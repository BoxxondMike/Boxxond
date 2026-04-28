import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Generate an unsubscribe token (so users can unsubscribe without logging in)
function generateUnsubToken(userId: string): string {
  const secret = process.env.CRON_SECRET!;
  return crypto
    .createHmac('sha256', secret)
    .update(userId)
    .digest('hex')
    .slice(0, 32);
}

// Filter movers that look like data noise (>200% swings on short history)
function isRealisticMover(mover: any): boolean {
  if (!mover || typeof mover.delta_pct !== 'number') return false;
  return Math.abs(mover.delta_pct) <= 200;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorised' }, { status: 401 });
  }

  try {
    // 1. Find users opted in
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('weekly_digest_enabled', true);

    if (!profiles || profiles.length === 0) {
      return Response.json({ message: 'No users opted in' });
    }

    let emailsSent = 0;
    let skipped = 0;

    for (const profile of profiles) {
      const userId = profile.user_id;

      // 2. Get this week's snapshot (most recent in last 2 days)
      const { data: thisWeek } = await supabase
        .from('collection_snapshots')
        .select('snapshot_date, total_value, card_count, top_mover_up, top_mover_down')
        .eq('user_id', userId)
        .gte('snapshot_date', new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))
        .order('snapshot_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!thisWeek) { skipped++; continue; }

      // 3. Get last week's snapshot (6-8 days ago)
      const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

      const { data: lastWeek } = await supabase
        .from('collection_snapshots')
        .select('snapshot_date, total_value, card_count')
        .eq('user_id', userId)
        .gte('snapshot_date', eightDaysAgo)
        .lte('snapshot_date', sixDaysAgo)
        .order('snapshot_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!lastWeek) { skipped++; continue; }

      // 4. Calculate change
      const valueDelta = Number(thisWeek.total_value) - Number(lastWeek.total_value);
      const valueDeltaPct = Number(lastWeek.total_value) > 0
        ? (valueDelta / Number(lastWeek.total_value)) * 100
        : 0;

      // Skip if collection is essentially flat (under £1 movement and 1% change)
      if (Math.abs(valueDelta) < 1 && Math.abs(valueDeltaPct) < 1) {
        skipped++;
        continue;
      }

      // 5. Get email
      const { data: userData } = await supabase.auth.admin.getUserById(userId);
      const email = userData?.user?.email;
      if (!email) { skipped++; continue; }

      // 6. Build movers HTML (only if realistic)
      const moverUp = isRealisticMover(thisWeek.top_mover_up) ? thisWeek.top_mover_up : null;
      const moverDown = isRealisticMover(thisWeek.top_mover_down) ? thisWeek.top_mover_down : null;

      const moversHtml = (moverUp || moverDown) ? `
        <div style="background: #ffffff; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
          <h3 style="color: #1a1a1a; font-size: 15px; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.05em;">Top Movers</h3>
          ${moverUp ? `
            <div style="padding: 12px 0; border-bottom: ${moverDown ? '1px solid #f0ede6' : 'none'};">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="color: #1a1a1a; font-weight: 600; font-size: 14px;">${moverUp.player}</div>
                  <div style="color: #888; font-size: 12px; margin-top: 2px;">${moverUp.variant}</div>
                </div>
                <div style="text-align: right;">
                  <div style="color: #1F6F3A; font-weight: 700; font-size: 16px;">+£${Number(moverUp.delta_value).toFixed(2)}</div>
                  <div style="color: #1F6F3A; font-size: 12px;">+${Number(moverUp.delta_pct).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          ` : ''}
          ${moverDown ? `
            <div style="padding: 12px 0;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="color: #1a1a1a; font-weight: 600; font-size: 14px;">${moverDown.player}</div>
                  <div style="color: #888; font-size: 12px; margin-top: 2px;">${moverDown.variant}</div>
                </div>
                <div style="text-align: right;">
                  <div style="color: #dc3545; font-weight: 700; font-size: 16px;">-£${Math.abs(Number(moverDown.delta_value)).toFixed(2)}</div>
                  <div style="color: #dc3545; font-size: 12px;">${Number(moverDown.delta_pct).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      ` : '';

      // 7. Build the email
      const direction = valueDelta >= 0 ? 'up' : 'down';
      const deltaColor = valueDelta >= 0 ? '#1F6F3A' : '#dc3545';
      const deltaSign = valueDelta >= 0 ? '+' : '-';
      const arrow = valueDelta >= 0 ? '↑' : '↓';
      const unsubToken = generateUnsubToken(userId);
      const unsubUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?u=${userId}&t=${unsubToken}`;

      await resend.emails.send({
        from: 'BoxxHQ <alerts@boxxhq.com>',
        to: email,
        subject: `Your collection is ${direction} ${deltaSign}£${Math.abs(valueDelta).toFixed(2)} this week`,
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="background: #faf7f0; font-family: sans-serif; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto;">
              <div style="text-align: center; padding: 30px 0 20px;">
                <img src="https://www.boxxhq.com/boxxhq-logo.png" alt="BoxxHQ" style="height: 80px; width: auto;" />
              </div>

              <div style="background: #ffffff; border-radius: 12px; padding: 32px 24px; margin-bottom: 20px; text-align: center;">
                <div style="color: #aaa; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Your Collection This Week</div>
                <div style="color: ${deltaColor}; font-size: 36px; font-weight: 800; letter-spacing: -1px;">
                  ${arrow} ${deltaSign}£${Math.abs(valueDelta).toFixed(2)}
                </div>
                <div style="color: ${deltaColor}; font-size: 16px; font-weight: 600; margin-top: 4px;">
                  ${deltaSign}${Math.abs(valueDeltaPct).toFixed(1)}% over 7 days
                </div>
                <div style="color: #888; font-size: 13px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #f0ede6;">
                  Now £${Number(thisWeek.total_value).toFixed(2)} across ${thisWeek.card_count} cards
                </div>
              </div>

              ${moversHtml}

              <div style="text-align: center; padding: 24px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/collection" style="background: #1F6F3A; color: #faf7f0; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px;">
                  View Full Collection
                </a>
              </div>

              <p style="color: #bbb; font-size: 12px; text-align: center; padding-top: 20px; border-top: 1px solid #f0ede6;">
                Weekly digest from BoxxHQ. Values based on current eBay UK listing data.<br/>
                <a href="${unsubUrl}" style="color: #888;">Unsubscribe from weekly digest</a>
              </p>
            </div>
          </body>
          </html>
        `,
      });

      emailsSent++;
    }

    return Response.json({
      message: `Processed ${profiles.length} opted-in users, sent ${emailsSent}, skipped ${skipped}`,
    });

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorised' }, { status: 401 });
  }

  try {
    const { data: alerts } = await supabase
      .from('card_alerts')
      .select('*')
      .limit(100);

    if (!alerts || alerts.length === 0) {
      return Response.json({ message: 'No alerts to process' });
    }

    let emailsSent = 0;

    for (const alert of alerts) {
      const { data: userData } = await supabase.auth.admin.getUserById(alert.user_id);
      const email = userData?.user?.email;
      if (!email) continue;

      const res = await fetch(
  `${process.env.NEXT_PUBLIC_SITE_URL}/api/search?q=${encodeURIComponent(alert.search_term)}${alert.max_price ? `&maxPrice=${alert.max_price}` : ''}&sort=newlyListed&limit=5`
);
      const data = await res.json();
      const items = data.items || [];
      if (items.length === 0) continue;

      const cardListHtml = items.slice(0, 5).map((item: any) => `
        <div style="display: flex; align-items: center; gap: 12px; padding: 12px; border-bottom: 1px solid #1a1a2e;">
          <img src="${item.thumbnailImages?.[0]?.imageUrl || item.image?.imageUrl || ''}" width="60" height="60" style="border-radius: 6px; object-fit: contain; flex-shrink: 0;" />
          <div style="flex: 1; min-width: 0;">
            <div style="color: #1a1a1a; font-size: 13px; margin-bottom: 6px; line-height: 1.4;">${item.title}</div>
            <div style="color: #3aaa35; font-weight: 700; font-size: 16px; margin-bottom: 8px;">
              ${item.price ? `£${parseFloat(item.price.value).toFixed(2)}` : 'N/A'}
            </div>
            <a href="${item.itemWebUrl}" style="background: #3aaa35; color: #faf7f0; padding: 6px 14px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 700; display: inline-block;">
              View on eBay →
            </a>
          </div>
        </div>
      `).join('');

      await resend.emails.send({
        from: 'BoxxHQ <alerts@boxxhq.com>',
        to: email,
        subject: `New listings found for "${alert.search_term}"`,
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="background: #faf7f0; font-family: sans-serif; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto;">
              <div style="text-align: center; padding: 30px 0 20px;">
                <h1 style="color: #1a1a1a; font-size: 28px; margin: 0;">Boxx<span style="color: #3aaa35;">HQ</span></h1>
              </div>
              <div style="background: #ffffff; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
                <h2 style="color: #1a1a1a; font-size: 18px; margin: 0 0 8px;">New listings for "${alert.search_term}"</h2>
                <p style="color: #666; font-size: 14px; margin: 0;">
                  We found ${items.length} listings matching your alert${alert.max_price ? ` under £${alert.max_price}` : ''}.
                </p>
              </div>
              <div style="background: #ffffff; border-radius: 12px; overflow: hidden; margin-bottom: 20px;">
                ${cardListHtml}
              </div>
              <div style="text-align: center; padding: 24px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="background: #3aaa35; color: #faf7f0; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px;">
                  View All Results on Boxxhq
                </a>
              </div>
              <p style="color: #bbb; font-size: 12px; text-align: center;">
                You're receiving this because you set up an alert on Boxxhq.
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="color: #888);">Manage alerts</a>
              </p>
            </div>
          </body>
          </html>
        `,
      });

      emailsSent++;
    }

    return Response.json({ message: `Processed ${alerts.length} alerts, sent ${emailsSent} emails` });

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
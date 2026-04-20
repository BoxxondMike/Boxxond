/**
 * app/api/cron/collection-snapshots/route.ts
 * ----------------------------------------------------------------------------
 * Daily cron: captures a collection valuation snapshot for every user who has
 * any cards in user_cards.
 *
 * Also calculates top mover up / top mover down compared to the previous
 * snapshot, so the weekly report has that data ready.
 *
 * Scheduled via vercel.json — see bottom of this file for the snippet to add.
 *
 * Protected by a CRON_SECRET env var so randos can't hammer it from the public
 * URL and skew your data / burn compute.
 * ----------------------------------------------------------------------------
 */

import { NextRequest } from 'next/server';
import {
  getAdminSupabase,
  valueUserCollection,
  ValuedCard,
} from '@/lib/collection-valuation';

// Vercel cron invokes with a GET
export async function GET(req: NextRequest) {
// Query-string secret check (matches existing cron pattern)
const secret = req.nextUrl.searchParams.get('secret');
if (secret !== process.env.CRON_SECRET) {
  return Response.json({ error: 'Unauthorised' }, { status: 401 });
}

  const supabase = getAdminSupabase();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // Find every user who has any cards
  const { data: users, error: usersErr } = await supabase
    .from('user_cards')
    .select('user_id')
    .not('user_id', 'is', null);

  if (usersErr) {
    return Response.json({ error: usersErr.message }, { status: 500 });
  }

  // Dedupe user_ids
  const userIds = Array.from(new Set((users ?? []).map((u) => u.user_id)));

  const results: Array<{ user_id: string; status: string; error?: string }> = [];

  for (const userId of userIds) {
    try {
      const valuation = await valueUserCollection(supabase, userId);

      // Pull the previous snapshot (if any) to compute movers
      const { data: prevRows } = await supabase
        .from('collection_snapshots')
        .select('snapshot_date, total_value, card_count')
        .eq('user_id', userId)
        .order('snapshot_date', { ascending: false })
        .limit(1);

      const previous = prevRows?.[0];

      // Compute top mover cards by comparing current unit prices with
      // previous day's price_history (if we can resolve them cheaply).
      // For the first pass we keep this simple: identify biggest value
      // card and biggest absolute change from purchase_price.
      const movers = computeTopMovers(valuation.cards);

      // Upsert snapshot (one per user per day)
      const { error: upsertErr } = await supabase
        .from('collection_snapshots')
        .upsert(
          {
            user_id: userId,
            snapshot_date: today,
            total_value: valuation.total_value,
            card_count: valuation.card_count,
            valued_count: valuation.valued_count,
            unvalued_count: valuation.unvalued_count,
            top_mover_up: movers.up ?? null,
            top_mover_down: movers.down ?? null,
          },
          { onConflict: 'user_id,snapshot_date' }
        );

      if (upsertErr) throw upsertErr;

      results.push({ user_id: userId, status: 'ok' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown';
      results.push({ user_id: userId, status: 'error', error: msg });
    }
  }

  const ok = results.filter((r) => r.status === 'ok').length;
  const failed = results.filter((r) => r.status === 'error').length;

  return Response.json({
    date: today,
    processed: results.length,
    ok,
    failed,
    errors: results.filter((r) => r.status === 'error'),
  });
}

/**
 * For the first snapshot we don't have "day-over-day movers" yet — we just
 * flag the highest-value card and the biggest purchase-vs-current gain/loss.
 * Once we have a few days of data, swap this for a true day-over-day
 * comparison against yesterday's priced totals.
 */
function computeTopMovers(cards: ValuedCard[]) {
  const valued = cards.filter((c) => c.total_value !== null);
  if (valued.length === 0) return { up: null, down: null };

  // Cards with a known purchase_price → compute profit/loss
  const withPurchase = valued.filter(
    (c) => c.purchase_price !== null && c.unit_price !== null
  );

  if (withPurchase.length === 0) {
    // Fall back to just the biggest-value card for "up"
    const top = [...valued].sort(
      (a, b) => (b.total_value ?? 0) - (a.total_value ?? 0)
    )[0];
    return {
      up: {
        player: top.player_name,
        variant: top.variant_label,
        value: top.total_value,
        note: 'biggest holding',
      },
      down: null,
    };
  }

  // Biggest absolute profit
  const scored = withPurchase.map((c) => {
    const delta = (c.unit_price! - c.purchase_price!) * c.quantity;
    const pct = c.purchase_price! > 0
      ? ((c.unit_price! - c.purchase_price!) / c.purchase_price!) * 100
      : 0;
    return { c, delta, pct };
  });

  const sorted = [...scored].sort((a, b) => b.delta - a.delta);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  return {
    up:
      best && best.delta > 0
        ? {
            player: best.c.player_name,
            variant: best.c.variant_label,
            delta_value: Math.round(best.delta * 100) / 100,
            delta_pct: Math.round(best.pct * 10) / 10,
          }
        : null,
    down:
      worst && worst.delta < 0
        ? {
            player: worst.c.player_name,
            variant: worst.c.variant_label,
            delta_value: Math.round(worst.delta * 100) / 100,
            delta_pct: Math.round(worst.pct * 10) / 10,
          }
        : null,
  };
}

/**
 * ----------------------------------------------------------------------------
 * Add this to your vercel.json in the project root (create it if it doesn't
 * exist, or merge into existing crons):
 *
 * {
 *   "crons": [
 *     {
 *       "path": "/api/cron/collection-snapshots",
 *       "schedule": "0 2 * * *"
 *     }
 *   ]
 * }
 *
 * "0 2 * * *" = every day at 02:00 UTC (quiet time, prices stable).
 *
 * Vercel will automatically call GET /api/cron/collection-snapshots at that
 * time, including the bearer token header with your CRON_SECRET value.
 *
 * Set CRON_SECRET in Vercel env vars (mark Sensitive). Can be any random string
 * — generate one with: openssl rand -hex 32
 * ----------------------------------------------------------------------------
 */
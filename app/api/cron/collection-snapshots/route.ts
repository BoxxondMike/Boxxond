/**
 * app/api/cron/collection-snapshots/route.ts
 * ----------------------------------------------------------------------------
 * DIAGNOSTIC VERSION — returns the per-card valuation breakdown in the
 * response, so we can see exactly which cards value and which don't.
 *
 * Once everything's matching properly, swap this back for the production
 * version that only returns summary counts.
 * ----------------------------------------------------------------------------
 */

import { NextRequest } from 'next/server';
import {
  getAdminSupabase,
  valueUserCollection,
  ValuedCard,
} from '@/lib/collection-valuation';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const supabase = getAdminSupabase();
  const today = new Date().toISOString().slice(0, 10);

  const { data: users, error: usersErr } = await supabase
    .from('user_cards')
    .select('user_id')
    .not('user_id', 'is', null);

  if (usersErr) {
    return Response.json({ error: usersErr.message }, { status: 500 });
  }

  const userIds: string[] = Array.from(
    new Set((users ?? []).map((u: any) => u.user_id as string))
  );

  const results: Array<{
    user_id: string;
    status: string;
    error?: string;
    breakdown?: any;
  }> = [];

  for (const userId of userIds) {
    try {
      const valuation = await valueUserCollection(supabase, userId);
      const movers = computeTopMovers(valuation.cards);

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

      // DIAGNOSTIC: return each card's valuation outcome
      results.push({
        user_id: userId,
        status: 'ok',
        breakdown: {
          total_value: valuation.total_value,
          card_count: valuation.card_count,
          valued_count: valuation.valued_count,
          unvalued_count: valuation.unvalued_count,
          cards: valuation.cards.map((c) => ({
            player: c.player_name,
            variant: c.variant_label,
            search_term_attempted: c.search_term_used,
            unit_price: c.unit_price,
            total_value: c.total_value,
            matched: c.total_value !== null,
          })),
        },
      });
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
    diagnostic: results,
  });
}

function computeTopMovers(cards: ValuedCard[]) {
  const valued = cards.filter((c) => c.total_value !== null);
  if (valued.length === 0) return { up: null, down: null };

  const withPurchase = valued.filter(
    (c) => c.purchase_price !== null && c.unit_price !== null
  );

  if (withPurchase.length === 0) {
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

  const scored = withPurchase.map((c) => {
    const delta = (c.unit_price! - c.purchase_price!) * c.quantity;
    const pct =
      c.purchase_price! > 0
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
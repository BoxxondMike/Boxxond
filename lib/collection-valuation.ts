/**
 * lib/collection-valuation.ts
 * ----------------------------------------------------------------------------
 * Shared helper for valuing a user's collection against the latest prices.
 * Used by:
 *   - /api/cron/collection-snapshots (daily cron)
 *   - Collection UI (show live value on the page)
 *   - Weekly report generator
 *
 * Keep the valuation logic in ONE place so nothing drifts.
 * ----------------------------------------------------------------------------
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// A single user card with its current valuation attached
export type ValuedCard = {
  card_id: string;
  player_id: string | null;
  player_name: string | null;
  variant_label: string;
  quantity: number;
  purchase_price: number | null;
  // Valuation
  unit_price: number | null;        // latest avg price for this variant
  total_value: number | null;       // unit_price * quantity
  listing_count: number | null;     // how many listings that price is based on
  search_term_used: string | null;  // what we matched on (for debugging)
};

export type CollectionValuation = {
  user_id: string;
  total_value: number;
  card_count: number;
  valued_count: number;
  unvalued_count: number;
  cards: ValuedCard[];
};

/**
 * Value a single user's collection against the latest_prices view.
 *
 * Join logic:
 *   user_cards → players (to get the player's name)
 *   lowercase(player.name) → latest_prices.search_term
 *   user_cards.variant_label → latest_prices.variant_label
 *
 * A card is "unvalued" if no matching (search_term, variant_label) row exists.
 */
export async function valueUserCollection(
  supabase: SupabaseClient,
  userId: string
): Promise<CollectionValuation> {
  // 1. Pull the user's cards with player name via join
  const { data: cards, error: cardsErr } = await supabase
    .from('user_cards')
    .select(
      `
        id,
        player_id,
        variant_label,
        quantity,
        purchase_price,
        player_name_manual,
        is_manual,
        players ( name )
      `
    )
    .eq('user_id', userId);

  if (cardsErr) throw cardsErr;
  if (!cards || cards.length === 0) {
    return {
      user_id: userId,
      total_value: 0,
      card_count: 0,
      valued_count: 0,
      unvalued_count: 0,
      cards: [],
    };
  }

  // 2. Pull all latest prices (small enough to fetch once, faster than
  //    per-card lookups). Cache in memory by (search_term, variant_label).
  const { data: priceRows, error: priceErr } = await supabase
    .from('latest_prices')
    .select('search_term, variant_label, avg_price, listing_count');

  if (priceErr) throw priceErr;

  const priceMap = new Map<string, { avg_price: number; listing_count: number }>();
  for (const row of priceRows ?? []) {
    priceMap.set(
      `${row.search_term.toLowerCase()}|${row.variant_label}`,
      { avg_price: Number(row.avg_price), listing_count: row.listing_count }
    );
  }

  // 3. Value each card
  const valuedCards: ValuedCard[] = cards.map((c: any) => {
    const qty = c.quantity ?? 1;
    const playerName: string | null =
      c.is_manual && c.player_name_manual
        ? c.player_name_manual
        : c.players?.name ?? null;

    if (!playerName) {
      return {
        card_id: c.id,
        player_id: c.player_id,
        player_name: null,
        variant_label: c.variant_label,
        quantity: qty,
        purchase_price: c.purchase_price,
        unit_price: null,
        total_value: null,
        listing_count: null,
        search_term_used: null,
      };
    }

    const searchTerm = playerName.toLowerCase();
    const priceHit = priceMap.get(`${searchTerm}|${c.variant_label}`);

    if (!priceHit) {
      return {
        card_id: c.id,
        player_id: c.player_id,
        player_name: playerName,
        variant_label: c.variant_label,
        quantity: qty,
        purchase_price: c.purchase_price,
        unit_price: null,
        total_value: null,
        listing_count: null,
        search_term_used: searchTerm,
      };
    }

    return {
      card_id: c.id,
      player_id: c.player_id,
      player_name: playerName,
      variant_label: c.variant_label,
      quantity: qty,
      purchase_price: c.purchase_price,
      unit_price: priceHit.avg_price,
      total_value: priceHit.avg_price * qty,
      listing_count: priceHit.listing_count,
      search_term_used: searchTerm,
    };
  });

  const valued = valuedCards.filter((c) => c.total_value !== null);
  const totalValue = valued.reduce((sum, c) => sum + (c.total_value ?? 0), 0);

  return {
    user_id: userId,
    total_value: Math.round(totalValue * 100) / 100,
    card_count: valuedCards.length,
    valued_count: valued.length,
    unvalued_count: valuedCards.length - valued.length,
    cards: valuedCards,
  };
}

/**
 * Lazy singleton — use this in routes where you don't already have a client.
 */
export function getAdminSupabase(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    { auth: { persistSession: false } }
  );
}
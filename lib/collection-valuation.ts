/**
 * lib/collection-valuation.ts
 * ----------------------------------------------------------------------------
 * Shared helper for valuing a user's collection against the latest prices.
 *
 * Price join convention (BoxxHQ-specific):
 *   - price_history.search_term includes the variant suffix, e.g.
 *     "mbappe auto", "mbappe numbered", "mbappe psa 10".
 *   - For base/no-variant cards, search_term is just the player name.
 *
 * So when valuing a user's card we need to reconstruct the expected
 * search_term by combining lowercase player name + variant suffix.
 * ----------------------------------------------------------------------------
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type ValuedCard = {
  card_id: string;
  player_id: string | null;
  player_name: string | null;
  variant_label: string;
  quantity: number;
  purchase_price: number | null;
  unit_price: number | null;
  total_value: number | null;
  listing_count: number | null;
  search_term_used: string | null;
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
 * Maps user_cards.variant_label → the suffix used in price_history.search_term.
 * Keep this in sync with how the price-history cron names its search terms.
 */
function variantToSearchSuffix(variantLabel: string): string {
  const v = variantLabel.trim().toLowerCase();
  switch (v) {
    case 'auto':
      return 'auto';
    case 'psa 10':
      return 'psa 10';
    case 'prizm':
      return 'prizm';
    case 'numbered parallel':
    case 'numbered':
      return 'numbered';
    case 'short print':
    case 'sp':
      return 'short print';
    case 'world cup':
      return 'world cup';
    case 'base':
    case 'all':
    case '':
      return ''; // no suffix — base card
    default:
      // Unknown variant — fall through with the raw label lowercased.
      // Worth a log so you see them in cron output.
      return v;
  }
}

function buildSearchTerm(playerName: string, variantLabel: string): string {
  const base = playerName.toLowerCase().trim();
  const suffix = variantToSearchSuffix(variantLabel);
  return suffix ? `${base} ${suffix}` : base;
}

/**
 * Value a single user's collection against the latest_prices view.
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

  // 2. Pull all latest prices — cache in memory keyed by search_term + variant
  const { data: priceRows, error: priceErr } = await supabase
    .from('latest_prices')
    .select('search_term, variant_label, avg_price, listing_count');

  if (priceErr) throw priceErr;

  const priceMap = new Map<string, { avg_price: number; listing_count: number }>();
  for (const row of priceRows ?? []) {
    const key = `${row.search_term.toLowerCase().trim()}|${row.variant_label}`;
    priceMap.set(key, {
      avg_price: Number(row.avg_price),
      listing_count: row.listing_count,
    });
  }

  // 3. Value each card using the correctly-constructed search_term
  const valuedCards: ValuedCard[] = cards.map((c: any) => {
    const qty = c.quantity ?? 1;
    const playerName: string | null =
      c.is_manual && c.player_name_manual
        ? c.player_name_manual
        : c.players?.name ?? c.player_name_manual ?? null;

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

    const searchTerm = buildSearchTerm(playerName, c.variant_label);
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

export function getAdminSupabase(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    { auth: { persistSession: false } }
  );
}
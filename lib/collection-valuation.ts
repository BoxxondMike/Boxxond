/**
 * lib/collection-valuation.ts
 * ----------------------------------------------------------------------------
 * Shared helper for valuing a user's collection against the latest prices.
 *
 * Two fixes from earlier versions:
 *   1. Reconstructs search_term with variant suffix (BoxxHQ convention)
 *   2. Does per-unique-combo lookups rather than pulling all of latest_prices
 *      into memory — avoids the Supabase 1000-row default limit silently
 *      dropping matches.
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
      return '';
    default:
      return v;
  }
}

function buildSearchTerm(playerName: string, variantLabel: string): string {
  const base = playerName.toLowerCase().trim();
  const suffix = variantToSearchSuffix(variantLabel);
  return suffix ? `${base} ${suffix}` : base;
}

export async function valueUserCollection(
  supabase: SupabaseClient,
  userId: string
): Promise<CollectionValuation> {
  // 1. Pull the user's cards
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

  // 2. Build list of unique (search_term, variant_label) pairs we need prices for
  type Lookup = { search_term: string; variant_label: string };
  const lookups: Lookup[] = [];
  const lookupSet = new Set<string>();

  const cardLookups: (Lookup | null)[] = cards.map((c: any) => {
    const playerName: string | null =
      c.is_manual && c.player_name_manual
        ? c.player_name_manual
        : c.players?.name ?? c.player_name_manual ?? null;

    if (!playerName) return null;

    const searchTerm = buildSearchTerm(playerName, c.variant_label);
    const key = `${searchTerm}|${c.variant_label}`;

    if (!lookupSet.has(key)) {
      lookupSet.add(key);
      lookups.push({ search_term: searchTerm, variant_label: c.variant_label });
    }

    return { search_term: searchTerm, variant_label: c.variant_label };
  });

  // 3. Fetch prices for ONLY the needed search_terms (avoids 1000-row limit)
  const uniqueSearchTerms = Array.from(new Set(lookups.map((l) => l.search_term)));

  const priceMap = new Map<string, { avg_price: number; listing_count: number }>();

  if (uniqueSearchTerms.length > 0) {
    const { data: priceRows, error: priceErr } = await supabase
      .from('latest_prices')
      .select('search_term, variant_label, avg_price, listing_count')
      .in('search_term', uniqueSearchTerms);

    if (priceErr) throw priceErr;

    for (const row of priceRows ?? []) {
      const key = `${row.search_term.toLowerCase().trim()}|${row.variant_label}`;
      priceMap.set(key, {
        avg_price: Number(row.avg_price),
        listing_count: row.listing_count,
      });
    }
  }

  // 4. Value each card
  const valuedCards: ValuedCard[] = cards.map((c: any, idx: number) => {
    const qty = c.quantity ?? 1;
    const playerName: string | null =
      c.is_manual && c.player_name_manual
        ? c.player_name_manual
        : c.players?.name ?? c.player_name_manual ?? null;

    const lookup = cardLookups[idx];

    if (!playerName || !lookup) {
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
        search_term_used: null,
      };
    }

    const priceHit = priceMap.get(`${lookup.search_term}|${lookup.variant_label}`);

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
        search_term_used: lookup.search_term,
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
      search_term_used: lookup.search_term,
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
/**
 * app/api/peregro/chat/route.ts
 * ----------------------------------------------------------------------------
 * Peregro chat endpoint — intent-aware data fetching + sharper CTAs.
 * ----------------------------------------------------------------------------
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

type PageContext = {
  page_url?: string;
  page_type?: 'home' | 'player' | 'set' | 'release' | 'other';
  player_name?: string;
  set_name?: string;
};

type HistoryMsg = { role: 'user' | 'assistant'; content: string };

type Intent = {
  buying: boolean;
  selling: boolean;
  trending: boolean;
  comparing: boolean;
  cheapest: boolean;
  graded: boolean;
  rookie: boolean;
  endingSoon: boolean;
};

type EnrichedContext = {
  priceContext: string | null;
  trendContext: string | null;
  comparisonContext: string | null;
  cheapestContext: string | null;
  endingSoonContext: string | null;
};

export async function POST(request: Request) {
  const {
    message,
    history = [],
    conversation_id,
    session_id,
    user_id,
    page_context = {},
  }: {
    message: string;
    history: HistoryMsg[];
    conversation_id: string;
    session_id: string;
    user_id?: string | null;
    page_context?: PageContext;
  } = await request.json();

  if (!message) {
    return Response.json({ error: 'No message provided' }, { status: 400 });
  }
  if (!conversation_id || !session_id) {
    return Response.json(
      { error: 'Missing conversation_id or session_id' },
      { status: 400 }
    );
  }

  // ---- 1. Ensure conversation row exists ----
  await supabase.from('peregro_conversations').upsert(
    {
      id: conversation_id,
      session_id,
      user_id: user_id ?? null,
      page_url: page_context.page_url ?? null,
      page_type: page_context.page_type ?? 'other',
      player_name: page_context.player_name ?? null,
      set_name: page_context.set_name ?? null,
    },
    { onConflict: 'id', ignoreDuplicates: true }
  );

  // ---- 2. Detect intent + find players + enrich context ----
  const intent = detectIntent(message);
  const playerMatch = await findRelevantPlayers(message, page_context);
  const enriched = await enrichContext(message, playerMatch, intent);

  // ---- 3. Build the system prompt ----
  const systemPrompt = buildSystemPrompt(enriched, playerMatch, page_context, intent, !!user_id);

  const messages: HistoryMsg[] = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ];

  // ---- 4. Log the user message ----
  await supabase.from('peregro_messages').insert({
    conversation_id,
    role: 'user',
    content: message,
  });
  await supabase.rpc('increment_message_count', { conv_id: conversation_id });

  // ---- 5. Call Claude ----
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages,
      }),
    });

    const data = await response.json();
    const fullReply: string =
      data.content?.[0]?.text || 'Sorry, I could not generate a response.';

    // Split reply + suggestions
    const [replyRaw, suggestionsRaw] = fullReply.split('SUGGESTIONS:');
    const reply = (replyRaw ?? '').trim();
    const suggestions = suggestionsRaw
      ? suggestionsRaw
          .trim()
          .split('|')
          .map((s: string) => s.trim())
          .filter(Boolean)
          .slice(0, 3)
      : [];

    // ---- 6. Extract eBay URLs ----
    const urlsInReply = reply.match(/https?:\/\/[^\s)\]]+/g) ?? [];
    const affiliateLinks = urlsInReply.filter((u) =>
      /ebay\.[a-z.]+/i.test(u)
    );

    // ---- 7. Log the assistant message ----
    await supabase.from('peregro_messages').insert({
      conversation_id,
      role: 'assistant',
      content: reply,
      affiliate_links_offered: affiliateLinks,
    });
    await supabase.rpc('increment_message_count', { conv_id: conversation_id });

    return Response.json({ reply, suggestions });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: msg }, { status: 500 });
  }
}

// ============================================================================
// Intent detection — what is the user actually asking?
// ============================================================================

function detectIntent(message: string): Intent {
  const m = message.toLowerCase();

  return {
    buying: /\b(buy|buying|cheapest|under £?\d+|where (can|do) i get|best deal|looking for|hunt|hunting)\b/.test(m),
    selling: /\b(sell|selling|worth|value|how much (can|would) i get|cash in|list|offload|what should i list)\b/.test(m),
    trending: /\b(trend|trending|rising|rise|hot|popular|moving|movement|momentum|increase|decrease|falling|drop|dropped|gaining|losing)\b/.test(m),
    comparing: /\b(vs|versus|compare|compared|better|than|or)\b.*\b(vs|versus|compare|compared|better|than|or)?\b/.test(m) && (m.split(/\bvs\b|\bversus\b|\band\b|\bor\b/).length > 2),
    cheapest: /\b(cheap|cheapest|affordable|budget|low(er)? price|under £?\d+|less than)\b/.test(m),
    graded: /\b(psa|bgs|graded|grade|slab|slabbed|gem mint|9\.5|10|raw)\b/.test(m),
    rookie: /\b(rookie|rc|rated rookie|first card|first bowman|debut)\b/.test(m),
    endingSoon: /\b(ending|ends|live now|now|today|right now|active listings)\b/.test(m),
  };
}

// ============================================================================
// Player lookup — uses ILIKE in the database (not in-memory)
// ============================================================================

async function findRelevantPlayers(message: string, ctx: PageContext) {
  const searchText = [
    message.toLowerCase(),
    ctx.player_name?.toLowerCase() ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const words = searchText
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9]/g, ''))
    .filter((w) => w.length > 2);

  if (words.length === 0) return [];

  const orConditions = words.map((w) => `name.ilike.%${w}%`).join(',');

  const { data: players } = await supabase
    .from('players')
    .select('id, name, team, sport, nationality')
    .or(orConditions)
    .limit(10);

  return players ?? [];
}

// ============================================================================
// Enrich context — fetch different data depending on intent
// ============================================================================

async function enrichContext(
  message: string,
  players: { id: string; name: string }[],
  intent: Intent
): Promise<EnrichedContext> {
  if (players.length === 0) {
    return {
      priceContext: null,
      trendContext: null,
      comparisonContext: null,
      cheapestContext: null,
      endingSoonContext: null,
    };
  }

  const playerNames = players.map((p) => p.name.toLowerCase());

  // Always fetch baseline price data (most recent average per variant)
  const priceContext = await getPriceContext(playerNames);

  // Conditionally enrich based on intent
  const [trendContext, comparisonContext, cheapestContext, endingSoonContext] = await Promise.all([
    intent.trending ? getTrendContext(playerNames) : Promise.resolve(null),
    intent.comparing && players.length >= 2 ? getComparisonContext(players) : Promise.resolve(null),
    intent.cheapest || intent.buying ? getCheapestListings(playerNames) : Promise.resolve(null),
    intent.endingSoon ? getEndingSoonListings(playerNames) : Promise.resolve(null),
  ]);

  return {
    priceContext,
    trendContext,
    comparisonContext,
    cheapestContext,
    endingSoonContext,
  };
}

async function getPriceContext(playerNames: string[]): Promise<string | null> {
  const { data: prices } = await supabase
    .from('price_history')
    .select('search_term, variant_label, avg_price, listing_count, recorded_at')
    .in(
      'search_term',
      playerNames.flatMap((name) => [
        name,
        `${name} auto`,
        `${name} psa 10`,
        `${name} prizm`,
        `${name} numbered`,
        `${name} short print`,
      ])
    )
    .order('recorded_at', { ascending: false })
    .limit(30);

  if (!prices || prices.length === 0) return null;

  return prices
    .map(
      (p: any) =>
        `${p.search_term} (${p.variant_label}): avg £${p.avg_price} across ${p.listing_count} listings`
    )
    .join('\n');
}

async function getTrendContext(playerNames: string[]): Promise<string | null> {
  // Compare last 7 days vs 30 days for each variant
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400 * 1000).toISOString();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400 * 1000).toISOString();

  const { data: recent } = await supabase
    .from('price_history')
    .select('search_term, variant_label, avg_price, recorded_at')
    .in('search_term', playerNames.flatMap((n) => [n, `${n} auto`, `${n} psa 10`]))
    .gte('recorded_at', sevenDaysAgo)
    .order('recorded_at', { ascending: false })
    .limit(30);

  const { data: older } = await supabase
    .from('price_history')
    .select('search_term, variant_label, avg_price')
    .in('search_term', playerNames.flatMap((n) => [n, `${n} auto`, `${n} psa 10`]))
    .gte('recorded_at', thirtyDaysAgo)
    .lt('recorded_at', sevenDaysAgo)
    .order('recorded_at', { ascending: false })
    .limit(30);

  if (!recent || !older || recent.length === 0 || older.length === 0) return null;

  // Group by search_term + variant_label, get latest from each set
  const recentMap = new Map<string, number>();
  const olderMap = new Map<string, number>();

  for (const row of recent) {
    const key = `${row.search_term}|${row.variant_label}`;
    if (!recentMap.has(key)) recentMap.set(key, parseFloat(row.avg_price));
  }
  for (const row of older) {
    const key = `${row.search_term}|${row.variant_label}`;
    if (!olderMap.has(key)) olderMap.set(key, parseFloat(row.avg_price));
  }

  const trends: string[] = [];
  for (const [key, recentPrice] of recentMap.entries()) {
    const olderPrice = olderMap.get(key);
    if (!olderPrice || olderPrice === 0) continue;
    const change = ((recentPrice - olderPrice) / olderPrice) * 100;
    const direction = change > 5 ? '↑' : change < -5 ? '↓' : '→';
    if (Math.abs(change) > 2) {
      trends.push(`${key.replace('|', ' (')}): £${recentPrice.toFixed(2)} ${direction} ${change.toFixed(1)}% vs 30d ago`);
    }
  }

  return trends.length > 0 ? trends.slice(0, 6).join('\n') : null;
}

async function getComparisonContext(players: { id: string; name: string }[]): Promise<string | null> {
  if (players.length < 2) return null;

  const lines: string[] = [];
  for (const p of players.slice(0, 3)) {
    const { data } = await supabase
      .from('price_history')
      .select('search_term, variant_label, avg_price, listing_count')
      .eq('search_term', p.name.toLowerCase())
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      lines.push(`${p.name}: avg £${data.avg_price} across ${data.listing_count} listings`);
    }
  }

  return lines.length > 0 ? lines.join('\n') : null;
}

async function getCheapestListings(playerNames: string[]): Promise<string | null> {
  const { data: listings } = await supabase
    .from('cached_listings')
    .select('items')
    .in('type', ['ending_soon', 'listings_we_like'])
    .limit(2);

  if (!listings || listings.length === 0) return null;

  // Flatten and filter to player matches under reasonable price ceiling
  const allItems: any[] = listings.flatMap((row: any) => row.items || []);

  const matches = allItems
    .filter((item) => {
      const title = (item.title || '').toLowerCase();
      return playerNames.some((name) => title.includes(name));
    })
    .map((item) => ({
      title: item.title,
      price: parseFloat(item.price?.value || '0'),
      currency: item.price?.currency || 'GBP',
      url: item.itemAffiliateWebUrl || item.itemWebUrl,
    }))
    .filter((item) => item.price > 0)
    .sort((a, b) => a.price - b.price)
    .slice(0, 5);

  if (matches.length === 0) return null;

  return matches.map((m) => `${m.currency === 'GBP' ? '£' : '$'}${m.price.toFixed(2)} — ${m.title}`).join('\n');
}

async function getEndingSoonListings(playerNames: string[]): Promise<string | null> {
  const { data: listings } = await supabase
    .from('cached_listings')
    .select('items')
    .eq('type', 'ending_soon')
    .single();

  if (!listings?.items) return null;

  const matches = (listings.items as any[])
    .filter((item) => {
      const title = (item.title || '').toLowerCase();
      return playerNames.some((name) => title.includes(name));
    })
    .slice(0, 5);

  if (matches.length === 0) return null;

  return matches
    .map((m) => {
      const price = m.price?.value ? `£${parseFloat(m.price.value).toFixed(2)}` : 'N/A';
      return `${price} — ${m.title}`;
    })
    .join('\n');
}

// ============================================================================
// System prompt — intent-aware, action-oriented
// ============================================================================

function buildSystemPrompt(
  enriched: EnrichedContext,
  playerMatch: { name: string; team: string }[],
  ctx: PageContext,
  intent: Intent,
  isLoggedIn: boolean
) {
  const pageHint =
    ctx.page_type === 'player' && ctx.player_name
      ? `The visitor is currently on ${ctx.player_name}'s page — prioritise them in your answers unless they ask about someone else.`
      : ctx.page_type === 'set' && ctx.set_name
      ? `The visitor is currently viewing the ${ctx.set_name} set page — orient your answers around that set.`
      : ctx.page_type === 'release'
      ? `The visitor is browsing the Release Vault — they're likely thinking about what's coming out soon.`
      : '';

  // Intent-specific guidance
  const intentGuidance: string[] = [];

  if (intent.selling) {
    intentGuidance.push(
      `SELLING INTENT detected: After answering, suggest setting up a price alert so they know when their card hits a target sell price. Example: "Want me to ping you if his Chrome auto crosses £50?"`
    );
  }
  if (intent.buying) {
    intentGuidance.push(
      `BUYING INTENT detected: Mention current cheapest listings if any are in the data. After answering, suggest a price drop alert. Example: "Set an alert for when copies dip below £20?"`
    );
  }
  if (intent.trending) {
    intentGuidance.push(
      `TRENDING INTENT detected: Use trend data if provided. Be specific about direction and magnitude (£X up to £Y, +Z%). Suggest movement alerts: "Want a heads up when the trend reverses?"`
    );
  }
  if (intent.comparing) {
    intentGuidance.push(
      `COMPARING INTENT detected: Give a clear pick or "depends" answer with a reason. Don't dodge with "both are good."`
    );
  }
  if (intent.graded) {
    intentGuidance.push(
      `GRADED CARD INTENT detected: Be especially careful — the price averages mix raw and graded together so will skew low. Caveat clearly. PSA 10 prices are typically 3-10x raw for star players.`
    );
  }
  if (intent.endingSoon) {
    intentGuidance.push(
      `ENDING SOON INTENT detected: Use the ending-soon listings data if available. Mention specific listings if any match.`
    );
  }

  const ctaGuidance = isLoggedIn
    ? `The visitor is signed in. Reference BoxxHQ features confidently — alerts, collection tracking, all available to them.`
    : `The visitor is NOT signed in. When suggesting alerts or collection tracking, mention they need to sign up (free) to use these features.`;

  return `You are Peregro, BoxxHQ's card-finding assistant. BoxxHQ is a UK card price tracker and marketplace.

PERSONALITY:
- Sharp, quick, like a mate who lives in the hobby
- Direct — no padding, no waffle
- Confident opinions when warranted ("I'd hold that one", "seller's dreaming")
- Use hobby vocabulary naturally: raw, slabbed, comp, case hit, RC, parallels

CORE RULES:
- Keep responses 3-4 lines max
- Always use £ for prices
- ONLY discuss trading cards, prices, hobby, BoxxHQ, grading, sets, players
- For unrelated queries: "I'm only here to talk cards mate — what card can I help you with?"
- NEVER state specific facts about player achievements or career history unless from BoxxHQ data
- If you don't have data, say so honestly — don't guess
- Price averages mix raw + graded, so caveat when relevant

INTENT-SPECIFIC GUIDANCE:
${intentGuidance.length > 0 ? intentGuidance.join('\n\n') : 'No specific intent detected — be helpful and ask a follow-up that drives toward a useful action.'}

${ctaGuidance}

${pageHint}

DATA AVAILABLE TO YOU:

${enriched.priceContext ? `## Current price data:\n${enriched.priceContext}\n` : ''}
${enriched.trendContext ? `## Recent trend data (last 7 days vs prior 30):\n${enriched.trendContext}\n` : ''}
${enriched.comparisonContext ? `## Comparison data:\n${enriched.comparisonContext}\n` : ''}
${enriched.cheapestContext ? `## Cheapest current listings:\n${enriched.cheapestContext}\n` : ''}
${enriched.endingSoonContext ? `## Ending soon listings:\n${enriched.endingSoonContext}\n` : ''}

${
  playerMatch.length > 0
    ? `## Players found in BoxxHQ:\n${playerMatch.map((p) => `${p.name} (${p.team})`).join(', ')}`
    : '## No specific players found in this query.'
}

At the end of EVERY response, add a new line then "SUGGESTIONS:" followed by exactly 3 short responses or follow-up questions that directly relate to what you just discussed. Keep suggestions under 6 words each. Frame them as natural replies the user might send.
Example: SUGGESTIONS: What's a PSA 9 worth?|Set an alert for me|Compare to Bellingham`;
}
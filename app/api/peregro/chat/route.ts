/**
 * app/api/peregro/chat/route.ts
 * ----------------------------------------------------------------------------
 * Peregro chat endpoint. Based on your existing Boxx Intel route,
 * with the following changes:
 *
 *   1. Rebranded copy (Boxx -> Peregro)
 *   2. Payload now includes conversation_id / session_id / user_id / page_context
 *   3. Creates the conversation row on first message (idempotent upsert)
 *   4. Logs user + assistant messages to peregro_messages
 *   5. Extracts eBay affiliate links from the reply and stores them on the conversation
 *   6. Uses page_context to bias the pre-fetch (if visitor is on a player page,
 *      prioritise that player even if they don't name them)
 *
 * Keeps the same tone rules, suggestions pattern, and direct fetch to Anthropic.
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
 
  // ---- 1. Ensure conversation row exists (idempotent) ----
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
 
  // ---- 2. Pre-fetch relevant data (page_context first, then message content) ----
  const playerMatch = await findRelevantPlayers(message, page_context);
  const priceContext = await getPriceContext(message, playerMatch);
 
  // ---- 3. Build the system prompt ----
  const systemPrompt = buildSystemPrompt(priceContext, playerMatch, page_context);
 
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
 
    // Split reply + suggestions (same pattern as Boxx Intel)
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
 
    // ---- 6. Extract any affiliate / eBay URLs from the reply ----
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
// Helpers — adapted from your existing Boxx Intel code
// ============================================================================
 
async function findRelevantPlayers(message: string, ctx: PageContext) {
  // Combine the message with page context so we catch players the visitor
  // hasn't explicitly named (e.g. they're on /players/mbappe).
  const searchTerms = [message.toLowerCase(), ctx.player_name?.toLowerCase() ?? '']
    .filter(Boolean)
    .join(' ');
 
  const words = searchTerms.split(/\s+/);
 
  const { data: players } = await supabase
    .from('players')
    .select('name, team, sport, nationality')
    .limit(200);
 
  if (!players) return [];
 
  return players
    .filter((player: any) => {
      const nameLower = player.name.toLowerCase();
      return words.some((word: string) => word.length > 3 && nameLower.includes(word));
    })
    .slice(0, 5);
}
 
async function getPriceContext(
  message: string,
  players: { name: string }[]
): Promise<string | null> {
  if (players.length === 0) return null;
 
  const playerNames = players.map((p) => p.name.toLowerCase());
 
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
      ])
    )
    .order('recorded_at', { ascending: false })
    .limit(20);
 
  if (!prices || prices.length === 0) return null;
 
  return prices
    .map((p: any) =>
        `${p.search_term} (${p.variant_label}): avg £${p.avg_price} across ${p.listing_count} listings`
    )
    .join('\n');
}
 
// ============================================================================
// System prompt
// ============================================================================
 
function buildSystemPrompt(
  priceContext: string | null,
  playerMatch: { name: string; team: string }[],
  ctx: PageContext
) {
  const pageHint =
    ctx.page_type === 'player' && ctx.player_name
      ? `The visitor is currently on ${ctx.player_name}'s page — prioritise them in your answers unless they ask about someone else.`
      : ctx.page_type === 'set' && ctx.set_name
      ? `The visitor is currently viewing the ${ctx.set_name} set page — orient your answers around that set.`
      : ctx.page_type === 'release'
      ? `The visitor is browsing the Release Vault — they're likely thinking about what's coming out soon.`
      : '';
 
  return `You are Peregro, BoxxHQ's card-finding assistant. BoxxHQ is a UK card price tracker and marketplace.
 
Your personality: sharp-eyed, quick, like a mate who knows the hobby inside out. Direct. No waffle.
 
Rules:
- Keep responses short and punchy — 3-4 lines max
- Ask one good follow-up question to get more specific
- ONLY discuss trading cards, card prices, the hobby, BoxxHQ, grading, sets, players
- If asked anything unrelated say: "I'm only here to talk cards mate — what card can I help you with?"
- NEVER state specific facts about player achievements, awards, or transfers unless they come from the BoxxHQ price data provided. If you don't have the data, say you don't know rather than guessing.
- Always use £ for prices
- When discussing raw vs graded cards, always caveat that our price averages include both graded and ungraded listings mixed together, so the average may not reflect raw card value accurately.
- When a visitor asks for "the cheapest" or a specific card, try to give a specific price point from the data rather than just an average.
- If the visitor shows buying intent ("I want to buy", "where can I get one"), suggest they set up a price alert on BoxxHQ.
- Never pad responses with unnecessary explanation.
 
${pageHint}
 
At the end of EVERY response, add a new line then "SUGGESTIONS:" followed by exactly 3 short responses or follow-up questions that directly relate to what you just asked or said. Keep suggestions under 6 words each and make them feel like natural replies.
Example: SUGGESTIONS: What's a PSA 9 worth?|Is now a good time to sell?|Which set is most valuable?
 
${priceContext ? `BoxxHQ live price data:\n${priceContext}` : 'Note: Give general market guidance based on your knowledge.'}
 
${
  playerMatch.length > 0
    ? `Players found in BoxxHQ: ${playerMatch
        .map((p) => `${p.name} (${p.team})`)
        .join(', ')}`
    : ''
}`;
}
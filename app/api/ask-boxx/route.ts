import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: Request) {
  const { message, history } = await request.json();

  if (!message) {
    return Response.json({ error: 'No message provided' }, { status: 400 });
  }

  const playerMatch = await findRelevantPlayers(message);
  const priceContext = await getPriceContext(message, playerMatch);

  const systemPrompt = `You are Boxx, a trading card expert for BoxxHQ — a UK card price tracker. You specialise in football cards but know all sports.

Your personality: direct, knowledgeable, like a mate who knows the hobby inside out. No waffle.

Rules:
- Keep responses short and punchy — 3-4 lines max
- Ask one good follow-up question to get more specific
- ONLY discuss trading cards, card prices, the hobby, BoxxHQ, grading, sets, players
- If asked anything unrelated say: "I'm only here to talk cards mate — what card can I help you with?"
- NEVER state specific facts about player achievements, awards, or transfers unless they come from the BoxxHQ price data provided. If you don't have the data, say you don't know rather than guessing.
- Always use £ for prices
- When discussing raw vs graded cards, always caveat that our price averages include both graded and ungraded listings mixed together, so the average may not reflect raw card value accurately.
- Never pad responses with unnecessary explanation

At the end of EVERY response, add a new line then "SUGGESTIONS:" followed by exactly 3 short responses or follow-up questions that directly relate to what you just asked or said. If you asked about condition, suggest conditions. If you asked about a set, suggest sets. Keep suggestions under 6 words each and make them feel like natural replies.
SUGGESTIONS: What's a PSA 9 worth?|Is now a good time to sell?|Which set is most valuable?

${priceContext ? `BoxxHQ live price data:\n${priceContext}` : 'Note: Give general market guidance based on your knowledge.'}

${playerMatch.length > 0 ? `Players found in BoxxHQ: ${playerMatch.map((p: any) => `${p.name} (${p.team})`).join(', ')}` : ''}`;

  const messages = [
    ...history.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    })),
    { role: 'user', content: message }
  ];

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
    const fullReply = data.content?.[0]?.text || 'Sorry, I could not generate a response.';

    // Split reply and suggestions
    const [reply, suggestionsRaw] = fullReply.split('SUGGESTIONS:');
    const suggestions = suggestionsRaw
      ? suggestionsRaw.trim().split('|').map((s: string) => s.trim()).filter(Boolean).slice(0, 3)
      : [];

    return Response.json({ reply: reply.trim(), suggestions });

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

async function findRelevantPlayers(message: string) {
  const words = message.toLowerCase().split(' ');

  const { data: players } = await supabase
    .from('players')
    .select('name, team, sport, nationality')
    .limit(200);

  if (!players) return [];

  return players.filter((player: any) => {
    const nameLower = player.name.toLowerCase();
    return words.some((word: string) => word.length > 3 && nameLower.includes(word));
  }).slice(0, 5);
}

async function getPriceContext(message: string, players: any[]) {
  if (players.length === 0) return null;

  const playerNames = players.map((p: any) => p.name.toLowerCase());

  const { data: prices } = await supabase
    .from('price_history')
    .select('search_term, variant_label, avg_price, listing_count, recorded_at')
    .in('search_term', playerNames.flatMap((name: string) => [
      name,
      `${name} auto`,
      `${name} psa 10`,
      `${name} prizm`,
    ]))
    .order('recorded_at', { ascending: false })
    .limit(20);

  if (!prices || prices.length === 0) return null;

  return prices.map((p: any) =>
    `${p.search_term} (${p.variant_label}): avg £${p.avg_price} across ${p.listing_count} listings`
  ).join('\n');
}
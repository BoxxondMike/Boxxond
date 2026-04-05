import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: Request) {
 const authHeader = request.headers.get('authorization');
const { searchParams } = new URL(request.url);
const secret = searchParams.get('secret');

if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && secret !== process.env.CRON_SECRET) {
  return Response.json({ error: 'Unauthorised' }, { status: 401 });
}

  try {
    const { data: players } = await supabase.from('players').select('name');
    if (!players || players.length === 0) {
      return Response.json({ message: 'No players found' });
    }

    let saved = 0;

    for (const player of players) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/search?q=${encodeURIComponent(player.name)}&playerSearch=true`
      );
      const data = await res.json();
      const items = data.items || [];

      const prices = items
        .filter((item: any) => item.price?.value)
        .map((item: any) => parseFloat(item.price.value));

      if (prices.length === 0) continue;

      const avg = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;

      await supabase.from('price_history').insert({
        search_term: player.name.toLowerCase(),
        avg_price: parseFloat(avg.toFixed(2)),
        listing_count: items.length,
      });

      saved++;
    }

    return Response.json({ message: `Saved price history for ${saved} players` });

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
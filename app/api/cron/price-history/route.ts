import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const batchSize = 50;

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorised' }, { status: 401 });
  }

  console.log('✓ Auth passed');

  try {
    console.log('Querying player_search_terms...');

    const { data: searchTerms, error } = await supabase
      .from('player_search_terms')
      .select('id, player_id, search_term, variant_label')
      .eq('active', true)
      .order('last_fetched_at', { ascending: true, nullsFirst: true })
      .limit(batchSize);

    console.log(`Found ${searchTerms?.length} terms, error: ${error?.message}`);

    if (!searchTerms || searchTerms.length === 0) {
      return Response.json({ message: 'No search terms found' });
    }

    let saved = 0;

    for (const term of searchTerms) {
      console.log(`Processing: ${term.search_term} (${term.variant_label})`);
      try {
        const searchUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/search?q=${encodeURIComponent(term.search_term)}&playerSearch=true`;
        
        const res = await fetch(searchUrl);
        const data = await res.json();
        const items = data.items || [];

        console.log(`Got ${items.length} items for ${term.search_term}`);

        const prices = items
          .filter((item: any) => item.price?.value)
          .map((item: any) => parseFloat(item.price.value));

        // Always update last_fetched_at regardless of results
        const { error: updateError } = await supabase
  .from('player_search_terms')
  .update({ last_fetched_at: new Date().toISOString() })
  .eq('search_term', term.search_term)
  .eq('variant_label', term.variant_label);

        console.log(`Updated last_fetched_at for ${term.search_term}, error: ${updateError?.message}`);

        if (prices.length === 0) continue;

        const avg = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;

        await supabase.from('price_history').insert({
          search_term: term.search_term,
          variant_label: term.variant_label,
          player_id: term.player_id,
          avg_price: parseFloat(avg.toFixed(2)),
          listing_count: items.length,
        });

        saved++;
      } catch (termError: any) {
        console.error(`Failed for ${term.search_term}: ${termError.message}`);
        continue;
      }
    }

    return Response.json({ 
      message: `Processed ${searchTerms.length} terms, saved ${saved} price records` 
    });

  } catch (error: any) {
    console.error('Cron error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
  
}
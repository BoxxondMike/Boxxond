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

        // Strip accents and lowercase for comparison
const stripAccents = (str: string) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// Get the player's actual name from the search term, removing variant modifiers
const playerNameOnly = stripAccents(
  term.search_term
    .replace(/ (auto|numbered|psa 10|short print|prizm|world cup|topps chrome|topps|fulham|chelsea|arsenal)$/i, '')
    .trim()
);

const filteredItems = items.filter((item: any) => {
  if (!item.price?.value) return false;
  const title = stripAccents(item.title || '');
  return title.includes(playerNameOnly);
});

const prices = filteredItems.map((item: any) => parseFloat(item.price.value));

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
          listing_count: filteredItems.length,
        });

        saved++;
      } catch (termError: any) {
        console.error(`Failed for ${term.search_term}: ${termError.message}`);
        continue;
      }
    }
    // Cache homepage listings
try {
  const ebayToken = await getEbayToken();
  
  const endingSoonFilter = encodeURIComponent('buyingOptions:{FIXED_PRICE},price:[5..10000],priceCurrency:GBP,itemLocationCountry:GB');
const featuredFilter = encodeURIComponent('buyingOptions:{FIXED_PRICE},price:[30..10000],priceCurrency:GBP,itemLocationCountry:GB,conditionIds:{2750|3000|4000|5000}');

const [endingSoonRes, featuredRes] = await Promise.all([
    fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?q=football%20card&filter=${endingSoonFilter}&sort=endingSoonest&limit=12`, {
      headers: {
        'Authorization': `Bearer ${ebayToken}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_GB',
        'X-EBAY-C-ENDUSERCTX': 'affiliateCampaignId=5339145682,affiliateReferenceId=Boxxhq',
      }
    }),
    fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?q=topps%20chrome%20football&filter=${featuredFilter}&sort=newlyListed&limit=12`, {
      headers: {
        'Authorization': `Bearer ${ebayToken}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_GB',
        'X-EBAY-C-ENDUSERCTX': 'affiliateCampaignId=5339145682,affiliateReferenceId=Boxxhq',
      }
    }),
  ]);

  const endingSoonData = await endingSoonRes.json();
  const featuredData = await featuredRes.json();

  await supabase.from('cached_listings').delete().in('type', ['ending_soon', 'listings_we_like']);
  
  await supabase.from('cached_listings').insert([
    { type: 'ending_soon', items: endingSoonData.itemSummaries || [] },
    { type: 'listings_we_like', items: featuredData.itemSummaries || [] },
  ]);

  console.log('✓ Homepage listings cached');
} catch (cacheError: any) {
  console.error('Cache error:', cacheError.message);
}

    return Response.json({ 
      message: `Processed ${searchTerms.length} terms, saved ${saved} price records` 
    });

  } catch (error: any) {
    console.error('Cron error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
  }

async function getEbayToken() {
  const credentials = Buffer.from(
    `${process.env.EBAY_APP_ID}:${process.env.EBAY_CERT_ID}`
  ).toString('base64');

  const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
  });

  const data = await response.json();
  return data.access_token;
}
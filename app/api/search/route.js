export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const featured = searchParams.get('featured');
  const sortParam = searchParams.get('sort');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const condition = searchParams.get('condition');
  const isPlayerSearch = searchParams.get('playerSearch') === 'true';

  if (!query) {
    return Response.json({ error: 'No search query provided' }, { status: 400 });
  }

  const token = await getEbayToken();

  // Build sort
  let sort = 'endingSoonest';
if (sortParam === 'price') sort = '-price';
if (sortParam === 'lowPrice') sort = 'price';
if (sortParam === 'newlyListed') sort = 'newlyListed';

  // Build filters
  let filters = 'buyingOptions%3A%7BFIXED_PRICE%7D';
  if (minPrice && maxPrice) filters += `,price:%5B${minPrice}..${maxPrice}%5D`;
  else if (minPrice) filters += `,price:%5B${minPrice}..%5D`;
  else if (maxPrice) filters += `,price:%5B..${maxPrice}%5D`;
  if (condition) filters += `,conditions:%7B${condition.toUpperCase()}%7D`;

  // Category filter for player searches
  const categoryFilter = isPlayerSearch ? '&category_ids=261328' : '';

  const response = await fetch(
    `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}${categoryFilter}&filter=${filters}&sort=${sort}&limit=${featured ? '12' : '100'}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_GB',
        'X-EBAY-C-ENDUSERCTX': 'affiliateCampaignId=5339145682,affiliateReferenceId=Boxxhq',
      },
    }
  );

  const data = await response.json();
  return Response.json({ items: data.itemSummaries || [] });
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
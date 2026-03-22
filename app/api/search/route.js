export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const featured = searchParams.get('featured');
  const sort = searchParams.get('sort') === 'price' ? '-price' : 'endingSoonest';
  const isPlayerSearch = searchParams.get('playerSearch') === 'true';
  const categoryFilter = isPlayerSearch ? '&category_ids=261328' : '';

  if (!query) {
    return Response.json({ error: 'No search query provided' }, { status: 400 });
  }

  const token = await getEbayToken();

  const response = await fetch(
    `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}${categoryFilter}&filter=buyingOptions%3A%7BFIXED_PRICE%7D&sort=${sort}&limit=${featured ? '4' : '50'}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_GB',
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
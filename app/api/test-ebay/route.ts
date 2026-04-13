export async function GET() {
  const credentials = Buffer.from(
    `${process.env.EBAY_APP_ID}:${process.env.EBAY_CERT_ID}`
  ).toString('base64');

  const tokenRes = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
  });

  const tokenData = await tokenRes.json();
  const token = tokenData.access_token;

  const searchRes = await fetch(
    'https://api.ebay.com/buy/browse/v1/item_summary/search?q=bellingham&category_ids=261328&limit=3',
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_GB',
      },
    }
  );

  const searchData = await searchRes.json();
  return Response.json({ 
    tokenOk: !!token,
    status: searchRes.status,
    data: searchData 
  });
}
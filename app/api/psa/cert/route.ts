export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cert = searchParams.get('cert');
  if (!cert) return Response.json({ error: 'No cert number provided' }, { status: 400 });

  const res = await fetch(`https://api.psacard.com/publicapi/cert/GetByCertNumber/${cert}`, {
    headers: { 'Authorization': `bearer ${process.env.PSA_API_KEY}` },
  });
  const data = await res.json();
  return Response.json(data);
}
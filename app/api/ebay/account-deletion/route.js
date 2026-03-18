export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const challenge_code = searchParams.get('challenge_code');
  const verification_token = 'boxxond021020PackerfulCharlotte87';
  const endpoint = 'https://boxxond.com/api/ebay/account-deletion';

  const crypto = await import('crypto');
  const hash = crypto.default
    .createHash('sha256')
    .update(challenge_code + verification_token + endpoint)
    .digest('hex');

  return Response.json({ challengeResponse: hash });
}

export async function POST(request) {
  return new Response('OK', { status: 200 });
}
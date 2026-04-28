import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

function generateUnsubToken(userId: string): string {
  const secret = process.env.CRON_SECRET!;
  return crypto
    .createHmac('sha256', secret)
    .update(userId)
    .digest('hex')
    .slice(0, 32);
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('u');
  const token = searchParams.get('t');

  if (!userId || !token) {
    return Response.json({ error: 'Missing parameters' }, { status: 400 });
  }

  // Verify token using constant-time comparison
  const expected = generateUnsubToken(userId);
  if (token.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))) {
    return Response.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { error } = await supabase
    .from('user_profiles')
    .update({ weekly_digest_enabled: false })
    .eq('user_id', userId);

  if (error) {
    return Response.json({ error: 'Failed to update preferences' }, { status: 500 });
  }

  return Response.json({ message: 'Unsubscribed successfully.' });
}
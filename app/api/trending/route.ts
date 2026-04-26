import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('search_logs')
    .select('player_name')
    .gte('searched_at', sevenDaysAgo);

  if (error) return NextResponse.json({ trending: [] });

  // Count searches per player
  const counts: Record<string, number> = {};
  for (const row of data || []) {
    counts[row.player_name] = (counts[row.player_name] || 0) + 1;
  }

  const trending = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, searches]) => ({ name, searches }));

  return NextResponse.json({ trending });
}
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET() {
  const { error } = await supabase
    .from('player_search_terms')
    .update({ last_fetched_at: new Date().toISOString() })
    .eq('search_term', 'jude bellingham')
    .eq('variant_label', 'All');

  return Response.json({ error: error?.message || 'success' });
}
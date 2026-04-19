/**
 * app/api/peregro/log/route.ts
 * ----------------------------------------------------------------------------
 * Handles lightweight logging events from the Peregro widget.
 *
 * Events:
 *   - affiliate_click       {url}                       -> increment counter + record URL
 *   - email_captured        {}                           -> flag the conversation
 *   - alert_created         {}                           -> flag the conversation
 *
 * Note: we do NOT log user/assistant messages from this route. Those are
 * logged server-side inside /api/peregro/chat, which is more reliable than
 * trusting the client to send them. This route is only for events the
 * component itself knows about (e.g. an affiliate link was clicked).
 *
 * Fire-and-forget from the client — failures here never break the chat UX.
 * ----------------------------------------------------------------------------
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

type LogPayload = {
  conversation_id: string;
  event: 'affiliate_click' | 'email_captured' | 'alert_created';
  url?: string;
};

export async function POST(request: Request) {
  let body: LogPayload;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { conversation_id, event, url } = body;

  if (!conversation_id || !event) {
    return Response.json(
      { error: 'Missing conversation_id or event' },
      { status: 400 }
    );
  }

  try {
    if (event === 'affiliate_click' && url) {
      await supabase.rpc('increment_affiliate_clicks', {
        conv_id: conversation_id,
        click_url: url,
      });
    } else if (event === 'email_captured') {
      await supabase.rpc('mark_email_captured', {
        conv_id: conversation_id,
      });
    } else if (event === 'alert_created') {
      await supabase.rpc('mark_alert_created', {
        conv_id: conversation_id,
      });
    } else {
      return Response.json({ error: 'Unknown event type' }, { status: 400 });
    }

    return Response.json({ ok: true });
  } catch (error: unknown) {
    // Never surface logging errors to the user — just swallow and return 200.
    // We'd rather lose one log event than break the chat.
    console.error('[peregro/log] failed', error);
    return Response.json({ ok: true });
  }
}
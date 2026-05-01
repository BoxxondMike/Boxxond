import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const DAILY_LIMIT = 20;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      imageBase64,
      mediaType,
      conversation_id,
      session_id,
      user_id,
    } = body;

    if (!imageBase64 || !mediaType) {
      return Response.json({ error: 'Missing image data' }, { status: 400 });
    }

    if (!conversation_id || !session_id) {
      return Response.json({ error: 'Missing conversation or session ID' }, { status: 400 });
    }

    if (!user_id) {
      return Response.json({ error: 'You need to be logged in to use photo identification' }, { status: 401 });
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(mediaType)) {
      return Response.json({ error: 'Unsupported image type' }, { status: 400 });
    }

    // ---- Rate limit check: 20 photo identifications per user per day ----
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count: usageToday } = await supabase
      .from('peregro_messages')
      .select('id, peregro_conversations!inner(user_id)', { count: 'exact', head: true })
      .eq('has_image', true)
      .eq('role', 'user')
      .eq('peregro_conversations.user_id', user_id)
      .gte('created_at', since);

    if ((usageToday ?? 0) >= DAILY_LIMIT) {
      return Response.json(
        { error: `Daily limit reached. You can identify up to ${DAILY_LIMIT} cards per day.` },
        { status: 429 }
      );
    }

    // ---- Upload image to card-images bucket ----
    const buffer = Buffer.from(imageBase64, 'base64');
    const fileName = `peregro/${user_id}/${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from('card-images')
      .upload(fileName, buffer, {
        contentType: mediaType,
        upsert: false,
      });

    let imageUrl: string | null = null;
    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from('card-images')
        .getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    // ---- Call Claude vision for identification ----
    const identifyPrompt = `You are a trading card identifier inside the Peregro chat assistant on BoxxHQ.

Look at this trading card image and identify what you see. Respond conversationally, in Peregro's voice (sharp, direct, like a mate who knows cards). 3-5 lines max.

Format your response like this:

Looks like a [year] [brand] [player] [variant]. [Optional: spotted serial number /XX, autograph, grade]. 

[Then offer to help with prices or ask if you got it right]

If anything's wrong — wrong player, wrong set, wrong variant, whatever — just tell me and I'll redo.

Rules:
- Brand should be one of: Topps Chrome, Topps Finest, Topps Museum, Topps Dynasty, Topps UCC, Topps Now, Topps Stadium Club, Topps Inception, Topps Sapphire, Topps EFL, Panini Prizm, Panini Select, Panini Mosaic, Panini Contenders, Panini Obsidian, Panini Immaculate, Upper Deck — or just "unknown brand" if you can't tell
- Variant should be one of: Base, Auto, PSA 10, Numbered Parallel, Short Print, Refractor, Gold, Orange, Red, Blue, Green, Black, Superfractor — or skip the variant
- If the card is graded (PSA/BGS/SGC slab), say "PSA 10" / "BGS 9.5" etc, not just "graded"
- Use £ if you mention any prices
- ALWAYS end with a line inviting correction. Phrases like: "Got it wrong? Tell me what's off." / "If I'm off, what should I change?" / "Tell me if any of that's not right."
- Then add a new line then "SUGGESTIONS:" followed by exactly 3 short follow-up replies the user might want to send next, separated by |. Keep each under 6 words. Examples: "What's it worth?" / "Show me sold prices" / "It's actually a PSA 9"`;

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        system: identifyPrompt,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: imageBase64,
                },
              },
              {
                type: 'text',
                text: 'Identify this card.',
              },
            ],
          },
        ],
      }),
    });

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text();
      console.error('Anthropic API error:', errText);
      return Response.json({ error: 'Card identification failed' }, { status: 500 });
    }

    const anthropicData = await anthropicResponse.json();
    const fullReply: string =
      anthropicData.content?.[0]?.text || 'Sorry, I could not identify that card.';

    const [replyRaw, suggestionsRaw] = fullReply.split('SUGGESTIONS:');
    const reply = (replyRaw ?? '').trim();
    const suggestions = suggestionsRaw
      ? suggestionsRaw
          .trim()
          .split('|')
          .map((s: string) => s.trim())
          .filter(Boolean)
          .slice(0, 3)
      : [];

    // ---- Ensure conversation row exists ----
    await supabase.from('peregro_conversations').upsert(
      {
        id: conversation_id,
        session_id,
        user_id,
      },
      { onConflict: 'id', ignoreDuplicates: true }
    );

    // ---- Log the user's image upload as a peregro_message ----
    await supabase.from('peregro_messages').insert({
      conversation_id,
      role: 'user',
      content: '[Photo uploaded]',
      has_image: true,
      image_url: imageUrl,
    });
    await supabase.rpc('increment_message_count', { conv_id: conversation_id });

    // ---- Log the assistant's reply ----
    await supabase.from('peregro_messages').insert({
      conversation_id,
      role: 'assistant',
      content: reply,
    });
    await supabase.rpc('increment_message_count', { conv_id: conversation_id });

    return Response.json({
      reply,
      suggestions,
      imageUrl,
      usageToday: (usageToday ?? 0) + 1,
      limit: DAILY_LIMIT,
    });
  } catch (error: any) {
    console.error('Identify card chat error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
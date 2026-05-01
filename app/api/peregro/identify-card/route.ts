export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageBase64, mediaType } = body;

    if (!imageBase64 || !mediaType) {
      return Response.json({ error: 'Missing image data' }, { status: 400 });
    }

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(mediaType)) {
      return Response.json({ error: 'Unsupported image type' }, { status: 400 });
    }

    const systemPrompt = `You are an expert trading card identifier. You'll be shown a photo of a sports trading card and must extract identifying information.

Return ONLY valid JSON matching this exact shape (no prose, no markdown, no code fences):

{
  "player_name": string | null,
  "year": number | null,
  "brand": string | null,
  "set_name": string | null,
  "card_number": string | null,
  "numbered": string | null,
  "is_autograph": boolean,
  "is_graded": boolean,
  "grade_company": string | null,
  "grade_value": string | null,
  "variant_guess": string | null,
  "confidence": "high" | "medium" | "low",
  "notes": string | null
}

Rules:
- "brand" should be one of: Topps Chrome, Topps Finest, Topps Museum, Topps Dynasty, Topps UCC, Topps Now, Topps Stadium Club, Topps Inception, Topps Sapphire, Topps EFL, Panini Prizm, Panini Select, Panini Mosaic, Panini Contenders, Panini Obsidian, Panini Immaculate, Upper Deck, Other - or null if you can't tell
- "variant_guess" should be one of: Base, Auto, PSA 10, Numbered Parallel, Short Print, Refractor, Gold, Orange, Red, Blue, Green, Black, Superfractor, Other - or null
- "numbered" format: "/99", "/50", "/1" etc. Only set if visibly numbered.
- "confidence": high = clearly identifiable from the image, medium = best guess but some uncertainty, low = significant guesswork
- Use null for anything you can't determine. Don't guess wildly.
- Set "is_autograph" to true only if you can see an actual signature on the card.
- Set "is_graded" to true only if the card is in a slab (PSA/BGS/SGC/ACE plastic case).
- "notes" is for one short observation that might help the user (e.g. "Card appears to be raw, ungraded" or "Back of card not visible") - or null.`;

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        system: systemPrompt,
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
                text: 'Identify this trading card. Return JSON only.',
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
    const textBlock = anthropicData.content?.find((c: any) => c.type === 'text');

    if (!textBlock?.text) {
      return Response.json({ error: 'No identification returned' }, { status: 500 });
    }

    let parsed;
    try {
      // Strip any accidental markdown fences just in case
      const cleaned = textBlock.text.replace(/```json\n?|```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error('Failed to parse Claude response:', textBlock.text);
      return Response.json({ error: 'Could not parse identification' }, { status: 500 });
    }

    return Response.json({ identification: parsed });
  } catch (error: any) {
    console.error('Identify card error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
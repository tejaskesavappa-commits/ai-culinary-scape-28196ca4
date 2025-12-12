import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ success: false, error: 'No image provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing mood from image...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a mood detection and food recommendation AI. Analyze the person's facial expression in the image and detect their mood. Then suggest 4-5 dishes that would be perfect for that mood.

IMPORTANT: You MUST respond with ONLY valid JSON, no markdown, no code blocks, just pure JSON.

Response format:
{
  "mood": "one of: happy, tired, stressed, hungry, relaxed, excited",
  "confidence": "high/medium/low",
  "emoji": "appropriate emoji for the mood",
  "message": "a friendly personalized message about their mood (max 20 words)",
  "suggestions": [
    {
      "name": "dish name",
      "description": "why this dish matches their mood (max 15 words)",
      "type": "comfort/energizing/light/hearty/sweet"
    }
  ]
}

Be warm, friendly, and suggest a mix of Indian and international dishes. If you can't clearly see a face, make a reasonable guess based on any visible cues or default to "relaxed" mood.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this person\'s mood from their expression and suggest perfect food dishes for them.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    console.log('AI response:', content);

    // Parse the JSON response
    let result;
    try {
      // Clean the response - remove any markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      result = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return a default response if parsing fails
      result = {
        mood: 'relaxed',
        confidence: 'medium',
        emoji: '😊',
        message: 'You seem relaxed! Here are some great food options for you.',
        suggestions: [
          { name: 'Butter Chicken', description: 'A classic comfort dish to enjoy', type: 'comfort' },
          { name: 'Paneer Tikka', description: 'Light yet flavorful appetizer', type: 'light' },
          { name: 'Biryani', description: 'A hearty and satisfying meal', type: 'hearty' },
          { name: 'Gulab Jamun', description: 'Sweet treat to brighten your day', type: 'sweet' }
        ]
      };
    }

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in mood-food-analyzer:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

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
    const { preferences, cuisineType, dietaryRestrictions, mood } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating food recommendations for:', { preferences, cuisineType, dietaryRestrictions, mood });

    const systemPrompt = `You are a friendly food recommendation expert. Based on user preferences, suggest 3-5 dishes they might enjoy. 
    
For each dish, provide:
- name: The dish name
- description: A brief, appetizing description (1-2 sentences)
- cuisineType: The cuisine origin
- spiceLevel: mild, medium, or hot
- isVegetarian: true or false

Respond ONLY with valid JSON in this format:
{
  "recommendations": [
    {
      "name": "Dish Name",
      "description": "Description",
      "cuisineType": "Italian",
      "spiceLevel": "mild",
      "isVegetarian": false
    }
  ],
  "message": "A friendly message about why these dishes were chosen"
}`;

    const userPrompt = `Please recommend dishes based on these preferences:
- Food preferences: ${preferences || 'No specific preference'}
- Cuisine type: ${cuisineType || 'Any cuisine'}
- Dietary restrictions: ${dietaryRestrictions || 'None'}
- Current mood: ${mood || 'Normal'}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add more credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log('AI response:', content);

    // Parse the JSON response
    let recommendations;
    try {
      // Handle potential markdown code blocks
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      recommendations = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      recommendations = {
        recommendations: [],
        message: "I couldn't generate recommendations at this time. Please try again."
      };
    }

    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in food-recommendations:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

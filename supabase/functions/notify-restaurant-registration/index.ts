import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RestaurantRegistrationRequest {
  restaurant_id: string;
  restaurant_name: string;
  owner_name: string;
  email: string;
  phone: string;
  address: string;
  cuisine_type: string;
  description: string;
  approval_token: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: RestaurantRegistrationRequest = await req.json();
    console.log("Received restaurant registration notification request:", data);

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    
    // Build approval URL - this will be handled by an edge function
    const approvalUrl = `${supabaseUrl}/functions/v1/approve-restaurant?token=${data.approval_token}&id=${data.restaurant_id}`;

    console.log("Restaurant registration logged:", data.restaurant_name);
    console.log("Approval URL:", approvalUrl);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Restaurant registration notification logged",
      approvalUrl 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in notify-restaurant-registration:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process notification" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
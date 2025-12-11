import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SMSRequest {
  orderId: string;
  phone: string;
  totalAmount: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const fast2smsApiKey = Deno.env.get("FAST2SMS_API_KEY");
    if (!fast2smsApiKey) {
      console.error("FAST2SMS_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "SMS service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify authentication
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Verify the JWT token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { orderId, phone, totalAmount }: SMSRequest = await req.json();

    if (!orderId || !phone || !totalAmount) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: orderId, phone, totalAmount" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify the order belongs to the user
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, user_id")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      console.error("Order fetch error:", orderError);
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (order.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: "Unauthorized to send SMS for this order" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Clean and validate phone number (remove +91 or any prefix, keep only digits)
    let cleanPhone = phone.replace(/\D/g, "");
    // Remove country code if present
    if (cleanPhone.startsWith("91") && cleanPhone.length === 12) {
      cleanPhone = cleanPhone.substring(2);
    }
    
    if (cleanPhone.length !== 10) {
      console.error("Invalid phone number:", phone, "-> cleaned:", cleanPhone);
      return new Response(
        JSON.stringify({ error: "Invalid phone number. Must be 10 digits." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create the SMS message
    const message = `FOODIEXPRESS: Your order #${orderId.slice(0, 8).toUpperCase()} has been placed successfully! Total: Rs.${totalAmount.toFixed(2)}. Thank you for ordering with us!`;

    console.log("Sending SMS to:", cleanPhone);
    console.log("Message:", message);

    // Send SMS using Fast2SMS API
    const smsResponse = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "authorization": fast2smsApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q", // Quick SMS route
        message: message,
        language: "english",
        flash: 0,
        numbers: cleanPhone,
      }),
    });

    const smsResult = await smsResponse.json();
    console.log("Fast2SMS response:", JSON.stringify(smsResult));

    if (smsResult.return === true || smsResult.return === "true") {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "SMS sent successfully",
          request_id: smsResult.request_id 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    } else {
      console.error("Fast2SMS error:", smsResult);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: smsResult.message || "Failed to send SMS",
          details: smsResult 
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

  } catch (error: any) {
    console.error("Error in send-order-sms function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

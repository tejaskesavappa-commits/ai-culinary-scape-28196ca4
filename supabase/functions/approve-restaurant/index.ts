import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    const restaurantId = url.searchParams.get("id");

    console.log("Approval request received:", { token, restaurantId });

    if (!token || !restaurantId) {
      return new Response(
        generateHtmlResponse("error", "Missing approval token or restaurant ID"),
        { status: 400, headers: { "Content-Type": "text/html", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify token and get restaurant
    const { data: restaurant, error: fetchError } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", restaurantId)
      .eq("approval_token", token)
      .single();

    if (fetchError || !restaurant) {
      console.error("Restaurant not found or invalid token:", fetchError);
      return new Response(
        generateHtmlResponse("error", "Invalid approval link or restaurant not found"),
        { status: 404, headers: { "Content-Type": "text/html", ...corsHeaders } }
      );
    }

    if (restaurant.is_approved) {
      return new Response(
        generateHtmlResponse("already_approved", `${restaurant.name} is already approved!`),
        { status: 200, headers: { "Content-Type": "text/html", ...corsHeaders } }
      );
    }

    // Approve the restaurant
    const { error: updateError } = await supabase
      .from("restaurants")
      .update({ is_approved: true })
      .eq("id", restaurantId);

    if (updateError) {
      console.error("Failed to approve restaurant:", updateError);
      return new Response(
        generateHtmlResponse("error", "Failed to approve restaurant. Please try again."),
        { status: 500, headers: { "Content-Type": "text/html", ...corsHeaders } }
      );
    }

    console.log("Restaurant approved successfully:", restaurant.name);

    return new Response(
      generateHtmlResponse("success", `${restaurant.name} has been approved successfully!`),
      { status: 200, headers: { "Content-Type": "text/html", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in approve-restaurant:", error);
    return new Response(
      generateHtmlResponse("error", "An unexpected error occurred"),
      { status: 500, headers: { "Content-Type": "text/html", ...corsHeaders } }
    );
  }
};

function generateHtmlResponse(status: "success" | "error" | "already_approved", message: string): string {
  const bgColor = status === "success" ? "#10B981" : status === "already_approved" ? "#F59E0B" : "#EF4444";
  const icon = status === "success" ? "✅" : status === "already_approved" ? "⚠️" : "❌";
  const title = status === "success" ? "Approved!" : status === "already_approved" ? "Already Approved" : "Error";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Restaurant Approval - FOODIEXPRESS</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          min-height: 100vh; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
          padding: 20px;
        }
        .card { 
          background: white; 
          border-radius: 16px; 
          box-shadow: 0 20px 60px rgba(0,0,0,0.1); 
          text-align: center; 
          max-width: 450px; 
          width: 100%;
          overflow: hidden;
        }
        .icon-area { 
          background: ${bgColor}; 
          padding: 40px; 
          font-size: 64px; 
        }
        .content { 
          padding: 40px 30px; 
        }
        h1 { 
          color: #1f2937; 
          margin-bottom: 15px; 
          font-size: 28px;
        }
        p { 
          color: #6b7280; 
          font-size: 16px; 
          line-height: 1.6;
        }
        .brand { 
          margin-top: 30px; 
          padding-top: 20px; 
          border-top: 1px solid #e5e7eb; 
          color: #9ca3af; 
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="icon-area">${icon}</div>
        <div class="content">
          <h1>${title}</h1>
          <p>${message}</p>
          <div class="brand">FOODIEXPRESS Admin</div>
        </div>
      </div>
    </body>
    </html>
  `;
}

serve(handler);

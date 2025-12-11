import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyPaymentRequest {
  order_id: string;
  transaction_reference?: string;
  action: "submit_reference" | "admin_verify" | "admin_reject";
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Get user token from request
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create client with service role for admin operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify user token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Invalid user token:", userError);
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Authenticated user:", user.id);

    const { order_id, transaction_reference, action }: VerifyPaymentRequest = await req.json();

    if (!order_id || !action) {
      return new Response(
        JSON.stringify({ error: "order_id and action are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing action:", action, "for order:", order_id);

    // Fetch the order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .maybeSingle();

    if (orderError || !order) {
      console.error("Order not found:", orderError);
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin
    const { data: adminRole } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    const isAdmin = !!adminRole;
    const isOrderOwner = order.user_id === user.id;

    console.log("User is admin:", isAdmin, "User is order owner:", isOrderOwner);

    // Handle different actions
    switch (action) {
      case "submit_reference": {
        // Only order owner can submit payment reference
        if (!isOrderOwner) {
          return new Response(
            JSON.stringify({ error: "You can only submit reference for your own orders" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (!transaction_reference) {
          return new Response(
            JSON.stringify({ error: "Transaction reference is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Update order with payment reference
        const { error: updateError } = await supabaseAdmin
          .from("orders")
          .update({
            payment_id: transaction_reference,
            payment_status: "pending",
            notes: order.notes 
              ? `${order.notes}\n[UPI Ref: ${transaction_reference}]`
              : `[UPI Ref: ${transaction_reference}]`,
            updated_at: new Date().toISOString(),
          })
          .eq("id", order_id);

        if (updateError) {
          console.error("Failed to update order:", updateError);
          return new Response(
            JSON.stringify({ error: "Failed to submit payment reference" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log("Payment reference submitted successfully");
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Payment reference submitted for verification" 
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "admin_verify": {
        // Only admin can verify payments
        if (!isAdmin) {
          return new Response(
            JSON.stringify({ error: "Admin access required" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Mark payment as completed
        const { error: updateError } = await supabaseAdmin
          .from("orders")
          .update({
            payment_status: "completed",
            status: "confirmed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", order_id);

        if (updateError) {
          console.error("Failed to verify payment:", updateError);
          return new Response(
            JSON.stringify({ error: "Failed to verify payment" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Add to order status history
        await supabaseAdmin
          .from("order_status_history")
          .insert({
            order_id,
            status: "confirmed",
            notes: "Payment verified by admin",
            updated_by: user.id,
          });

        console.log("Payment verified successfully by admin");
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Payment verified successfully" 
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "admin_reject": {
        // Only admin can reject payments
        if (!isAdmin) {
          return new Response(
            JSON.stringify({ error: "Admin access required" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Mark payment as failed
        const { error: updateError } = await supabaseAdmin
          .from("orders")
          .update({
            payment_status: "failed",
            status: "cancelled",
            updated_at: new Date().toISOString(),
          })
          .eq("id", order_id);

        if (updateError) {
          console.error("Failed to reject payment:", updateError);
          return new Response(
            JSON.stringify({ error: "Failed to reject payment" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Add to order status history
        await supabaseAdmin
          .from("order_status_history")
          .insert({
            order_id,
            status: "cancelled",
            notes: "Payment rejected by admin",
            updated_by: user.id,
          });

        console.log("Payment rejected by admin");
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Payment rejected" 
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error: any) {
    console.error("Error in verify-upi-payment:", error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

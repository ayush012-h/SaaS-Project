import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Authenticate user
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      token!,
    );
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...cors, "Content-Type": "application/json" },
        },
      );
    }

    const API_KEY = Deno.env.get("DODO_API_KEY")!;
    const PRODUCT_ID = Deno.env.get("DODO_PRODUCT_ID")!;
    const APP_URL = Deno.env.get("APP_URL") || "https://subtrackr.me";

    if (!API_KEY || !PRODUCT_ID) {
      throw new Error("Missing Dodo Payments environment variables");
    }

    // Create checkout session with Dodo Payments API
    const response = await fetch("https://api.dodopayments.com/subscriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        billing: {
          city: "Silchar",
          country: "IN",
          state: "Assam",
          street: "Your Street",
          zipcode: "788001",
        },
        customer: {
          email: user.email,
          name: user.user_metadata?.full_name || "User",
          create_new_customer: true,
        },
        metadata: {
          user_id: user.id,
        },
        payment_link: true,
        product_id: PRODUCT_ID,
        quantity: 1,
        return_url: `${APP_URL}/dashboard?upgraded=true`,
      }),
    });

    const data = await response.json();
    console.log("Dodo response:", JSON.stringify(data));

    if (!response.ok) {
      throw new Error(data?.message || "Failed to create checkout");
    }

    // Dodo returns payment_link for hosted checkout
    const checkoutUrl = data?.payment_link;

    if (!checkoutUrl) {
      throw new Error("No checkout URL returned from Dodo");
    }

    console.log(`✅ Dodo checkout created for user ${user.id}`);

    return new Response(
      JSON.stringify({ url: checkoutUrl }),
      { status: 200, headers: { ...cors, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("create-dodo-checkout error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }
});

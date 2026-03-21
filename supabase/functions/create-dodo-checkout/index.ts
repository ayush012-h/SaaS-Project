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

    console.log("DODO_API_KEY present:", !!API_KEY);
    console.log("DODO_PRODUCT_ID:", PRODUCT_ID);
    console.log("User email:", user.email);

    if (!API_KEY || !PRODUCT_ID) {
      throw new Error(
        "Missing Dodo Payments environment variables — check Supabase secrets",
      );
    }

    // ── Try Dodo API ──────────────────────────────────────
    const requestBody = {
      billing: {
        city: "Silchar",
        country: "IN",
        state: "Assam",
        street: "Main Street",
        zipcode: "788001",
      },
      customer: {
        email: user.email,
        name: user.user_metadata?.full_name || user.email?.split("@")[0] ||
          "User",
        create_new_customer: true,
      },
      metadata: {
        user_id: user.id,
      },
      payment_link: true,
      product_id: PRODUCT_ID,
      quantity: 1,
      trial_period_days: 3,
      return_url: `${APP_URL}/dashboard?upgraded=true`,
    };

    console.log("Sending to Dodo:", JSON.stringify(requestBody));

    const response = await fetch("https://api.dodopayments.com/subscriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // Read raw response text first for debugging
    const rawText = await response.text();
    console.log("Dodo raw response status:", response.status);
    console.log("Dodo raw response body:", rawText);

    // Parse response
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(rawText);
    } catch {
      throw new Error(`Dodo returned non-JSON response: ${rawText}`);
    }

    // Handle API errors
    if (!response.ok) {
      const errMsg = (data?.message as string) ||
        (data?.error as string) ||
        (data?.detail as string) ||
        `Dodo API error ${response.status}`;
      throw new Error(errMsg);
    }

    console.log("Dodo full response:", JSON.stringify(data));

    // ── Extract checkout URL ──────────────────────────────
    // Dodo may return URL in different fields depending on version
    const checkoutUrl = (data?.payment_link as string) ||
      (data?.url as string) ||
      (data?.checkout_url as string) ||
      (data?.hosted_url as string) ||
      (data?.link as string) ||
      // Sometimes nested inside data object
      ((data?.data as Record<string, unknown>)?.payment_link as string) ||
      ((data?.data as Record<string, unknown>)?.url as string);

    if (!checkoutUrl) {
      console.error("Could not find URL in response:", JSON.stringify(data));
      throw new Error(
        `No checkout URL found in Dodo response. ` +
          `Response keys: ${Object.keys(data).join(", ")}`,
      );
    }

    console.log(`✅ Dodo checkout URL: ${checkoutUrl}`);
    console.log(`✅ Created for user: ${user.id}`);

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

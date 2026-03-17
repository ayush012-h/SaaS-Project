import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check Pro plan
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    if (profile?.plan !== "pro") {
      return new Response(
        JSON.stringify({ error: "Pro plan required", upgrade: true }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get email text from request
    const { email_text } = await req.json();

    if (!email_text || email_text.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "Please provide email or bank statement text" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call OpenAI to extract subscriptions
    const prompt = `
You are a subscription detection AI. Analyze this bank statement or email text and extract all recurring subscription charges.

Text to analyze:
"""
${email_text}
"""

Return ONLY a valid JSON array. No markdown, no explanation.
Each item must have:
{
  "name": "Service name (e.g. Netflix, Spotify)",
  "amount": 9.99,
  "billing_cycle": "monthly" | "yearly" | "weekly",
  "next_renewal_date": "YYYY-MM-DD or null if unknown",
  "category": "Entertainment" | "Music" | "Productivity" | "Dev Tools" | "Cloud" | "Health" | "Education" | "Other"
}

Rules:
- Only include clear recurring charges, not one-time payments
- If amount is in INR, keep it as is
- If you cannot detect any subscriptions, return an empty array []
- next_renewal_date should be estimated as 30 days from today if monthly and date is unclear
`;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    const openaiData = await openaiRes.json();
    const rawContent = openaiData.choices?.[0]?.message?.content?.trim();

    if (!rawContent) throw new Error("No response from AI");

    const detectedSubscriptions = JSON.parse(rawContent);

    if (!Array.isArray(detectedSubscriptions)) {
      throw new Error("Invalid AI response format");
    }

    if (detectedSubscriptions.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No subscriptions detected in this text",
          subscriptions: [],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check free plan limit
    if (profile?.plan !== "pro") {
      const { count } = await supabase
        .from("subscriptions")
        .select("*", { count: "exact" })
        .eq("user_id", user.id);

      if ((count || 0) >= 5) {
        return new Response(
          JSON.stringify({ error: "Free plan limit reached. Upgrade to Pro.", upgrade: true }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Insert detected subscriptions into DB
    const toInsert = detectedSubscriptions.map((sub: any) => ({
      user_id: user.id,
      name: sub.name,
      amount: sub.amount,
      billing_cycle: sub.billing_cycle || "monthly",
      next_renewal_date: sub.next_renewal_date || null,
      category: sub.category || "Other",
      status: "active",
    }));

    const { data: inserted, error: insertError } = await supabase
      .from("subscriptions")
      .insert(toInsert)
      .select();

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({
        message: `Found and added ${inserted.length} subscription${inserted.length !== 1 ? "s" : ""}`,
        subscriptions: inserted,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("scan-email-text error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
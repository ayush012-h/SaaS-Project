// ============================================================
// FILE 1: supabase/functions/generate-cancel-guide/index.ts
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Auth check
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token!);
    if (authError || !user) throw new Error("Unauthorized");

    // Check Pro plan
    const { data: profile } = await supabase
      .from("profiles").select("plan").eq("id", user.id).single();
    if (profile?.plan !== "pro") {
      return new Response(JSON.stringify({ error: "Pro plan required", upgrade: true }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { service_name, renewal_date } = await req.json();
    if (!service_name) throw new Error("service_name is required");

    // Check cache first
    const { data: cached } = await supabase
      .from("cancel_guides")
      .select("guide_data")
      .ilike("service_name", service_name)
      .single();

    if (cached?.guide_data) {
      console.log("Returning cached guide for:", service_name);
      return new Response(
        JSON.stringify({ ...cached.guide_data, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call OpenAI
    const prompt = `Generate step-by-step cancellation instructions for "${service_name}".
Return ONLY valid JSON in this exact format:
{
  "service": "${service_name}",
  "steps": [
    {"number": 1, "instruction": "Go to the website", "type": "website", "url": "https://example.com/account"},
    {"number": 2, "instruction": "Click on Account Settings", "type": "settings", "url": null},
    {"number": 3, "instruction": "Find Cancel Subscription", "type": "settings", "url": null},
    {"number": 4, "instruction": "Confirm cancellation", "type": "warning", "url": null}
  ],
  "warnings": ["Your access continues until end of billing period", "Download your data before cancelling"],
  "customer_service": "support phone or email if known",
  "difficulty": "easy",
  "estimated_time": "2 minutes"
}
Types must be one of: website, settings, customer_service, warning
Difficulty must be: easy, medium, or hard`;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.3,
      }),
    });

    const openaiData = await openaiRes.json();
    const raw = openaiData.choices?.[0]?.message?.content?.trim();
    if (!raw) throw new Error("No response from OpenAI");

    const guideData = JSON.parse(raw);

    // Cache it
    await supabase.from("cancel_guides").upsert({
      service_name: service_name.toLowerCase(),
      guide_data: guideData,
      updated_at: new Date().toISOString(),
    }, { onConflict: "service_name" });

    return new Response(
      JSON.stringify(guideData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("generate-cancel-guide error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
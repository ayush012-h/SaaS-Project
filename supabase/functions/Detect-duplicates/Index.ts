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

    // Auth
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token!);
    if (authError || !user) throw new Error("Unauthorized");

    // Check Pro
    const { data: profile } = await supabase
      .from("profiles").select("plan").eq("id", user.id).single();
    if (profile?.plan !== "pro") {
      return new Response(
        JSON.stringify({ error: "Pro plan required", upgrade: true }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { subscriptions } = await req.json();

    if (!subscriptions || subscriptions.length < 2) {
      return new Response(
        JSON.stringify({ duplicates: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subList = subscriptions
      .map((s: any) => `- ${s.name} (${s.category || "Unknown"}, ₹${s.amount}/month)`)
      .join("\n");

    const prompt = `Analyze these subscriptions and find overlapping or duplicate services:

${subList}

Find pairs of subscriptions that serve the same purpose (e.g., two streaming services, two cloud storage services, two note-taking apps, two music apps).

Return ONLY a valid JSON array. If no duplicates found, return [].
Each duplicate pair must have exactly these fields:
[{
  "service1": "exact service name from list",
  "service2": "exact service name from list",
  "category": "category they share e.g. Video Streaming",
  "overlap_reason": "one sentence explaining why they overlap",
  "recommendation": "which one to keep and why",
  "potential_saving": minimum_amount_of_the_two_services_as_number,
  "confidence": "high"
}]

Only include pairs where you are confident they actually overlap. Return [] if no clear overlaps exist.`;

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
        temperature: 0.2,
      }),
    });

    const openaiData = await openaiRes.json();
    const raw = openaiData.choices?.[0]?.message?.content?.trim();
    if (!raw) throw new Error("No response from OpenAI");

    // Clean response
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const duplicates = JSON.parse(cleaned);

    console.log(`Found ${duplicates.length} duplicate pairs for user ${user.id}`);

    return new Response(
      JSON.stringify({ duplicates: Array.isArray(duplicates) ? duplicates : [] }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("detect-duplicates error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message, duplicates: [] }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
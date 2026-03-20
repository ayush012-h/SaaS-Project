// supabase/functions/email-cron/index.ts
// Runs automatically every day via cron job
// Sends: Day 3 onboarding, Day 7 onboarding, Re-engagement emails

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ── Helper: call send-email function ─────────────────────
async function sendEmail(
  supabaseUrl: string,
  anonKey: string,
  type: string,
  to: string,
  name: string,
  data: Record<string, unknown> = {},
) {
  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ type, to, name, data }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Send failed");
    return { success: true };
  } catch (err) {
    console.error(`Failed to send ${type} to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
}

// ── Main handler ─────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

    if (!supabaseUrl || !serviceKey) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const stats = {
      onboarding_day3: { sent: 0, failed: 0 },
      onboarding_day7: { sent: 0, failed: 0 },
      re_engagement: { sent: 0, failed: 0 },
    };

    // ── 1. DAY 3 ONBOARDING ──────────────────────────────
    // Find users who signed up exactly 3 days ago
    const day3 = new Date(now);
    day3.setDate(day3.getDate() - 3);
    const day3Str = day3.toISOString().split("T")[0];

    const { data: day3Users, error: day3Err } = await supabase
      .from("profiles")
      .select("id, email, full_name, created_at")
      .gte("created_at", `${day3Str}T00:00:00.000Z`)
      .lte("created_at", `${day3Str}T23:59:59.999Z`)
      .not("email", "is", null);

    if (day3Err) {
      console.error("Day 3 query error:", day3Err.message);
    } else {
      console.log(`Day 3 users found: ${day3Users?.length || 0}`);
      for (const user of day3Users || []) {
        const result = await sendEmail(
          supabaseUrl,
          anonKey,
          "onboarding_day3",
          user.email,
          user.full_name || "",
        );
        if (result.success) stats.onboarding_day3.sent++;
        else stats.onboarding_day3.failed++;

        // 100ms delay between emails to avoid rate limits
        await new Promise((r) => setTimeout(r, 100));
      }
    }

    // ── 2. DAY 7 ONBOARDING ──────────────────────────────
    // Find free users who signed up exactly 7 days ago
    const day7 = new Date(now);
    day7.setDate(day7.getDate() - 7);
    const day7Str = day7.toISOString().split("T")[0];

    const { data: day7Users, error: day7Err } = await supabase
      .from("profiles")
      .select("id, email, full_name, plan, created_at")
      .gte("created_at", `${day7Str}T00:00:00.000Z`)
      .lte("created_at", `${day7Str}T23:59:59.999Z`)
      .eq("plan", "free") // only pitch upgrade to free users
      .not("email", "is", null);

    if (day7Err) {
      console.error("Day 7 query error:", day7Err.message);
    } else {
      console.log(`Day 7 users found: ${day7Users?.length || 0}`);
      for (const user of day7Users || []) {
        // Get their subscription stats
        const { data: subs } = await supabase
          .from("subscriptions")
          .select("amount")
          .eq("user_id", user.id)
          .eq("status", "active");

        const totalSubs = subs?.length || 0;
        const monthlyCost = subs?.reduce(
          (sum: number, s: { amount: string }) =>
            sum + parseFloat(s.amount || "0"),
          0,
        ) || 0;

        const result = await sendEmail(
          supabaseUrl,
          anonKey,
          "onboarding_day7",
          user.email,
          user.full_name || "",
          {
            total_subs: totalSubs,
            monthly_cost: Math.round(monthlyCost),
          },
        );
        if (result.success) stats.onboarding_day7.sent++;
        else stats.onboarding_day7.failed++;

        await new Promise((r) => setTimeout(r, 100));
      }
    }

    // ── 3. RE-ENGAGEMENT (14+ days inactive) ─────────────
    // Find users who haven't been seen in 14+ days
    const day14 = new Date(now);
    day14.setDate(day14.getDate() - 14);
    const day14Str = day14.toISOString();

    const { data: inactiveUsers, error: inactiveErr } = await supabase
      .from("profiles")
      .select("id, email, full_name, last_seen_at")
      .lt("last_seen_at", day14Str)
      .not("email", "is", null)
      .not("last_seen_at", "is", null)
      .limit(50); // max 50 re-engagement emails per day

    if (inactiveErr) {
      console.error("Re-engagement query error:", inactiveErr.message);
    } else {
      console.log(`Inactive users found: ${inactiveUsers?.length || 0}`);
      for (const user of inactiveUsers || []) {
        const lastSeen = new Date(user.last_seen_at);
        const daysSince = Math.floor(
          (now.getTime() - lastSeen.getTime()) / (1000 * 60 * 60 * 24),
        );

        const result = await sendEmail(
          supabaseUrl,
          anonKey,
          "re_engagement",
          user.email,
          user.full_name || "",
          { days_since_login: daysSince },
        );
        if (result.success) stats.re_engagement.sent++;
        else stats.re_engagement.failed++;

        await new Promise((r) => setTimeout(r, 100));
      }
    }

    // ── Summary log ──────────────────────────────────────
    console.log("Email cron completed:", {
      date: todayStr,
      stats,
    });

    return new Response(
      JSON.stringify({
        success: true,
        date: todayStr,
        stats,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("email-cron error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

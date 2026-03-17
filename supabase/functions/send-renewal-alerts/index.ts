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

    // Find all subscriptions renewing in the next 7 days
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    const todayStr = today.toISOString().split("T")[0];
    const sevenDaysStr = sevenDaysLater.toISOString().split("T")[0];

    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select(`
        *,
        profiles (
          email,
          full_name
        )
      `)
      .eq("status", "active")
      .gte("next_renewal_date", todayStr)
      .lte("next_renewal_date", sevenDaysStr);

    if (error) throw error;

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ message: "No renewals in next 7 days", sent: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let emailsSent = 0;

    // Send email for each renewal
    for (const sub of subscriptions) {
      const userEmail = sub.profiles?.email;
      const userName = sub.profiles?.full_name || "there";

      if (!userEmail) continue;

      const renewalDate = new Date(sub.next_renewal_date);
      const daysUntil = Math.ceil(
        (renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      const emailHtml = `
        <div style="font-family: 'DM Sans', sans-serif; max-width: 500px; margin: 0 auto; background: #0A0A0F; color: #E8E8F0; padding: 32px; border-radius: 16px;">
          <div style="display: flex; align-items: center; margin-bottom: 24px;">
            <div style="background: linear-gradient(135deg, #6C63FF, #3ECFCF); width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-right: 12px;">💳</div>
            <h2 style="margin: 0; font-size: 20px; font-weight: 800;">SubTrackr</h2>
          </div>

          <h3 style="color: #FFD700; margin-bottom: 8px;">⚡ Renewal Reminder</h3>
          <p style="color: #C0C0D0; margin-bottom: 24px;">Hey ${userName}, just a heads up:</p>

          <div style="background: #1A1A2A; border: 1px solid #2A2A3A; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <div style="font-size: 24px; margin-bottom: 8px;">${sub.name}</div>
            <div style="color: #888; font-size: 14px; margin-bottom: 4px;">${sub.category}</div>
            <div style="font-size: 28px; font-weight: 800; color: #6C63FF; margin: 12px 0;">$${sub.amount}</div>
            <div style="color: #FFD700; font-size: 14px;">
              Renews in <strong>${daysUntil} day${daysUntil !== 1 ? "s" : ""}</strong> on ${sub.next_renewal_date}
            </div>
          </div>

          <a href="${Deno.env.get("APP_URL")}/alerts"
             style="display: block; text-align: center; background: linear-gradient(135deg, #6C63FF, #3ECFCF); color: white; padding: 14px 24px; border-radius: 10px; text-decoration: none; font-weight: 700; margin-bottom: 16px;">
            View in SubTrackr →
          </a>

          <p style="color: #444460; font-size: 12px; text-align: center; margin-top: 24px;">
            You're receiving this because you have renewal alerts enabled in SubTrackr.<br/>
            <a href="${Deno.env.get("APP_URL")}/settings" style="color: #6C63FF;">Manage alert preferences</a>
          </p>
        </div>
      `;

      // Send via Resend
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "SubTrackr <noreply@subtrackr.me>",
          to: userEmail,
          subject: `⚡ ${sub.name} renews in ${daysUntil} day${daysUntil !== 1 ? "s" : ""} — $${sub.amount}`,
          html: emailHtml,
        }),
      });

      if (resendRes.ok) {
        emailsSent++;

        // Log alert as sent in DB
        await supabase.from("alerts").insert({
          user_id: sub.user_id,
          subscription_id: sub.id,
          alert_date: todayStr,
          dismissed: false,
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: `Renewal alerts sent`,
        sent: emailsSent,
        total_found: subscriptions.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("send-renewal-alerts error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
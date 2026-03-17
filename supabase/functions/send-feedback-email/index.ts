import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // ── Check secrets ──────────────────────────────────
        const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
        const FOUNDER_EMAIL = Deno.env.get("FOUNDER_EMAIL");

        console.log("RESEND_API_KEY present:", !!RESEND_API_KEY);
        console.log("FOUNDER_EMAIL present:", !!FOUNDER_EMAIL);
        console.log("FOUNDER_EMAIL value:", FOUNDER_EMAIL);

        if (!RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY secret is missing");
        }
        if (!FOUNDER_EMAIL) {
            throw new Error("FOUNDER_EMAIL secret is missing");
        }

        // ── Parse request body ─────────────────────────────
        const body = await req.json();
        console.log("Request body:", JSON.stringify(body));

        const {
            type = "general",
            rating = 0,
            message = "",
            user_email = "anonymous",
            page = "/",
        } = body;

        if (!message) {
            throw new Error("Message is empty");
        }

        // ── Build simple email ─────────────────────────────
        const ratingEmoji = ["", "😤", "😕", "😐", "😊", "😍"][rating] || "💬";
        const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);

        const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #f9f9f9; border-radius: 12px;">
        <h2 style="color: #6C63FF; margin-top: 0;">
          New ${typeLabel} Feedback from SubTrackr
        </h2>
        
        <div style="background: white; border-radius: 8px; padding: 16px; margin-bottom: 16px; border-left: 4px solid #6C63FF;">
          <strong>Rating:</strong> ${ratingEmoji} ${rating}/5<br/>
          <strong>Type:</strong> ${typeLabel}<br/>
          <strong>From:</strong> ${user_email}<br/>
          <strong>Page:</strong> ${page}<br/>
          <strong>Time:</strong> ${new Date().toLocaleString()}
        </div>

        <div style="background: white; border-radius: 8px; padding: 16px;">
          <strong>Message:</strong>
          <p style="margin: 8px 0 0; line-height: 1.6; color: #333;">
            ${message}
          </p>
        </div>

        ${
            user_email !== "anonymous"
                ? `
        <div style="margin-top: 16px; text-align: center;">
          <a href="mailto:${user_email}" 
             style="background: #6C63FF; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Reply to User →
          </a>
        </div>
        `
                : ""
        }
      </div>
    `;

        // ── Send via Resend ────────────────────────────────
        console.log("Sending email to:", FOUNDER_EMAIL);

        const resendResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${RESEND_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // Use resend's onboarding address which works without domain verification
                from: "SubTrackr <onboarding@resend.dev>",
                to: [FOUNDER_EMAIL],
                subject: `${ratingEmoji} New ${typeLabel} feedback — SubTrackr`,
                html: emailHtml,
            }),
        });

        const resendData = await resendResponse.json();
        console.log("Resend response status:", resendResponse.status);
        console.log("Resend response body:", JSON.stringify(resendData));

        if (!resendResponse.ok) {
            throw new Error(
                `Resend API error ${resendResponse.status}: ${
                    JSON.stringify(resendData)
                }`,
            );
        }

        console.log("✅ Email sent successfully, ID:", resendData.id);

        return new Response(
            JSON.stringify({ success: true, email_id: resendData.id }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
        );
    } catch (error) {
        console.error("❌ send-feedback-email failed:", error.message);

        return new Response(
            JSON.stringify({
                error: error.message,
                hint: "Check Supabase Edge Function logs for details",
            }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
        );
    }
});

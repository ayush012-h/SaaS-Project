import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ── TEMPLATES ─────────────────────────────────────────────

function welcomeTemplate(name: string, appUrl: string): string {
  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0A0A0F;color:#E8E8F0;border-radius:16px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#6C63FF,#3ECFCF);padding:40px;text-align:center;">
      <div style="font-size:40px;margin-bottom:8px;">💳</div>
      <h1 style="margin:0;font-size:26px;font-weight:900;color:#fff;">Welcome to SubTrackr!</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Stop losing money on forgotten subscriptions</p>
    </div>
    <div style="padding:36px 40px;">
      <p style="font-size:16px;color:#C0C0D0;margin:0 0 16px;">Hey ${
    name || "there"
  } 👋</p>
      <p style="font-size:14px;color:#A0A0B8;line-height:1.7;margin:0 0 24px;">
        Welcome to SubTrackr! You just took the first step to stop losing money on forgotten subscriptions.
        The average person wastes <strong style="color:#FFD700;">₹2,400/year</strong> on unused subscriptions. Let's fix that.
      </p>
      <div style="background:#1A1A2A;border-radius:12px;padding:24px;margin-bottom:24px;">
        <p style="font-size:13px;font-weight:700;color:#6C63FF;margin:0 0 16px;text-transform:uppercase;letter-spacing:1px;">Get started in 3 steps</p>
        <div style="display:flex;gap:12px;margin-bottom:14px;"><span style="font-size:20px;">1️⃣</span><div><div style="font-weight:700;font-size:14px;color:#E8E8F0;">Add your first subscription</div><div style="font-size:12px;color:#666680;">Netflix, Spotify, Adobe — whatever you pay for</div></div></div>
        <div style="display:flex;gap:12px;margin-bottom:14px;"><span style="font-size:20px;">2️⃣</span><div><div style="font-weight:700;font-size:14px;color:#E8E8F0;">Set renewal alerts</div><div style="font-size:12px;color:#666680;">Never get surprised by a charge again</div></div></div>
        <div style="display:flex;gap:12px;"><span style="font-size:20px;">3️⃣</span><div><div style="font-weight:700;font-size:14px;color:#E8E8F0;">Get AI spending insights</div><div style="font-size:12px;color:#666680;">See exactly where your money goes</div></div></div>
      </div>
      <div style="text-align:center;margin-bottom:28px;">
        <a href="${appUrl}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#6C63FF,#3ECFCF);color:#fff;text-decoration:none;padding:14px 36px;border-radius:12px;font-weight:800;font-size:15px;">Go to Dashboard →</a>
      </div>
      <p style="font-size:12px;color:#444460;text-align:center;">Questions? Reply to this email — I personally read every message.</p>
    </div>
    <div style="padding:20px 40px;border-top:1px solid #1E1E2E;text-align:center;">
      <p style="font-size:11px;color:#333350;margin:0;">© 2026 SubTrackr · <a href="${appUrl}/privacy" style="color:#555570;">Privacy</a> · <a href="${appUrl}/unsubscribe" style="color:#555570;">Unsubscribe</a></p>
    </div>
  </div>`;
}

function proUpgradeTemplate(name: string, appUrl: string): string {
  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0A0A0F;color:#E8E8F0;border-radius:16px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#6C63FF,#3ECFCF);padding:40px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">🎉</div>
      <h1 style="margin:0;font-size:26px;font-weight:900;color:#fff;">Welcome to Pro!</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">You just unlocked everything SubTrackr has to offer</p>
    </div>
    <div style="padding:36px 40px;">
      <p style="font-size:15px;color:#A0A0B8;line-height:1.7;margin:0 0 24px;">Hey ${
    name || "there"
  }, thank you for upgrading to Pro! Here is everything you now have access to:</p>
      <div style="background:#1A1A2A;border-radius:12px;padding:24px;margin-bottom:24px;">
        ${
    [
      ["📄", "Cancellation Guides", "Cancel any service in under 2 minutes"],
      ["💰", "Budget Alerts", "Set limits and get warned before overspending"],
      ["📊", "Yearly Report", "Your subscription Wrapped — shareable"],
      ["🔁", "Duplicate Detector", "Find overlapping services with AI"],
      ["📅", "Calendar View", "See every renewal before it hits"],
      ["📤", "CSV and PDF Export", "Download all your data anytime"],
    ].map(([icon, title, desc]) =>
      `<div style="display:flex;gap:14px;margin-bottom:16px;align-items:flex-start;"><span style="font-size:20px;flex-shrink:0;">${icon}</span><div><div style="font-weight:700;font-size:14px;color:#E8E8F0;">${title}</div><div style="font-size:12px;color:#666680;">${desc}</div></div></div>`
    ).join("")
  }
      </div>
      <div style="text-align:center;margin-bottom:28px;">
        <a href="${appUrl}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#6C63FF,#3ECFCF);color:#fff;text-decoration:none;padding:14px 36px;border-radius:12px;font-weight:800;font-size:15px;">Explore Pro Features →</a>
      </div>
    </div>
    <div style="padding:20px 40px;border-top:1px solid #1E1E2E;text-align:center;">
      <p style="font-size:11px;color:#333350;margin:0;">© 2026 SubTrackr · <a href="${appUrl}/settings" style="color:#555570;">Manage subscription</a></p>
    </div>
  </div>`;
}

function onboardingDay3Template(name: string, appUrl: string): string {
  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0A0A0F;color:#E8E8F0;border-radius:16px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#1A0A2E,#0A1A2E);padding:32px 40px;text-align:center;border-bottom:1px solid #2A2A4A;">
      <div style="font-size:32px;margin-bottom:8px;">🤖</div>
      <h1 style="margin:0;font-size:20px;font-weight:900;">Did you know about AI Email Scanning?</h1>
    </div>
    <div style="padding:36px 40px;">
      <p style="font-size:15px;color:#A0A0B8;line-height:1.7;margin:0 0 20px;">Hey ${
    name || "there"
  },</p>
      <p style="font-size:14px;color:#A0A0B8;line-height:1.7;margin:0 0 24px;">Instead of adding subscriptions one by one, just paste your bank statement text and our AI finds ALL your subscriptions automatically.</p>
      <div style="background:#1A1A2A;border-radius:12px;padding:20px;margin-bottom:24px;border-left:3px solid #6C63FF;">
        <p style="margin:0;font-size:14px;color:#A89CFF;font-weight:700;">💡 Try this right now</p>
        <p style="margin:8px 0 0;font-size:13px;color:#888;line-height:1.6;">Open your banking app → View last 3 months statement → Copy and paste the text into SubTrackr AI Scanner. It finds everything in seconds.</p>
      </div>
      <div style="text-align:center;">
        <a href="${appUrl}/scanner" style="display:inline-block;background:linear-gradient(135deg,#6C63FF,#3ECFCF);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:800;font-size:14px;">Try AI Scanner Now →</a>
      </div>
    </div>
    <div style="padding:20px 40px;border-top:1px solid #1E1E2E;text-align:center;">
      <p style="font-size:11px;color:#333350;margin:0;">© 2026 SubTrackr · <a href="${appUrl}/unsubscribe" style="color:#555570;">Unsubscribe</a></p>
    </div>
  </div>`;
}

function onboardingDay7Template(
  name: string,
  appUrl: string,
  totalSubs: number,
  monthlyCost: number,
): string {
  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0A0A0F;color:#E8E8F0;border-radius:16px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#0A2A0A,#0A1A0A);padding:32px 40px;text-align:center;border-bottom:1px solid #1A4A1A;">
      <div style="font-size:32px;margin-bottom:8px;">📊</div>
      <h1 style="margin:0;font-size:20px;font-weight:900;color:#4CFF8F;">Your Week 1 Summary</h1>
    </div>
    <div style="padding:36px 40px;">
      <p style="font-size:15px;color:#A0A0B8;line-height:1.7;margin:0 0 24px;">Hey ${
    name || "there"
  }, you have been using SubTrackr for a week!</p>
      <div style="display:flex;gap:16px;margin-bottom:24px;">
        <div style="flex:1;background:#1A1A2A;border-radius:12px;padding:20px;text-align:center;"><div style="font-size:32px;font-weight:900;color:#6C63FF;">${
    totalSubs || 0
  }</div><div style="font-size:12px;color:#666680;margin-top:4px;">Subscriptions tracked</div></div>
        <div style="flex:1;background:#1A1A2A;border-radius:12px;padding:20px;text-align:center;"><div style="font-size:32px;font-weight:900;color:#3ECFCF;">₹${
    monthlyCost || 0
  }</div><div style="font-size:12px;color:#666680;margin-top:4px;">Monthly spend found</div></div>
      </div>
      <div style="background:#1A1A2A;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#FFD700;">⭐ Upgrade to Pro and unlock:</p>
        ${
    [
      "Unlimited subscription tracking",
      "AI spending insights",
      "Step-by-step cancellation guides",
      "Budget alerts and yearly report",
      "CSV and PDF export",
    ].map((f) =>
      `<div style="font-size:13px;color:#A0A0B8;margin-bottom:8px;">✓ ${f}</div>`
    ).join("")
  }
        <div style="margin-top:16px;text-align:center;">
          <a href="${appUrl}/settings" style="display:inline-block;background:linear-gradient(135deg,#6C63FF,#3ECFCF);color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:800;font-size:14px;">Upgrade to Pro — ₹49/month →</a>
        </div>
      </div>
    </div>
    <div style="padding:20px 40px;border-top:1px solid #1E1E2E;text-align:center;">
      <p style="font-size:11px;color:#333350;margin:0;">© 2026 SubTrackr · <a href="${appUrl}/unsubscribe" style="color:#555570;">Unsubscribe</a></p>
    </div>
  </div>`;
}

function featureUpdateTemplate(
  name: string,
  appUrl: string,
  month: string,
  features: Array<{ icon: string; title: string; desc: string }>,
): string {
  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0A0A0F;color:#E8E8F0;border-radius:16px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#0D0A2E,#0A1A2E);padding:32px 40px;text-align:center;border-bottom:1px solid #2A2A4A;">
      <div style="font-size:13px;font-weight:700;color:#A89CFF;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">What is New in SubTrackr</div>
      <h1 style="margin:0;font-size:22px;font-weight:900;">New features just dropped 🚀</h1>
      <p style="margin:8px 0 0;color:#666680;font-size:13px;">${month}</p>
    </div>
    <div style="padding:36px 40px;">
      <p style="font-size:15px;color:#A0A0B8;line-height:1.7;margin:0 0 24px;">Hey ${
    name || "there"
  }, we have been busy building. Here is what is new:</p>
      ${
    features.map((f) =>
      `<div style="background:#1A1A2A;border-radius:12px;padding:20px;margin-bottom:14px;display:flex;gap:16px;align-items:flex-start;"><span style="font-size:24px;flex-shrink:0;">${f.icon}</span><div><div style="font-weight:700;font-size:15px;color:#E8E8F0;margin-bottom:4px;">${f.title}</div><div style="font-size:13px;color:#666680;line-height:1.6;">${f.desc}</div></div></div>`
    ).join("")
  }
      <div style="text-align:center;margin-top:28px;margin-bottom:28px;">
        <a href="${appUrl}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#6C63FF,#3ECFCF);color:#fff;text-decoration:none;padding:14px 36px;border-radius:12px;font-weight:800;font-size:15px;">Check Out New Features →</a>
      </div>
    </div>
    <div style="padding:20px 40px;border-top:1px solid #1E1E2E;text-align:center;">
      <p style="font-size:11px;color:#333350;margin:0;">© 2026 SubTrackr · <a href="${appUrl}/unsubscribe" style="color:#555570;">Unsubscribe</a></p>
    </div>
  </div>`;
}

function reEngagementTemplate(
  name: string,
  appUrl: string,
  daysSince: number,
): string {
  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0A0A0F;color:#E8E8F0;border-radius:16px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#2A1A0A,#1A0A0A);padding:32px 40px;text-align:center;border-bottom:1px solid #4A2A1A;">
      <div style="font-size:32px;margin-bottom:8px;">👀</div>
      <h1 style="margin:0;font-size:20px;font-weight:900;color:#FF9F43;">We miss you!</h1>
    </div>
    <div style="padding:36px 40px;">
      <p style="font-size:15px;color:#A0A0B8;line-height:1.7;margin:0 0 20px;">Hey ${
    name || "there"
  }, you have not logged into SubTrackr in <strong style="color:#E8E8F0;">${daysSince} days</strong>.</p>
      <div style="background:#2A1A0A;border:1px solid #4A2A1A;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="margin:0;font-size:14px;color:#FF9F43;font-weight:700;">⚠️ Check your upcoming renewals</p>
        <p style="margin:8px 0 0;font-size:13px;color:#888;line-height:1.6;">Log in to see which subscriptions are renewing soon so you can cancel before getting charged.</p>
      </div>
      <div style="text-align:center;">
        <a href="${appUrl}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#6C63FF,#3ECFCF);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:800;font-size:14px;">Check My Renewals →</a>
      </div>
    </div>
    <div style="padding:20px 40px;border-top:1px solid #1E1E2E;text-align:center;">
      <p style="font-size:11px;color:#333350;margin:0;">© 2026 SubTrackr · <a href="${appUrl}/unsubscribe" style="color:#555570;">Unsubscribe</a></p>
    </div>
  </div>`;
}

// ── MAIN HANDLER ─────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const APP_URL = Deno.env.get("APP_URL") || "https://subtrackr.me";

    console.log("RESEND_API_KEY present:", !!RESEND_API_KEY);
    console.log("APP_URL:", APP_URL);

    if (!RESEND_API_KEY) {
      throw new Error(
        "RESEND_API_KEY secret is missing in Supabase Edge Function secrets",
      );
    }

    // Parse body — handle both JSON and raw text
    let body: Record<string, unknown>;
    try {
      const rawBody = await req.text();
      console.log("Raw request body:", rawBody);
      body = JSON.parse(rawBody);
    } catch {
      throw new Error("Invalid JSON body");
    }

    const { type, to, name, data = {} } = body as {
      type: string;
      to: string;
      name: string;
      data: Record<string, unknown>;
    };

    console.log("Email type:", type, "To:", to, "Name:", name);

    if (!type) throw new Error("Missing email type");
    if (!to) throw new Error("Missing recipient email");

    let subject = "";
    let html = "";

    switch (type) {
      case "welcome":
        subject = "Welcome to SubTrackr! Here is how to get started 💳";
        html = welcomeTemplate(name as string, APP_URL);
        break;

      case "pro_upgrade":
        subject = "You are now a SubTrackr Pro member! 🎉";
        html = proUpgradeTemplate(name as string, APP_URL);
        break;

      case "onboarding_day3":
        subject = "Did you know about AI email scanning? 🤖";
        html = onboardingDay3Template(name as string, APP_URL);
        break;

      case "onboarding_day7":
        subject = `Your week 1 summary — ₹${
          (data as Record<string, unknown>)?.monthly_cost || 0
        }/month found 📊`;
        html = onboardingDay7Template(
          name as string,
          APP_URL,
          Number((data as Record<string, unknown>)?.total_subs || 0),
          Number((data as Record<string, unknown>)?.monthly_cost || 0),
        );
        break;

      case "feature_update":
        subject = `What is new in SubTrackr — ${
          (data as Record<string, unknown>)?.month || "this month"
        } 🚀`;
        html = featureUpdateTemplate(
          name as string,
          APP_URL,
          String((data as Record<string, unknown>)?.month || ""),
          ((data as Record<string, unknown>)?.features as Array<
            { icon: string; title: string; desc: string }
          >) || [],
        );
        break;

      case "re_engagement":
        subject = "We miss you — check your upcoming renewals 👀";
        html = reEngagementTemplate(
          name as string,
          APP_URL,
          Number((data as Record<string, unknown>)?.days_since_login || 14),
        );
        break;

      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    // Send via Resend
    console.log("Sending email via Resend to:", to);

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SubTrackr <hello@subtrackr.me>",
        to: [to],
        subject,
        html,
      }),
    });

    const resendRaw = await resendRes.text();
    console.log("Resend status:", resendRes.status);
    console.log("Resend response:", resendRaw);

    let resendData: Record<string, unknown>;
    try {
      resendData = JSON.parse(resendRaw);
    } catch {
      throw new Error(`Resend returned non-JSON: ${resendRaw}`);
    }

    if (!resendRes.ok) {
      throw new Error(`Resend error: ${JSON.stringify(resendData)}`);
    }

    console.log("✅ Email sent successfully. ID:", resendData.id);

    return new Response(
      JSON.stringify({ success: true, email_id: resendData.id }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("send-email error:", (error as Error).message);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

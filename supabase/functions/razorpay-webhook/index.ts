import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

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

    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET")!;
    const body = await req.text();

    // Verify webhook signature
    const razorpaySignature = req.headers.get("x-razorpay-signature");

    if (razorpaySignature && webhookSecret) {
      const expectedSignature = createHmac("sha256", webhookSecret)
        .update(body)
        .digest("hex");

      if (expectedSignature !== razorpaySignature) {
        return new Response("Invalid signature", { status: 400 });
      }
    }

    const event = JSON.parse(body);
    const eventType = event.event;

    console.log("Razorpay webhook event:", eventType);

    switch (eventType) {

      // Payment successful — upgrade to Pro
      case "subscription.activated":
      case "subscription.charged": {
        const subscription = event.payload.subscription.entity;
        const userId = subscription.notes?.user_id;

        if (userId) {
          await supabase
            .from("profiles")
            .update({
              plan: "pro",
              razorpay_subscription_id: subscription.id,
            })
            .eq("id", userId);

          console.log(`✅ User ${userId} upgraded to Pro`);
        }
        break;
      }

      // Subscription cancelled or expired — downgrade to Free
      case "subscription.cancelled":
      case "subscription.expired":
      case "subscription.completed": {
        const subscription = event.payload.subscription.entity;
        const userId = subscription.notes?.user_id;

        if (userId) {
          await supabase
            .from("profiles")
            .update({
              plan: "free",
              razorpay_subscription_id: null,
            })
            .eq("id", userId);

          console.log(`⬇️ User ${userId} downgraded to Free`);
        }
        break;
      }

      // Payment failed — notify but keep access until period ends
      case "subscription.pending": {
        const subscription = event.payload.subscription.entity;
        const userId = subscription.notes?.user_id;

        console.log(`⚠️ Payment pending for user ${userId}`);

        // Optional: send email notification via Resend
        if (userId) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", userId)
            .single();

          if (profile?.email) {
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "SubTrackr <noreply@subtrackr.me>",
                to: profile.email,
                subject: "⚠️ SubTrackr Pro — Payment Issue",
                html: `
                  <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
                    <h2>Payment Issue with Your SubTrackr Pro Subscription</h2>
                    <p>We had trouble processing your latest payment. Your Pro access is still active for now.</p>
                    <p>Please update your payment method to avoid losing access.</p>
                    <a href="${Deno.env.get("APP_URL")}/settings"
                       style="background: #6C63FF; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; margin-top: 16px;">
                      Update Payment Method
                    </a>
                  </div>
                `,
              }),
            });
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("razorpay-webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
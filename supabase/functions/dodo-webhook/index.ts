import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

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

    const body = await req.text();
    const signature = req.headers.get("webhook-signature");
    const secret = Deno.env.get("DODO_WEBHOOK_SECRET")!;

    // Verify webhook signature
    if (signature && secret) {
      const hmac = createHmac("sha256", secret)
        .update(body)
        .digest("hex");

      if (hmac !== signature) {
        console.error("Invalid webhook signature");
        return new Response("Invalid signature", { status: 401 });
      }
    }

    const event = JSON.parse(body);
    const eventType = event?.type;
    const userId = event?.data?.metadata?.user_id ||
      event?.data?.subscription?.metadata?.user_id;

    console.log("Dodo webhook event:", eventType, "user:", userId);

    switch (eventType) {
      // Payment successful → upgrade to Pro
      case "payment.succeeded":
      case "subscription.active": {
        if (userId) {
          const { error } = await supabase
            .from("profiles")
            .update({ plan: "pro" })
            .eq("id", userId);

          if (error) {
            console.error("DB update error:", error.message);
          } else {
            console.log(`✅ User ${userId} upgraded to Pro via Dodo`);
          }
        }
        break;
      }

      // Subscription cancelled → downgrade to Free
      case "subscription.cancelled":
      case "subscription.expired":
      case "subscription.on_hold": {
        if (userId) {
          await supabase
            .from("profiles")
            .update({ plan: "free" })
            .eq("id", userId);

          console.log(`⬇️ User ${userId} downgraded to Free`);
        }
        break;
      }

      // Payment failed — keep pro access
      // Dodo retries automatically
      case "payment.failed": {
        console.log(`⚠️ Payment failed for user ${userId}`);
        break;
      }

      default:
        console.log(`Unhandled Dodo event: ${eventType}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...cors, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("dodo-webhook error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }
});

// src/lib/emails.js
// Import this file anywhere in your app to send emails
// Usage: import { sendWelcomeEmail } from '../lib/emails'

import { supabase } from './supabase'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// ── CORE SEND FUNCTION ────────────────────────────────────

async function sendEmail(type, to, name, data = {}) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/send-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ type, to, name, data }),
      }
    )

    const result = await response.json()

    if (!response.ok) {
      console.error('Email failed:', result.error)
      return { success: false, error: result.error }
    }

    console.log(`Email sent: type=${type} to=${to}`)
    return { success: true, email_id: result.email_id }

  } catch (error) {
    console.error('Email error:', error.message)
    return { success: false, error: error.message }
  }
}

// 1. Welcome email - call on signup
export async function sendWelcomeEmail(email, name) {
  return sendEmail('welcome', email, name)
}

// 2. Pro upgrade email - call after payment
export async function sendProUpgradeEmail(email, name) {
  return sendEmail('pro_upgrade', email, name)
}

// 3. Day 3 onboarding
export async function sendOnboardingDay3(email, name) {
  return sendEmail('onboarding_day3', email, name)
}

// 4. Day 7 onboarding with stats
export async function sendOnboardingDay7(email, name, totalSubs, monthlyCost) {
  return sendEmail('onboarding_day7', email, name, {
    total_subs: totalSubs,
    monthly_cost: monthlyCost,
  })
}

// 5. Feature update newsletter
export async function sendFeatureUpdate(email, name, month, features) {
  return sendEmail('feature_update', email, name, { month, features })
}

// 6. Re-engagement for inactive users
export async function sendReEngagement(email, name, daysSinceLogin) {
  return sendEmail('re_engagement', email, name, {
    days_since_login: daysSinceLogin,
  })
}

// 7. Send newsletter to all users (marketing emails only)
export async function sendNewsletterToAllUsers(type, data = {}) {
  try {
    const { data: users, error } = await supabase
      .from('profiles')
      .select('email, full_name')
      .not('email', 'is', null)

    if (error) throw error

    let sent = 0
    let failed = 0

    for (const user of users || []) {
      const result = await sendEmail(type, user.email, user.full_name || '', data)
      if (result.success) sent++
      else failed++
      await new Promise(r => setTimeout(r, 100))
    }

    return { success: true, sent, failed }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
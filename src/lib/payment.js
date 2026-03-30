import { supabase } from './supabase'

// Cache country detection result
let cachedCountry = null

// ── Country Detection ─────────────────────────────────────
async function detectCountry() {
  if (cachedCountry) return cachedCountry

  const services = [
    async () => {
      const r = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) })
      const d = await r.json()
      return d.country_code
    },
    async () => {
      const r = await fetch('https://api.country.is/', { signal: AbortSignal.timeout(3000) })
      const d = await r.json()
      return d.country
    },
    async () => {
      const r = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(3000) })
      const d = await r.json()
      return d.country_code
    },
    async () => {
      const r = await fetch('https://freeipapi.com/api/json', { signal: AbortSignal.timeout(3000) })
      const d = await r.json()
      return d.countryCode
    },
  ]

  for (const service of services) {
    try {
      const code = await service()
      if (code && code.length === 2) {
        cachedCountry = code.toUpperCase()
        return cachedCountry
      }
    } catch { continue }
  }
  
  cachedCountry = 'UNKNOWN'
  return cachedCountry
}

export function forceInternational() {
  cachedCountry = 'US'
}

export function forceIndia() {
  cachedCountry = 'IN'
}

export async function isIndianUser() {
  const country = await detectCountry()
  return country === 'IN'
}

// Reset cache (useful for testing)
export function resetCountryCache() {
  cachedCountry = null
}

// ── Dodo Payments checkout (International) ────────────────
async function dodoCheckout() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Please login first')

    console.log('Creating Dodo checkout...')

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-dodo-checkout`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    // Log raw response for debugging
    const responseText = await res.text()
    console.log('Dodo checkout raw response:', responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch {
      throw new Error(`Invalid response from checkout: ${responseText}`)
    }

    if (!res.ok) {
      throw new Error(data?.error || `Checkout failed with status ${res.status}`)
    }

    if (data.error) throw new Error(data.error)

    // Check all possible URL field names Dodo might return
    const checkoutUrl =
      data.url ||
      data.checkout_url ||
      data.payment_url ||
      data.link ||
      data.payment_link

    if (!checkoutUrl) {
      console.error('Full Dodo response:', JSON.stringify(data))
      throw new Error('No checkout URL returned from Dodo. Check edge function logs.')
    }

    console.log('Dodo checkout URL:', checkoutUrl)

    // Redirect to Dodo hosted checkout
    window.location.href = checkoutUrl

  } catch (error) {
    console.error('Dodo checkout error:', error.message)
    throw error
  }
}

// ── Smart checkout — auto picks payment ───────────────────
export async function smartCheckout() {
  try {
    const india = await isIndianUser()
    console.log('Is Indian user:', india)

    if (india) {
      console.log('→ Razorpay (Indian user)')
      const { redirectToCheckout } = await import('./razorpay')
      return redirectToCheckout()
    } else {
      console.log('→ Dodo Payments (International user)')
      return dodoCheckout()
    }
  } catch (error) {
    console.error('Smart checkout error:', error.message)
    throw error
  }
}

// ── Show correct price based on location ──────────────────
export async function getLocalPrice() {
  const india = await isIndianUser()
  return india
    ? {
        amount:   '₹49',
        period:   '/month',
        flag:     '🇮🇳',
        currency: 'INR',
      }
    : {
        amount:   '$1',
        period:   '/month',
        flag:     '🌍',
        currency: 'USD',
      }
}
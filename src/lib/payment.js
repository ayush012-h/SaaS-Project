import { supabase } from './supabase'

// Cache country detection
let cachedCountry = null

async function detectCountry() {
  if (cachedCountry) return cachedCountry
  try {
    const res = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(3000)
    })
    const data = await res.json()
    cachedCountry = data.country_code
    return cachedCountry
  } catch {
    return 'UNKNOWN'
  }
}

export async function isIndianUser() {
  const country = await detectCountry()
  return country === 'IN'
}

// Dodo Payments checkout for international users
async function dodoCheckout() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Please login first')

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

    const data = await res.json()
    if (data.error) throw new Error(data.error)
    if (!data.url) throw new Error('No checkout URL returned')

    // Redirect to Dodo hosted checkout
    window.location.href = data.url

  } catch (error) {
    console.error('Dodo checkout error:', error.message)
    throw error
  }
}

// Smart checkout — auto picks payment based on location
export async function smartCheckout() {
  try {
    const india = await isIndianUser()
    if (india) {
      console.log('Indian user → Razorpay')
      const { redirectToCheckout } = await import('./razorpay')
      return redirectToCheckout()
    } else {
      console.log('International user → Dodo Payments')
      return dodoCheckout()
    }
  } catch (error) {
    console.error('Smart checkout error:', error.message)
    throw error
  }
}

// Show correct price based on location
export async function getLocalPrice() {
  const india = await isIndianUser()
  return india
    ? { amount: '₹49', period: '/month', flag: '🇮🇳', currency: 'INR' }
    : { amount: '$1',   period: '/month', flag: '🌍', currency: 'USD' }
}


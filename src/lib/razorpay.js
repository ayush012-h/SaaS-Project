import { supabase } from './supabase'
import { sendProUpgradeEmail } from './emails'
import toast from 'react-hot-toast'

const orderCache = new Map()

/**
 * Prefetches a Razorpay order ID to make the checkout popup open instantly.
 * Call this when a user hovers over an 'Upgrade to Pro' button.
 */
export async function prefetchOrder() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user?.id) return
    
    const userId = session.user.id
    const cacheKey = `order_${userId}`
    
    // Check if we already have a valid order ID (valid for 5 mins)
    if (orderCache.has(cacheKey)) {
      const { timestamp } = orderCache.get(cacheKey)
      if (Date.now() - timestamp < 5 * 60 * 1000) return
    }

    console.log('⚡ Prefetching Razorpay order...')
    const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
      body: { user_id: userId, email: session.user.email, prefetch: true }
    })

    if (!error && data?.subscription_id) {
      orderCache.set(cacheKey, { 
        subscription_id: data.subscription_id, 
        timestamp: Date.now() 
      })
      console.log('✅ Order prefetched successfully')
    }
  } catch (e) {
    console.warn('Prefetch failed (silent):', e)
  }
}

export async function redirectToCheckout() {
  try {
    // Lead script pre-check (fast)
    if (!window.Razorpay) {
      const scriptId = 'razorpay-sdk'
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script')
        script.id = scriptId
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        document.body.appendChild(script)
        await new Promise(resolve => script.onload = resolve)
      }
      let attempts = 0
      while (!window.Razorpay && attempts < 50) {
        await new Promise(r => setTimeout(r, 100))
        attempts++
      }
    }

    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user
    if (!user) throw new Error('Please login first')

    const loadingToast = toast.loading('Opening secure checkout...')
    
    // Check Cache first
    const cacheKey = `order_${user.id}`
    let subscription_id = null
    
    if (orderCache.has(cacheKey)) {
      const cached = orderCache.get(cacheKey)
      if (Date.now() - cached.timestamp < 10 * 60 * 1000) {
        subscription_id = cached.subscription_id
        console.log('🎯 Using prefetched order ID')
      }
    }

    // Call profile fetch in parallel
    const profilePromise = supabase.from('profiles').select('full_name').eq('id', user.id).single()

    if (!subscription_id) {
      console.log('⏳ Generating new Razorpay order...')
      const { data, error: invokeError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { user_id: user.id, email: user.email }
      })

      if (invokeError) {
        toast.dismiss(loadingToast)
        toast.error(invokeError.message || 'Payment initialization failed')
        return
      }
      subscription_id = data?.subscription_id
    }

    if (!subscription_id) {
      toast.dismiss(loadingToast)
      toast.error('Could not create subscription ID')
      return
    }

    toast.dismiss(loadingToast)

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      subscription_id: subscription_id,
      name: 'SubTrackr',
      description: 'Pro Subscription — ₹49/month',
      currency: 'INR',
      image: '/logo.png',
      prefill: { email: user.email },
      theme: { color: '#6C63FF' },
      modal: {
        ondismiss: function() { console.log('Checkout closed') }
      },
      handler: async function(payment) {
        toast.success('Payment successful! Verifying...')
        // Realtime update plan for better UX
        await supabase.from('profiles').update({ plan: 'pro' }).eq('id', user.id)
        
        // Non-blocking email
        profilePromise.then(({ data: profile }) => {
          sendProUpgradeEmail(user.email, profile?.full_name || 'there').catch(console.error)
        })

        window.location.href = '/dashboard?upgraded=true'
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()

  } catch (error) {
    console.error('Payment error:', error.message)
    toast.error(error.message)
  }
}
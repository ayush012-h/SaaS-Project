import { supabase } from './supabase'

export async function redirectToCheckout() {
  try {
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    document.body.appendChild(script)

    await new Promise(resolve => script.onload = resolve)

    // Get current user and session
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user
    if (!user) throw new Error('Please login first')

    // Create subscription order via your edge function
    const { data, error: invokeError } = await supabase.functions.invoke('create-razorpay-order', {
      body: { user_id: user.id, email: user.email }
    })

    if (invokeError) throw new Error(invokeError.message || 'Failed to create order')
    
    const { subscription_id } = data
    if (!subscription_id) throw new Error('No subscription ID returned')

    // Open Razorpay checkout popup
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      subscription_id: subscription_id,
      name: 'SubTrackr',
      description: 'Pro Plan - Unlimited Subscription Tracking',
      image: '/logo.png',
      prefill: {
        email: user.email,
      },
      theme: {
        color: '#6C63FF'
      },
      handler: async function(response) {
        // Payment successful
        // Update user plan in Supabase
        await supabase
          .from('profiles')
          .update({ plan: 'pro' })
          .eq('id', user.id)

        window.location.href = '/dashboard?upgraded=true'
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()

  } catch (error) {
    console.error('Payment error:', error.message)
    alert(error.message)
  }
}
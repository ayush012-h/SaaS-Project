import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const SubscriptionsContext = createContext({})

export function SubscriptionsProvider({ children }) {
  const { user } = useAuth()
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSubscriptions = useCallback(async () => {
    if (!user) {
      setSubscriptions([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setSubscriptions(data || [])
    setLoading(false)
  }, [user?.id])

  useEffect(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  async function addSubscription(sub) {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({ ...sub, user_id: user.id })
      .select()
      .single()
    if (error) throw error
    setSubscriptions(prev => [data, ...prev])
    return data
  }

  async function updateSubscription(id, updates) {
    const existing = subscriptions.find(s => s.id === id)
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setSubscriptions(prev => prev.map(s => s.id === id ? data : s))

    if (existing && user) {
      const TRACKED_FIELDS = ['name', 'amount', 'billing_cycle', 'category', 'status', 'next_renewal_date', 'notes', 'reminder_days', 'tags']
      const historyEntries = TRACKED_FIELDS
        .filter(field => field in updates && String(updates[field]) !== String(existing[field]))
        .map(field => ({
          user_id: user.id,
          subscription_id: id,
          field,
          old_value: existing[field] != null ? String(existing[field]) : null,
          new_value: updates[field] != null ? String(updates[field]) : null,
        }))
      if (historyEntries.length > 0) {
        supabase.from('subscription_history').insert(historyEntries).then(() => {})
      }
    }
    return data
  }

  async function deleteSubscription(id) {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id)
    if (error) throw error
    setSubscriptions(prev => prev.filter(s => s.id !== id))
  }

  async function snoozeSubscription(id, days = 7) {
    const until = new Date()
    until.setDate(until.getDate() + days)
    return updateSubscription(id, { snoozed_until: until.toISOString().split('T')[0] })
  }

  async function unsnoozeSubscription(id) {
    return updateSubscription(id, { snoozed_until: null })
  }

  // Derived stats
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active' || s.status === 'trial')
  const monthlyTotal = activeSubscriptions.reduce((sum, sub) => {
    if (sub.billing_cycle === 'monthly') return sum + Number(sub.amount)
    if (sub.billing_cycle === 'yearly') return sum + Number(sub.amount) / 12
    if (sub.billing_cycle === 'weekly') return sum + Number(sub.amount) * 4.33
    return sum
  }, 0)
  const yearlyTotal = monthlyTotal * 12
  const today = new Date().toISOString().split('T')[0]
  const upcomingRenewals = subscriptions
    .filter(s => s.status === 'active' || s.status === 'trial')
    .filter(s => {
      if (!s.next_renewal_date) return false
      if (s.snoozed_until && s.snoozed_until > today) return false
      const days = Math.ceil((new Date(s.next_renewal_date) - new Date()) / (1000 * 60 * 60 * 24))
      return days >= 0 && days <= 30
    })
    .sort((a, b) => new Date(a.next_renewal_date) - new Date(b.next_renewal_date))

  const snoozedSubscriptions = subscriptions.filter(s => s.snoozed_until && s.snoozed_until > today)
  const categoryBreakdown = activeSubscriptions.reduce((acc, sub) => {
    let cat = sub.category || 'Other'
    cat = cat.charAt(0).toUpperCase() + cat.slice(1)
    const monthly = sub.billing_cycle === 'monthly' ? Number(sub.amount)
      : sub.billing_cycle === 'yearly' ? Number(sub.amount) / 12
      : Number(sub.amount) * 4.33
    acc[cat] = (acc[cat] || 0) + monthly
    return acc
  }, {})

  return (
    <SubscriptionsContext.Provider value={{
      subscriptions, loading, error,
      activeSubscriptions, monthlyTotal, yearlyTotal,
      upcomingRenewals, snoozedSubscriptions, categoryBreakdown,
      addSubscription, updateSubscription, deleteSubscription,
      snoozeSubscription, unsnoozeSubscription,
      refetch: fetchSubscriptions
    }}>
      {children}
    </SubscriptionsContext.Provider>
  )
}

export const useSubscriptions = () => useContext(SubscriptionsContext)

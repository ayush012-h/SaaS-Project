import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const UserContext = createContext({})

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    }

    init()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    // Optional: Realtime subscription for profile changes if needed
    // But for now manual updateProfile is enough for instant sync
    
    return () => subscription.unsubscribe()
  }, [])

  async function updateProfile(updates) {
    // Optimistic update
    setProfile(prev => ({ ...prev, ...updates }))
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session.user.id)
      
      if (error) throw error
    } catch (err) {
      console.error('Failed to sync profile update:', err)
      // Revert on error if critical, but for now we trust the local state + retry
    }
  }

  const isPro = profile?.plan === 'pro'

  return (
    <UserContext.Provider value={{ profile, isPro, loading, updateProfile, fetchProfile }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}

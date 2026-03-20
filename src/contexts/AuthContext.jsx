/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null)
      return
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      setProfile(data)
      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      setProfile(null)
    }
  }, [])

  const handleAuthChange = useCallback(async (currentSession) => {
    try {
      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id)
        setSession(currentSession)
        setUser(currentSession.user)
      } else {
        setSession(null)
        setUser(null)
        setProfile(null)
      }
    } catch (err) {
      console.error('Auth sync error:', err)
    } finally {
      setLoading(false)
    }
  }, [fetchProfile])

  useEffect(() => {
    let mounted = true
    let initialCheckDone = false

    // Emergency timer
    const emergencyTimer = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth check timed out')
        setLoading(false)
      }
    }, 8000)

    // 1. Initial manual check
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!mounted) return
      if (initialSession) {
        initialCheckDone = true
        handleAuthChange(initialSession)
      } else {
        // Give listener a moment to fire if this is a redirect
        setTimeout(() => {
          if (mounted && !initialCheckDone) setLoading(false)
        }, 1500)
      }
    })

    // 2. Continuous listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return
      
      console.log('Auth event:', event)

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        initialCheckDone = true
        await handleAuthChange(currentSession)
      } else if (event === 'SIGNED_OUT') {
        initialCheckDone = true
        setSession(null)
        setUser(null)
        setProfile(null)
        setLoading(false)
      } else if (event === 'USER_UPDATED') {
        if (currentSession?.user) {
          setUser(currentSession.user)
          fetchProfile(currentSession.user.id).catch(() => {})
        }
      }
    })

    return () => {
      mounted = false
      clearTimeout(emergencyTimer)
      subscription?.unsubscribe()
    }
  }, [fetchProfile, handleAuthChange])

  async function signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: fullName,
      })
      // Manually trigger state update to avoid race condition with onAuthStateChange
      if (data.session) await handleAuthChange(data.session)
    }
    return data
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    // Manually trigger state update to avoid race condition with onAuthStateChange
    if (data.session) await handleAuthChange(data.session)
    return data
  }

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    })
    if (error) throw error
    return data
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setSession(null)
    setUser(null)
    setProfile(null)
  }

  async function updateProfile(updates) {
    if (!user) return
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    if (error) throw error
    setProfile(data)
    return data
  }

  const isPro = profile?.plan === 'pro'

  return (
    <AuthContext.Provider value={{
      session, user, profile, loading, isPro,
      signUp, signIn, signInWithGoogle, signOut, updateProfile, fetchProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

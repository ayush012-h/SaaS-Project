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

  useEffect(() => {
    let mounted = true
    let initialCheckDone = false

    // Robust loading timer - slightly longer for mobile
    const timer = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth fallback: Loading timed out')
        setLoading(false)
      }
    }, 6000)

    const initAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession()
        if (!mounted) return
        
        if (initialSession) {
          setSession(initialSession)
          setUser(initialSession.user)
          await fetchProfile(initialSession.user.id)
        }
      } catch (err) {
        console.error('Session init error:', err)
      } finally {
        if (mounted) {
          initialCheckDone = true
          setLoading(false)
        }
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return

      // Ignore redundant initial session if we already did it
      if (event === 'INITIAL_SESSION' && initialCheckDone) return

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || (event === 'INITIAL_SESSION' && currentSession)) {
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id)
        }
        setLoading(false)
      } else if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
        setProfile(null)
        setLoading(false)
      } else if (event === 'USER_UPDATED') {
        setUser(currentSession?.user ?? null)
        if (currentSession?.user) fetchProfile(currentSession.user.id)
      }
    })

    return () => {
      mounted = false
      clearTimeout(timer)
      subscription?.unsubscribe()
    }
  }, [fetchProfile])

  async function signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: fullName,
      })
    }
    return data
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
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

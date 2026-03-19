/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  console.log('AuthProvider: Initializing...')

  // Force loading to complete after 2 seconds max - reduced timeout
  useEffect(() => {
    console.log('AuthProvider: Setting up force timeout')
    const forceTimeout = setTimeout(() => {
      if (loading) {
        console.warn('AuthProvider: Forcing auth loading to complete - timeout reached')
        setLoading(false)
      }
    }, 2000) // Reduced from 5 seconds
    return () => clearTimeout(forceTimeout)
  }, [loading])

  // Immediate fallback for development
  useEffect(() => {
    const immediateTimeout = setTimeout(() => {
      if (loading) {
        console.warn('AuthProvider: Immediate fallback - setting loading to false')
        setLoading(false)
      }
    }, 1000) // 1 second immediate fallback
    return () => clearTimeout(immediateTimeout)
  }, [loading])

  async function fetchProfile(userId) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('AuthProvider: Setting up auth initialization')
    
    // Set a timeout to ensure loading doesn't hang
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading timeout - proceeding without session')
        setLoading(false)
      }
    }, 1500) // Reduced from 3 seconds

    // Try to get session, but don't let it hang
    try {
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        console.log('AuthProvider: Got session result:', { session: !!session, error })
        clearTimeout(timeoutId)
        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          return
        }
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchProfile(session.user.id)
        } else {
          setLoading(false)
        }
      }).catch(error => {
        clearTimeout(timeoutId)
        console.error('Error getting session:', error)
        setLoading(false)
      })
    } catch (error) {
      clearTimeout(timeoutId)
      console.error('Auth initialization error:', error)
      setLoading(false)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      clearTimeout(timeoutId)
      subscription?.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  }

  async function updateProfile(updates) {
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

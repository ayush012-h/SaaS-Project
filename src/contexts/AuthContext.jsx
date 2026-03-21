/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [session, setSession]   = useState(null)
  const [user, setUser]         = useState(null)
  const [profile, setProfile]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const mountedRef               = useRef(true)
  const profileCacheRef          = useRef(null) // cache to avoid re-fetching same profile

  // ── Fetch profile with timeout protection ─────────────
  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null)
      return null
    }

    // Return cached profile if same user — avoids re-fetch on TOKEN_REFRESHED
    if (profileCacheRef.current?.id === userId) {
      setProfile(profileCacheRef.current)
      return profileCacheRef.current
    }

    try {
      // Race between fetch and 5s timeout
      const result = await Promise.race([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Profile fetch timed out')), 5000)
        ),
      ])

      if (!mountedRef.current) return null

      if (result.error) throw result.error

      profileCacheRef.current = result.data
      setProfile(result.data)
      return result.data

    } catch (error) {
      console.error('Profile fetch error:', error.message)
      // Don't clear profile on timeout — keep showing last known profile
      // This prevents UI flicker on TOKEN_REFRESHED events
      return null
    }
  }, [])

  // ── Handle auth state change ───────────────────────────
  // KEY FIX: always calls setLoading(false) in finally block
  // Previous version could get stuck if fetchProfile threw
  const handleAuthChange = useCallback(async (currentSession) => {
    try {
      if (currentSession?.user) {
        setSession(currentSession)
        setUser(currentSession.user)
        await fetchProfile(currentSession.user.id)
      } else {
        setSession(null)
        setUser(null)
        setProfile(null)
        profileCacheRef.current = null
      }
    } catch (err) {
      console.error('Auth sync error:', err.message)
      // Even on error — never leave loading = true
    } finally {
      // ALWAYS set loading false — this was the bug
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [fetchProfile])

  // ── Main auth effect ───────────────────────────────────
  useEffect(() => {
    mountedRef.current = true

    // Hard timeout — absolute last resort
    // If nothing works in 6s just stop loading
    const hardTimeout = setTimeout(() => {
      if (mountedRef.current) {
        console.warn('Hard auth timeout hit — forcing loading=false')
        setLoading(false)
      }
    }, 6000)

    // 1. Get initial session immediately
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (!mountedRef.current) return
      if (error) {
        console.error('getSession error:', error.message)
        setLoading(false)
        return
      }
      handleAuthChange(initialSession)
    })

    // 2. Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mountedRef.current) return

        console.log('Auth event:', event)

        switch (event) {

          case 'INITIAL_SESSION':
            // Already handled by getSession above — skip to avoid double fetch
            break

          case 'SIGNED_IN':
            // Clear profile cache on new sign in
            profileCacheRef.current = null
            await handleAuthChange(currentSession)
            break

          case 'TOKEN_REFRESHED':
            // KEY FIX: Don't re-fetch profile on token refresh
            // Just update the session token — profile hasn't changed
            if (currentSession?.user && mountedRef.current) {
              setSession(currentSession)
              setUser(currentSession.user)
              setLoading(false) // immediately done — no profile fetch needed
            }
            break

          case 'SIGNED_OUT':
            profileCacheRef.current = null
            setSession(null)
            setUser(null)
            setProfile(null)
            setLoading(false)
            break

          case 'USER_UPDATED':
            if (currentSession?.user) {
              setUser(currentSession.user)
              // Clear cache so updated profile gets re-fetched
              profileCacheRef.current = null
              fetchProfile(currentSession.user.id).catch(console.error)
            }
            break

          default:
            // Unknown event — make sure we're not stuck loading
            setLoading(false)
            break
        }
      }
    )

    return () => {
      mountedRef.current = false
      clearTimeout(hardTimeout)
      subscription?.unsubscribe()
    }
  }, [fetchProfile, handleAuthChange])

  // ── Auth methods ───────────────────────────────────────

  async function signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        plan: 'free',
      })
      profileCacheRef.current = null // clear cache for new user
      if (data.session) await handleAuthChange(data.session)
    }
    return data
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    profileCacheRef.current = null // clear cache on sign in
    if (data.session) await handleAuthChange(data.session)
    return data
  }

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) throw error
    return data
  }

  async function signOut() {
    profileCacheRef.current = null
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
    profileCacheRef.current = data // update cache
    setProfile(data)
    return data
  }

  const isPro = profile?.plan === 'pro'

  return (
    <AuthContext.Provider value={{
      session, user, profile, loading, isPro,
      signUp, signIn, signInWithGoogle, signOut,
      updateProfile, fetchProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
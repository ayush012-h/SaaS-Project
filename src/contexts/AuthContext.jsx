/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [session, setSession]   = useState(null)
  const [user, setUser]         = useState(null)
  const [profile, setProfile]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const mountedRef               = useRef(true)
  const profileCacheRef          = useRef(null)

  const fetchProfile = useCallback(async (userId, force = false) => {
    if (!userId) { setProfile(null); return null }

    if (!force && profileCacheRef.current?.id === userId) {
      setProfile(profileCacheRef.current)
      return profileCacheRef.current
    }

    let attempts = 0
    let lastResult = null

    while (attempts < 3) {
      try {
        const result = await Promise.race([
          supabase.from('profiles').select('*').eq('id', userId).single(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Profile fetch timed out')), 5000)
          ),
        ])

        if (!mountedRef.current) return null
        
        if (!result.error && result.data) {
          profileCacheRef.current = result.data
          setProfile(result.data)
          return result.data
        }
        
        lastResult = result
      } catch (error) {
        console.warn(`Profile fetch attempt ${attempts + 1} failed:`, error.message)
      }

      attempts++
      if (attempts < 3) await new Promise(r => setTimeout(r, 500 * attempts))
    }

    // Fallback or error handled outside
    if (lastResult?.error) {
      console.error('Final profile fetch error:', lastResult.error.message)
    }
    return null
  }, [])

  const handleAuthChange = useCallback(async (currentSession) => {
    try {
      if (currentSession?.user) {
        setSession(currentSession)
        setUser(currentSession.user)
        try {
          await fetchProfile(currentSession.user.id)
        } catch (profileErr) {
          console.warn('Profile fetch failed, keeping session:', profileErr.message)
          // Non-intrusive toast so user knows something didn't sync
          toast.error('Failed to sync profile. Retrying…', { id: 'profile-err', duration: 3000 })
        }
      } else {
        setSession(null)
        setUser(null)
        setProfile(null)
        profileCacheRef.current = null
      }
    } catch (err) {
      console.error('Auth sync error:', err.message)
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [fetchProfile])

  useEffect(() => {
    mountedRef.current = true

    const hardTimeout = setTimeout(() => {
      if (mountedRef.current) {
        console.warn('Hard auth timeout — forcing loading=false')
        setLoading(false)
      }
    }, 20000)

    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (!mountedRef.current) return
      if (error) { console.error('getSession error:', error.message); setLoading(false); return }
      handleAuthChange(initialSession)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mountedRef.current) return
        console.log('Auth event:', event)

        switch (event) {
          case 'INITIAL_SESSION':
            break
          case 'SIGNED_IN':
            profileCacheRef.current = null
            await handleAuthChange(currentSession)
            // Force a fresh profile fetch just in case
            if (currentSession?.user) {
              fetchProfile(currentSession.user.id, true).catch(console.error)
            }
            break
          case 'TOKEN_REFRESHED':
            if (currentSession?.user && mountedRef.current) {
              setSession(currentSession)
              setUser(currentSession.user)
              // Optionally refresh profile on token update
              setLoading(false)
            }
            break
          case 'SIGNED_OUT':
            profileCacheRef.current = null
            setSession(null); setUser(null); setProfile(null); setLoading(false)
            break
          case 'USER_UPDATED':
            if (currentSession?.user) {
              setUser(currentSession.user)
              fetchProfile(currentSession.user.id, true).catch(console.error)
            }
            break
          default:
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

  async function signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    if (data.user) {
      // A Postgres trigger (handle_new_user) auto-creates the profile row.
      // This upsert is a client-side safety net for edge cases.
      supabase
        .from('profiles')
        .upsert({ id: data.user.id, email, full_name: fullName, plan: 'free' }, { onConflict: 'id', ignoreDuplicates: true })
        .then() // fire-and-forget — non-blocking
      profileCacheRef.current = null
      if (data.session) await handleAuthChange(data.session)
    }
    return data
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    profileCacheRef.current = null
    if (data.session) await handleAuthChange(data.session)
    return data
  }

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) throw error
    return data
  }

  async function signOut() {
    profileCacheRef.current = null
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setSession(null); setUser(null); setProfile(null)
  }

  async function updateProfile(updates) {
    if (!user) return
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', user.id).select().single()
    if (error) throw error
    profileCacheRef.current = data
    setProfile(data)
    return data
  }

  const isPro = profile?.plan === 'pro'

  return (
    <AuthContext.Provider value={{
      session, user, profile, loading, isPro,
      signUp, signIn, signInWithGoogle, signOut, updateProfile, fetchProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
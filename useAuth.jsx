import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, weddingAPI } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [wedding, setWedding] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadWedding(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadWedding(session.user.id)
      else { setWedding(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadWedding = async (userId) => {
    try {
      const w = await weddingAPI.getMyWedding(userId)
      setWedding(w)
    } catch (e) {
      setWedding(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshWedding = async () => {
    if (user) await loadWedding(user.id)
  }

  return (
    <AuthContext.Provider value={{ user, wedding, setWedding, loading, refreshWedding }}>
      {children}
    </AuthContext.Provider>
  )
}

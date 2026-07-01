import { useState, useCallback } from 'react'
import { getUser, getToken, setSession, clearSession, type AuthUser } from './auth'
import { login as apiLogin } from './api'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(getUser)

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin(email, password)
    setSession(res.token, res.user)
    setUser(res.user)
    return res.user
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  return {
    user,
    isAuthenticated: !!getToken(),
    isAdmin: user?.role === 'admin',
    login,
    logout,
  }
}

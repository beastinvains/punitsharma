/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { apiLogin } from '../api/client'

const AuthContext = createContext(null)

const TOKEN_KEY = 'portfolio_blog_token'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  })
  const [authLoading] = useState(false)

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }, [])

  const login = useCallback(async ({ email, password }) => {
    // apiLogin throws a helpful error message on failure.
    const { token: nextToken } = await apiLogin({ email, password })
    localStorage.setItem(TOKEN_KEY, nextToken)
    setToken(nextToken)
    return nextToken
  }, [])

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      authLoading,
      login,
      logout,
    }),
    [token, authLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}


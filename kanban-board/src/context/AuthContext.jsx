import { createContext, useCallback, useContext, useState } from 'react'

const MOCK_USER = {
  id: 'u1',
  name: 'Alex Rivera',
  email: 'alex@acme.com',
  avatar: null,
}

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  signup: () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = useCallback((email, password) => {
    const errors = {}
    if (!email) errors.email = 'Email is required'
    if (!password) errors.password = 'Password is required'
    if (Object.keys(errors).length > 0) return errors
    setUser(MOCK_USER)
    return null
  }, [])

  const signup = useCallback((name, email, password, confirmPassword) => {
    const errors = {}
    if (!name) errors.name = 'This field is required'
    if (!email) errors.email = 'This field is required'
    if (!password) errors.password = 'This field is required'
    if (!confirmPassword) errors.confirmPassword = 'This field is required'
    if (password && password.length < 8) errors.password = 'Password must be at least 8 characters'
    if (password && confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    if (Object.keys(errors).length > 0) return errors
    setUser({ id: crypto.randomUUID(), name, email, avatar: null })
    return null
  }, [])

  const logout = useCallback(() => setUser(null), [])

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const isString = (value) => typeof value === 'string'
const isNonEmptyString = (value) => isString(value) && value.trim().length > 0
const isValidEmail = (value) => isNonEmptyString(value) && emailPattern.test(value.trim())

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = useCallback((email, password) => {
    const errors = {}

    if (!isNonEmptyString(email)) {
      errors.email = 'Email is required'
    } else if (!isValidEmail(email)) {
      errors.email = 'Enter a valid email address'
    }

    if (!isNonEmptyString(password)) {
      errors.password = 'Password is required'
    }

    if (Object.keys(errors).length > 0) return errors

    setUser(MOCK_USER)
    return null
  }, [])

  const signup = useCallback((name, email, password, confirmPassword) => {
    const errors = {}

    if (!isNonEmptyString(name)) {
      errors.name = 'This field is required'
    }

    if (!isNonEmptyString(email)) {
      errors.email = 'This field is required'
    } else if (!isValidEmail(email)) {
      errors.email = 'Enter a valid email address'
    }

    if (!isString(password)) {
      errors.password = 'Password must be a valid string'
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }

    if (!isString(confirmPassword)) {
      errors.confirmPassword = 'Confirm password is required'
    }

    if (isString(password) && isString(confirmPassword) && password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(errors).length > 0) return errors

    setUser({ id: crypto.randomUUID(), name: name.trim(), email: email.trim(), avatar: null })
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

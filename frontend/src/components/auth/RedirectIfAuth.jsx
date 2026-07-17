import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RedirectIfAuth({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/" replace /> : children
}

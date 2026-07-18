import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function RedirectIfAuth({ children }) {
  const { user, loading } = useSelector((state) => state.auth)
  if (loading) return <div>Loading...</div>
  return user ? <Navigate to="/" replace /> : children
}

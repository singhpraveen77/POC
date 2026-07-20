import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import MainLoader from '../loader/MainLoader.jsx'

export default function RedirectIfAuth({ children }) {
  const { user, loading } = useSelector((state) => state.auth)
  if (loading) return (
    <MainLoader />
  )
  return user ? <Navigate to="/" replace /> : children
}

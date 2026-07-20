import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { TailSpin } from 'react-loader-spinner'
import MainLoader from '../loader/MainLoader.jsx'
// import MainLoader from '../loader/mainLoader'
// import mainLoader from '../loader/mainLoader'

export default function ProtectedRoute() {
  const { user, loading } = useSelector((state) => state.auth)
  if (loading) return (
    <MainLoader />
  )
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

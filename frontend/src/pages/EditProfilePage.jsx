import { useDispatch, useSelector } from 'react-redux'
import MainLoader from '../components/loader/MainLoader.jsx'
import EditProfileForm from '../components/profile/EditProfileForm.jsx'
import { useEffect } from 'react'
import { getProfile } from '../redux/profile/profileThunk.js'
export default function EditProfilePage() {
  const dispatch = useDispatch()
  const { profile, loading, error } = useSelector(state => state.profile)
  useEffect(() => {
    dispatch(getProfile()).unwrap().catch(console.error)
  }, [dispatch])
  if (loading && !profile) return <MainLoader message="Loading Profile..." />
  if (error) return (
    <div className="p-8 text-center font-semibold text-[var(--color-error)]">{error}</div>
  )
  if (!profile) return (
    <div className="p-8 text-center font-semibold text-[var(--color-text-muted)]">Profile not found.</div>
  )
  return (
    <div className="flex-1 p-6 overflow-y-auto scrollbar-thin bg-[var(--color-bg)]">
      <div className="max-w-[700px] mx-auto">
        <EditProfileForm user={profile.user} />
      </div>
    </div>
  )
}
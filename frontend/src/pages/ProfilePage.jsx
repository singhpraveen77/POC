import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile } from '../redux/profile/profileThunk.js'
import { fetchIncomingInvites } from '../redux/invite/workspaceInviteSlice.js'
import MainLoader from '../components/loader/MainLoader.jsx'
import ProfileHeader from '../components/profile/ProfileHeader.jsx'
import ProfileStats from '../components/profile/ProfileStats.jsx'
import RecentWorkspaces from '../components/profile/RecentWorkspaces.jsx'
import RecentBoards from '../components/profile/RecentBoards.jsx'
import RecentTasks from '../components/profile/RecentTasks.jsx'
import InvitationsPanel from '../components/profile/InvitationsPanel.jsx'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const { profile, loading, error } = useSelector(state => state.profile)

  useEffect(() => { dispatch(getProfile()).unwrap().catch(console.error) }, [dispatch])
  useEffect(() => { dispatch(fetchIncomingInvites()) }, [dispatch])

  if (loading) return <MainLoader message="Loading Profile…" />
  if (error) return <div className="p-6 text-[var(--color-error)]">{error}</div>
  if (!profile) return <div className="p-6 text-[var(--color-text-muted)]">No profile found.</div>

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-6 bg-[var(--color-bg)]">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-6">
        <ProfileHeader user={profile.user} />
        {/* <ProfileStats stats={profile.stats} /> */}

        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          <RecentWorkspaces workspaces={profile.recentWorkspaces} />
          <RecentBoards boards={profile.recentBoards} />
        </div>

        {/* <RecentTasks tasks={profile.recentTasks} /> */}
        <InvitationsPanel />
      </div>
    </div>
  )
}
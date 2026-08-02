import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button.jsx'
import ProfileAvatar from './ProfileAvatar.jsx'

export default function ProfileHeader({ user }) {
  const navigate = useNavigate()
  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 bg-[var(--color-surface-low)] border border-[var(--color-border)]">
      <div className="flex items-center gap-5 w-full sm:w-auto">
        <div className="rounded-full overflow-hidden shrink-0 border-[3px] border-[var(--color-profile)]">
          <ProfileAvatar size={72} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="m-0 text-[22px] font-bold text-[var(--color-text)]">{user.name}</h2>
          <p className="my-1 text-sm m-0 text-[var(--color-text-muted)]">@{user.username}</p>
          <p className="my-1 text-sm m-0 text-[var(--color-text-muted)]">{user.email}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className={`flex items-center gap-1 text-[12.5px] font-semibold ${user.isVerified ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
              
              {user.isVerified ? 'Verified' : 'Not Verified'}
            </span>
            <span className="text-[12px] ">Joined {joinedDate}</span>
          </div>
        </div>
      </div>
      <Button variant="solid" size="sm" onClick={() => navigate('/editProfilePage')} className="sm:mt-0 mt-2 sm:ml-auto sm:flex items-center gap-2">
        
        {/* Mobile: icon only */}
   <span className="material-symbols-outlined sm:hidden! ">
    edit
  </span>

  <span className="hidden sm:inline">
    Edit Profile
  </span>
      </Button>
    </div>
  )
}
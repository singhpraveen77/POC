import { useSelector } from 'react-redux'
import { useState } from 'react'
import ProfileAvatar from '../profile/ProfileAvatar.jsx'
import ProfileCard from '../profile/ProfileCard.jsx'

export default function Navbar({ onMenuToggle }) {
  const { user } = useSelector(state => state.auth)
  const [showProfile, setShowProfile] = useState(false)

  return (
    <header className="flex items-center justify-between px-6 shrink-0 sticky top-0 z-30"
            style={{ height: 56, backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>

      {}
      <div className="flex items-center gap-3">
        <button className="mobile-only p-1.5 rounded text-[var(--color-text-muted)] hover:bg-[var(--color-hover)] transition-colors border-none bg-transparent cursor-pointer"
                onClick={onMenuToggle} aria-label="Open menu">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>menu</span>
        </button>
        <span className="mobile-only text-[18px] font-bold text-[var(--color-btn)]">Kanban</span>
      </div>

      {}
      <div className="relative flex items-center"
           onMouseEnter={() => setShowProfile(true)}
           onMouseLeave={() => setShowProfile(false)}>
        <div className="flex items-center gap-2.5 cursor-pointer px-2 py-1.5 rounded-lg transition-colors hover:bg-[var(--color-hover)]">
          {}
          <div className="rounded-full overflow-hidden shrink-0"
               style={{ width: 32, height: 32, border: '2px solid var(--color-profile)' }}>
            <ProfileAvatar size={32} />
          </div>
          <span className="text-[13.5px] font-medium text-[var(--color-text)] desktop-only">{user?.name}</span>
          <span className="material-symbols-outlined text-[var(--color-text-subtle)] desktop-only" style={{ fontSize: 16 }}>expand_more</span>
        </div>

        {showProfile && <ProfileCard />}
      </div>
    </header>
  )
}
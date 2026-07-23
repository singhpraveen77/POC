import { useSelector } from 'react-redux'
import ProfileCard from '../profile/profileCard';
import { useState } from 'react';

export default function Navbar({ onMenuToggle }) {
  const { user } = useSelector(state => state.auth)
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 64,
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 30,
        backgroundColor: 'var(--color-background)',
        borderBottom: '1px solid var(--color-outline-variant)',
      }}
    >
      {/* Left: hamburger + logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          className="icon-btn mobile-only"
          onClick={onMenuToggle}
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span
          className="mobile-only"
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: 'var(--color-primary)',
            lineHeight: 1,
          }}
        >
          Kanban Project
        </span>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
        onMouseEnter={() => setShowProfile(true)}
        onMouseLeave={() => setShowProfile(false)}
      >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 4,
          backgroundColor: "lightgrey",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
        }}
      >
        {user?.name?.charAt(0).toUpperCase()}
      </div>

      <span
        style={{
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        {user?.name}
      </span>
    </div>

    {showProfile && (
      <ProfileCard/>
    )}
      </div>
    </div>
    </header>
  )
}

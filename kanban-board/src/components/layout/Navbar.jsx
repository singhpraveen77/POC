import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import Avatar from '../common/Avatar'

export default function Navbar({ onMenuToggle }) {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [search, setSearch] = useState('')

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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Search */}
        <div
          className="desktop-search"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            height: 36,
            padding: '0 12px',
            borderRadius: 20,
            backgroundColor: 'var(--color-surface-container-low)',
            border: '1px solid transparent',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-outline)', flexShrink: 0 }}>
            search
          </span>
          <input
            type="text"
            placeholder="Search tasks…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              width: 176,
              fontSize: 14,
              color: 'var(--color-on-surface)',
              fontFamily: 'inherit',
            }}
          />
        </div>


        {/* Theme toggle */}
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          <span className="material-symbols-outlined">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Avatar */}
        <Avatar src={user?.avatar} name={user?.name ?? ''} size="md" />
      </div>
    </header>
  )
}

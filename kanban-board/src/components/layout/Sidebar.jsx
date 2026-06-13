import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'

const NAV_LINKS = [
  { label: 'Dashboard',  icon: 'dashboard',   path: '/' },
  { label: 'Boards',     icon: 'view_kanban',  path: '/boards' },
  { label: 'Settings',   icon: 'settings',     path: '/settings' },
]

export default function Sidebar({ isOpen, onClose, onCreateTask }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const inner = (
    <nav style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: 260,
      padding: '16px 8px',
      backgroundColor: 'var(--color-surface)',
      borderRight: '1px solid var(--color-outline-variant)',
      flexShrink: 0,
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px', marginBottom: 24 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          backgroundColor: 'var(--color-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#fff' }}>view_kanban</span>
        </div>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-on-surface)', lineHeight: 1, margin: 0 }}>
            Kanban Project
          </p>
          <p style={{ fontSize: 12, color: 'var(--color-on-surface-variant)', margin: '3px 0 0' }}>
            Product Team
          </p>
        </div>
      </div>

      {/* Nav links */}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_LINKS.map(link => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              end={link.path === '/'}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 8px',
                borderRadius: 8,
                borderLeft: isActive ? '4px solid var(--color-primary)' : '4px solid transparent',
                borderTopLeftRadius: isActive ? 0 : 8,
                borderBottomLeftRadius: isActive ? 0 : 8,
                backgroundColor: isActive ? 'var(--color-surface-container-high)' : 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                textDecoration: 'none',
                transition: 'background-color 0.15s',
              })}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{link.icon}</span>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Create Task button */}
      <div className="py-2 mt-2">
        <button
          type="button"
          className="btn btn-solid w-full flex justify-center py-2.5"
          onClick={() => { onCreateTask(); onClose() }}
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create Task
        </button>
      </div>

      {/* Footer */}
      <ul className="list-none m-0 p-0 border-t border-[var(--color-outline-variant)] pt-3 flex flex-col gap-0.5">
       
        <li>
          <button type="button" className="nav-btn w-full text-red-500 hover:bg-red-500/10" onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span>
            Logout Account
          </button>
        </li>
      </ul>
    </nav>
  )

  return (
    <>
      {/* Desktop — always shown */}
      <div className="hidden md:block" style={{ height: '100%', flexShrink: 0 }}>
        {inner}
      </div>

      {/* Mobile — overlay drawer */}
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={onClose}
          />
          <div style={{ position: 'relative', zIndex: 10, height: '100%' }}>
            {inner}
          </div>
        </div>
      )}
    </>
  )
}

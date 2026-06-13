import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

export default function Settings() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const [activeTab, setActiveTab] = useState('profile')
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [emailError, setEmailError] = useState('')
  const [saveStatus, setSaveStatus] = useState('')

  function handleSave() {
    if (!email.includes('@')) {
      setEmailError('Enter a valid email address')
      setSaveStatus('error')
      return
    }
    setEmailError('')
    setSaveStatus('success')
  }

  function handleTabChange(tab) {
    setActiveTab(tab)
    setSaveStatus('')
    setEmailError('')
  }

  return (
    <div className="page-scroll" style={{ padding: 24 }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <h1 className="text-headline-md" style={{ color: 'var(--color-on-surface)', marginBottom: 24 }}>
          Settings
        </h1>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-outline-variant)', marginBottom: 24 }}>
          {['profile', 'appearance'].map(tab => (
            <button
              key={tab}
              type="button"
              className={`tab-btn${activeTab === tab ? ' active' : ''}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {activeTab === 'profile' && (
          <div style={{
            padding: 24, borderRadius: 12,
            backgroundColor: 'var(--color-surface-container-lowest)',
            border: '1px solid var(--color-outline-variant)',
            display: 'flex', flexDirection: 'column', gap: 20,
          }}>
            <h2 className="text-headline-sm" style={{ color: 'var(--color-on-surface)', margin: 0 }}>
              Profile Information
            </h2>

            <Input
              id="settings-name"
              label="Full Name"
              icon="person"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
            />

            <Input
              id="settings-email"
              label="Email"
              type="email"
              icon="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setEmailError(''); setSaveStatus('') }}
              error={emailError}
              placeholder="you@example.com"
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Button variant="solid" onClick={handleSave}>Save Changes</Button>
              {saveStatus === 'success' && (
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-surface-tint)', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
                  Changes saved
                </p>
              )}
            </div>
          </div>
        )}

        {/* Appearance tab */}
        {activeTab === 'appearance' && (
          <div style={{
            padding: 24, borderRadius: 12,
            backgroundColor: 'var(--color-surface-container-lowest)',
            border: '1px solid var(--color-outline-variant)',
            display: 'flex', flexDirection: 'column', gap: 20,
          }}>
            <h2 className="text-headline-sm" style={{ color: 'var(--color-on-surface)', margin: 0 }}>
              Appearance
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-on-surface)', margin: '0 0 2px' }}>Dark Mode</p>
                <p style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', margin: 0 }}>
                  Switch between light and dark themes
                </p>
              </div>
              {/* Toggle switch — uses inline styles, not .btn, since it's custom shaped */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-pressed={theme === 'dark'}
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  backgroundColor: theme === 'dark' ? 'var(--color-primary)' : 'var(--color-outline-variant)',
                  flexShrink: 0,
                  padding: 0,
                  WebkitAppearance: 'none',
                  appearance: 'none',
                }}
              >
                <span style={{
                  position: 'absolute',
                  width: 16, height: 16,
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s',
                  transform: theme === 'dark' ? 'translateX(24px)' : 'translateX(4px)',
                }} />
              </button>
            </div>

            <p style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', margin: 0 }}>
              Current theme:{' '}
              <span style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>
                {theme === 'dark' ? 'Dark' : 'Light'}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

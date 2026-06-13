import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

function AuthInput({ id, label, icon, type = 'text', placeholder, value, onChange, error, autoFocus }) {
  return (
    <div className="flex flex-col gap-1.5 w-full overflow-y-hidden">
      {label && (
        <label htmlFor={id} className="text-[13px] font-semibold text-[var(--color-on-surface-variant)] ml-1">
          {label}
        </label>
      )}
      <div
        className="flex items-center gap-2.5 h-12 px-4 rounded-xl border-2 transition-all duration-200 focus-within:border-[var(--color-primary)] focus-within:ring-4 focus-within:ring-[var(--color-primary)]/10"
        style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          borderColor: error ? 'var(--color-error)' : 'var(--color-outline-variant)',
        }}
      >
        {icon && (
          <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--color-outline)' }}>
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoFocus={autoFocus}
          className="flex-1 bg-transparent border-none outline-none text-[15px] text-[var(--color-on-surface)] placeholder-[var(--color-outline)]/60"
        />
      </div>
      {error && (
        <p className="text-[12px] font-medium text-[var(--color-error)] ml-1">
          {error}
        </p>
      )}
    </div>
  )
}

export default function LoginPage() {
  const { login } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  function handleSubmit(e) {
    e.preventDefault()
    const result = login(email, password)
    if (result) {
      setErrors(result)
    } else {
      navigate('/', { replace: true })
    }
  }

  return (
    <div className="flex h-[100dvh] w-full bg-[var(--color-background)] overflow-hidden">
      {/* Left branded panel - Fixed 50% width */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center px-16 gap-8 bg-[var(--color-primary)] relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-white blur-[100px]"></div>
        </div>

        <div className="text-center z-10">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="material-symbols-outlined text-white text-[48px]">
              view_kanban
            </span>
          </div>
          <h1 className="text-[42px] font-bold text-white tracking-tight leading-tight mb-4">
            Kanban Project
          </h1>



          <p className="text-lg text-white/80  mx-auto">
            Your team's productivity hub. Organize work, ship faster, and stay in flow.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-[280px] z-10">
          {[
            { icon: 'view_kanban', text: 'Drag-and-drop boards' },
            { icon: 'group', text: 'Real-time collaboration' },
            { icon: 'timer', text: 'Smart task tracking' }
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10">
              <span className="material-symbols-outlined text-white/90 text-[22px]">
                {f.icon}
              </span>
              <span className="text-white/90 font-medium text-[14px]">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-col flex-1 relative bg-[var(--color-surface-container-lowest)]">
        <div className="absolute top-6 right-6 z-20">
          <button
            type="button"
            className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--color-outline-variant)] bg-[var(--color-surface)] text-[var(--color-on-surface-variant)] transition-all hover:bg-[var(--color-surface-container)]"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined text-[20px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 py-12 max-w-[440px] mx-auto w-full">
          <div className="mb-8 text-center lg:text-left">
            <div className="lg:hidden w-14 h-14 bg-[var(--color-primary)] rounded-xl flex items-center justify-center mx-auto mb-5 shadow-lg">
              <span className="material-symbols-outlined text-white text-[28px]">view_kanban</span>
            </div>
            <h2 className="text-[28px] font-bold text-[var(--color-on-surface)]">
              Welcome back
            </h2>
            <p className="text-[15px] text-[var(--color-on-surface-variant)] mt-2">
              Please enter your details to sign in
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <AuthInput
              id="email"
              label="Email Address"
              type="email"
              icon="alternate_email"
              placeholder="name@example.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })) }}
              error={errors.email}
              autoFocus
            />

            <div className="flex flex-col gap-1">
              <AuthInput
                id="password"
                label="Password"
                type="password"
                icon="lock"
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })) }}
                error={errors.password}
              />
              <div className="flex justify-end mt-0.5">
                <a href="#" className="text-[13px] font-semibold text-[var(--color-primary)] hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow-lg shadow-[var(--color-primary)]/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
              <span className="material-symbols-outlined text-[18px]">login</span>
            </button>
          </form>

          <p className="mt-6 text-center text-[14px] text-[var(--color-on-surface-variant)]">
            New to Kanban Project?<Link to="/signup" className="font-bold text-[var(--color-primary)] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

// Localized Input component to avoid issues with common components
function AuthInput({ id, label, icon, type = 'text', placeholder, value, onChange, error, autoFocus }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
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

export default function SignupPage() {
  const { signup } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const [fields, setFields] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})

  function update(key) {
    return (e) => {
      setFields(prev => ({ ...prev, [key]: e.target.value }))
      setErrors(prev => ({ ...prev, [key]: '' }))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const result = signup(fields.name, fields.email, fields.password, fields.confirmPassword)
    if (result) {
      setErrors(result)
    } else {
      navigate('/', { replace: true })
    }
  }

  return (
    <div className="flex min-h-screen w-full  overflow-hidden">
      {/* Left branded panel - Hidden on smaller screens */}
      <div className="hidden lg:flex flex-col items-center justify-center flex-1 px-16 gap-10 bg-[var(--color-primary)] relative">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-white blur-[100px]"></div>
        </div>

        <div className="text-center z-10">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <span className="material-symbols-outlined text-white text-[48px]">
              view_kanban
            </span>
          </div>
          <h1 className="text-[42px] font-bold text-white tracking-tight leading-tight mb-4">
            Kanban Project
          </h1>
          <p className="text-lg text-white/80  mx-auto">
            Design your workflow, collaborate with teams, and achieve more together.
          </p>
        </div>

        <div className="flex flex-col gap-5  z-10">
          {[
            { icon: 'bolt', text: 'Lightning fast management' },
            { icon: 'layers', text: 'Intuitive drag-and-drop' },
            { icon: 'monitoring', text: 'Real-time project tracking' }
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <span className="material-symbols-outlined text-white/90 text-[24px]">
                {f.icon}
              </span>
              <span className="text-white/90 font-medium text-[15px]">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-col flex-1 relative bg-[var(--color-surface-container-lowest)] overflow-y-auto">
        {/* Theme toggle */}
        <div className="absolute top-6 right-6">
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

        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 py-16 max-w-[480px] mx-auto w-full">
          <div className="mb-10 text-center lg:text-left">
            <div className="lg:hidden w-14 h-14 bg-[var(--color-primary)] rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[var(--color-primary)]/20">
              <span className="material-symbols-outlined text-white text-[32px]">view_kanban</span>
            </div>
            <h2 className="text-[32px] font-bold text-[var(--color-on-surface)] tracking-tight">
              Get Started
            </h2>
            <p className="text-[15px] text-[var(--color-on-surface-variant)] mt-2">
              Create your account and jump into the workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <div className="grid grid-cols-1 gap-5">
              <AuthInput
                id="name"
                label="Full Name"
                icon="person"
                placeholder="Enter your name"
                value={fields.name}
                onChange={update('name')}
                error={errors.name}
                autoFocus
              />
              <AuthInput
                id="email"
                label="Email Address"
                type="email"
                icon="alternate_email"
                placeholder="name@example.com"
                value={fields.email}
                onChange={update('email')}
                error={errors.email}
              />
              <AuthInput
                id="password"
                label="Password"
                type="password"
                icon="lock"
                placeholder="Choose a strong password"
                value={fields.password}
                onChange={update('password')}
                error={errors.password}
              />
              <AuthInput
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                icon="verified_user"
                placeholder="Repeat your password"
                value={fields.confirmPassword}
                onChange={update('confirmPassword')}
                error={errors.confirmPassword}
              />
            </div>

            <button
              type="submit"
              className="mt-4 w-full h-12 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow-lg shadow-[var(--color-primary)]/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Create Account</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </form>

          <p className="mt-8 text-center text-[14px] text-[var(--color-on-surface-variant)]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-[var(--color-primary)] hover:underline transition-all"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}


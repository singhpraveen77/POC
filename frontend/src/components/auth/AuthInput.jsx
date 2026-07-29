import { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
export default function AuthInput({ id, label, type = 'text', placeholder, value, onChange, error, autoFocus }) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={id} className="text-[13.5px] font-semibold text-[var(--color-text)]">{label}</label>
      )}
      <div className="relative w-full">
        <input
          id={id}
          type={isPassword && showPassword ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoFocus={autoFocus}
          className={`w-full h-10 text-[14px] outline-none bg-[var(--color-surface-low)] text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] border transition-colors ${error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)] focus:border-[var(--color-border-focus)]'} ${isPassword ? 'pr-10 pl-3' : 'px-3'}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer flex items-center text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
          >
            {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
          </button>
        )}
      </div>
      {error && <p className="text-[12px] text-[var(--color-error)] m-0">{error}</p>}
    </div>
  )
}
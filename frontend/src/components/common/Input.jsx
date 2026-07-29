export default function Input({ id, label, icon, type = 'text', placeholder, value, onChange, onBlur, error, disabled = false, className = '', autoFocus = false, ...rest }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-[var(--color-text-muted)]">{label}</label>
      )}
      <div className={`flex items-center gap-2 h-10 px-3 rounded-lg border transition-colors duration-150 bg-[var(--color-surface-low)] ${error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)] focus-within:border-[var(--color-border-focus)]'}`}>
        {icon && <span className="material-symbols-outlined shrink-0 text-[18px] text-[var(--color-text-subtle)]">{icon}</span>}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          autoFocus={autoFocus}
          className="flex-1 bg-transparent outline-none text-[14px] text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] disabled:opacity-50"
          {...rest}
        />
      </div>
      {error && <p role="alert" className="text-[12px] font-medium text-[var(--color-error)] m-0">{error}</p>}
    </div>
  )
}
export default function Input({
  id,
  label,
  icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  className = '',
  autoFocus = false,
  ...rest
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-[13px] font-medium"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          {label}
        </label>
      )}
      <div
        className="flex items-center gap-2 h-10 px-3 rounded-lg border transition-colors duration-150"
        style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          borderColor: error ? 'var(--color-error)' : 'var(--color-outline-variant)',
        }}
      >
        {icon && (
          <span
            className="material-symbols-outlined flex-shrink-0"
            style={{ fontSize: 18, color: 'var(--color-outline)' }}
          >
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          autoFocus={autoFocus}
          className="flex-1 bg-transparent outline-none text-[14px] placeholder-[var(--color-outline)] disabled:opacity-50"
          style={{
            color: 'var(--color-on-surface)',
            caretColor: 'var(--color-primary)',
          }}
          {...rest}
        />
      </div>
      {error && (
        <p
          role="alert"
          className="text-[12px] font-medium"
          style={{ color: 'var(--color-error)' }}
        >
          {error}
        </p>
      )}
    </div>
  )
}

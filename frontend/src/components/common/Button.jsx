import { TailSpin } from 'react-loader-spinner'

export default function Button({
  variant = 'solid',
  size = 'md',
  icon,
  iconAfter,
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
  children,
  ...rest
}) {
  const classes = ['btn', `btn-${variant}`, `btn-${size}`, className]
    .filter(Boolean)
    .join(' ')

  const spinnerColor = variant === 'solid' || variant === 'danger' ? '#ffffff' : 'var(--color-primary)'

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={classes}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "0 0.5rem",
        cursor: disabled || loading ? "not-allowed" : "pointer",
      }}      {...rest}
          >
      {loading ? (
        <TailSpin height="16" width="16" color={spinnerColor} ariaLabel="loading" />
      ) : (
        icon && (
          <span className="material-symbols-outlined" style={{ fontSize: size === 'sm' ? 16 : 20 }}>
            {icon}
          </span>
        )
      )}
      <span>{children}</span>
      {!loading && iconAfter && (
        <span className="material-symbols-outlined" style={{ fontSize: size === 'sm' ? 16 : 20 }}>
          {iconAfter}
        </span>
      )}
    </button>
  )
}

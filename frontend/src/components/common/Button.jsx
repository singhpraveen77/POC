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
  const base = ['btn', `btn-${size}`, className].filter(Boolean).join(' ')
  const iconSize = size === 'sm' ? 'text-[16px]' : 'text-[20px]'
  const spinColor = variant === 'solid' || variant === 'danger' ? '#ffffff' : '#669DF1'

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} inline-flex !border !border-amber-50 items-center gap-2`}
      {...rest}
    >
      {loading ? (
        <TailSpin height="16" width="16" color={spinColor} ariaLabel="loading" />
      ) : (
        icon && <span className={`material-symbols-outlined ${iconSize}`}>{icon}</span>
      )}
      <span>{children}</span>
      {!loading && iconAfter && (
        <span className={`material-symbols-outlined ${iconSize}`}>{iconAfter}</span>
      )}
    </button>
  )
}
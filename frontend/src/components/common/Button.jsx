export default function Button({
  variant = 'solid',
  size = 'md',
  icon,
  iconAfter,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  children,
  ...rest
}) {
  const classes = ['btn', `btn-${variant}`, `btn-${size}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
      {...rest}
    >
      {icon && (
        <span className="material-symbols-outlined">
          {icon}
        </span>
      )}
      {children}
      {iconAfter && (
        <span className="material-symbols-outlined">
          {iconAfter}
        </span>
      )}
    </button>
  )
}

const VARIANT = {
  urgent:  { backgroundColor: 'var(--color-error-container)',     color: 'var(--color-on-error-container)' },
  high:    { backgroundColor: 'var(--color-tertiary-container)',  color: 'var(--color-on-tertiary-container)' },
  medium:  { backgroundColor: 'var(--color-secondary-fixed)',     color: 'var(--color-on-secondary-fixed-variant)' },
  low:     { backgroundColor: 'var(--color-surface-container)',   color: 'var(--color-on-surface-variant)' },
  default: { backgroundColor: 'var(--color-surface-container)',   color: 'var(--color-on-surface-variant)' },
}

export default function Badge({ label, variant = 'default', removable = false, onRemove }) {
  const s = VARIANT[variant] ?? VARIANT.default
  return (
    <span style={{
      ...s,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.04em',
      lineHeight: 1.4,
      whiteSpace: 'nowrap',
    }}>
      {label}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 0, lineHeight: 1, fontSize: 13, color: 'inherit',
            opacity: 0.7, marginLeft: 2,
          }}
        >×</button>
      )}
    </span>
  )
}

const PALETTE = [
  '#0058be', '#712ae2', '#924700', '#ba1a1a',
  '#006874', '#1d6a00',
]

function getBgColor(name) {
  let sum = 0
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i)
  return PALETTE[sum % PALETTE.length]
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?'
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const sizeMap = {
  sm: 24,
  md: 32,
  lg: 40,
}

export default function Avatar({ src, name = '', size = 'md', className = '' }) {
  const px = sizeMap[size] ?? sizeMap.md
  const initials = getInitials(name)
  const bg = getBgColor(name)

  const style = {
    width: px,
    height: px,
    borderRadius: '50%',
    flexShrink: 0,
    overflow: 'hidden',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: px * 0.38,
    fontWeight: 600,
    color: '#fff',
    backgroundColor: src ? 'transparent' : bg,
    border: '2px solid var(--color-surface-container-lowest)',
  }

  return (
    <div style={style} className={className} title={name}>
      {src ? (
        <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}

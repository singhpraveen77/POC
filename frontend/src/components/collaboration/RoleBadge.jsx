export default function RoleBadge({ role }) {
  const ROLE_STYLES = {
    OWNER:  { text: 'var(--color-btn-text)' },
    ADMIN:  { text: '#FFFFFF' },
    MEMBER: { text: '#FFFFFF' },
    VIEWER: {  text: '#FFFFFF' },
  }
  const style = ROLE_STYLES[role] ?? ROLE_STYLES.VIEWER
  return (
    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full
      ${role === 'OWNER' ? ' text-green-300' : ''}
      ${role === 'ADMIN' ? ' text-white' : ''}
      ${role === 'MEMBER' ? ' text-white' : ''}
      ${role === 'VIEWER' ? ' text-white' : ''}`}
    >
      {role}
    </span>
  )
}
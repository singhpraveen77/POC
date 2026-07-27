const ROLE_STYLES = {
  OWNER: ' text-orange-700',
  ADMIN: 'text-blue-700',
  MEMBER: ' text-green-700',
  VIEWER: 'text-gray-600',
}

export default function RoleBadge({ role }) {
  const colorClasses = ROLE_STYLES[role] ?? ROLE_STYLES.VIEWER
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colorClasses}`}>
      {role}
    </span>
  )
}

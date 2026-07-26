const ROLE_STYLES = {
  OWNER: 'bg-orange-100 text-orange-700',
  ADMIN: 'bg-blue-100 text-blue-700',
  MEMBER: 'bg-green-100 text-green-700',
  VIEWER: 'bg-gray-100 text-gray-600',
}

export default function RoleBadge({ role }) {
  const colorClasses = ROLE_STYLES[role] ?? ROLE_STYLES.VIEWER
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colorClasses}`}>
      {role}
    </span>
  )
}

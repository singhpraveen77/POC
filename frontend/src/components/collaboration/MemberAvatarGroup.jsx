export default function MemberAvatarGroup({ members, max = 5 }) {
  const visible = members.slice(0, max)
  const overflow = members.length - max

  return (
    <div className="flex items-center">
      {visible.map((member, index) => {
        const user = member.user ?? {}

        return (
          <div
            key={member.id ?? index}
            title={user.name ?? ''}
            className={[
              "w-6 h-6 rounded-full inline-flex items-center justify-center text-[10px] font-semibold flex-shrink-0 border-2 border-[var(--color-surface,#fff)]",
              index === 0 ? "ml-0" : "-ml-2"
            ].join(" ")}
          >
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name ?? ''}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : user.name ? (
              <div className="w-6 h-6 rounded-full border-0 bg-orange-200 text-orange-800 flex items-center justify-center text-[10px] font-semibold">
                {user.name[0].toUpperCase()}
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border-0 bg-gray-200" />
            )}
          </div>
        )
      })}

      {overflow > 0 && (
        <div className="-ml-2 w-6 h-6 rounded-full inline-flex items-center justify-center text-[10px] font-semibold border-2 border-[var(--color-surface,#fff)] bg-gray-200 text-gray-600">
          +{overflow}
        </div>
      )}
    </div>
  )
}

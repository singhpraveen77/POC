import RoleBadge from './RoleBadge'
export default function MemberCard({ member, currentUserRole, onChangeRole, onRemove }) {
  const canManage =
    (currentUserRole === 'OWNER' || currentUserRole === 'ADMIN') &&
    member.role !== 'OWNER'
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)]">
      <div className="shrink-0">
        {member.user.profileImage ? (
          <img src={member.user.profileImage} alt={member.user.name}
               className="w-9 h-9  object-cover" />
        ) : (
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold bg-[var(--color-profile)] text-[var(--color-profile-text)]">
            {member.user.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate m-0 text-[var(--color-text)]">
          {member.user.name}
        </p>
        <p className="text-xs truncate m-0 text-[var(--color-text-muted)]">
          @{member.user.username}
        </p>
        <p className="text-xs truncate m-0 text-[var(--color-text-muted)]">
          {member.user.email}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <RoleBadge role={member.role} />
        {canManage && (
          <>
            <button type="button" onClick={() => onChangeRole(member)}
                    className="p-1  transition-colors border-none bg-transparent cursor-pointer hover:bg-[var(--color-hover)] text-[var(--color-text-subtle)]">
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>edit</span>
            </button>
            <button type="button" onClick={() => onRemove(member)}
                    className="p-1  transition-colors border-none bg-transparent cursor-pointer hover:bg-[var(--color-hover)] text-[var(--color-error)]">
              <span  className='font-semibold'>delete</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
import RoleBadge from "./RoleBadge";

export default function MemberCard({ member, currentUserRole, onChangeRole, onRemove }) {
  const canManage =
    (currentUserRole === "OWNER" || currentUserRole === "ADMIN") &&
    member.role !== "OWNER";

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-outline-variant)]"
    >
      <div className="flex-shrink-0">
        {member.user.profileImage ? (
          <img
            src={member.user.profileImage}
            alt={member.user.name}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-sm font-bold">
            {member.user.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate text-[var(--color-on-surface)]">
          {member.user.name}
        </p>
        <p className="text-xs truncate text-[var(--color-on-surface-variant)]">
          @{member.user.username}
        </p>
        <p className="text-xs truncate text-[var(--color-on-surface-variant)]">
          {member.user.email}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <RoleBadge role={member.role} />
        {canManage && (
          <>
            <button
              type="button"
              onClick={() => onChangeRole(member)}
              className="p-1 rounded transition-colors text-[var(--color-on-surface-variant)]"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <button
              type="button"
              onClick={() => onRemove(member)}
              className="p-1 rounded transition-colors text-[var(--color-error)]"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

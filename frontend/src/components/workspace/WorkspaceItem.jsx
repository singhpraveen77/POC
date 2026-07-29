import RoleBadge from '../collaboration/RoleBadge'
export default function WorkspaceItem({ workspace, myRole, canManage, onClick, onEdit, onDelete }) {
  const iconBtn = 'border-none bg-transparent cursor-pointer p-1 flex items-center text-[var(--color-text-subtle)]'
  return (
    <div onClick={onClick}
         className="p-5  cursor-pointer flex justify-between items-start transition-all duration-150 bg-[var(--color-surface-low)] border border-[var(--color-border)]">
      <div className="flex-1 min-w-0 pr-3">
        <h2 className="text-[15px] font-bold mt-0 mb-1 truncate m-0 text-[var(--color-text)]">{workspace.name}</h2>
        <p className="text-[12.5px] truncate mt-0 mb-2 m-0 text-[var(--color-text-muted)]">{workspace.slug}</p>
        {myRole && <RoleBadge role={myRole} />}
      </div>
      {canManage && (
        <div className="flex gap-1 shrink-0">
          <button type="button" className={iconBtn} title="Edit" onClick={onEdit}>
            <span className="material-symbols-outlined text-[17px]">edit</span>
          </button>
          {myRole === 'OWNER' && (
            <button type="button" className={iconBtn} title="Delete" onClick={onDelete}>
              <span className="material-symbols-outlined text-[17px]">delete</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
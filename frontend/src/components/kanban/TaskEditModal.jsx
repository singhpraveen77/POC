import Modal from '../common/Modal'
import Button from '../common/Button'
import TaskOptionsLoader from '../loader/TaskOptionsLoader'
export default function TaskEditModal({
  isOpen, onClose, title, onTitleChange, description, onDescriptionChange,
  columnId, onColumnChange, assigneeId, onAssigneeChange,
  columns, members, errors, isSaving, isDeleting, onSave, onDelete, currentUserRole,
}) {
  const isLoading = isSaving || isDeleting
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
      {isLoading ? <TaskOptionsLoader /> : (
        <form onSubmit={onSave} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-text)]">Title *</label>
            <input required autoFocus value={title} onChange={e => onTitleChange(e.target.value)} className="input-base" />
            {errors?.title && <span className="text-[12px] font-medium text-[var(--color-error)]">{errors.title}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-text)]">Description</label>
            <textarea rows={4} placeholder="Task details…" value={description}
                      onChange={e => onDescriptionChange(e.target.value)} className="input-base resize-y" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-text)]">Column</label>
            <select value={columnId} onChange={e => onColumnChange(e.target.value)} className="input-base">
              {columns?.map(col => <option key={col.id} value={col.id}>{col.name}</option>)}
            </select>
          </div>
          {members.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[var(--color-text)]">Assignee</label>
              <select value={assigneeId} onChange={e => onAssigneeChange(e.target.value)} className="input-base">
                <option value="">Unassigned</option>
                {members.map(m => <option key={m.userId} value={m.userId}>{m.user.name} (@{m.user.username})</option>)}
              </select>
            </div>
          )}
          <div className="flex justify-between gap-3 mt-2">
            {(currentUserRole === 'OWNER' || currentUserRole === 'ADMIN') && (
              <Button variant="danger" type="button" loading={isDeleting} disabled={isLoading} onClick={onDelete}>Delete</Button>
            )}
            <div className="flex gap-3 ml-auto">
              <Button variant="outline" type="button" disabled={isLoading} onClick={onClose}>Cancel</Button>
              {currentUserRole !== 'VIEWER' && (
                <Button variant="solid" type="submit" loading={isSaving} disabled={isLoading}>submit</Button>
              )}
            </div>
          </div>
        </form>
      )}
    </Modal>
  )
}
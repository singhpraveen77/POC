import Modal from '../common/Modal'
import Button from '../common/Button'
export default function TaskCreateModal({ isOpen, onClose, taskTitle, onTitleChange, taskAssigneeId, onAssigneeChange, members, onSubmit, errors, isSubmitting }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Task">
      <form onSubmit={onSubmit} className="p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[var(--color-text)]">Task Title *</label>
          <input required autoFocus placeholder="e.g. Implement OAuth login"
                 value={taskTitle} onChange={e => onTitleChange(e.target.value)} className="input-base" />
          {errors?.title && <span className="text-[12px] font-medium text-[var(--color-error)]">{errors.title}</span>}
        </div>
        {members.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-text)]">Assignee</label>
            <select value={taskAssigneeId} onChange={e => onAssigneeChange(e.target.value)} className="input-base">
              <option value="">Unassigned</option>
              {members.map(m => <option key={m.userId} value={m.userId}>{m.user.name} (@{m.user.username})</option>)}
            </select>
          </div>
        )}
        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="solid" type="submit" loading={isSubmitting}>Create</Button>
        </div>
      </form>
    </Modal>
  )
}
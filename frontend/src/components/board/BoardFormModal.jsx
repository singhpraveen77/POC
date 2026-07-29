import Modal from '../common/Modal'
import Button from '../common/Button'
export default function BoardFormModal({ isOpen, onClose, title, name, onNameChange, description, onDescriptionChange, errors, isSubmitting, onSubmit, submitLabel = 'Create' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={onSubmit} className="p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[var(--color-text)]">Board Name *</label>
          <input required autoFocus placeholder="e.g. Sprint Backlog" value={name}
                 onChange={e => onNameChange(e.target.value)} className="input-base" />
          {errors?.name && <span className="text-xs font-medium text-[var(--color-error)]">{errors.name}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[var(--color-text)]">Description</label>
          <textarea rows={3} placeholder="e.g. Tracking sprint tasks and progress." value={description}
                    onChange={e => onDescriptionChange(e.target.value)} className="input-base resize-y" />
          {errors?.description && <span className="text-xs font-medium text-[var(--color-error)]">{errors.description}</span>}
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="solid" type="submit" loading={isSubmitting}>{submitLabel}</Button>
        </div>
      </form>
    </Modal>
  )
}
import Modal from '../common/Modal'
import Button from '../common/Button'
export default function WorkspaceFormModal({ isOpen, onClose, title, name, onNameChange, slug, onSlugChange, errors, isSubmitting, onSubmit, submitLabel = 'Create' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={onSubmit} className="p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[var(--color-text)]">Workspace Name *</label>
          <input required autoFocus placeholder="e.g. Engineering Team" value={name}
                 onChange={e => onNameChange(e.target.value)} className="input-base" />
          {errors?.name && <span className="text-xs font-medium text-[var(--color-error)]">{errors.name}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[var(--color-text)]">Workspace Slug *</label>
          <input required placeholder="e.g. engineering-team" value={slug}
                 onChange={e => onSlugChange(e.target.value)} className="input-base" />
          {errors?.slug && <span className="text-xs font-medium text-[var(--color-error)]">{errors.slug}</span>}
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="solid" type="submit" loading={isSubmitting}>{submitLabel}</Button>
        </div>
      </form>
    </Modal>
  )
}
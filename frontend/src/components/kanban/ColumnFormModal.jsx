import Modal from '../common/Modal'
import Button from '../common/Button'
export default function ColumnFormModal({ isOpen, onClose, columnName, onChange, onSubmit, errors, isSubmitting }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Column">
      <form onSubmit={onSubmit} className="p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[var(--color-text)]">Column Name *</label>
          <input required autoFocus placeholder="e.g. In Progress" value={columnName}
                 onChange={e => onChange(e.target.value)} className="input-base" />
          {errors?.name && <span className="text-[12px] font-medium text-[var(--color-error)]">{errors.name}</span>}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="solid" type="submit" loading={isSubmitting}>Create</Button>
        </div>
      </form>
    </Modal>
  )
}
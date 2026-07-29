import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { changeMemberRole } from '../../redux/member/workspaceMemberSlice'
export default function ChangeRoleModal({ member, workspaceId, isOpen, onClose }) {
  const dispatch = useDispatch()
  const [role, setRole] = useState(member?.role || 'MEMBER')
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(changeMemberRole({ workspaceId, userId: member.userId, role }))
    onClose()
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Role">
      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[var(--color-text)]">Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="input-base text-[var(--color-text)] bg-[var(--color-surface-low)] border-[var(--color-border)] focus:border-[var(--color-btn)]">
            <option value="ADMIN">ADMIN</option>
            <option value="MEMBER">MEMBER</option>
            <option value="VIEWER">VIEWER</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 mt-3">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="solid" type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  )
}
import { useDispatch } from 'react-redux'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { removeMember } from '../../redux/member/workspaceMemberSlice'

export default function RemoveMemberModal({ member, workspaceId, isOpen, onClose }) {
  const dispatch = useDispatch()

  const handleRemove = () => {
    dispatch(removeMember({ workspaceId, userId: member.userId }))
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Remove Member">
      <div className="p-6 flex flex-col gap-5">
        <p className="text-sm text-[var(--color-on-surface)]">
          Are you sure you want to remove {member?.user?.name} from this workspace?
        </p>
        <div className="flex justify-end gap-3 mt-3">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="danger" type="button" onClick={handleRemove}>Remove</Button>
        </div>
      </div>
    </Modal>
  )
}

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { searchUsers, clearSearch } from '../../redux/search/userSearchSlice'
import { sendInvite } from '../../redux/invite/workspaceInviteSlice'
export default function InviteMemberModal({ workspaceId, isOpen, onClose }) {
  const dispatch = useDispatch()
  const searchResults = useSelector(state => state.userSearch.results)
  const [query, setQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('MEMBER')
  const [selectedUser, setSelectedUser] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const resetState = () => {
    setQuery('')
    setSelectedRole('MEMBER')
    setSelectedUser(null)
    setIsSubmitting(false)
    dispatch(clearSearch())
  }
  const handleClose = () => {
    resetState()
    onClose()
  }
  useEffect(() => {
    if (!query.trim()) {
      dispatch(clearSearch())
      return
    }
    const timer = setTimeout(() => dispatch(searchUsers(query)), 400)
    return () => clearTimeout(timer)
  }, [query, dispatch])
  const handleSelectUser = (user) => {
    setSelectedUser(user)
    setQuery('')
    dispatch(clearSearch())
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedUser) return
    setIsSubmitting(true)
    dispatch(sendInvite({ workspaceId, invitedUserId: selectedUser.id, role: selectedRole }))
      .unwrap()
      .then(handleClose)
      .finally(() => setIsSubmitting(false))
  }
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Invite Member">
      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[var(--color-text)]">Search User</label>
          <input type="text" placeholder="Search by name or email" value={query}
                 onChange={e => { setSelectedUser(null); setQuery(e.target.value) }}
                 className="input-base text-[var(--color-text)] bg-[var(--color-surface-low)] border-[var(--color-border)] focus:border-[var(--color-btn)] placeholder:text-[var(--color-text-subtle)]" />
          {searchResults.length > 0 && (
            <ul className="m-0 p-0 list-none  overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-low)]">
              {searchResults.map(user => (
                <li key={user.id} onClick={() => handleSelectUser(user)}
                    className="px-3 py-2.5 cursor-pointer flex flex-col gap-0.5 transition-colors border-b border-[var(--color-border)] hover:bg-[var(--color-hover)]"
                    role="button">
                  <span className="text-sm font-semibold text-[var(--color-text)]">{user.name}</span>
                  <span className="text-xs text-[var(--color-text-muted)]">{user.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedUser && (
          <div className="px-3 py-2.5  flex flex-col gap-0.5 border border-[var(--color-border)] bg-[var(--color-surface-low)]">
            <span className="text-[13px] font-semibold text-[var(--color-text)]">{selectedUser.name}</span>
            <span className="text-xs text-[var(--color-text-muted)]">{selectedUser.email}</span>
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[var(--color-text)]">Role</label>
          <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="input-base text-[var(--color-text)] bg-[var(--color-surface-low)] border-[var(--color-border)] focus:border-[var(--color-btn)]">
            <option value="ADMIN">Admin</option>
            <option value="MEMBER">Member</option>
            <option value="VIEWER">Viewer</option>
          </select>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={handleClose}>Cancel</Button>
          <Button variant="solid" type="submit" loading={isSubmitting} disabled={!selectedUser}>Send Invite</Button>
        </div>
      </form>
    </Modal>
  )
}
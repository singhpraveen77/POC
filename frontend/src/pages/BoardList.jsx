import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoards, createBoard, updateBoard, deleteBoard } from '../redux/board/boardSlice.js'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/common/Button.jsx'
import { extractFieldErrors } from '../utils/errorHelper.js'
import { BoardSkeleton } from '../components/loader/BoardLoader.jsx'
import { fetchMembers } from '../redux/member/workspaceMemberSlice.js'
import InviteMemberModal from '../components/collaboration/InviteMemberModal.jsx'
import { validateBoard, hasErrors } from '../utils/validators.js'
import BoardItem from '../components/board/BoardItem.jsx'
import BoardFormModal from '../components/board/BoardFormModal.jsx'

export default function BoardList() {
  const { workspaceId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, status } = useSelector(state => state.boards)
  const { members } = useSelector(state => state.workspaceMembers)
  const currentUser = useSelector(state => state.auth.user)
  const currentUserRole = members.find(m => m.userId === currentUser?.id)?.role

  const [isInviteOpen, setIsInviteOpen] = useState(false)

  // ── Create state ──
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [createErrors, setCreateErrors] = useState({})
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false)

  // ── Edit state ──
  const [editingBoard, setEditingBoard] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editErrors, setEditErrors] = useState({})
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false)

  useEffect(() => { dispatch(fetchBoards(workspaceId)) }, [workspaceId, dispatch])
  useEffect(() => { dispatch(fetchMembers(workspaceId)) }, [workspaceId, dispatch])

  const handleRefresh = () => { dispatch(fetchBoards(workspaceId)); dispatch(fetchMembers(workspaceId)) }

  const handleCreate = (e) => {
    e.preventDefault()
    const errs = validateBoard({ name })
    if (hasErrors(errs)) { setCreateErrors(errs); return }
    setCreateErrors({})
    setIsSubmittingCreate(true)
    dispatch(createBoard({ name, description, workspaceId }))
      .unwrap()
      .then(() => { setIsCreateOpen(false); setName(''); setDescription('') })
      .catch(err => setCreateErrors(extractFieldErrors(err)))
      .finally(() => setIsSubmittingCreate(false))
  }

  const openEdit = (board, e) => {
    e.stopPropagation()
    setEditingBoard(board)
    setEditName(board.name)
    setEditDescription(board.description || '')
    setEditErrors({})
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    const errs = validateBoard({ name: editName })
    if (hasErrors(errs)) { setEditErrors(errs); return }
    setEditErrors({})
    setIsSubmittingEdit(true)
    dispatch(updateBoard({ id: editingBoard.id, data: { name: editName, description: editDescription } }))
      .unwrap()
      .then(() => setEditingBoard(null))
      .catch(err => setEditErrors(extractFieldErrors(err)))
      .finally(() => setIsSubmittingEdit(false))
  }

  const handleDelete = (board, e) => {
    e.stopPropagation()
    if (window.confirm(`Delete board "${board.name}"? This is permanent.`)) {
      dispatch(deleteBoard(board.id))
    }
  }

  const canManage = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN'

  return (
    <div className="px-3 py-2 max-w-full ">
      {}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[22px] font-extrabold m-0 text-[var(--color-text)]">Boards</h1>
          <p className="mt-1 mb-0 text-sm m-0 text-[var(--color-text-muted)]">
            Manage your workflows, tasks, and column groupings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm"  onClick={handleRefresh}>Refresh</Button>
          <Button variant="outline" size="sm"  onClick={() => navigate(`/workspaces/${workspaceId}/members`)}>Members</Button>
          {canManage && (
            <Button variant="outline" size="sm"  onClick={() => setIsInviteOpen(true)}>Invite</Button>
          )}
          <Button variant="solid" icon="add" onClick={() => setIsCreateOpen(true)}/>
        </div>
      </div>

      {}
      {status === 'loading' ? (
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {Array.from({ length: 6 }).map((_, i) => <BoardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {items.map(board => (
            <BoardItem
              key={board.id}
              board={board}
              canManage={canManage}
              onClick={() => navigate(`/boards/${board.id}`)}
              onEdit={e => openEdit(board, e)}
              onDelete={e => handleDelete(board, e)}
            />
          ))}

          {items.length === 0 && (
            <div className="col-span-full py-12 px-6 text-center rounded-xl"
                 style={{ border: '2px dashed var(--color-border)' }}>
              <span className="material-symbols-outlined text-[48px] mb-3 block text-[var(--color-text-subtle)]">view_week</span>
              <p className="text-[15px] font-semibold mt-0 mb-1 text-[var(--color-text-muted)]">No boards found</p>
              <p className="text-sm mt-0 mb-4 text-[var(--color-text-subtle)]">Create your first board in this workspace.</p>
              <Button variant="solid" icon="add" onClick={() => setIsCreateOpen(true)}>Create Board</Button>
            </div>
          )}
        </div>
      )}

      {}
      <BoardFormModal
        isOpen={isCreateOpen}
        onClose={() => { setIsCreateOpen(false); setName(''); setDescription(''); setCreateErrors({}) }}
        title="Create Board"
        name={name} onNameChange={setName}
        description={description} onDescriptionChange={setDescription}
        errors={createErrors}
        isSubmitting={isSubmittingCreate}
        onSubmit={handleCreate}
        submitLabel="Create"
      />

      <BoardFormModal
        isOpen={!!editingBoard}
        onClose={() => setEditingBoard(null)}
        title="Edit Board"
        name={editName} onNameChange={setEditName}
        description={editDescription} onDescriptionChange={setEditDescription}
        errors={editErrors}
        isSubmitting={isSubmittingEdit}
        onSubmit={handleUpdate}
        submitLabel="Save Changes"
      />

      <InviteMemberModal
        workspaceId={workspaceId}
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </div>
  )
}
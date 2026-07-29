import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWorkspaces, createWorkspace, updateWorkspace, deleteWorkspace } from '../redux/workspace/workspaceSlice.js'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button.jsx'
import { extractFieldErrors } from '../utils/errorHelper.js'
import { WorkspaceSkeleton } from '../components/loader/WorkspaceLoader.jsx'
import { validateWorkspace, hasErrors } from '../utils/validators.js'
import WorkspaceItem from '../components/workspace/WorkspaceItem.jsx'
import WorkspaceFormModal from '../components/workspace/WorkspaceFormModal.jsx'

export default function WorkspaceList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, status } = useSelector(state => state.workspaces)
  const currentUser = useSelector(state => state.auth.user)

  // ── Create state ──
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [createErrors, setCreateErrors] = useState({})
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false)

  // ── Edit state ──
  const [editingWorkspace, setEditingWorkspace] = useState(null)
  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [editErrors, setEditErrors] = useState({})
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchWorkspaces())
  }, [status, dispatch])

  const handleCreate = (e) => {
    e.preventDefault()
    const errs = validateWorkspace({ name, slug })
    if (hasErrors(errs)) { setCreateErrors(errs); return }
    setCreateErrors({})
    setIsSubmittingCreate(true)
    dispatch(createWorkspace({ name, slug }))
      .unwrap()
      .then(() => { setIsCreateOpen(false); setName(''); setSlug('') })
      .catch(err => setCreateErrors(extractFieldErrors(err)))
      .finally(() => setIsSubmittingCreate(false))
  }

  const openEdit = (ws, e) => {
    e.stopPropagation()
    setEditingWorkspace(ws)
    setEditName(ws.name)
    setEditSlug(ws.slug)
    setEditErrors({})
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    const errs = validateWorkspace({ name: editName, slug: editSlug })
    if (hasErrors(errs)) { setEditErrors(errs); return }
    setEditErrors({})
    setIsSubmittingEdit(true)
    dispatch(updateWorkspace({ id: editingWorkspace.id, data: { name: editName, slug: editSlug } }))
      .unwrap()
      .then(() => { setEditingWorkspace(null) })
      .catch(err => setEditErrors(extractFieldErrors(err)))
      .finally(() => setIsSubmittingEdit(false))
  }

  const handleDelete = (ws, e) => {
    e.stopPropagation()
    if (window.confirm(`Delete workspace "${ws.name}"? This is permanent.`)) {
      dispatch(deleteWorkspace(ws.id))
    }
  }

  return (
    <div className="px-6 py-10 max-w-full">
      {}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[22px] font-extrabold m-0 ">Workspaces</h1>
          <p className="mt-1 mb-0 text-sm m-0 ">
            Create and manage collaborative spaces for your projects.
          </p>
        </div>
        <Button variant="solid" icon="add" onClick={() => setIsCreateOpen(true)}/>
      </div>

      {}
      {status === 'loading' && items.length === 0 ? (
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          <WorkspaceSkeleton /><WorkspaceSkeleton /><WorkspaceSkeleton />
        </div>
      ) : (
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {items.map(ws => {
            const myRole = ws.members?.find(m => m.userId === currentUser?.id)?.role
            const canManage = myRole === 'OWNER' || myRole === 'ADMIN'
            return (
              <WorkspaceItem
                key={ws.id}
                workspace={ws}
                myRole={myRole}
                canManage={canManage}
                onClick={() => navigate(`/workspaces/${ws.id}`)}
                onEdit={e => openEdit(ws, e)}
                onDelete={e => handleDelete(ws, e)}
              />
            )
          })}

          {items.length === 0 && (
            <div className="col-span-full py-12 px-6 text-center rounded-xl"
                 style={{ border: '2px dashed var(--color-border)' }}>
              <span className="material-symbols-outlined text-[48px] mb-3 block text-[var(--color-text-subtle)]">folder_open</span>
              <p className="text-[15px] font-semibold mt-0 mb-1 text-[var(--color-text-muted)]">No workspaces found</p>
              <p className="text-sm mt-0 mb-4 text-[var(--color-text-subtle)]">Get started by creating your first workspace.</p>
              <Button variant="solid" icon="add" onClick={() => setIsCreateOpen(true)}>Create Workspace</Button>
            </div>
          )}
        </div>
      )}

      {}
      <WorkspaceFormModal
        isOpen={isCreateOpen}
        onClose={() => { setIsCreateOpen(false); setName(''); setSlug(''); setCreateErrors({}) }}
        title="Create Workspace"
        name={name} onNameChange={setName}
        slug={slug} onSlugChange={setSlug}
        errors={createErrors}
        isSubmitting={isSubmittingCreate}
        onSubmit={handleCreate}
        submitLabel="Create"
      />

      {}
      <WorkspaceFormModal
        isOpen={!!editingWorkspace}
        onClose={() => setEditingWorkspace(null)}
        title="Edit Workspace"
        name={editName} onNameChange={setEditName}
        slug={editSlug} onSlugChange={setEditSlug}
        errors={editErrors}
        isSubmitting={isSubmittingEdit}
        onSubmit={handleUpdate}
        submitLabel="Save Changes"
      />
    </div>
  )
}
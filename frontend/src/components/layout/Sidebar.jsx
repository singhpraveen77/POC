import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../redux/auth/authThunk'
import { fetchWorkspaces, createWorkspace } from '../../redux/workspace/workspaceSlice.js'
import { createBoard } from '../../redux/board/boardSlice.js'
import Modal from '../common/Modal.jsx'
import Button from '../common/Button.jsx'
import { extractFieldErrors } from '../../utils/errorHelper.js'

export default function Sidebar({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items: workspaces, status } = useSelector(state => state.workspaces)

  const [expandedWorkspaces, setExpandedWorkspaces] = useState({})

  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false)
  const [wsName, setWsName] = useState('')
  const [wsSlug, setWsSlug] = useState('')
  const [wsErrors, setWsErrors] = useState({})
  const [isSubmittingWs, setIsSubmittingWs] = useState(false)

  const [boardWorkspaceId, setBoardWorkspaceId] = useState(null)
  const [boardName, setBoardName] = useState('')
  const [boardDesc, setBoardDesc] = useState('')
  const [boardErrors, setBoardErrors] = useState({})
  const [isSubmittingBoard, setIsSubmittingBoard] = useState(false)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchWorkspaces())
  }, [status, dispatch])

  const toggleWorkspace = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    setExpandedWorkspaces(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleCreateWorkspace = (e) => {
    e.preventDefault()
    setWsErrors({})
    setIsSubmittingWs(true)
    dispatch(createWorkspace({ name: wsName, slug: wsSlug }))
      .unwrap()
      .then((newWs) => {
        setIsCreateWorkspaceOpen(false)
        setWsName('')
        setWsSlug('')
        setExpandedWorkspaces(prev => ({ ...prev, [newWs.id]: true }))
        navigate(`/workspaces/${newWs.id}`)
        onClose()
      })
      .catch((err) => setWsErrors(extractFieldErrors(err)))
      .finally(() => setIsSubmittingWs(false))
  }

  const handleCreateBoard = (e) => {
    e.preventDefault()
    setBoardErrors({})
    setIsSubmittingBoard(true)
    dispatch(createBoard({ name: boardName, description: boardDesc, workspaceId: boardWorkspaceId }))
      .unwrap()
      .then((newBoard) => {
        setBoardWorkspaceId(null)
        setBoardName('')
        setBoardDesc('')
        navigate(`/boards/${newBoard.id}`)
        onClose()
      })
      .catch((err) => setBoardErrors(extractFieldErrors(err)))
      .finally(() => setIsSubmittingBoard(false))
  }

  
  const inputCls = 'input-base text-[var(--color-text)] bg-[var(--color-surface-low)] border-[var(--color-border)] focus:border-[var(--color-btn)] placeholder:text-[var(--color-text-subtle)]'

  const inner = (
    <nav className="flex flex-col h-full min-w-[20vw] p-5 border border-[var(--color-border)]  border-b-blue-50 shrink-0 scrollbar-thin">

      
      <div className="flex items-center gap-3 px-3 mb-7">
        <span className="text-[35px] font-bold text-[var(--color-text)] tracking-tight">Kanban Project</span>
      </div>

      
      <div className="flex-1 overflow-y-auto scrollbar-thin flex flex-col gap-5">

        <NavLink
          to="/"
          end
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 rounded-md text-[13.5px] font-medium no-underline transition-all duration-150 ${
              isActive
                ? 'bg-[var(--color-active-tab)] text-[var(--color-active-tab-text)] font-sm'
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text)]'
            }`
          }
        >
          <span className="material-symbols-outlined">dashboard</span> 
          <span className="text-xl">Dashboard</span> 
          
        </NavLink>

        {}
        <div>
          <div className="flex items-center px-3 pb-2 mb-1"  >
            <span className="border-[var(--color-border)] font-bold tracking-widest uppercase ">Workspaces</span>
            <button
              onClick={() => setIsCreateWorkspaceOpen(true)}
              className="p-0.5 rounded text-[var(--color-btn)] hover:bg-[var(--color-hover)] transition-colors"
              title="New Workspace"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
            </button>
          </div>

          {}
          {status === 'loading' && workspaces.length === 0 && (
            <div className="animate-pulse flex flex-col gap-2 px-3 py-2">
              <div className="h-3 rounded bg-[var(--color-surface-high)] w-4/5" />
              <div className="h-3 rounded bg-[var(--color-surface-high)] w-3/5" />
            </div>
          )}

          {status === 'succeeded' && workspaces.length === 0 && (
            <p className="text-[12px] italic text-[var(--color-text-subtle)] px-3 py-2 m-0">No workspaces yet</p>
          )}

          <ul className="list-none m-0 p-0 flex flex-col gap-0.5">
            {workspaces.map(ws => {
              const isExpanded = !!expandedWorkspaces[ws.id]
              return (
                <li key={ws.id} className="flex flex-col">
                  {}
                  <div className="flex items-center   rounded-sm transition-colors hover:bg-[var(--color-hover)] group">
                    {}
                    <button
                      onClick={(e) => toggleWorkspace(ws.id, e)}
                      className="shrink-0 bg-transparent border-none cursor-pointer p-2 flex items-center text-[var(--color-text-subtle)]"
                      style={{ transition: 'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
                    </button>

                    {}
                    <NavLink
                      to={`/workspaces/${ws.id}`}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex-1 min-w-0 py-2 pr-1 text-[18px] no-underline truncate transition-colors ${
                          isActive
                            ? 'text-[var(--color-active-tab-text)] font-semibold'
                            : 'text-[var(--color-text)] hover:text-[var(--color-btn)]'
                        }`
                      }
                    >
                      {ws.name}
                    </NavLink>

                    {}
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBoardWorkspaceId(ws.id); setBoardName(''); setBoardDesc(''); setBoardErrors({}) }}
                      className="opacity-0 group-hover:opacity-100 shrink-0 bg-transparent border-none cursor-pointer p-1.5 mr-1 rounded text-[var(--color-btn)] hover:bg-[var(--color-hover)] transition-all"
                      title="Add Board"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
                    </button>
                  </div>

                  {}
                  {isExpanded && (
                    <ul className="list-none m-0 p-0 pl-8 flex flex-col gap-0.5">
                      {ws.boards && ws.boards.length > 0 ? (
                        ws.boards.map(board => (
                          <li key={board.id}>
                            <NavLink
                              to={`/boards/${board.id}`}
                              onClick={onClose}
                              className={({ isActive }) =>
                                `flex items-center gap-2 px-2.5 py-1.5 rounded text-[12.5px] font-medium no-underline truncate transition-all ${
                                  isActive
                                    ? 'bg-[var(--color-active-tab)] text-[var(--color-active-tab-text)]'
                                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text)]'
                                }`
                              }
                            >
                              <span className="text-[8px] text-[currentColor] leading-none">●</span>
                              <span className="truncate">{board.name}</span>
                            </NavLink>
                          </li>
                        ))
                      ) : (
                        <li className="flex items-center gap-1.5 px-2.5 py-1 text-[11.5px] text-[var(--color-text-subtle)]">
                          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>info</span>
                          No boards yet
                        </li>
                      )}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12, marginTop: 'auto' }} />

      {}
      <Modal isOpen={isCreateWorkspaceOpen} onClose={() => setIsCreateWorkspaceOpen(false)} title="New Workspace">
        <form onSubmit={handleCreateWorkspace} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-text)]">Workspace Name *</label>
            <input required placeholder="e.g. Design Team" value={wsName} onChange={e => setWsName(e.target.value)} className={inputCls} />
            {wsErrors.name && <span className="text-xs text-[var(--color-error)]">{wsErrors.name}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-text)]">Workspace Slug *</label>
            <input required placeholder="e.g. design-team" value={wsSlug} onChange={e => setWsSlug(e.target.value)} className={inputCls} />
            {wsErrors.slug && <span className="text-xs text-[var(--color-error)]">{wsErrors.slug}</span>}
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsCreateWorkspaceOpen(false)} type="button">Cancel</Button>
            <Button variant="solid" type="submit" loading={isSubmittingWs}>Create</Button>
          </div>
        </form>
      </Modal>

      {}
      <Modal isOpen={boardWorkspaceId !== null} onClose={() => setBoardWorkspaceId(null)} title="New Board">
        <form onSubmit={handleCreateBoard} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-text)]">Board Name *</label>
            <input required placeholder="e.g. UI Redesign" value={boardName} onChange={e => setBoardName(e.target.value)} className={inputCls} />
            {boardErrors.name && <span className="text-xs text-[var(--color-error)]">{boardErrors.name}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-text)]">Description</label>
            <textarea placeholder="Board details…" value={boardDesc} onChange={e => setBoardDesc(e.target.value)} rows={3}
              className={`${inputCls} resize-y`} />
            {boardErrors.description && <span className="text-xs text-[var(--color-error)]">{boardErrors.description}</span>}
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setBoardWorkspaceId(null)} type="button">Cancel</Button>
            <Button variant="solid" type="submit" loading={isSubmittingBoard}>Create</Button>
          </div>
        </form>
      </Modal>
    </nav>
  )

  return (
    <>
      {}
      <div className="hidden md:block">{inner}</div>

      {}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-lg" onClick={onClose} />
          <div className="relative z-10 h-full w-[280px] max-w-[85vw]">{inner}</div>
        </div>
      )}
    </>
  )
}
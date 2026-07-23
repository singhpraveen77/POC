import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../redux/auth/authThunk'
import { fetchWorkspaces, createWorkspace } from '../../redux/workspace/workspaceSlice'
import { createBoard } from '../../redux/board/boardSlice'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { extractFieldErrors } from '../../utils/errorHelper'
import toast from 'react-hot-toast'

export default function Sidebar({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items: workspaces, status } = useSelector(state => state.workspaces)

  const [expandedWorkspaces, setExpandedWorkspaces] = useState({})

  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false)
  const [wsName, setWsName] = useState("")
  const [wsSlug, setWsSlug] = useState("")
  const [wsErrors, setWsErrors] = useState({})
  const [isSubmittingWs, setIsSubmittingWs] = useState(false)

  const [boardWorkspaceId, setBoardWorkspaceId] = useState(null)
  const [boardName, setBoardName] = useState("")
  const [boardDesc, setBoardDesc] = useState("")
  const [boardErrors, setBoardErrors] = useState({})
  const [isSubmittingBoard, setIsSubmittingBoard] = useState(false)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchWorkspaces())
    }
  }, [status, dispatch])

  

  const toggleWorkspace = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    setExpandedWorkspaces(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleCreateWorkspace = (e) => {
    e.preventDefault()
    setWsErrors({})
    setIsSubmittingWs(true)

    dispatch(createWorkspace({ name: wsName, slug: wsSlug }))
      .unwrap()
      .then((newWs) => {
        setIsCreateWorkspaceOpen(false)
        setWsName("")
        setWsSlug("")
        setExpandedWorkspaces(prev => ({ ...prev, [newWs.id]: true }))
        navigate(`/workspaces/${newWs.id}`)
        onClose()
      })
      .catch((err) => {
        const fields = extractFieldErrors(err)
        setWsErrors(fields)
      })
      .finally(() => {
        setIsSubmittingWs(false)
      })
  }

  const handleCreateBoard = (e) => {
    e.preventDefault()
    setBoardErrors({})
    setIsSubmittingBoard(true)

    dispatch(createBoard({ name: boardName, description: boardDesc, workspaceId: boardWorkspaceId }))
      .unwrap()
      .then((newBoard) => {
        setBoardWorkspaceId(null)
        setBoardName("")
        setBoardDesc("")
        navigate(`/boards/${newBoard.id}`)
        onClose()
      })
      .catch((err) => {
        const fields = extractFieldErrors(err)
        setBoardErrors(fields)
      })
      .finally(() => {
        setIsSubmittingBoard(false)
      })
  }

  const inner = (
    <nav style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: 260,
      padding: '20px 12px',
      backgroundColor: 'var(--color-surface)',
      borderRight: '1px solid var(--color-outline-variant)',
      flexShrink: 0,
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px', marginBottom: 28 }}>
        
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-on-surface)', lineHeight: 1.1, margin: 0 }}>
            Kanban Project
          </p>
        </div>
      </div>

      {/* Main Navigation List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }} className="scrollbar-thin">
        {/* Core Links */}
        <div>
          <NavLink
            to="/"
            end
            onClick={onClose}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 6,
              color: isActive ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
              fontSize: 14,
              fontWeight: isActive ? 600 : 500,
              textDecoration: 'none',
              transition: 'all 0.2s',
            })}
          >
            Dashboard
          </NavLink>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px 8px 12px', borderBottom: '1px solid var(--color-outline-variant)', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-on-surface-variant)', uppercase: 'true', letterSpacing: '0.05em' }}>MY WORKSPACES</span>
            <button 
              onClick={() => setIsCreateWorkspaceOpen(true)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}
              title="Add New Workspace"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
            </button>
          </div>

          {status === 'loading' && workspaces.length === 0 && (
            <div className="animate-pulse" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '8px 12px' }}>
              <div style={{ height: 16, backgroundColor: 'var(--color-surface-container)', borderRadius: 4, width: '80%' }}></div>
              <div style={{ height: 16, backgroundColor: 'var(--color-surface-container)', borderRadius: 4, width: '60%' }}></div>
            </div>
          )}

          {status === 'succeeded' && workspaces.length === 0 && (
            <p style={{ fontSize: 12, color: 'var(--color-on-surface-variant)', padding: '8px 12px', margin: 0, fontStyle: 'italic' }}>
              No workspaces created yet
            </p>
          )}

          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {workspaces.map(ws => {
              const isExpanded = !!expandedWorkspaces[ws.id];
              return (
                <li key={ws.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Workspace Row */}
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: 6,
                      transition: 'background-color 0.2s',
                    }}
                    className="hover:bg-slate-100"
                  >
                    {/* Toggle Collapse Chevron */}
                    <button 
                      onClick={(e) => toggleWorkspace(ws.id, e)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '10px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-on-surface-variant)',
                        transition: 'transform 0.2s',
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
                    </button>

                    {/* Workspace Title Link */}
                    <NavLink
                      to={`/workspaces/${ws.id}`}
                      onClick={onClose}
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 4px',
                        color: isActive ? 'var(--color-primary)' : 'var(--color-on-surface)',
                        fontWeight: isActive ? 600 : 500,
                        fontSize: 13.5,
                        textDecoration: 'none',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '120px'
                      })}
                    >
                      {ws.name}
                    </NavLink>

                    {/* Add Board Icon to the right of Workspace name */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setBoardWorkspaceId(ws.id)
                        setBoardName("")
                        setBoardDesc("")
                        setBoardErrors({})
                      }} 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        padding: '4px 8px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: 'var(--color-primary)', 
                        marginLeft: 'auto' 
                      }}
                      title="Add Board to Workspace"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                    </button>
                  </div>

                  {/* Boards nested list */}
                  {isExpanded && (
                    <ul style={{ listStyle: 'none', margin: 0, padding: '2px 0 2px 28px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {ws.boards && ws.boards.length > 0 ? (
                        ws.boards.map(board => (
                          <li key={board.id}>
                            <NavLink
                              to={`/boards/${board.id}`}
                              onClick={onClose}
                              style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                // justifyContent:'center',
                                textAlign:'center',
                                gap: 8,
                                padding: '8px 10px',
                                borderRadius: 4,
                                backgroundColor: isActive ? "bg-slate-200" : "transparent",
                                color: isActive ? 'var(--color-secondary)' : 'var(--color-on-surface-variant)',
                                fontSize: 12.5,
                                fontWeight: isActive ? 600 : 500,
                                textDecoration: 'none',
                                transition: 'all 0.15s',
                              })}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 16,paddingBottom:'3%' }}>  ●
</span>
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {board.name}
                              </span>
                            </NavLink>
                          </li>
                        ))
                      ) : (
                        <li>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', fontSize: 11.5, color: 'var(--color-outline)' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>info</span>
                            No boards yet
                          </div>
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

      {/* Footer Navigation */}
      <div style={{ borderTop: '1px solid var(--color-outline-variant)', paddingTop: 16, marginTop: 'auto' }}>
        
      </div>

      {/* Create Workspace Modal */}
      <Modal isOpen={isCreateWorkspaceOpen} onClose={() => setIsCreateWorkspaceOpen(false)} title="New Workspace">
        <form onSubmit={handleCreateWorkspace} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-on-surface)" }}>Workspace Name *</label>
            <input 
              required 
              placeholder="e.g. Design Team" 
              value={wsName} 
              onChange={e => setWsName(e.target.value)} 
              style={{
                padding: "10px 12px",
                border: "1px solid var(--color-outline)",
                borderRadius: 6,
                fontSize: 14,
                outline: "none"
              }}
              className="focus:border-orange-500"
            />
            {wsErrors.name && (
              <span style={{ fontSize: 12, color: "var(--color-error)", fontWeight: 500 }}>{wsErrors.name}</span>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-on-surface)" }}>Workspace Slug *</label>
            <input 
              required 
              placeholder="e.g. design-team" 
              value={wsSlug} 
              onChange={e => setWsSlug(e.target.value)} 
              style={{
                padding: "10px 12px",
                border: "1px solid var(--color-outline)",
                borderRadius: 6,
                fontSize: 14,
                outline: "none"
              }}
              className="focus:border-orange-500"
            />
            {wsErrors.slug && (
              <span style={{ fontSize: 12, color: "var(--color-error)", fontWeight: 500 }}>{wsErrors.slug}</span>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <Button variant="outline" onClick={() => setIsCreateWorkspaceOpen(false)} type="button">Cancel</Button>
            <Button variant="solid" type="submit" loading={isSubmittingWs}>Create</Button>
          </div>
        </form>
      </Modal>

      {/* Create Board Modal */}
      <Modal isOpen={boardWorkspaceId !== null} onClose={() => setBoardWorkspaceId(null)} title="New Board">
        <form onSubmit={handleCreateBoard} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-on-surface)" }}>Board Name *</label>
            <input 
              required 
              placeholder="e.g. UI Redesign" 
              value={boardName} 
              onChange={e => setBoardName(e.target.value)} 
              style={{
                padding: "10px 12px",
                border: "1px solid var(--color-outline)",
                borderRadius: 6,
                fontSize: 14,
                outline: "none"
              }}
              className="focus:border-orange-500"
            />
            {boardErrors.name && (
              <span style={{ fontSize: 12, color: "var(--color-error)", fontWeight: 500 }}>{boardErrors.name}</span>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-on-surface)" }}>Description</label>
            <textarea 
              placeholder="Board details..." 
              value={boardDesc} 
              onChange={e => setBoardDesc(e.target.value)}
              rows={3}
              style={{
                padding: "10px 12px",
                border: "1px solid var(--color-outline)",
                borderRadius: 6,
                fontSize: 14,
                outline: "none",
                resize: "vertical"
              }}
              className="focus:border-orange-500"
            />
            {boardErrors.description && (
              <span style={{ fontSize: 12, color: "var(--color-error)", fontWeight: 500 }}>{boardErrors.description}</span>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <Button variant="outline" onClick={() => setBoardWorkspaceId(null)} type="button">Cancel</Button>
            <Button variant="solid" type="submit" loading={isSubmittingBoard}>Create</Button>
          </div>
        </form>
      </Modal>
    </nav>
  )

  return (
    <>
      {/* Desktop — always shown */}
      <div className="hidden md:block" style={{ height: '100%', flexShrink: 0 }}>
        {inner}
      </div>

      {/* Mobile — overlay drawer */}
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
            onClick={onClose}
          />
          <div style={{ position: 'relative', zIndex: 10, height: '100%', animation: 'slide-in 0.3s ease-out' }}>
            {inner}
          </div>
        </div>
      )}
    </>
  )
}

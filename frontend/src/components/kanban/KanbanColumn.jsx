import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'
import { deleteColumn, updateColumn } from '../../redux/column/columnSlice'

const COLUMN_DOT_COLORS = {
  'todo': 'var(--color-outline)',
  'in progress': 'var(--color-primary)',
  'in_progress': 'var(--color-primary)',
  'review': 'var(--color-secondary)',
  'done': '#22c55e', // Green dot for done
}

export default function KanbanColumn({ columnId, title, tasks, onCardClick, activeId, children }) {
  const dispatch = useDispatch()
  const { setNodeRef, isOver } = useDroppable({ id: columnId })
  
  const titleLower = title.toLowerCase()
  const isDone = titleLower === 'done'
  const isInProgress = titleLower === 'in progress' || titleLower === 'in_progress'

  const [menuOpen, setMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(title)
  const menuRef = useRef(null)

  // Handle click outside to close dropdown menu
  useEffect(() => {
    function clickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', clickOutside)
    }
    return () => document.removeEventListener('mousedown', clickOutside)
  }, [menuOpen])

  const handleRenameSubmit = () => {
    if (editName.trim() && editName.trim() !== title) {
      dispatch(updateColumn({ id: columnId, data: { name: editName.trim() } }))
    }
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the column "${title}"?`)) {
      dispatch(deleteColumn(columnId))
      setMenuOpen(false)
    }
  }

  const dotColor = COLUMN_DOT_COLORS[titleLower] || 'var(--color-outline)'

  return (
    <div
      className="flex-shrink-0 flex flex-col border"
      style={{
        width: 'clamp(260px, 80vw, 310px)',
        height: '100%',
        minHeight: 0,
        borderRadius: '8px',
        borderStyle: isDone ? 'dashed' : 'solid',
        borderColor: 'var(--color-outline-variant)',
        backgroundColor: isDone ? 'var(--color-surface-container-lowest)' : 'var(--color-surface-container-low)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}
    >
      {/* Column Header */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0 border-b relative"
        style={{
          borderBottomStyle: isDone ? 'dashed' : 'solid',
          borderColor: 'var(--color-outline-variant)',
          borderTopLeftRadius: '0px',
          borderTopRightRadius: '0px',
          backgroundColor: isDone ? 'var(--color-surface-container-lowest)' : 'var(--color-surface-container-low)',
        }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          
          
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameSubmit()
                if (e.key === 'Escape') setIsEditing(false)
              }}
              autoFocus
              style={{
                fontSize: '13px',
                fontWeight: '600',
                padding: '2px 6px',
                border: '1px solid var(--color-primary)',
                borderRadius: '4px',
                outline: 'none',
                width: '100%',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-on-surface)',
              }}
            />
          ) : (
            <h3
              onClick={() => setIsEditing(true)}
              className="text-[13px] font-bold uppercase tracking-wider truncate cursor-pointer hover:text-[var(--color-primary)] transition-colors m-0"
              style={{ color: isDone ? 'var(--color-on-surface-variant)' : 'var(--color-on-surface)' }}
              title="Click to rename"
            >
              {title}
            </h3>
          )}

          <span
            className="text-[11px] font-bold px-2 py-0.5 "
            style={{
              backgroundColor: isInProgress ? 'var(--color-primary-container)' : 'var(--color-surface-container-high)',
              color: isInProgress ? 'var(--color-on-primary-container)' : 'var(--color-on-surface-variant)',
            }}
          >
            {tasks.length}
          </span>
        </div>

        {/* Options Button & Dropdown */}
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center cursor-pointer"
            style={{ color: 'var(--color-on-surface-variant)' }}
            aria-label="Column options"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>more_horiz</span>
          </button>

          {menuOpen && (
            <div 
              style={{
                position: 'absolute',
                top: '28px',
                right: '0px',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-outline-variant)',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                minWidth: '120px',
                padding: '4px 0'
              }}
            >
              <button
                type="button"
                onClick={() => { setIsEditing(true); setMenuOpen(false); }}
                style={{
                  padding: '8px 12px',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: 'var(--color-on-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.15s'
                }}
                className="hover:bg-slate-50"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                Rename
              </button>
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  padding: '8px 12px',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: 'var(--color-error)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.15s'
                }}
                className="hover:bg-red-50"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Drop Indicator */}
      {isOver && (
        <div
          className="mx-2 mt-1 rounded-full flex-shrink-0"
          style={{ height: 2, backgroundColor: 'var(--color-primary)', boxShadow: '0 0 8px rgba(234,88,12,0.6)' }}
        />
      )}

      {/* Cards List */}
      <SortableContext
        items={tasks.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 scrollbar-thin overflow-x-hidden"
          style={{ minHeight: 100 }}
        >
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              isDone={isDone}
              onClick={() => onCardClick(task.id)}
            />
          ))}

          {/* Empty state */}
          {tasks.length === 0 && !activeId && (
            <div
              className="flex items-center justify-center h-16 rounded-lg border border-dashed text-[12.5px] p-4 text-center"
              style={{
                borderColor: 'var(--color-outline)',
                color: 'var(--color-on-surface-variant)',
                backgroundColor: 'rgba(0,0,0,0.01)'
              }}
            >
              Drop tasks here
            </div>
          )}
          {children}
        </div>
      </SortableContext>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTask } from '../../context/TaskContext'
import Avatar from '../common/Avatar'
import Badge from '../common/Badge'
import Button from '../common/Button'

const STATUSES = ['todo', 'in-progress', 'review', 'done']
const STATUS_LABELS = { todo: 'Todo', 'in-progress': 'In Progress', review: 'In Review', done: 'Done' }
const PRIORITIES = ['low', 'medium', 'high', 'urgent']

function priorityVariant(p) {
  if (p === 'urgent') return 'urgent'
  if (p === 'high') return 'high'
  if (p === 'medium') return 'medium'
  return 'low'
}

const selectStyle = {
  backgroundColor: 'var(--color-surface-container-low)',
  color: 'var(--color-on-surface)',
  border: '1px solid var(--color-outline-variant)',
  borderRadius: 8,
  padding: '0 10px',
  height: 36,
  fontSize: 13,
  width: '100%',
  outline: 'none',
  cursor: 'pointer',
}

export default function TaskDetailsDrawer({ taskId, onClose }) {
  const { tasks, updateTask, deleteTask } = useTask()
  const task = tasks.find(t => t.id === taskId) ?? null
  const titleRef = useRef(null)
  const [localTitle, setLocalTitle] = useState('')

  // Sync local title when task changes
  useEffect(() => {
    if (task) setLocalTitle(task.title)
  }, [task?.id, task?.title])

  // Escape key closes drawer
  useEffect(() => {
    if (!taskId) return
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [taskId, onClose])

  function handleTitleBlur() {
    if (!localTitle.trim()) {
      setLocalTitle(task.title)
    } else if (localTitle !== task.title) {
      updateTask(task.id, { title: localTitle })
    }
  }

  function handleTitleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      titleRef.current?.blur()
    }
  }

  function handleDelete() {
    deleteTask(task.id)
    onClose()
  }

  const isVisible = !!taskId

  if (!isVisible) return null

  return createPortal(
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)', pointerEvents: 'all' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="relative z-50 flex flex-col h-full overflow-y-auto kanban-scroll"
        style={{
          width: 420,
          backgroundColor: 'var(--color-surface-container-lowest)',
          borderLeft: '1px solid var(--color-outline-variant)',
          transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 300ms ease-in-out',
        }}
      >
        {!task ? (
          <div className="flex items-center justify-center h-full text-[14px]"
            style={{ color: 'var(--color-on-surface-variant)' }}>
            Task not found
          </div>
        ) : (
          <>
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
              style={{ borderColor: 'var(--color-outline-variant)' }}
            >
              <span
                className="text-[12px] font-mono font-semibold tracking-wide"
                style={{ color: 'var(--color-outline)' }}
              >
                {task.id}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg transition-colors"
                style={{ color: 'var(--color-on-surface-variant)' }}
                aria-label="Close drawer"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-5 px-5 py-5 flex-1">
              {/* Editable title */}
              <input
                ref={titleRef}
                value={localTitle}
                onChange={e => setLocalTitle(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="w-full bg-transparent outline-none text-[18px] font-semibold leading-snug border-b-2 pb-1 transition-colors"
                style={{
                  color: 'var(--color-on-surface)',
                  borderBottomColor: 'var(--color-primary)',
                }}
              />

              {/* Status + Priority selects */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Status
                  </label>
                  <select
                    value={task.status}
                    onChange={e => updateTask(task.id, { status: e.target.value })}
                    style={selectStyle}
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Priority
                  </label>
                  <select
                    value={task.priority}
                    onChange={e => updateTask(task.id, { priority: e.target.value })}
                    style={selectStyle}
                  >
                    {PRIORITIES.map(p => (
                      <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Read-only: Due Date + Assignee */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-[12px] font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Due Date
                  </p>
                  <p className="text-[13px]" style={{ color: task.dueDate ? 'var(--color-on-surface)' : 'var(--color-outline)' }}>
                    {task.dueDate ?? 'No due date'}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[12px] font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Assignee
                  </p>
                  <div className="flex items-center gap-2">
                    <Avatar name={task.assignee.name} size="sm" />
                    <span className="text-[13px]" style={{ color: 'var(--color-on-surface)' }}>
                      {task.assignee.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Labels */}
              {task.labels.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-[12px] font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Labels
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {task.labels.map(label => (
                      <Badge
                        key={label}
                        label={label}
                        variant={priorityVariant(label.toLowerCase())}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="flex flex-col gap-2 flex-1">
                <p className="text-[12px] font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Description
                </p>
                <p
                  className="text-[14px] leading-relaxed min-h-[60px]"
                  style={{ color: task.description ? 'var(--color-on-surface)' : 'var(--color-outline)' }}
                >
                  {task.description || 'No description provided.'}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div
              className="px-5 py-4 border-t flex-shrink-0"
              style={{ borderColor: 'var(--color-outline-variant)' }}
            >
              <Button
                variant="danger"
                icon="delete"
                onClick={handleDelete}
                className="w-full justify-center"
              >
                Delete Task
              </Button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}

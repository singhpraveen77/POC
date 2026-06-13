import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTask } from '../../context/TaskContext'

const STATUSES = ['todo', 'in-progress', 'review', 'done']
const STATUS_LABELS = { todo: 'Todo', 'in-progress': 'In Progress', review: 'In Review', done: 'Done' }
const PRIORITIES = ['low', 'medium', 'high', 'urgent']

const TOOLBAR_ICONS = [
  { icon: 'format_bold', label: 'Bold' },
  { icon: 'format_italic', label: 'Italic' },
  { icon: 'strikethrough_s', label: 'Strikethrough' },
  { icon: 'format_list_bulleted', label: 'Bulleted List' },
  { icon: 'format_list_numbered', label: 'Numbered List' },
  { icon: 'attach_file', label: 'Attach File' },
]

function defaultState(presetStatus) {
  return {
    title: '',
    status: STATUSES.includes(presetStatus) ? presetStatus : 'todo',
    priority: 'low',
    dueDate: '',
    assignee: '',
    description: '',
    labels: [],
    labelInput: '',
    titleError: '',
  }
}

// Local TaskInput component
function TaskInput({ id, label, icon, type = 'text', placeholder, value, onChange, error }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-[13px] font-semibold text-[var(--color-on-surface-variant)] ml-1">
          {label}
        </label>
      )}
      <div 
        className="flex items-center gap-2.5 h-11 px-3.5 rounded-xl border-2 transition-all duration-200 focus-within:border-[var(--color-primary)] focus-within:ring-4 focus-within:ring-[var(--color-primary)]/10"
        style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          borderColor: error ? 'var(--color-error)' : 'var(--color-outline-variant)',
        }}
      >
        {icon && (
          <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--color-outline)' }}>
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 bg-transparent border-none outline-none text-[14px] text-[var(--color-on-surface)] placeholder-[var(--color-outline)]/60"
        />
      </div>
    </div>
  )
}

export default function CreateTaskModal({ isOpen, onClose, presetStatus = 'todo' }) {
  const { addTask } = useTask()
  const [form, setForm] = useState(() => defaultState(presetStatus))
  const containerRef = useRef(null)

  // Reset form whenever modal opens
  useEffect(() => {
    if (isOpen) setForm(defaultState(presetStatus))
  }, [isOpen, presetStatus])

  // Focus trap + Escape close
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function addLabel() {
    const trimmed = form.labelInput.trim()
    if (trimmed && !form.labels.includes(trimmed)) {
      setForm(prev => ({ ...prev, labels: [...prev.labels, trimmed], labelInput: '' }))
    }
  }

  function removeLabel(label) {
    setForm(prev => ({ ...prev, labels: prev.labels.filter(l => l !== label) }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) {
      setForm(prev => ({ ...prev, titleError: 'Title is required' }))
      return
    }
    addTask({
      title: form.title.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || null,
      assignee: form.assignee
        ? { name: form.assignee, initials: form.assignee.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) }
        : { name: 'Unassigned', initials: 'UA' },
      description: form.description,
      labels: form.labels,
    })
    onClose()
  }

  if (!isOpen) return null

  const selectClasses = "w-full h-11 px-3.5 rounded-xl border-2 bg-[var(--color-surface-container-lowest)] border-[var(--color-outline-variant)] text-[14px] text-[var(--color-on-surface)] outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all appearance-none cursor-pointer"

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-[800px] bg-[var(--color-surface-container-lowest)] rounded-2xl shadow-2xl overflow-y-auto flex flex-col h-auto max-h-[calc(100vh-2rem)] sm:max-h-[90vh]"
      >
        <form onSubmit={handleSubmit} noValidate className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface)]">
            <h2 className="text-[20px] font-bold text-[var(--color-on-surface)]">New Task</h2>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 scrollbar-thin">
            <div className="flex flex-col gap-4 sm:gap-6">
              {/* Title Input */}
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={form.title}
                  onChange={e => { set('title', e.target.value); set('titleError', '') }}
                  autoFocus
                  className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder-[var(--color-outline)] text-[var(--color-on-surface)]"
                />
                <div className={`h-0.5 w-full transition-all duration-300 ${form.titleError ? 'bg-[var(--color-error)]' : 'bg-[var(--color-primary)] opacity-30 focus-within:opacity-100'}`} />
                {form.titleError && (
                  <p className="text-[12px] font-medium text-[var(--color-error)]">{form.titleError}</p>
                )}
              </div>

              {/* Status & Priority Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[var(--color-on-surface-variant)] ml-1">Status</label>
                  <div className="relative">
                    <select
                      value={form.status}
                      onChange={e => set('status', e.target.value)}
                      className={selectClasses}
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[20px] text-[var(--color-outline)]">expand_more</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[var(--color-on-surface-variant)] ml-1">Priority</label>
                  <div className="relative">
                    <select
                      value={form.priority}
                      onChange={e => set('priority', e.target.value)}
                      className={selectClasses}
                    >
                      {PRIORITIES.map(p => (
                        <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[20px] text-[var(--color-outline)]">priority_high</span>
                  </div>
                </div>
              </div>

              {/* Date & Assignee Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TaskInput
                  id="dueDate"
                  label="Due Date"
                  type="date"
                  value={form.dueDate}
                  onChange={e => set('dueDate', e.target.value)}
                />
                <TaskInput
                  id="assignee"
                  label="Assignee"
                  icon="person"
                  placeholder="Task owner"
                  value={form.assignee}
                  onChange={e => set('assignee', e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[var(--color-on-surface-variant)] ml-1">Description</label>
                <div className="border-2 border-[var(--color-outline-variant)] rounded-2xl overflow-hidden focus-within:border-[var(--color-primary)] focus-within:ring-4 focus-within:ring-[var(--color-primary)]/10 transition-all">
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-[var(--color-surface-container-low)] border-b border-[var(--color-outline-variant)]">
                    {TOOLBAR_ICONS.map(({ icon, label }) => (
                      <button
                        key={icon}
                        type="button"
                        title={label}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">{icon}</span>
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    placeholder="Describe the task details here..."
                    rows={4}
                    className="w-full p-4 bg-[var(--color-surface-container-lowest)] text-[14px] text-[var(--color-on-surface)] outline-none resize-none placeholder-[var(--color-outline)]/60"
                  />
                </div>
              </div>

              {/* Labels */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[var(--color-on-surface-variant)] ml-1">Labels</label>
                <div className="flex flex-wrap gap-2 p-2 min-h-[44px] bg-[var(--color-surface-container-lowest)] border-2 border-[var(--color-outline-variant)] rounded-xl">
                  {form.labels.map(label => (
                    <div 
                      key={label}
                      className="flex items-center gap-1.5 px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[12px] font-bold rounded-full group transition-all"
                    >
                      <span>{label}</span>
                      <button 
                        type="button"
                        onClick={() => removeLabel(label)}
                        className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add label…"
                      value={form.labelInput}
                      onChange={e => set('labelInput', e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addLabel() } }}
                      className="bg-transparent border-none outline-none text-[13px] text-[var(--color-on-surface)] w-24 placeholder-[var(--color-outline)]/60"
                    />
                    <button
                      type="button"
                      onClick={addLabel}
                      className="text-[13px] font-bold text-[var(--color-primary)] hover:underline"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-4 bg-[var(--color-surface)] border-t border-[var(--color-outline-variant)] flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 sm:px-5 h-10 sm:h-11 rounded-xl text-[13px] sm:text-[14px] font-bold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 sm:px-6 h-10 sm:h-11 bg-[var(--color-primary)] text-white text-[13px] sm:text-[14px] font-bold rounded-xl shadow-lg shadow-[var(--color-primary)]/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">add_task</span>
              <span>Create Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}


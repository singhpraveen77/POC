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


// Custom responsive dropdown component
function ResponsiveDropdown({ label, options, value, onChange, icon }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)


  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen])


  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])


  const selectedLabel = value 
    ? options.find(opt => opt.value === value)?.label || options[0]?.label 
    : options[0]?.label


  return (
    <div className="flex flex-col gap-1.5 min-w-0 relative" ref={dropdownRef}>
      {label && (
        <label className="text-[13px] font-semibold text-[var(--color-on-surface-variant)] ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-11 pl-3.5 pr-10 rounded-xl border-2 bg-[var(--color-surface-container-lowest)] border-[var(--color-outline-variant)] text-[14px] text-[var(--color-on-surface)] outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all flex items-center justify-between"
        >
          <span className="flex items-center gap-2 text-left">
            {icon && (
              <span className="material-symbols-outlined text-[20px] text-[var(--color-outline)]">
                {icon}
              </span>
            )}
            <span className="truncate">{selectedLabel}</span>
          </span>
          <span className="material-symbols-outlined text-[20px] text-[var(--color-outline)]">
            {isOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>


        {/* Dropdown menu - positioned absolutely but constrained to viewport */}
        {isOpen && (
          <div 
            className="absolute z-50 w-full mt-1 bg-[var(--color-surface-container-lowest)] border-2 border-[var(--color-outline-variant)] rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto scrollbar-thin"
            style={{
              // Ensure dropdown stays within viewport
              left: '0',
              right: '0',
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className="w-full px-3.5 py-2.5 text-[14px] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-colors flex items-center gap-2 text-left"
                style={{
                  backgroundColor: value === option.value ? 'var(--color-primary)/10' : 'transparent'
                }}
              >
                {option.value === value && (
                  <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">
                    check
                  </span>
                )}
                <span className={value === option.value ? 'text-[var(--color-primary)] font-semibold' : ''}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


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
    <div className="flex flex-col gap-1.5 w-full min-w-0">
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
          className="flex-1 bg-transparent border-none outline-none text-[14px] text-[var(--color-on-surface)] placeholder-[var(--color-outline)]/60 min-w-0"
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


  // Dropdown options
  const statusOptions = STATUSES.map(s => ({ value: s, label: STATUS_LABELS[s] }))
  const priorityOptions = PRIORITIES.map(p => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) }))
  const assigneeOptions = [
    { value: '', label: 'Select Assignee' },
    { value: 'Praveen Singh', label: 'Praveen Singh' },
    { value: 'John Doe', label: 'John Doe' },
    { value: 'Jane Smith', label: 'Jane Smith' },
    { value: 'Alex Johnson', label: 'Alex Johnson' },
  ]
  const labelOptions = [
    { value: '', label: 'Choose a Label...' },
    { value: 'Feature', label: '✨ Feature' },
    { value: 'Bug', label: '🐛 Bug' },
    { value: 'Design', label: '🎨 Design' },
    { value: 'Frontend', label: '💻 Frontend' },
    { value: 'Backend', label: '⚙️ Backend' },
    { value: 'Urgent', label: '🚨 Urgent' },
  ]


  // Description toolbar
  const DescriptionToolbar = () => (
    <div className="border-2 border-[var(--color-outline-variant)] rounded-2xl overflow-hidden focus-within:border-[var(--color-primary)] focus-within:ring-4 focus-within:ring-[var(--color-primary)]/10 transition-all">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-[var(--color-surface-container-low)] border-b border-[var(--color-outline-variant)] overflow-x-auto scrollbar-thin">
        {TOOLBAR_ICONS.map(({ icon, label }) => (
          <button
            key={icon}
            type="button"
            title={label}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] transition-colors shrink-0"
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
  )


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
                <ResponsiveDropdown
                  label="Status"
                  options={statusOptions}
                  value={form.status}
                  onChange={(val) => set('status', val)}
                />


                <ResponsiveDropdown
                  label="Priority"
                  options={priorityOptions}
                  value={form.priority}
                  onChange={(val) => set('priority', val)}
                />
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
                <ResponsiveDropdown
                  label="Assignee"
                  options={assigneeOptions}
                  value={form.assignee}
                  onChange={(val) => set('assignee', val)}
                  icon="person"
                />
              </div>


              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[var(--color-on-surface-variant)] ml-1">Description</label>
                <DescriptionToolbar />
              </div>


              {/* Labels - Responsive custom dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[var(--color-on-surface-variant)] ml-1">Labels</label>
                <div className="flex flex-col gap-3 p-3 sm:p-4 bg-[var(--color-surface-container-lowest)] border-2 border-[var(--color-outline-variant)] rounded-xl">
                  <ResponsiveDropdown
                    label={null}
                    options={labelOptions}
                    value=""
                    onChange={(val) => { 
                      if (val) { 
                        setForm(prev => ({ ...prev, labels: [...new Set([...prev.labels, val])] })) 
                      } 
                    }}
                    icon="sell"
                  />


                  {/* Active labels display - responsive with better wrapping */}
                  <div className="flex flex-wrap gap-2 min-w-0">
                    {form.labels.length === 0 && (
                      <p className="text-[12px] text-[var(--color-outline)] italic">No labels selected</p>
                    )}
                    {form.labels.map(label => (
                      <div 
                        key={label}
                        className="flex items-center gap-1.5 px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[12px] font-bold rounded-full group transition-all shrink-0"
                      >
                        <span>{label}</span>
                        <button 
                          type="button"
                          onClick={() => removeLabel(label)}
                          className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-colors shrink-0"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </div>
                    ))}
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
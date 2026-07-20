import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function TaskCard({ task, isDone = false, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    touchAction: 'none',
    userSelect: 'none',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        onClick={onClick}
        className="group relative flex flex-col gap-2.5 p-3 border cursor-pointer transition-none select-none"
        style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          borderColor: 'var(--color-outline-variant)',
          opacity: isDone ? 0.5 : 1,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" ,
          borderRadius:"10px"       
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--color-primary)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--color-outline-variant)'
        }}
      >
        {/* Edit button on hover */}
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onClick() }}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
          style={{ color: 'var(--color-outline)' }}
          aria-label="Edit task"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>edit</span>
        </button>

        {/* ID */}
        <span
          className="font-mono text-[11px] font-semibold tracking-wide"
          style={{ color: 'var(--color-outline)' }}
        >
          {task.id}
        </span>

        {/* Title */}
        {isDone ? (
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-surface-tint)' }}>
              check_circle
            </span>
            <span
              className="text-[13px] font-medium leading-snug line-through"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              {task.title}
            </span>
          </div>
        ) : (
          <p className="text-[13px] font-medium leading-snug pr-5" style={{ color: 'var(--color-on-surface)' }}>
            {task.title}
          </p>
        )}

        {/* Progress bar (in-progress only) */}
        {task.status === 'in-progress' && task.progress != null && (
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: 4, backgroundColor: 'var(--color-surface-variant)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${task.progress}%`,
                backgroundColor: 'var(--color-primary)',
              }}
            />
          </div>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-2 border-t"
          style={{ borderColor: 'var(--color-outline-variant)' }}
        >
          {/* Due date or comment count */}
          <div className="flex items-center gap-1 text-[12px]" style={{ color: 'var(--color-on-surface-variant)' }}>
            {task.dueDate ? (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>calendar_today</span>
                <span>{formatDate(task.dueDate)}</span>
              </>
            ) : task.comments > 0 ? (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>comment</span>
                <span>{task.comments}</span>
              </>
            ) : null}
          </div>

          {/* Assignee initial */}
          {task.assignee?.name && (
            <div style={{ 
              width: 20, height: 20, backgroundColor: 'var(--color-primary-container)', 
              color: 'var(--color-on-primary-container)', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', fontWeight: 'bold', fontSize: 10 
            }}>
              {task.assignee.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

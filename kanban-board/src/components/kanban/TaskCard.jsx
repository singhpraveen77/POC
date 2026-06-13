import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Avatar from '../common/Avatar'
import Badge from '../common/Badge'

function priorityVariant(priority) {
  if (priority === 'urgent') return 'urgent'
  if (priority === 'high') return 'high'
  if (priority === 'medium') return 'medium'
  return 'low'
}

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
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        onClick={onClick}
        className="group relative flex flex-col gap-2.5 p-3 rounded-lg border cursor-pointer transition-all duration-150 select-none"
        style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          borderColor: 'var(--color-outline-variant)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          opacity: isDone ? 0.5 : 1,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--color-primary)'
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(33,112,228,0.15)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--color-outline-variant)'
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
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

        {/* Labels / Badges */}
        {task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.labels.map(label => (
              <Badge
                key={label}
                label={label}
                variant={
                  label.toLowerCase() === 'urgent' || task.priority === 'urgent'
                    ? 'urgent'
                    : label.toLowerCase() === 'high' || task.priority === 'high'
                      ? 'high'
                      : 'default'
                }
              />
            ))}
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

          {/* Assignee avatar */}
          <Avatar name={task.assignee.name} src={task.assignee.avatar} size="sm" />
        </div>
      </div>
    </div>
  )
}

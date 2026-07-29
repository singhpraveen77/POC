import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function formatDate(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function TaskCard({ task, isDone = false, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  return (
    <div ref={setNodeRef}
         style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0 : 1, touchAction: 'none', userSelect: 'none' }}
         {...attributes} {...listeners}>
      <div
        onClick={onClick}
        className="group relative flex flex-col gap-2.5 p-3.5 rounded-lg cursor-pointer select-none transition-all duration-150 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-btn)] hover:-translate-y-px"
      >
        {}
        <button type="button" onClick={e => { e.stopPropagation(); onClick() }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded bg-transparent border-none cursor-pointer text-[var(--color-text-subtle)]"
                aria-label="Edit task">
          <span className="material-symbols-outlined text-[13px]">edit</span>
        </button>

        {isDone ? (
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[15px] text-[var(--color-text-subtle)]">check_circle</span>
            <span className="text-[12.5px] font-medium leading-snug line-through text-[var(--color-text-subtle)]">{task.title}</span>
          </div>
        ) : (
          <p className="text-[12.5px] font-medium leading-snug pr-4 m-0 text-[var(--color-text)]">{task.title}</p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-subtle)]">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>
          {task.assignee?.name && (
            <div className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 bg-[var(--color-profile)] text-[var(--color-profile-text)]">
              {task.assignee.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
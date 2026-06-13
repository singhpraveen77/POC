import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'

const COLUMN_DOT_COLORS = {
  'todo': 'var(--color-outline-variant)',
  'in-progress': 'var(--color-primary)',
  'review': 'var(--color-secondary)',
  'done': 'var(--color-surface-tint)',
}

export default function KanbanColumn({ columnId, title, tasks, onCardClick, activeId }) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId })
  const isDone = columnId === 'done'
  const isInProgress = columnId === 'in-progress'

  return (
    <div
      className="flex-shrink-0 flex flex-col rounded-xl border"
      style={{
        width: 'clamp(240px, 75vw, 300px)', // Fixed width per column: 75vw on mobile, 300px on desktop
        height: '100%',
        minHeight: 0,
        borderStyle: isDone ? 'dashed' : 'solid',
        borderColor: 'var(--color-outline-variant)',
        backgroundColor: isDone ? 'var(--color-surface-container-lowest)' : 'var(--color-surface-container-low)',
        opacity: isDone ? 0.85 : 1,
      }}
    >
      {/* Column header */}
      <div
        className="flex items-center justify-between px-3 py-2.5 rounded-t-xl flex-shrink-0 border-b"
        style={{
          borderBottomStyle: isDone ? 'dashed' : 'solid',
          borderColor: 'var(--color-outline-variant)',
          backgroundColor: isDone ? 'var(--color-surface-container-lowest)' : 'var(--color-surface-container-low)',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${isInProgress ? 'animate-pulse' : ''}`}
            style={{ backgroundColor: COLUMN_DOT_COLORS[columnId] }}
          />
          <h3
            className="text-[12px] font-semibold uppercase tracking-wider"
            style={{ color: isDone ? 'var(--color-on-surface-variant)' : 'var(--color-on-surface)' }}
          >
            {title}
          </h3>
          <span
            className="text-[11px] font-bold px-1.5 py-0.5 rounded-md"
            style={{
              backgroundColor: isInProgress ? 'var(--color-primary-container)' : 'var(--color-surface-container)',
              color: isInProgress ? 'var(--color-on-primary-container)' : 'var(--color-on-surface-variant)',
            }}
          >
            {tasks.length}
          </span>
        </div>
        <button
          type="button"
          className="p-1 rounded transition-colors"
          style={{ color: 'var(--color-outline)' }}
          aria-label="Column options"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>more_horiz</span>
        </button>
      </div>

      {/* Drop indicator */}
      {isOver && (
        <div
          className="mx-2 mt-1 rounded-full"
          style={{ height: 2, backgroundColor: 'var(--color-primary)', boxShadow: '0 0 8px rgba(33,112,228,0.6)' }}
        />
      )}

      {/* Cards list */}
      <SortableContext
        items={tasks.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className="flex-1 overflow-y-auto p-2 flex flex-col gap-2 scrollbar-thin overflow-x-hidden"
          style={{ minHeight: 80 }}
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
              className="flex items-center justify-center h-16 rounded-lg border border-dashed text-[12px]"
              style={{
                borderColor: 'var(--color-outline-variant)',
                color: 'var(--color-outline)',
              }}
            >
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

import EmptyState from './EmptyState.jsx'

export default function RecentTasks({ tasks }) {
  return (
    <div className="p-5 bg-[var(--color-surface-low)] border border-[var(--color-border)]">
      <h3 className="m-0 mb-4 text-[15px] font-semibold text-[var(--color-text)]">Recent Tasks</h3>
      {tasks.length === 0 ? <EmptyState message="No recent tasks." /> : (
        <div className="flex flex-col gap-2.5">
          {tasks.map(task => (
            <div key={task.id} className="p-3.5 bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="font-semibold text-[13.5px] text-[var(--color-text)]">{task.title}</div>
              {task.description && (
                <div className="mt-1 text-[12.5px] text-[var(--color-text-muted)]">{task.description}</div>
              )}
              <div className="mt-2 flex justify-between text-[11.5px] text-[var(--color-text-subtle)]">
                <span>Status: <span className="text-[var(--color-btn)]">{task.status}</span></span>
                {task.priority && <span>Priority: {task.priority}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
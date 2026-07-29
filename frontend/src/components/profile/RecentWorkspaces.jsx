import WorkspaceCard from './WorkspaceCard.jsx'
import EmptyState from './EmptyState.jsx'

export default function RecentWorkspaces({ workspaces }) {
  return (
    <div className="p-5 bg-[var(--color-surface-low)] border border-[var(--color-border)]">
      <h3 className="m-0 mb-4 text-[15px] font-semibold text-[var(--color-text)]">Workspaces</h3>
      {workspaces.length === 0 ? <EmptyState message="No recent workspaces." /> : (
        <div className="flex flex-col gap-2.5">
          {workspaces.map(ws => <WorkspaceCard key={ws.id} workspace={ws} />)}
        </div>
      )}
    </div>
  )
}
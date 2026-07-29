import Button from '../common/Button'
export default function BoardHeader({ board, currentUserRole, onRefresh, onAddColumn }) {
  return (
    <div className="shrink-0 px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between gap-3">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-xl font-extrabold m-0 text-[var(--color-text)]">{board.name}</h1>
        <p className="text-[12.5px] font-semibold m-0 text-[var(--color-text-muted)]">
          {board.columns?.length || 0} columns
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm"  onClick={onRefresh}>Refresh</Button>
        {currentUserRole !== 'VIEWER' && (
          <Button variant="solid" icon="add" onClick={onAddColumn}>Column</Button>
        )}
      </div>
    </div>
  )
}
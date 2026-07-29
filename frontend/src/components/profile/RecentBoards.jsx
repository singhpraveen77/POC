import BoardCard from './BoardCard.jsx'
import EmptyState from './EmptyState.jsx'

export default function RecentBoards({ boards }) {
  return (
    <div className="p-5 bg-[var(--color-surface-low)] border border-[var(--color-border)]">
      <h3 className="m-0 mb-4 text-[15px] font-semibold text-[var(--color-text)]">Boards</h3>
      {boards.length === 0 ? <EmptyState message="No recent boards." /> : (
        <div className="flex flex-col gap-2.5">
          {boards.map(board => <BoardCard key={board.id} board={board} />)}
        </div>
      )}
    </div>
  )
}
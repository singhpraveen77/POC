import BoardCard from "./BoardCard";
import EmptyState from "./EmptyState";

export default function RecentBoards({ boards }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="m-0 mb-5 text-xl">Recent Boards</h3>
      {boards.length === 0 ? (
        <EmptyState message="No recent boards found." />
      ) : (
        <div className="flex flex-col gap-3.5">
          {boards.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}
        </div>
      )}
    </div>
  );
}

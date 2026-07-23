import BoardCard from "./BoardCard";
import EmptyState from "./EmptyState";

export default function RecentBoards({ boards }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        padding: 20,
      }}
    >
      <h3
        style={{
          margin: 0,
          marginBottom: 20,
          fontSize: 20,
        }}
      >
        Recent Boards
      </h3>

      {boards.length === 0 ? (
        <EmptyState message="No recent boards found." />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
            />
          ))}
        </div>
      )}
    </div>
  );
}
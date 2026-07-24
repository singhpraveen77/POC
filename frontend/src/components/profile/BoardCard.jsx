import { useNavigate } from "react-router-dom";

export default function BoardCard({ board }) {
  const navigate = useNavigate();

  const createdDate = new Date(board.createdAt).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  return (
    <div
      onClick={() => navigate(`/boards/${board.id}`)}
      style={{
        padding: 16,
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        cursor: "pointer",
        background: "#fff",
        transition: "0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#f9fafb";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#fff";
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#111827",
        }}
      >
        > {board.name}
      </div>

      <div
        style={{
          marginTop: 6,
          fontSize: 13,
          color: "#6b7280",
        }}
      >
        Created {createdDate}
      </div>
    </div>
  );
}
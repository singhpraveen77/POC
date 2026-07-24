import { useNavigate } from "react-router-dom";

export default function WorkspaceCard({ workspace }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/workspaces/${workspace.id}`)}
      style={{
        padding: 16,
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        cursor: "pointer",
        transition: "0.2s",
        background: "#fff",
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
          fontWeight: 600,
          fontSize: 16,
          color: "#111827",
        }}
      >
        -> {workspace.name}
      </div>

      <div
        style={{
          marginTop: 6,
          fontSize: 13,
          color: "#6b7280",
        }}
      >
        Slug: {workspace.slug}
      </div>
    </div>
  );
}
import WorkspaceCard from "./WorkspaceCard";
import EmptyState from "./EmptyState";

export default function RecentWorkspaces({ workspaces }) {
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
        Recent Workspaces
      </h3>

      {workspaces.length === 0 ? (
        <EmptyState message="No recent workspaces found." />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {workspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
            />
          ))}
        </div>
      )}
    </div>
  );
}
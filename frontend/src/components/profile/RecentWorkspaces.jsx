import WorkspaceCard from "./WorkspaceCard.jsx";
import EmptyState from "./EmptyState.jsx";

export default function RecentWorkspaces({ workspaces }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="m-0 mb-5 text-xl">Recent Workspaces</h3>
      {workspaces.length === 0 ? (
        <EmptyState message="No recent workspaces found." />
      ) : (
        <div className="flex flex-col gap-3.5">
          {workspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      )}
    </div>
  );
}

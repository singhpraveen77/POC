import { useNavigate } from "react-router-dom";

export default function WorkspaceCard({ workspace }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/workspaces/${workspace.id}`)}
      className="p-4 border border-gray-200 rounded-[10px] cursor-pointer transition-colors duration-200 bg-white hover:bg-gray-50"
    >
      <div className="font-semibold text-base text-gray-900">
        {"->"} {workspace.name}
      </div>
      <div className="mt-1.5 text-[13px] text-gray-500">
        Slug: {workspace.slug}
      </div>
    </div>
  );
}

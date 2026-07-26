import { useNavigate } from "react-router-dom";

export default function BoardCard({ board }) {
  const navigate = useNavigate();

  const createdDate = new Date(board.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      onClick={() => navigate(`/boards/${board.id}`)}
      className="p-4 border border-gray-200 rounded-[10px] cursor-pointer bg-white transition-colors duration-200 hover:bg-gray-50"
    >
      <div className="text-base font-semibold text-gray-900">
        {">"} {board.name}
      </div>
      <div className="mt-1.5 text-[13px] text-gray-500">
        Created {createdDate}
      </div>
    </div>
  );
}

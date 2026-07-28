import EmptyState from "./EmptyState.jsx";

export default function RecentTasks({ tasks }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="m-0 mb-5 text-xl">Recent Tasks</h3>
      {tasks.length === 0 ? (
        <EmptyState message="No recent tasks found." />
      ) : (
        <div className="flex flex-col gap-3.5">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 border border-gray-200 rounded-[10px] bg-white">
              <div className="font-semibold text-base text-gray-900">{task.title}</div>
              {task.description && (
                <div className="mt-1.5 text-gray-500 text-sm">{task.description}</div>
              )}
              <div className="mt-2.5 flex justify-between text-[13px] text-gray-400">
                <span>Status: {task.status}</span>
                {task.priority && <span>Priority: {task.priority}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

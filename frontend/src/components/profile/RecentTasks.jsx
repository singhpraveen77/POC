import EmptyState from "./EmptyState";

export default function RecentTasks({ tasks }) {
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
        Recent Tasks
      </h3>

      {tasks.length === 0 ? (
        <EmptyState message="No recent tasks found." />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                padding: 16,
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                background: "#fff",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  color: "#111827",
                }}
              >
                {task.title}
              </div>

              {task.description && (
                <div
                  style={{
                    marginTop: 6,
                    color: "#6b7280",
                    fontSize: 14,
                  }}
                >
                  {task.description}
                </div>
              )}

              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  color: "#9ca3af",
                }}
              >
                <span>Status: {task.status}</span>

                {task.priority && (
                  <span>Priority: {task.priority}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
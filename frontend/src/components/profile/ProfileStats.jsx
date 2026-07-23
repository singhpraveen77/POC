import StatsCard from "./StatsCard";

export default function ProfileStats({ stats }) {
  const statItems = [
    {
      title: "Workspaces",
      value: stats.workspaces,
    },
    {
      title: "Boards Created",
      value: stats.boardsCreated,
    },
    {
      title: "Tasks Created",
      value: stats.tasksCreated,
    },
    {
      title: "Assigned Tasks",
      value: stats.assignedTasks,
    },
    {
      title: "Completed Tasks",
      value: stats.completedTasks,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 20,
      }}
    >
      {statItems.map((item) => (
        <StatsCard
          key={item.title}
          title={item.title}
          value={item.value}
        />
      ))}
    </div>
  );
}
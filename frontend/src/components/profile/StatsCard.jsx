export default function StatsCard({ title, value }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minHeight: 100,
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize: 14,
          color: "#6b7280",
          fontWeight: 500,
        }}
      >
        {title}
      </span>

      <span
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "#111827",
        }}
      >
        {value}
      </span>
    </div>
  );
}
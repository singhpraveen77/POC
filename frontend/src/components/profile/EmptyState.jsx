export default function EmptyState({ message }) {
  return (
    <div
      style={{
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#6b7280",
        textAlign: "center",
      }}
    >

      <p
        style={{
          margin: 0,
          fontSize: 15,
        }}
      >
        {message}
      </p>
    </div>
  );
}
export default function ProfileAvatar({ name }) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "lightgrey",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "38px",
          fontWeight: "700",
          userSelect: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        {initial}
      </div>
    </div>
  );
}
export default function ProfileInfoCard({
  title,
  subtitle,
  children,
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "12px",
        padding: "32px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        border: "1px solid #e5e7eb",
      }}
    >
      {title && (
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "700",
              color: "#111827",
            }}
          >
            {title}
          </h2>

          {subtitle && (
            <p
              style={{
                marginTop: "8px",
                marginBottom: 0,
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
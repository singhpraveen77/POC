export const BoardSkeleton = () => (
  <div className="animate-pulse" style={{
    padding: 24,
    backgroundColor: "var(--color-surface-container-low)",
    border: "1px solid var(--color-outline-variant)",
    borderRadius: "8px",
    height: "108px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  }}>
    <div style={{ height: 18, backgroundColor: "var(--color-surface-container-high)", borderRadius: 4, width: "60%" }}> </div>
    <div style={{ height: 14, backgroundColor: "var(--color-surface-container-high)", borderRadius: 4, width: "45%" }}></div>
  </div>
);
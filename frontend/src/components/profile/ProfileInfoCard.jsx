export default function ProfileInfoCard({ title, subtitle, children }) {
  return (
    <div className="p-6 bg-[var(--color-surface-low)] border border-[var(--color-border)]">
      {title && (
        <div className="mb-5">
          <h2 className="m-0 text-xl font-bold text-[var(--color-text)]">{title}</h2>
          {subtitle && <p className="mt-1 mb-0 text-sm text-[var(--color-text-muted)]">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}
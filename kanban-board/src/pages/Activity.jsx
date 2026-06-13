export default function Activity() {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-64 gap-3">
      <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-outline)' }}>
        history
      </span>
      <h2 className="text-style-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
        Activity
      </h2>
      <p className="text-[14px]" style={{ color: 'var(--color-on-surface-variant)' }}>
        Coming soon — a full audit log of all team activity.
      </p>
    </div>
  )
}

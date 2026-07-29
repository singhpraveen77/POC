export default function StatsCard({ title, value }) {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-2 min-h-[90px] justify-center bg-[var(--color-surface-low)] border border-[var(--color-border)]">
      <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">{title}</span>
      <span className="text-[30px] font-bold">{value}</span>
    </div>
  )
}
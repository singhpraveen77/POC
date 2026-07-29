export const BoardSkeleton = () => (
  <div className="animate-pulse p-6 rounded-lg h-[108px] flex flex-col gap-3 bg-[var(--color-surface-low)] border border-[var(--color-border)]">
    <div className="h-4 rounded bg-[var(--color-surface-high)] w-3/5" />
    <div className="h-3 rounded bg-[var(--color-surface-high)] w-2/5" />
  </div>
)
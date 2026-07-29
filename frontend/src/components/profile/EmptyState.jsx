export default function EmptyState({ message }) {
  return (
    <div className="py-8 px-5 flex flex-col items-center justify-center text-center">
      <span className="material-symbols-outlined text-[36px] mb-2 text-[var(--color-text-subtle)]">inbox</span>
      <p className="m-0 text-[14px] text-[var(--color-text-muted)]">{message}</p>
    </div>
  )
}
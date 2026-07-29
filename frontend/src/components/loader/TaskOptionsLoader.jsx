import { TailSpin } from 'react-loader-spinner'

export default function TaskOptionsLoader() {
  return (
    <div className="w-full min-h-[360px] flex flex-col items-center justify-center gap-3">
      <TailSpin height={44} width={44} color="#669DF1" ariaLabel="loading" />
      <span className="text-sm text-[var(--color-text-muted)]">Just a moment…</span>
    </div>
  )
}
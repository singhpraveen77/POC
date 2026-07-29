import { TailSpin } from 'react-loader-spinner'
export default function MainLoader({ message = 'Loading…' }) {
  return (
    <div className="w-full h-screen flex items-center justify-center gap-4 p-8">
      <TailSpin height={48} width={48} color="#669DF1" ariaLabel="loading" />
      <span className="text-base font-medium text-[var(--color-text-muted)]">{message}</span>
    </div>
  )
}
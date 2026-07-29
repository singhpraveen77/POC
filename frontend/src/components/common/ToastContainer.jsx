import { useSelector, useDispatch } from 'react-redux'
import { removeToast } from '../../redux/toast/toastSlice'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

const TYPE_CLS = {
  success: 'bg-[var(--color-success)] text-white',
  error:   'bg-[var(--color-error-bg)] text-[var(--color-error)]',
  warning: 'bg-[var(--color-surface-high)] text-[var(--color-warning)]',
  info:    'bg-[var(--color-btn)] text-[var(--color-btn-text)]',
}

function Toast({ id, message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(() => onClose(id), 3000)
    return () => clearTimeout(t)
  }, [id, onClose])

  return (
    <div className={`flex items-center justify-between gap-4 px-4 py-3 rounded-lg shadow-lg min-w-[240px] text-[13.5px] font-medium ${TYPE_CLS[type] || TYPE_CLS.info}`}>
      <span>{message}</span>
      <button onClick={() => onClose(id)} className="bg-transparent border-none cursor-pointer opacity-70 hover:opacity-100 text-inherit">
        <span className="material-symbols-outlined text-[17px]">close</span>
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const toasts = useSelector(state => state.toast.toasts)
  const dispatch = useDispatch()
  const handleClose = id => dispatch(removeToast(id))

  if (!toasts.length) return null
  return createPortal(
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">
      {toasts.map(t => <Toast key={t.id} {...t} onClose={handleClose} />)}
    </div>,
    document.body
  )
}
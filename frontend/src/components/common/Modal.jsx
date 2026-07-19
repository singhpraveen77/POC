import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({ isOpen, onClose, title, children, className = '' }) {
  const containerRef = useRef(null)

  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return

    const prev = document.activeElement

    const focusable = containerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable?.length) {
      const inputs = Array.from(focusable).filter(el => el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT');
      if (inputs.length > 0) {
        inputs[0].focus();
      } else {
        focusable[0].focus();
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const els = Array.from(
        containerRef.current?.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      )
      if (!els.length) return
      const first = els[0]
      const last = els[els.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      prev?.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Container */}
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={`relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${className}`}
        style={{ backgroundColor: 'var(--color-surface-container-lowest)' }}
      >
        {title && (
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: 'var(--color-outline-variant)' }}
          >
            <h2
              id="modal-title"
              className="text-style-headline-sm"
              style={{ color: 'var(--color-on-surface)' }}
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg transition-colors"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body
  )
}

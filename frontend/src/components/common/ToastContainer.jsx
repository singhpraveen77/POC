import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../../redux/toast/toastSlice';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const Toast = ({ id, message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const bgColors = {
    info: 'var(--color-primary-container)',
    success: 'var(--color-secondary-container)',
    error: 'var(--color-error-container)',
    warning: 'var(--color-surface-variant)',
  };

  const textColors = {
    info: 'var(--color-on-primary-container)',
    success: 'var(--color-on-secondary-container)',
    error: 'var(--color-on-error-container)',
    warning: 'var(--color-on-surface-variant)',
  };

  return (
    <div
      style={{
        backgroundColor: bgColors[type] || bgColors.info,
        color: textColors[type] || textColors.info,
        padding: '12px 20px',
        borderRadius: '8px',
        marginBottom: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minWidth: '250px',
        fontSize: '14px',
        fontWeight: '500',
      }}
    >
      <span>{message}</span>
      <button
        onClick={() => onClose(id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          marginLeft: '15px',
          color: 'inherit',
          opacity: 0.7,
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
      </button>
    </div>
  );
};

export default function ToastContainer() {
  const toasts = useSelector((state) => state.toast.toasts);
  const dispatch = useDispatch();

  const handleClose = (id) => {
    dispatch(removeToast(id));
  };

  if (toasts.length === 0) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={handleClose} />
      ))}
    </div>,
    document.body
  );
}

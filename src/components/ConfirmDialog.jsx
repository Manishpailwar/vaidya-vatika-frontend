import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = 'Yes', confirmColor = '#e53935' }) {
  const confirmRef = useRef(null)

  useEffect(() => {
    if (open && confirmRef.current) {
      confirmRef.current.focus()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 16px',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div style={{
        background: '#fff',
        borderRadius: 24,
        padding: '36px 32px',
        maxWidth: 400,
        width: '100%',
        boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>
          {confirmColor === '#e53935' ? '⚠️' : '🚪'}
        </div>
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--bark)', marginBottom: 10 }}>
          {title}
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 28, lineHeight: 1.6 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '12px 0', borderRadius: 50,
              border: '2px solid rgba(45,80,22,0.15)',
              background: '#fff', color: 'var(--text-mid)',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
              fontFamily: 'Lato, sans-serif',
            }}>
            No, Keep It
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            style={{
              flex: 1, padding: '12px 0', borderRadius: 50,
              border: 'none',
              background: confirmColor, color: '#fff',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
              fontFamily: 'Lato, sans-serif',
              boxShadow: `0 4px 14px ${confirmColor}55`,
            }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
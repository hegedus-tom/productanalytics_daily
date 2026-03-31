import { useEffect } from 'react'

export default function DeleteViewModal({ viewName, onConfirm, onClose }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 300, backdropFilter: 'blur(2px)' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        background: 'white', borderRadius: 14, zIndex: 301, width: 380,
        boxShadow: '0 20px 60px rgba(0,0,0,0.18)', padding: '28px 24px',
        animation: 'fadeUp 0.18s ease',
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Delete this view?</div>
        <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 24, lineHeight: 1.5 }}>
          <span style={{ fontWeight: 600, color: '#374151' }}>"{viewName}"</span> will be permanently removed from your sidebar.
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}
          >Cancel</button>
          <button
            onClick={onConfirm}
            style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#DC2626', fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}
          >Yes, delete</button>
        </div>
      </div>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translate(-50%,-46%); } to { opacity:1; transform:translate(-50%,-50%); } }`}</style>
    </>
  )
}

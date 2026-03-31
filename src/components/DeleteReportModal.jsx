import { useEffect } from 'react'

export default function DeleteReportModal({ onConfirm, onClose }) {
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
        background: 'white', borderRadius: 16, zIndex: 301, width: 460,
        boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        animation: 'fadeUp 0.18s ease',
      }}>
        {/* Header */}
        <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Delete Report</span>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, color: '#9CA3AF', lineHeight: 1, padding: 0, fontFamily: 'inherit' }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', borderBottom: '1px solid #F3F4F6' }}>
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.65, margin: 0 }}>
            Are you sure you want to delete this report and all its views? This action cannot be undone. Please confirm if you want to proceed with the deletion.
          </p>
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 24px', display: 'flex', gap: 12 }}>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: '12px', borderRadius: 10, border: 'none',
              background: '#DC2626', fontSize: 15, fontWeight: 700, color: 'white',
              cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            Delete
          </button>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid #E5E7EB', background: 'white', fontSize: 15, fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}
          >Cancel</button>
        </div>
      </div>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translate(-50%,-46%); } to { opacity:1; transform:translate(-50%,-50%); } }`}</style>
    </>
  )
}

import { useState, useEffect, useRef } from 'react'

export default function RenameReportModal({ currentName, onSave, onClose }) {
  const [name, setName] = useState(currentName)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.select()
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
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Rename report</span>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, color: '#9CA3AF', lineHeight: 1, padding: 0, fontFamily: 'inherit' }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 10 }}>Edit name</label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && name.trim()) { onSave(name.trim()); onClose() } }}
            style={{
              width: '100%', padding: '12px 14px', border: '1px solid #E5E7EB', borderRadius: 10,
              fontSize: 14, color: '#111827', background: '#F9FAFB', outline: 'none',
              fontFamily: 'inherit', boxSizing: 'border-box',
            }}
            onFocus={e => { e.target.style.background = 'white'; e.target.style.borderColor = '#A78BFA' }}
            onBlur={e => { e.target.style.background = '#F9FAFB'; e.target.style.borderColor = '#E5E7EB' }}
          />
        </div>

        {/* Footer */}
        <div style={{ padding: '0 24px 24px', display: 'flex', gap: 12 }}>
          <button
            onClick={() => { if (name.trim()) { onSave(name.trim()); onClose() } }}
            disabled={!name.trim()}
            style={{
              flex: 1, padding: '12px', borderRadius: 10, border: 'none',
              background: name.trim() ? '#7C3AED' : '#DDD6FE',
              fontSize: 15, fontWeight: 700, color: 'white',
              cursor: name.trim() ? 'pointer' : 'default', fontFamily: 'inherit',
            }}
          >Save</button>
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

import { useState, useEffect, useRef } from 'react'

export default function SaveViewModal({ filters, onSave, onClose }) {
  const [name, setName] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) return
    onSave(trimmed, filters)
    onClose()
  }

  const OP_LABEL = { gt: '>', lt: '<', eq: '=' }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 200, backdropFilter: 'blur(2px)' }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white', borderRadius: 14, zIndex: 201,
        width: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        animation: 'fadeUp 0.18s ease',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid #F3F4F6' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Save view</div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>Save your current filters as a named view</div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer', fontSize: 15, color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}
          >×</button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 22px' }}>
          {/* Active filters summary */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active filters</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {filters.map(f => (
                <span key={f.key} style={{
                  fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                  background: '#EDE9FE', color: '#6D28D9',
                }}>
                  {f.label} {OP_LABEL[f.op]} {f.value}
                </span>
              ))}
            </div>
          </div>

          {/* Name input */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>View name</label>
            <input
              ref={inputRef}
              type="text"
              placeholder="e.g. Losers under 100 ROAS"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave() }}
              style={{
                width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: 8,
                fontSize: 13, color: '#111827', outline: 'none', fontFamily: 'inherit',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#A78BFA'}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}
            >Cancel</button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              style={{
                padding: '8px 20px', borderRadius: 8, border: 'none',
                background: name.trim() ? '#6D28D9' : '#DDD6FE',
                fontSize: 13, fontWeight: 700, color: 'white',
                cursor: name.trim() ? 'pointer' : 'default', fontFamily: 'inherit',
                transition: 'background 0.15s',
              }}
            >Save view</button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translate(-50%, -46%); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
    </>
  )
}

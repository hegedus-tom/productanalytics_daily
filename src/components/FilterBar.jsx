import { useState, useRef, useEffect } from 'react'

// field → default operator, label, data key
const FILTER_FIELDS = [
  { key: 'roas',    label: 'ROAS',    dataKey: 'roas'     },
  { key: 'clicks',  label: 'Clicks',  dataKey: 'clicks'   },
  { key: 'spend',   label: 'Spend',   dataKey: 'spend'    },
  { key: 'revenue', label: 'Revenue', dataKey: 'convValue'},
]

const OPS = ['gt', 'lt', 'eq']
const OP_LABEL = { gt: 'Greater than', lt: 'Lower than', eq: 'Equal to' }

export default function FilterBar({ filters, onChange, onSaveView }) {
  const [open, setOpen]         = useState(false)
  const [submenu, setSubmenu]   = useState(null) // field key with open submenu
  const ref = useRef(null)

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSubmenu(null) } }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  function addFilter(fieldKey, op) {
    const f = FILTER_FIELDS.find(f => f.key === fieldKey)
    const defaults = { roas: 100, clicks: 10, spend: 500, revenue: 500 }
    if (filters.find(x => x.key === fieldKey)) return // already active
    onChange([...filters, { key: fieldKey, label: f.label, dataKey: f.dataKey, op, value: defaults[fieldKey] }])
    setOpen(false); setSubmenu(null)
  }

  function removeFilter(key) { onChange(filters.filter(f => f.key !== key)) }

  function updateValue(key, val) {
    onChange(filters.map(f => f.key === key ? { ...f, value: val } : f))
  }

  const activeKeys = new Set(filters.map(f => f.key))

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>

      {/* Filters button */}
      <div ref={ref} style={{ position: 'relative' }}>
        <button
          onClick={() => { setOpen(o => !o); setSubmenu(null) }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', border: '1px solid #E5E7EB', borderRadius: 7,
            background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            color: '#374151', fontFamily: 'inherit',
            boxShadow: open ? '0 0 0 3px rgba(109,40,217,0.08)' : 'none',
            borderColor: open ? '#C4B5FD' : '#E5E7EB',
          }}
        >
          {/* Funnel icon */}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          Filters
          <span style={{ fontSize: 10, color: '#9CA3AF' }}>▼</span>
        </button>

        {/* Dropdown */}
        {open && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 100,
            background: 'white', border: '1px solid #E5E7EB', borderRadius: 9,
            boxShadow: '0 6px 24px rgba(0,0,0,0.10)', minWidth: 150, padding: '6px 0',
          }}>
            {FILTER_FIELDS.map(f => (
              <div key={f.key} style={{ position: 'relative' }}
                onMouseEnter={() => setSubmenu(f.key)}
                onMouseLeave={() => setSubmenu(null)}
              >
                <div style={{
                  padding: '9px 14px', fontSize: 13, cursor: 'pointer',
                  color: activeKeys.has(f.key) ? '#D1D5DB' : '#374151',
                  fontWeight: 500,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: submenu === f.key ? '#F9FAFB' : 'transparent',
                }}>
                  {f.label}
                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>›</span>
                </div>

                {/* Submenu — all three operators */}
                {submenu === f.key && (
                  <div style={{
                    position: 'absolute', left: '100%', top: 0,
                    background: 'white', border: '1px solid #E5E7EB', borderRadius: 9,
                    boxShadow: '0 6px 24px rgba(0,0,0,0.10)', minWidth: 148, padding: '6px 0',
                    zIndex: 101,
                  }}>
                    {OPS.map(op => (
                      <div
                        key={op}
                        onClick={() => !activeKeys.has(f.key) && addFilter(f.key, op)}
                        style={{
                          padding: '9px 14px', fontSize: 13,
                          cursor: activeKeys.has(f.key) ? 'default' : 'pointer',
                          color: activeKeys.has(f.key) ? '#D1D5DB' : '#374151',
                          fontWeight: 500,
                        }}
                        onMouseEnter={e => { if (!activeKeys.has(f.key)) e.currentTarget.style.background = '#F9FAFB' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                      >
                        {OP_LABEL[op]}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active filter chips */}
      {filters.map(f => (
        <div key={f.key} style={{
          display: 'flex', alignItems: 'center', gap: 0,
          border: '1px solid #E5E7EB', borderRadius: 7, background: 'white',
          fontSize: 13, overflow: 'hidden',
        }}>
          <span style={{ padding: '5px 10px', fontWeight: 600, color: '#374151', borderRight: '1px solid #E5E7EB' }}>
            {f.label}
          </span>
          <span style={{ padding: '5px 8px', color: '#9CA3AF', borderRight: '1px solid #E5E7EB' }}>
            {OP_LABEL[f.op]}
          </span>
          <input
            type="number"
            value={f.value}
            onChange={e => updateValue(f.key, +e.target.value)}
            style={{
              width: 52, padding: '5px 8px', border: 'none', outline: 'none',
              fontSize: 13, fontWeight: 700, color: '#111827', fontFamily: 'inherit',
              background: 'transparent',
            }}
          />
          <button
            onClick={() => removeFilter(f.key)}
            style={{ padding: '5px 8px', border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 14, lineHeight: 1 }}
          >×</button>
        </div>
      ))}

      {/* Save view + Reset */}
      {filters.length > 0 && (
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={onSaveView}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 13px', border: '1px solid #C4B5FD', borderRadius: 7,
              background: '#EDE9FE', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, color: '#6D28D9', fontFamily: 'inherit',
            }}
          >
            {/* Eye icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Save view
          </button>
          <button
            onClick={() => onChange([])}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 700, color: '#DC2626', fontFamily: 'inherit',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              <line x1="2" y1="2" x2="22" y2="22"/>
            </svg>
            Reset
          </button>
        </div>
      )}
    </div>
  )
}

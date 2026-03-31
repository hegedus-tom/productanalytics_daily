import { useState, useRef, useEffect } from 'react'

const MONTHS      = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTHS_S    = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DOW         = ['Mo','Tu','We','Th','Fr','Sa','Su']
const TODAY       = new Date(2026, 2, 31) // 31 Mar 2026

const STRIPE = 'repeating-linear-gradient(45deg,transparent,transparent 3px,rgba(0,0,0,0.05) 3px,rgba(0,0,0,0.05) 6px)'

const PRESETS = [
  { label: 'Last 7 days',  key: '7D'  },
  { label: 'Last 30 days', key: '30D' },
  { label: 'This Month',   key: 'TM'  },
]

/* ─── helpers ─── */
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r }
function sameDay(a, b)  { return a && b && a.toDateString() === b.toDateString() }
function daysBetween(a, b) { return Math.round((b - a) / 86400000) + 1 }
function monIdx(jsDay)  { return (jsDay + 6) % 7 }   // Mon=0 … Sun=6

function presetDates(key) {
  if (key === '7D')  { const e = addDays(TODAY,-1); return { start: addDays(e,-6), end: e } }
  if (key === '30D') { const e = addDays(TODAY,-1); return { start: addDays(e,-29), end: e } }
  // This Month
  return { start: new Date(TODAY.getFullYear(), TODAY.getMonth(), 1), end: new Date(TODAY) }
}

function presetLabel(key) { return PRESETS.find(p => p.key === key)?.label ?? '' }

function getCalDays(year, month) {
  const first = new Date(year, month, 1)
  const last  = new Date(year, month + 1, 0)
  const offset = monIdx(first.getDay())
  const days = []
  for (let i = offset - 1; i >= 0; i--)
    days.push({ date: new Date(year, month, -i), cur: false })
  for (let d = 1; d <= last.getDate(); d++)
    days.push({ date: new Date(year, month, d), cur: true })
  let fill = 1
  while (days.length % 7 !== 0)
    days.push({ date: new Date(year, month + 1, fill++), cur: false })
  return days
}

function nextM(ym) {
  return ym.month === 11 ? { year: ym.year + 1, month: 0 } : { year: ym.year, month: ym.month + 1 }
}

/* ─── component ─── */
export default function DateRangePicker({ onApply }) {
  const init = presetDates('30D')
  const [open,        setOpen]       = useState(false)
  const [applied,     setApplied]    = useState({ preset: '30D', start: init.start, end: init.end })
  const [preset,      setPreset]     = useState('30D')
  const [tStart,      setTStart]     = useState(init.start)
  const [tEnd,        setTEnd]       = useState(init.end)
  const [hover,       setHover]      = useState(null)
  const [awaiting,    setAwaiting]   = useState(false)  // waiting for end-click
  const [leftM,       setLeftM]      = useState({ year: 2026, month: 2 })
  const ref = useRef(null)

  const rightM = nextM(leftM)

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  function openPicker() {
    setPreset(applied.preset)
    setTStart(applied.start)
    setTEnd(applied.end)
    setAwaiting(false)
    setHover(null)
    setLeftM({ year: applied.start.getFullYear(), month: applied.start.getMonth() })
    setOpen(true)
  }

  function pickPreset(key) {
    const r = presetDates(key)
    setPreset(key)
    setTStart(r.start)
    setTEnd(r.end)
    setAwaiting(false)
    setHover(null)
    setLeftM({ year: r.start.getFullYear(), month: r.start.getMonth() })
  }

  function clickDay(date) {
    if (!awaiting) {
      setTStart(date); setTEnd(null); setAwaiting(true); setPreset(null)
    } else {
      if (date < tStart) { setTStart(date); setTEnd(null) }
      else               { setTEnd(date); setAwaiting(false) }
    }
  }

  function apply() {
    if (!tStart || !tEnd) return
    const days = daysBetween(tStart, tEnd)
    const pk   = preset || (days <= 7 ? '7D' : '30D')
    setApplied({ preset: pk, start: tStart, end: tEnd })
    onApply?.(pk, tStart, tEnd)
    setOpen(false)
  }

  function cancel() { setOpen(false) }

  const effEnd    = tEnd ?? (awaiting && hover && hover >= tStart ? hover : null)
  const rangeLen  = tStart && effEnd ? daysBetween(tStart, effEnd) : null
  const btnLabel  = applied.preset ? presetLabel(applied.preset) : `${MONTHS_S[applied.start.getMonth()]} ${applied.start.getDate()} – ${MONTHS_S[applied.end.getMonth()]} ${applied.end.getDate()}`

  /* ─── calendar render ─── */
  function renderCal(ym) {
    const { year, month } = ym
    const days = getCalDays(year, month)
    return (
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
          {MONTHS_S[month]} {year}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {/* Headers */}
          {DOW.map((d, i) => (
            <div key={d} style={{
              textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#6B7280',
              padding: '4px 0 8px',
              background: i >= 5 ? STRIPE : 'transparent',
            }}>{d}</div>
          ))}

          {/* Day cells */}
          {days.map(({ date, cur }, idx) => {
            const dow     = monIdx(date.getDay())
            const isWknd  = dow >= 5
            const isStart = sameDay(date, tStart)
            const isEnd   = sameDay(date, effEnd)
            const inRange = tStart && effEnd && date > tStart && date < effEnd
            const isEdge  = isStart || isEnd

            // Range band background (extends full cell width)
            let bandBg = 'transparent'
            if (isStart && effEnd)   bandBg = 'linear-gradient(to right, transparent 50%, #EDE9FE 50%)'
            else if (isEnd && tStart) bandBg = 'linear-gradient(to left,  transparent 50%, #EDE9FE 50%)'
            else if (inRange)         bandBg = '#EDE9FE'

            return (
              <div
                key={idx}
                onClick={() => cur && clickDay(date)}
                onMouseEnter={() => awaiting && setHover(date)}
                onMouseLeave={() => awaiting && setHover(null)}
                style={{
                  background: bandBg,
                  cursor: cur ? 'pointer' : 'default',
                  padding: '1px 0',
                }}
              >
                <div style={{
                  width: 32, height: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto',
                  borderRadius: isEdge ? 7 : 0,
                  background: isEdge ? '#6D28D9' : (!isEdge && isWknd && !inRange) ? STRIPE : 'transparent',
                  color: isEdge ? 'white'
                       : inRange ? '#6D28D9'
                       : !cur    ? '#D1D5DB'
                       : sameDay(date, TODAY) ? '#6D28D9'
                       : '#111827',
                  fontWeight: isEdge ? 700 : sameDay(date, TODAY) ? 600 : 400,
                  fontSize: 13,
                }}>
                  {date.getDate()}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>

      {/* ── Trigger ── */}
      <button
        onClick={() => open ? setOpen(false) : openPicker()}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 12px', background: 'white', fontFamily: 'inherit',
          border: `1.5px solid ${open ? '#6D28D9' : '#E5E7EB'}`,
          borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151',
          outline: 'none', boxShadow: open ? '0 0 0 3px rgba(109,40,217,0.08)' : 'none',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span>{btnLabel}</span>
        {open && (
          <span
            onClick={e => { e.stopPropagation(); setOpen(false) }}
            style={{ color: '#9CA3AF', fontSize: 11, lineHeight: 1, cursor: 'pointer' }}
          >✕</span>
        )}
        <span style={{ color: '#9CA3AF', fontSize: 10 }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* ── Popover ── */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 200,
          background: 'white', borderRadius: 12,
          boxShadow: '0 10px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.07)',
          border: '1px solid #E5E7EB',
          width: 700, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>

          {/* Body */}
          <div style={{ display: 'flex' }}>

            {/* Presets sidebar */}
            <div style={{ width: 165, padding: '20px 0', borderRight: '1px solid #F3F4F6', flexShrink: 0 }}>
              {PRESETS.map(p => (
                <button
                  key={p.key}
                  onClick={() => pickPreset(p.key)}
                  style={{
                    display: 'block', width: '100%', padding: '11px 20px',
                    border: 'none', background: 'none', textAlign: 'left',
                    cursor: 'pointer', fontFamily: 'inherit',
                    fontSize: 14, color: '#6D28D9',
                    fontWeight: preset === p.key ? 700 : 500,
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Calendars */}
            <div style={{ flex: 1, padding: '20px 20px 16px' }}>

              {/* Navigation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <button onClick={() => setLeftM(lm => lm.month === 0 ? { year: lm.year-1, month: 11 } : { ...lm, month: lm.month-1 })}
                  style={{ width: 32, height: 32, border: '1px solid #E5E7EB', borderRadius: 7, background: 'white', cursor: 'pointer', fontSize: 14, display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
                <select value={leftM.month}
                  onChange={e => setLeftM(lm => ({ ...lm, month: +e.target.value }))}
                  style={{ flex: 1, padding: '6px 8px', border: '1px solid #E5E7EB', borderRadius: 7, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer' }}>
                  {MONTHS.map((m,i) => <option key={i} value={i}>{m}</option>)}
                </select>
                <select value={leftM.year}
                  onChange={e => setLeftM(lm => ({ ...lm, year: +e.target.value }))}
                  style={{ flex: 1, padding: '6px 8px', border: '1px solid #E5E7EB', borderRadius: 7, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer' }}>
                  {[2024,2025,2026,2027].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <button onClick={() => setLeftM(nextM)}
                  style={{ width: 32, height: 32, border: '1px solid #E5E7EB', borderRadius: 7, background: 'white', cursor: 'pointer', fontSize: 14, display:'flex', alignItems:'center', justifyContent:'center' }}>→</button>
              </div>

              {/* Two months */}
              <div style={{ display: 'flex', gap: 20 }}>
                {renderCal(leftM)}
                <div style={{ width: 1, background: '#F3F4F6', flexShrink: 0 }} />
                {renderCal(rightM)}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            borderTop: '1px solid #E5E7EB', padding: '12px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#374151' }}>
              <span style={{ fontWeight: 500 }}>Range:</span>
              {rangeLen != null && (
                <span style={{ background: '#F3F4F6', borderRadius: 20, padding: '3px 13px', fontWeight: 600, fontSize: 13, color: '#374151' }}>
                  {rangeLen} Days
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={cancel} style={{ padding: '8px 20px', border: '1.5px solid #D1D5DB', borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', color: '#374151' }}>Cancel</button>
              <button
                onClick={apply}
                disabled={!tStart || !tEnd}
                style={{
                  padding: '8px 22px', border: 'none', borderRadius: 8,
                  background: tStart && tEnd ? '#6D28D9' : '#E5E7EB',
                  cursor: tStart && tEnd ? 'pointer' : 'not-allowed',
                  fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                  color: tStart && tEnd ? 'white' : '#9CA3AF',
                }}
              >Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

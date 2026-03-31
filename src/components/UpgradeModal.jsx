import { useEffect } from 'react'

const FEATURES = [
  { icon: '📅', text: 'Up to 60-day date ranges for deeper trend analysis' },
  { icon: '📊', text: 'Monthly performance views to track long-term ROAS shifts' },
  { icon: '🔄', text: 'Week-over-week and month-over-month comparisons' },
  { icon: '⚡', text: 'Full historical data access across your entire catalog' },
]

export default function UpgradeModal({ onClose }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, backdropFilter: 'blur(3px)' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        background: 'white', borderRadius: 20, zIndex: 301, width: 480,
        boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        animation: 'fadeUp 0.2s ease',
      }}>

        {/* Purple gradient header */}
        <div style={{
          background: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 60%, #7C3AED 100%)',
          padding: '32px 28px 28px',
          position: 'relative',
        }}>
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: 16, right: 16, width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: 16, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}
          >×</button>

          {/* Lock icon */}
          <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.15)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>

          <div style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 8, lineHeight: 1.2 }}>
            Unlock historical data
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
            You're currently on the <strong style={{ color: 'white' }}>Basic plan</strong>, which includes last 7 days. Upgrade to access longer date ranges and make smarter decisions.
          </div>
        </div>

        {/* Features list */}
        <div style={{ padding: '24px 28px 8px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
            What you'll unlock
          </div>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{f.icon}</span>
              <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{f.text}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ padding: '16px 28px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a
            href="mailto:hello@dotidot.io?subject=Interested in upgrading my plan&body=Hi dotidot team, I would like to learn more about upgrading my plan to access historical data and extended date ranges."
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '13px', borderRadius: 12, background: '#6D28D9',
              fontSize: 14, fontWeight: 700, color: 'white', textDecoration: 'none',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#5B21B6'}
            onMouseLeave={e => e.currentTarget.style.background = '#6D28D9'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Send an enquiry to dotidot
          </a>
          <button
            onClick={onClose}
            style={{ padding: '12px', borderRadius: 12, border: '1.5px solid #E5E7EB', background: 'white', fontSize: 14, fontWeight: 600, color: '#6B7280', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Maybe later
          </button>
        </div>
      </div>

      <style>{`@keyframes fadeUp { from { opacity:0; transform:translate(-50%,-46%); } to { opacity:1; transform:translate(-50%,-50%); } }`}</style>
    </>
  )
}

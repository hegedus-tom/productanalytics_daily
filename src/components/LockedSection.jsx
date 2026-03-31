import { useState } from 'react'
import UpgradeModal from './UpgradeModal'

export default function LockedSection({ children, reason = 'This section requires more than 7 days of data.', header }) {
  const [showUpgrade, setShowUpgrade] = useState(false)

  return (
    <>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      <div style={{ position: 'relative' }}>
        {/* Unblurred header */}
        {header && <div style={{ marginBottom: 0 }}>{header}</div>}
        {/* Blurred content */}
        <div style={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.6 }}>
          {children}
        </div>

        {/* Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 12,
        }}>
          <div style={{
            background: 'white', borderRadius: 16, padding: '28px 36px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.13)', textAlign: 'center',
            maxWidth: 360, width: '90%',
            border: '1px solid #EDE9FE',
          }}>
            {/* Lock icon */}
            <div style={{
              width: 48, height: 48, background: '#EDE9FE', borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6D28D9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>

            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
              Upgrade to unlock this section
            </div>
            <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: 20 }}>
              {reason}
            </div>

            <button
              onClick={() => setShowUpgrade(true)}
              style={{
                width: '100%', padding: '11px', borderRadius: 10, border: 'none',
                background: '#6D28D9', fontSize: 13, fontWeight: 700, color: 'white',
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#5B21B6'}
              onMouseLeave={e => e.currentTarget.style.background = '#6D28D9'}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Unlock with a paid plan
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

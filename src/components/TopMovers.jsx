import { useState } from 'react'
import { topMovers } from '../data/mockData'
import ProductModal from './ProductModal'
import UpgradeModal from './UpgradeModal'

function MoverTable({ movers, dir, onSelect }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0 16px', padding: '0 0 8px', borderBottom: '1px solid #F3F4F6', marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Product</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>ROAS</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>Change</span>
      </div>
      {movers.map((m, i) => (
        <div key={m.id} style={{
          display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0 16px',
          padding: '10px 0', borderBottom: i < movers.length - 1 ? '1px solid #F9FAFB' : 'none',
          alignItems: 'center',
        }}>
          <div style={{ borderLeft: `3px solid ${dir === 'up' ? '#22C55E' : '#EF4444'}`, paddingLeft: 10 }}>
            <span
              onClick={() => onSelect(m.id)}
              style={{ fontSize: 13, fontWeight: 600, color: '#6D28D9', fontFamily: 'monospace', cursor: 'pointer', textDecoration: 'none' }}
            >{m.id}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: m.roasCurrent < 100 ? '#DC2626' : '#111827' }}>
              {m.roasCurrent.toFixed(1)}%
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF' }}>was {m.roasPrior.toFixed(1)}%</div>
          </div>
          <div style={{ textAlign: 'right', minWidth: 72 }}>
            <span style={{
              display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
              background: dir === 'up' ? '#DCFCE7' : '#FEE2E2',
              color:      dir === 'up' ? '#15803D'  : '#DC2626',
            }}>
              {dir === 'up' ? '+' : ''}{m.delta.toFixed(0)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function TopMovers({ blurBody }) {
  const [modalId,     setModalId]     = useState(null)
  const [showUpgrade, setShowUpgrade] = useState(false)

  return (
    <>
      {modalId     && <ProductModal   productId={modalId} onClose={() => setModalId(null)} />}
      {showUpgrade && <UpgradeModal   onClose={() => setShowUpgrade(false)} />}

      <div className="card section-wrap" style={{ marginBottom: 28 }}>

        {/* Header — always visible, never blurred */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div className="card-title">Biggest ROAS movers</div>
            <div className="card-subtitle">What changed in the past week — last 7 days vs previous 7 days</div>
          </div>
          <span style={{ fontSize: 11, background: '#EDE9FE', color: '#6D28D9', padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>
            New with daily data
          </span>
        </div>

        {/* Body — blurred with upgrade overlay when blurBody */}
        {blurBody ? (
          <div style={{ position: 'relative' }}>
            {/* Blurred data */}
            <div style={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.6 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '0 32px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#15803D' }}>↑ Getting better</span>
                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>Mar 23–29 vs Mar 16–22</span>
                  </div>
                  <MoverTable movers={topMovers.gainers} dir="up" onSelect={() => {}} />
                </div>
                <div style={{ background: '#F3F4F6' }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#DC2626' }}>↓ Getting worse</span>
                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>Mar 23–29 vs Mar 16–22</span>
                  </div>
                  <MoverTable movers={topMovers.decliners} dir="down" onSelect={() => {}} />
                </div>
              </div>
            </div>

            {/* Upgrade overlay */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: 'white', borderRadius: 16, padding: '24px 32px', boxShadow: '0 8px 40px rgba(0,0,0,0.13)', textAlign: 'center', maxWidth: 340, border: '1px solid #EDE9FE' }}>
                <div style={{ width: 44, height: 44, background: '#EDE9FE', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6D28D9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Upgrade to unlock this section</div>
                <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, marginBottom: 18 }}>
                  Week-over-week ROAS movers require more than 7 days of data.
                </div>
                <button
                  onClick={() => setShowUpgrade(true)}
                  style={{ width: '100%', padding: '10px', borderRadius: 10, border: 'none', background: '#6D28D9', fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  onMouseEnter={e => e.currentTarget.style.background = '#5B21B6'}
                  onMouseLeave={e => e.currentTarget.style.background = '#6D28D9'}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Unlock
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '0 32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#15803D' }}>↑ Getting better</span>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>Mar 23–29 vs Mar 16–22</span>
              </div>
              <MoverTable movers={topMovers.gainers} dir="up" onSelect={setModalId} />
            </div>
            <div style={{ background: '#F3F4F6' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#DC2626' }}>↓ Getting worse</span>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>Mar 23–29 vs Mar 16–22</span>
              </div>
              <MoverTable movers={topMovers.decliners} dir="down" onSelect={setModalId} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

import { useState } from 'react'
import { topMovers } from '../data/mockData'
import ProductModal from './ProductModal'
import UpgradeModal from './UpgradeModal'

function MoverTable({ movers, dir, onSelect }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0 16px', padding: '0 0 8px', borderBottom: '1px solid #F3F4F6', marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Product</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>Revenue / wk</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>Revenue Δ</span>
      </div>
      {movers.map((m, i) => (
        <div key={m.id} style={{
          display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0 16px',
          padding: '10px 0', borderBottom: i < movers.length - 1 ? '1px solid #F9FAFB' : 'none',
          alignItems: 'center',
        }}>
          {/* Product: name + id */}
          <div style={{ borderLeft: `3px solid ${dir === 'up' ? '#22C55E' : '#EF4444'}`, paddingLeft: 10, minWidth: 0 }}>
            <div
              onClick={() => onSelect(m.id)}
              style={{ fontSize: 13, fontWeight: 600, color: '#111827', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >{m.name}</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'monospace', marginTop: 1 }}>{m.id}</div>
          </div>

          {/* Revenue: now / was */}
          <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: dir === 'up' ? '#15803D' : (m.revenueL7 < m.revenuePrior ? '#DC2626' : '#111827') }}>
              €{m.revenueL7.toFixed(0)}/wk
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF' }}>was €{m.revenuePrior.toFixed(0)}</div>
          </div>

          {/* Revenue delta pill */}
          <div style={{ textAlign: 'right', minWidth: 72 }}>
            <span style={{
              display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
              background: dir === 'up' ? '#DCFCE7' : '#FEE2E2',
              color:      dir === 'up' ? '#15803D'  : '#DC2626',
            }}>
              {dir === 'up' ? '+' : ''}€{Math.abs(m.revenueL7 - m.revenuePrior).toFixed(0)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

const PAGE = 5

export default function TopMovers({ blurBody }) {
  const [modalId,      setModalId]      = useState(null)
  const [showUpgrade,  setShowUpgrade]  = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE)

  const gainers   = topMovers.gainers.slice(0, visibleCount)
  const decliners = topMovers.decliners.slice(0, visibleCount)
  const totalRows = Math.max(topMovers.gainers.length, topMovers.decliners.length)
  const canExpand = visibleCount < totalRows
  const canCollapse = visibleCount > PAGE

  return (
    <>
      {modalId     && <ProductModal  productId={modalId} onClose={() => setModalId(null)} />}
      {showUpgrade && <UpgradeModal  onClose={() => setShowUpgrade(false)} />}

      <div className="card section-wrap" style={{ marginBottom: 28 }}>

        {/* Header — always visible, never blurred */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div className="card-title">Biggest revenue movers</div>
            <div className="card-subtitle">What changed in the past week — last 7 days vs previous 7 days</div>
          </div>
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
                  <MoverTable movers={topMovers.gainers.slice(0, PAGE)} dir="up" onSelect={() => {}} />
                </div>
                <div style={{ background: '#F3F4F6' }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#DC2626' }}>↓ Getting worse</span>
                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>Mar 23–29 vs Mar 16–22</span>
                  </div>
                  <MoverTable movers={topMovers.decliners.slice(0, PAGE)} dir="down" onSelect={() => {}} />
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
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '0 32px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#15803D' }}>↑ Getting better</span>
                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>Mar 23–29 vs Mar 16–22</span>
                </div>
                <MoverTable movers={gainers} dir="up" onSelect={setModalId} />
              </div>
              <div style={{ background: '#F3F4F6' }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#DC2626' }}>↓ Getting worse</span>
                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>Mar 23–29 vs Mar 16–22</span>
                </div>
                <MoverTable movers={decliners} dir="down" onSelect={setModalId} />
              </div>
            </div>

            {/* Expand / collapse */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20, paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
              {canExpand && (
                <button
                  onClick={() => setVisibleCount(v => Math.min(v + 10, totalRows))}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 18px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: 'white', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#6D28D9'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                  Show {Math.min(10, totalRows - visibleCount)} more
                </button>
              )}
              {canCollapse && (
                <button
                  onClick={() => setVisibleCount(PAGE)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 18px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: 'white', fontSize: 13, fontWeight: 600, color: '#9CA3AF', cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#D1D5DB'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"/>
                  </svg>
                  Show less
                </button>
              )}
              <span style={{ display: 'flex', alignItems: 'center', fontSize: 12, color: '#9CA3AF' }}>
                {visibleCount} of {totalRows} products
              </span>
            </div>
          </>
        )}
      </div>
    </>
  )
}

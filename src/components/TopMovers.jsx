import { useState } from 'react'
import { topMovers } from '../data/mockData'
import ProductModal from './ProductModal'

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

export default function TopMovers() {
  const [modalId, setModalId] = useState(null)

  return (
    <>
    {modalId && <ProductModal productId={modalId} onClose={() => setModalId(null)} />}
    <div className="card section-wrap" style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div className="card-title">Biggest ROAS movers</div>
          <div className="card-subtitle">What changed in the past week — last 7 days vs previous 7 days</div>
        </div>
        <span style={{ fontSize: 11, background: '#EDE9FE', color: '#6D28D9', padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>
          New with daily data
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '0 32px' }}>
        {/* Winners */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#15803D' }}>↑ Getting better</span>
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>Mar 23–29 vs Mar 16–22</span>
          </div>
          <MoverTable movers={topMovers.gainers} dir="up" onSelect={setModalId} />
        </div>

        {/* Divider */}
        <div style={{ background: '#F3F4F6' }} />

        {/* Losers */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#DC2626' }}>↓ Getting worse</span>
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>Mar 23–29 vs Mar 16–22</span>
          </div>
          <MoverTable movers={topMovers.decliners} dir="down" onSelect={setModalId} />
        </div>
      </div>
    </div>
    </>
  )
}

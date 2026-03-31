import { topMovers } from '../data/mockData'
import HowToRead from './HowToRead'

function fmt(n) { return '€' + n.toFixed(2) }

export default function TopMovers() {
  return (
    <div className="card section-wrap" style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <div>
          <div className="card-title">What changed this week</div>
          <div className="card-subtitle">Products with the biggest ROAS change vs the previous 7 days</div>
        </div>
        <span style={{ fontSize: 11, background: '#EDE9FE', color: '#6D28D9', padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>
          New with daily data
        </span>
      </div>

      <HowToRead text="This table compares each product's ROAS over the last 7 days vs the 7 days before that. Left side = products improving (good news). Right side = products getting worse (action needed)." />

      <div className="movers-grid">
        {/* Gainers */}
        <div>
          <div className="movers-half-title gainers">
            <span>↑</span> Getting better
            <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 400, marginLeft: 4 }}>Mar 23–29 vs Mar 16–22</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0 16px', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>PRODUCT</span>
            <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textAlign: 'right' }}>ROAS NOW</span>
            <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textAlign: 'right' }}>CHANGE</span>
          </div>
          {topMovers.gainers.map(m => (
            <div key={m.id} className="mover-row">
              <div>
                <div className="mover-id">{m.id}</div>
                <div className="mover-meta">Spend {fmt(m.spendL7)} · Rev {fmt(m.revenueL7)}</div>
              </div>
              <div style={{ textAlign: 'right', marginLeft: 16 }}>
                <div className="mover-roas-current">{m.roasCurrent.toFixed(1)}%</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>was {m.roasPrior.toFixed(1)}%</div>
              </div>
              <div style={{ textAlign: 'right', minWidth: 64 }}>
                <span className="mover-roas-delta up">+{m.delta.toFixed(0)} pp</span>
              </div>
            </div>
          ))}
        </div>

        {/* Decliners */}
        <div>
          <div className="movers-half-title decliners">
            <span>↓</span> Getting worse
            <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 400, marginLeft: 4 }}>Mar 23–29 vs Mar 16–22</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0 16px', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>PRODUCT</span>
            <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textAlign: 'right' }}>ROAS NOW</span>
            <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textAlign: 'right' }}>CHANGE</span>
          </div>
          {topMovers.decliners.map(m => (
            <div key={m.id} className="mover-row">
              <div>
                <div className="mover-id">{m.id}</div>
                <div className="mover-meta">Spend {fmt(m.spendL7)} · Rev {fmt(m.revenueL7)}</div>
              </div>
              <div style={{ textAlign: 'right', marginLeft: 16 }}>
                <div className="mover-roas-current" style={{ color: m.roasCurrent < 100 ? '#DC2626' : '#111827' }}>
                  {m.roasCurrent.toFixed(1)}%
                </div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>was {m.roasPrior.toFixed(1)}%</div>
              </div>
              <div style={{ textAlign: 'right', minWidth: 64 }}>
                <span className="mover-roas-delta down">{m.delta.toFixed(0)} pp</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { useEffect } from 'react'
import { productDetails, productList } from '../data/mockData'

// flatten all lists into a single lookup map
const allProductsMap = {}
Object.values(productList).forEach(list =>
  list.forEach(p => { if (!allProductsMap[p.id]) allProductsMap[p.id] = p })
)

function fmt(n)    { return '€' + (n ?? 0).toLocaleString('en-EU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function fmtPct(n) { return n != null ? n.toFixed(2) + '%' : '—' }

function StatusBadge({ status }) {
  const active = status === 'active'
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
      background: active ? '#DCFCE7' : '#F3F4F6',
      color:      active ? '#15803D' : '#9CA3AF',
    }}>
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}

function MetricCard({ label, value, sub, color }) {
  return (
    <div style={{ flex: 1, background: '#F9FAFB', borderRadius: 10, padding: '14px 18px' }}>
      <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: color || '#111827' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

export default function ProductModal({ productId, onClose }) {
  // look up the detail first, then fall back to basic info from productList
  const detail = productDetails[productId]

  const basicRow = allProductsMap[productId]

  const name     = detail?.name     || basicRow?.name || productId
  const brand    = detail?.brand    || '—'
  const category = detail?.category || '—'
  const variants = detail?.variants || []

  // aggregate totals from variants if detail exists, else use basicRow
  const totalSpend   = detail ? variants.reduce((s, v) => s + v.spend, 0) : basicRow?.spend || 0
  const totalRevenue = detail ? variants.reduce((s, v) => s + v.convValue, 0) : basicRow?.convValue || 0
  const totalClicks  = detail ? variants.reduce((s, v) => s + v.clicks, 0) : basicRow?.clicks || 0
  const avgRoas      = totalSpend > 0 ? (totalRevenue / totalSpend) * 100 : null

  // close on Escape key
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
          zIndex: 100, backdropFilter: 'blur(2px)',
        }}
      />

      {/* Modal panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '780px', maxWidth: '92vw',
        background: 'white', zIndex: 101, display: 'flex', flexDirection: 'column',
        boxShadow: '-4px 0 32px rgba(0,0,0,0.15)',
        animation: 'slideIn 0.22s ease',
      }}>

        {/* Header */}
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid #E5E7EB',
          display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0,
        }}>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: '50%', border: '1px solid #E5E7EB',
              background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 16, color: '#6B7280', flexShrink: 0,
              fontFamily: 'inherit',
            }}
          >×</button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {name}
            </div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
              Product ID: <span style={{ fontFamily: 'monospace', color: '#6D28D9', fontWeight: 600 }}>{productId}</span>
              {brand !== '—' && <> &nbsp;·&nbsp; {brand} &nbsp;·&nbsp; {category}</>}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* KPI row */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <MetricCard label="Total Spend"   value={fmt(totalSpend)}   sub="Last 30 days" />
            <MetricCard label="Total Revenue" value={fmt(totalRevenue)} sub="Conv. value" />
            <MetricCard label="ROAS"          value={fmtPct(avgRoas)}   sub="Revenue / Spend"
              color={avgRoas != null && avgRoas < 100 ? '#DC2626' : avgRoas != null && avgRoas > 300 ? '#15803D' : '#111827'} />
            <MetricCard label="Clicks"        value={totalClicks.toLocaleString()} sub="Last 30 days" />
          </div>

          {/* Variants table */}
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Product variants</div>
              <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>Performance broken down by variant / size</div>
            </div>

            {variants.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
                No variant data available for this product.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F9FAFB' }}>
                      {['SKU', 'Size', 'Status', 'Spend', 'ROAS', 'Conv. Value', 'Clicks', 'Impressions', 'Conversions'].map(h => (
                        <th key={h} style={{
                          padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#9CA3AF',
                          textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.04em',
                          whiteSpace: 'nowrap', borderBottom: '1px solid #E5E7EB',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((v, i) => (
                      <tr key={v.sku} style={{ background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                        <td style={{ padding: '11px 16px', fontFamily: 'monospace', fontSize: 12, color: '#6D28D9', fontWeight: 600, borderBottom: '1px solid #F3F4F6', whiteSpace: 'nowrap' }}>{v.sku}</td>
                        <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 600, color: '#111827', borderBottom: '1px solid #F3F4F6', whiteSpace: 'nowrap' }}>{v.size}</td>
                        <td style={{ padding: '11px 16px', borderBottom: '1px solid #F3F4F6' }}><StatusBadge status={v.status} /></td>
                        <td style={{ padding: '11px 16px', fontSize: 13, color: '#374151', borderBottom: '1px solid #F3F4F6' }}>{fmt(v.spend)}</td>
                        <td style={{ padding: '11px 16px', borderBottom: '1px solid #F3F4F6' }}>
                          <span style={{ fontWeight: 700, fontSize: 13, color: v.roas == null ? '#9CA3AF' : v.roas < 100 ? '#DC2626' : v.roas > 300 ? '#15803D' : '#111827' }}>
                            {fmtPct(v.roas)}
                          </span>
                        </td>
                        <td style={{ padding: '11px 16px', fontSize: 13, color: '#374151', borderBottom: '1px solid #F3F4F6' }}>{fmt(v.convValue)}</td>
                        <td style={{ padding: '11px 16px', fontSize: 13, color: '#374151', borderBottom: '1px solid #F3F4F6' }}>{v.clicks.toLocaleString()}</td>
                        <td style={{ padding: '11px 16px', fontSize: 13, color: '#374151', borderBottom: '1px solid #F3F4F6' }}>{v.impressions.toLocaleString()}</td>
                        <td style={{ padding: '11px 16px', fontSize: 13, color: '#374151', borderBottom: '1px solid #F3F4F6' }}>{v.conversions.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(60px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  )
}

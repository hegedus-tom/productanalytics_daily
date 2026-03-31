import { useState } from 'react'

const insights = [
  {
    tag: 'Where you\'re losing money',
    value: '€4,155.14',
    body: '<b>26.99%</b> of the total budget has been spent on products with <b>ROAS lower than 100%</b>. This money goes into promotion of <b>509 products</b> (<b>8.12%</b> of the promoted products). These products are generating <b>ROAS 11.60%</b>. This money can be reallocated to better products.',
    trend: 'worse',
    trendLabel: '+€312 vs last week',
  },
  {
    tag: 'Spend on low-ROAS products',
    value: '€5,904.87',
    body: '<b>38.36%</b> of the total budget has been invested in products with <b>ROAS lower than 210.73%</b>. This budget goes into promotion of <b>554 products</b> (<b>8.84%</b> of the promoted products). These products are generating <b>ROAS 53.25%</b>. This money can be reallocated to better products.',
    trend: 'better',
    trendLabel: '−€188 vs last week',
  },
  {
    tag: 'Spend concentration',
    value: '0.14%',
    suffix: 'of all promoted products (9 products) used 10% of the total budget.',
    body: 'A tiny group of <b>9 products</b> is absorbing <b>10% of your entire budget</b>. If any of these products stops performing, your results will drop sharply.',
    trend: 'worse',
    trendLabel: 'Unchanged vs last week',
  },
  {
    tag: 'Active products',
    value: '12.60%',
    suffix: 'of promoted products (790 products) have more than 10 clicks in the last 30 days.',
    body: '<b>790 products</b> received more than <b>10 clicks</b>. These products used <b>68.23% of the budget</b> and are responsible for most of your revenue.',
    trend: 'better',
    trendLabel: '+47 products vs last week',
  },
]

export default function PerformanceInsights() {
  const [open, setOpen] = useState({})
  const toggle = id => setOpen(o => ({ ...o, [id]: !o[id] }))

  return (
    <div className="card section-wrap" style={{ marginBottom: 28 }}>
      <div className="alerts-header">
        <span style={{ fontSize: 20 }}>🔴</span>
        <div>
          <div className="alerts-title">Performance insights</div>
          <div className="alerts-subtitle">Insights highlighting urgent issues, risks, and opportunities.</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 18 }}>⚠️</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#991B1B' }}>Key alerts</span>
        <span style={{ fontSize: 13, color: '#6B7280' }}>— Insights requiring your immediate attention.</span>
      </div>

      {insights.map((ins, i) => (
        <div className="insight-box" key={i}>
          <div className="insight-box-left">
            <div className="insight-header">
              <span style={{ fontWeight: 700, fontSize: 14, color: '#B91C1C' }}>{ins.tag}</span>
            </div>
            <div className="insight-value">{ins.value}</div>
            {ins.suffix && <div style={{ fontSize: 13, color: '#374151', marginBottom: 4 }}>{ins.suffix}</div>}
            {open[i] && (
              <div className="insight-body" dangerouslySetInnerHTML={{ __html: ins.body }} />
            )}
            <button
              onClick={() => toggle(i)}
              className="show-more"
              style={{ marginTop: 8, border: 'none', background: 'none', padding: 0, fontFamily: 'inherit' }}
            >
              {open[i] ? 'Show less ▲' : 'Show more ▼'}
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, marginLeft: 24, flexShrink: 0 }}>
            <span className={`insight-trend-badge ${ins.trend}`}>
              {ins.trend === 'worse' ? '↑' : '↓'} {ins.trendLabel}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

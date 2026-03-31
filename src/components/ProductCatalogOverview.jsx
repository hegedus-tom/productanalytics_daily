import { dailyStats, segments } from '../data/mockData'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'

function SparkLine({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
        <Tooltip
          content={({ active, payload }) =>
            active && payload?.length
              ? <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 6, padding: '4px 10px', fontSize: 11 }}>
                  <b>{payload[0].payload.d}</b>: {payload[0].value} active
                </div>
              : null
          }
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default function ProductCatalogOverview() {
  // Build sparkline data: active products per day (last 14 valid days)
  const valid = dailyStats.filter(d => !d.partial).slice(-14)
  const sparkData = valid.map(d => ({ v: d.activeProducts, d: d.dateShort }))

  const cards = [
    {
      title: 'Total products',
      desc: 'Number of all products in the data feed.',
      value: '24,424',
      sub: null,
    },
    {
      title: 'Promoted products',
      desc: 'Products that are displayed in the campaigns.',
      value: `${segments.promotedPct}%`,
      sub: `${segments.promoted.toLocaleString()} products of all ${segments.total.toLocaleString()}`,
    },
    {
      title: 'Inactive products',
      desc: 'Products that have 0 spend.',
      value: `${segments.inactivePct}%`,
      sub: `${segments.inactive.toLocaleString()} products of all ${segments.total.toLocaleString()}`,
    },
  ]

  return (
    <div className="section-wrap" style={{ marginBottom: 28 }}>
      <div className="section-title">Product catalog overview</div>
      <div className="section-subtitle">An overview of your product catalog.</div>

      <div className="catalog-grid" style={{ marginBottom: 24 }}>
        {cards.map(c => (
          <div className="catalog-card" key={c.title}>
            <div className="catalog-card-title">{c.title}</div>
            <div className="catalog-card-desc">{c.desc}</div>
            <div className="catalog-card-value">{c.value}</div>
            {c.sub && <div className="catalog-card-sub">{c.sub}</div>}
          </div>
        ))}
      </div>

      {/* NEW: Active product trend — only possible with daily data */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <div className="card-title" style={{ fontSize: 14 }}>Active products over time</div>
            <div style={{ fontSize: 12, color: '#9CA3AF' }}>
              How many products had spend each day — last 14 days
            </div>
          </div>
          <span style={{ fontSize: 11, background: '#EDE9FE', color: '#6D28D9', padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>
            New with daily data
          </span>
        </div>
        <SparkLine data={sparkData} color="#7C3AED" />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
          <span>{valid[0]?.dateShort}</span>
          <span>{valid[valid.length - 1]?.dateShort}</span>
        </div>
      </div>
    </div>
  )
}

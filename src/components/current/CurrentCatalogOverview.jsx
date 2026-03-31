import { segments } from '../../data/mockData'

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

export default function CurrentCatalogOverview() {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Product catalog overview</div>
      <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 20 }}>An overview of your product catalog.</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {cards.map(c => (
          <div key={c.title} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{c.title}</div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>{c.desc}</div>
            <div style={{ fontSize: 38, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{c.value}</div>
            {c.sub && <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 10 }}>{c.sub}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

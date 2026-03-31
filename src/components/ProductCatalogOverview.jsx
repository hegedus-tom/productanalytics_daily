import { segments } from '../data/mockData'

export default function ProductCatalogOverview() {

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

    </div>
  )
}

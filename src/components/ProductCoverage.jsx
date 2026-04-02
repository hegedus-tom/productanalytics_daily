import { segments } from '../data/mockData'

export default function ProductCoverage() {

  return (
    <div className="section-wrap" style={{ marginBottom: 28 }}>
      <div className="section-title">Product coverage</div>
      <div className="section-subtitle">An overview of your product catalog performance and budget distribution.</div>

      {/* Catalog footnote */}
      <div style={{
        marginTop: 8, padding: '10px 16px', borderRadius: 8,
        background: '#F9FAFB', border: '1px solid #F3F4F6',
        display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center',
      }}>
        <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Feed context</span>
        <span style={{ fontSize: 12, color: '#6B7280' }}>
          <span style={{ fontWeight: 700, color: '#374151' }}>{segments.total.toLocaleString()}</span> total products in feed
        </span>
        <span style={{ fontSize: 12, color: '#6B7280' }}>
          <span style={{ fontWeight: 700, color: '#15803D' }}>{segments.promotedPct}%</span> promoted ({segments.promoted.toLocaleString()} products)
          <span style={{ color: '#9CA3AF', marginLeft: 6 }}>— industry avg for Shopping: 20–30%</span>
        </span>
        <span style={{ fontSize: 12, color: '#6B7280' }}>
          <span style={{ fontWeight: 700, color: '#374151' }}>{segments.inactivePct}%</span> inactive — typical for large feeds; review in Product intelligence below
        </span>
      </div>
    </div>
  )
}

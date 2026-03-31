const insights = [
  {
    tag: 'Where you\'re losing money',
    value: '€4,155.14',
    tabKey: 'losers',
    tabLabel: 'Losers',
    trend: 'worse',
    trendLabel: '+€312 vs last week',
  },
  {
    tag: 'Spend on low-ROAS products',
    value: '€5,904.87',
    tabKey: 'underperformers',
    tabLabel: 'Underperformers',
    trend: 'better',
    trendLabel: '−€188 vs last week',
  },
  {
    tag: 'Spend concentration',
    value: '0.14%',
    tabKey: 'budgetSpenders',
    tabLabel: 'Budget spenders',
    trend: 'worse',
    trendLabel: 'Unchanged vs last week',
  },
  {
    tag: 'Active products',
    value: '12.60%',
    tabKey: 'active',
    tabLabel: 'Active products',
    trend: 'better',
    trendLabel: '+47 products vs last week',
  },
]

export default function PerformanceInsights({ onInsightClick }) {
  return (
    <div className="card section-wrap" style={{ marginBottom: 28 }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 16 }}>🔴</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Performance insights</span>
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>— Insights requiring your attention.</span>
      </div>

      {/* Compact cards row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {insights.map((ins, i) => (
          <div
            key={i}
            onClick={() => onInsightClick?.(ins.tabKey)}
            style={{
              background: '#FAFAFA', border: '1px solid #F3F4F6',
              borderRadius: 10, padding: '12px 14px',
              cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C4B5FD'; e.currentTarget.style.background = '#FAF5FF' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#F3F4F6'; e.currentTarget.style.background = '#FAFAFA' }}
          >
            {/* Tag */}
            <div style={{ fontSize: 11, fontWeight: 600, color: '#B45309', marginBottom: 6, lineHeight: 1.3 }}>
              {ins.tag}
            </div>

            {/* Value + trend badge */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#DC2626', lineHeight: 1 }}>{ins.value}</span>
              <span style={{
                fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap',
                padding: '2px 7px', borderRadius: 20,
                background: ins.trend === 'worse' ? '#FEE2E2' : '#DCFCE7',
                color:      ins.trend === 'worse' ? '#B91C1C' : '#15803D',
              }}>
                {ins.trend === 'worse' ? '↑' : '↓'} {ins.trendLabel}
              </span>
            </div>

            {/* CTA */}
            <div style={{ marginTop: 8, fontSize: 11, color: '#6D28D9', fontWeight: 600 }}>
              View {ins.tabLabel} →
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

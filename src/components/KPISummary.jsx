import { dailyStats, segments } from '../data/mockData'

function fmt(n) { return '€' + n.toLocaleString('en-EU', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }
function fmtPct(n) { return n.toFixed(1) + '%' }

function getRange(period) {
  // exclude partial Mar 30
  const valid = dailyStats.filter(d => !d.partial)
  if (period === '7D')  return { cur: valid.slice(-7),  prev: valid.slice(-14, -7) }
  if (period === '14D') return { cur: valid.slice(-14), prev: valid.slice(-28, -14) }
  return { cur: valid, prev: null }
}

function sum(arr, key) { return arr.reduce((a, b) => a + b[key], 0) }

export default function KPISummary({ period }) {
  const { cur, prev } = getRange(period)

  const spend   = sum(cur, 'spend')
  const revenue = sum(cur, 'revenue')
  const roas    = spend > 0 ? (revenue / spend * 100) : 0
  const active  = Math.round(cur.reduce((a, b) => a + b.activeProducts, 0) / cur.length)

  let spendDelta = null, revDelta = null, roasDelta = null, activeDelta = null
  if (prev && prev.length > 0) {
    const pSpend   = sum(prev, 'spend')
    const pRev     = sum(prev, 'revenue')
    const pRoas    = pSpend > 0 ? (pRev / pSpend * 100) : 0
    const pActive  = Math.round(prev.reduce((a, b) => a + b.activeProducts, 0) / prev.length)
    spendDelta  = pSpend  > 0 ? ((spend   - pSpend)  / pSpend  * 100) : null
    revDelta    = pRev    > 0 ? ((revenue - pRev)    / pRev    * 100) : null
    roasDelta   = roas - pRoas
    activeDelta = pActive > 0 ? ((active  - pActive) / pActive * 100) : null
  }

  const cards = [
    {
      label: 'Total Spend',
      value: fmt(spend),
      sub: `across ${cur.length} days`,
      delta: spendDelta,
      // spending more isn't inherently good/bad — neutral direction
      goodUp: null,
    },
    {
      label: 'Total Revenue',
      value: fmt(revenue),
      sub: `from promoted products`,
      delta: revDelta,
      goodUp: true,
    },
    {
      label: 'Average ROAS',
      value: fmtPct(roas),
      sub: `return on ad spend`,
      delta: roasDelta !== null ? roasDelta : null,
      isDelta: true,
      goodUp: true,
    },
    {
      label: 'Active Products',
      value: active.toLocaleString(),
      sub: `${(active / segments.total * 100).toFixed(1)}% of ${segments.total.toLocaleString()} total products`,
      delta: activeDelta,
      goodUp: true,
    },
  ]

  return (
    <div className="kpi-grid">
      {cards.map(c => {
        let trendClass = 'neutral'
        let trendLabel = null
        if (c.delta !== null && c.delta !== undefined) {
          const isPositive = c.goodUp === null ? true : (c.goodUp ? c.delta > 0 : c.delta < 0)
          trendClass = c.delta > 0 ? (c.goodUp === null ? 'neutral' : (c.goodUp ? 'up' : 'down'))
                                   : (c.goodUp === null ? 'neutral' : (c.goodUp ? 'down' : 'up'))
          if (c.goodUp === null) trendClass = 'neutral'
          const sign = c.delta > 0 ? '+' : ''
          trendLabel = c.isDelta
            ? `${sign}${c.delta.toFixed(1)} pp vs prev`
            : `${sign}${c.delta.toFixed(1)}% vs prev`
        }
        return (
          <div className="kpi-card" key={c.label}>
            <div className="kpi-label">{c.label}</div>
            <div className="kpi-value">{c.value}</div>
            <div className="kpi-sub">{c.sub}</div>
            {trendLabel && (
              <div className={`kpi-trend ${trendClass}`}>
                {trendClass === 'up' ? '↑' : trendClass === 'down' ? '↓' : '→'} {trendLabel}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

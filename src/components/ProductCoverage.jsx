import { budgetGroups, segments } from '../data/mockData'
import HowToRead from './HowToRead'

function fmtEur(n) { return '€' + n.toLocaleString('en-EU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

export default function ProductCoverage() {

  return (
    <div className="section-wrap" style={{ marginBottom: 28 }}>
      <div className="section-title">Product coverage</div>
      <div className="section-subtitle">An overview of your product catalog performance and budget distribution.</div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title" style={{ marginBottom: 4 }}>Where your budget goes</div>

        <HowToRead text="This table shows how your budget is concentrated. When most spend goes into a small group driving most revenue, it creates risk if those products drop out. Other products then receive little budget and can't show their potential." />

        <div style={{ overflowX: 'auto' }}>
          <table className="budget-table">
            <thead>
              <tr>
                <th>Budget group</th>
                <th>No. of products</th>
                <th>% of promoted products</th>
                <th>% of all products</th>
                <th>Spend</th>
                <th>Revenue</th>
                <th>ROAS</th>
              </tr>
            </thead>
            <tbody>
              {budgetGroups.map((g, i) => (
                <tr key={g.group}>
                  <td><span className="budget-group-label">{g.group}</span></td>
                  <td><span className="budget-num">{g.products}</span></td>
                  <td>{g.pctPromoted.toFixed(2)}%</td>
                  <td>{g.pctAll.toFixed(2)}%</td>
                  <td>{fmtEur(g.spend)}</td>
                  <td>
                    <span className="revenue-main">{fmtEur(g.revenue)}</span>
                    <span className="revenue-pct">({g.revenuePct}%)</span>
                  </td>
                  <td><span className="roas-value">{g.roas.toFixed(2)}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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

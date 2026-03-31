import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import { budgetGroups, segments } from '../data/mockData'
import HowToRead from './HowToRead'

const PRODUCT_COLORS = ['#60A5FA', '#34D399', '#A78BFA']
const REVENUE_COLORS = ['#4ADE80', '#F472B6', '#60A5FA']

function fmtEur(n) { return '€' + n.toLocaleString('en-EU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

export default function ProductCoverage() {
  const prodChartData = budgetGroups.map((g, i) => ({ name: g.group, value: parseFloat(g.pctAll.toFixed(2)), color: PRODUCT_COLORS[i] }))
  const revChartData  = budgetGroups.map((g, i) => ({ name: g.group, value: g.revenuePct, color: REVENUE_COLORS[i] }))

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

      <div className="two-col">
        {/* Products by budget groups */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 4 }}>Products by budget groups</div>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>Share of products in each budget group.</div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
            {budgetGroups.map((g, i) => (
              <span key={g.group} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6B7280' }}>
                <span style={{ width: 14, height: 14, borderRadius: 2, background: PRODUCT_COLORS[i], display: 'inline-block' }} />
                {g.group}
              </span>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={prodChartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip formatter={(v) => [`${v}%`, '% of all products']} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}
                label={{ position: 'top', fontSize: 11, fontWeight: 700, formatter: v => `${v}%`, fill: '#374151' }}>
                {prodChartData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <HowToRead text="This chart shows how your budget is concentrated across products. The risk: if most spend goes into only a few items, performance drops when they underperform." />
        </div>

        {/* Revenue by budget groups */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 4 }}>Revenue by budget groups</div>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>Revenue contribution of each budget group compared to total.</div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
            {budgetGroups.map((g, i) => (
              <span key={g.group} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6B7280' }}>
                <span style={{ width: 14, height: 14, borderRadius: 2, background: REVENUE_COLORS[i], display: 'inline-block' }} />
                {g.group}
              </span>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revChartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip formatter={(v) => [`${v}%`, '% of revenue']} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}
                label={{ position: 'top', fontSize: 11, fontWeight: 700, formatter: v => `${v}%`, fill: '#374151' }}>
                {revChartData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <HowToRead text="This chart shows how much revenue each budget group generates. The top 10% spend group generating only 12.95% of revenue suggests room for reallocation." />
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

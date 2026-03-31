import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import { budgetGroups } from '../../data/mockData'

const PRODUCT_COLORS = ['#60A5FA', '#34D399', '#A78BFA']
const REVENUE_COLORS = ['#4ADE80', '#F472B6', '#60A5FA']

function fmtEur(n) { return '€' + n.toLocaleString('en-EU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

function HowToRead({ text }) {
  return (
    <div style={{ background: '#EDE9FE', borderRadius: 8, padding: '12px 16px', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 14 }}>💬</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#6D28D9' }}>How to read this?</span>
      </div>
      <p style={{ fontSize: 13, color: '#5B21B6', marginTop: 8, lineHeight: 1.6 }}>{text}</p>
    </div>
  )
}

export default function CurrentProductCoverage() {
  const [view, setView] = useState('all') // 'all' | 'promoted'

  const prodChartData = budgetGroups.map((g, i) => ({
    name: g.group,
    value: view === 'all' ? parseFloat(g.pctAll.toFixed(2)) : parseFloat(g.pctPromoted.toFixed(2)),
    color: PRODUCT_COLORS[i],
  }))
  const revChartData = budgetGroups.map((g, i) => ({
    name: g.group,
    value: g.revenuePct,
    color: REVENUE_COLORS[i],
  }))

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Product coverage</div>
      <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 20 }}>An overview of your product catalog performance and budget distribution.</div>

      {/* Where your budget goes */}
      <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Where your budget goes</div>

        <HowToRead text="This insight shows how your budget is concentrated within promoted products. When most spend goes into a small group driving most revenue, it creates risk if they drop out. Other products then receive little budget and can't show their potential." />

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Budget group', 'No. of products', '% of promoted products', '% of all products', 'Spend', 'Revenue', 'ROAS'].map(h => (
                  <th key={h} style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #E5E7EB', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {budgetGroups.map(g => (
                <tr key={g.group}>
                  <td style={{ padding: '14px 12px', fontSize: 13, color: '#9CA3AF', borderBottom: '1px solid #F3F4F6' }}>{g.group}</td>
                  <td style={{ padding: '14px 12px', fontSize: 15, fontWeight: 700, color: '#111827', borderBottom: '1px solid #F3F4F6' }}>{g.products}</td>
                  <td style={{ padding: '14px 12px', fontSize: 13, color: '#374151', borderBottom: '1px solid #F3F4F6' }}>{g.pctPromoted.toFixed(2)}%</td>
                  <td style={{ padding: '14px 12px', fontSize: 13, color: '#374151', borderBottom: '1px solid #F3F4F6' }}>{g.pctAll.toFixed(2)}%</td>
                  <td style={{ padding: '14px 12px', fontSize: 13, color: '#374151', borderBottom: '1px solid #F3F4F6' }}>{fmtEur(g.spend)}</td>
                  <td style={{ padding: '14px 12px', borderBottom: '1px solid #F3F4F6' }}>
                    <span style={{ fontWeight: 600, color: '#111827', fontSize: 13 }}>{fmtEur(g.revenue)}</span>
                    <span style={{ fontSize: 11, color: '#22C55E', fontWeight: 600, marginLeft: 4 }}>({g.revenuePct}%)</span>
                  </td>
                  <td style={{ padding: '14px 12px', fontWeight: 700, color: '#111827', fontSize: 13, borderBottom: '1px solid #F3F4F6' }}>{g.roas.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Products by budget groups */}
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Products by budget groups</div>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>Share of products in each budget group.</div>

          {/* Toggle */}
          <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: 8, padding: 3, gap: 2, marginBottom: 16, width: 'fit-content' }}>
            {[['all', 'Of all products'], ['promoted', 'Of promoted products']].map(([k, label]) => (
              <button
                key={k}
                onClick={() => setView(k)}
                style={{
                  padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  background: view === k ? 'white' : 'transparent',
                  color: view === k ? '#111827' : '#6B7280',
                  fontWeight: view === k ? 600 : 500,
                  boxShadow: view === k ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {label}
                {k === 'promoted' && (
                  <span style={{ marginLeft: 4, fontSize: 10, background: '#E5E7EB', borderRadius: '50%', width: 14, height: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>i</span>
                )}
              </button>
            ))}
          </div>

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
              <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={38} />
              <Tooltip formatter={v => [`${v}%`, view === 'all' ? '% of all products' : '% of promoted products']} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}
                label={{ position: 'top', fontSize: 11, fontWeight: 700, formatter: v => `${v}%`, fill: '#374151' }}>
                {prodChartData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div style={{ background: '#EDE9FE', borderRadius: 8, padding: '10px 14px', marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 12 }}>💬</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6D28D9' }}>How to read this?</span>
            </div>
            <p style={{ fontSize: 12, color: '#5B21B6', lineHeight: 1.5 }}>This insight shows how your budget is concentrated across products and the risk of most spend going into only a few items.</p>
          </div>
        </div>

        {/* Revenue by budget groups */}
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Revenue by budget groups</div>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>Revenue contribution of each budget group compared to the total.</div>

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
              <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={38} />
              <Tooltip formatter={v => [`${v}%`, '% of revenue']} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}
                label={{ position: 'top', fontSize: 11, fontWeight: 700, formatter: v => `${v}%`, fill: '#374151' }}>
                {revChartData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div style={{ background: '#EDE9FE', borderRadius: 8, padding: '10px 14px', marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 12 }}>💬</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6D28D9' }}>How to read this?</span>
            </div>
            <p style={{ fontSize: 12, color: '#5B21B6', lineHeight: 1.5 }}>This chart shows how much revenue each budget group generates, e.g., how the top of spend contributes to revenue.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

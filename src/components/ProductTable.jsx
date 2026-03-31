import { useState } from 'react'
import { productList, segments } from '../data/mockData'

function fmt(n) { return '€' + n.toLocaleString('en-EU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function fmtPct(n) { return n.toFixed(2) + '%' }

const TABS = [
  { key: 'all',            label: 'All products',    count: segments.total,        alert: false },
  { key: 'losers',         label: 'Losers',           count: segments.losers,       alert: true },
  { key: 'underperformers',label: 'Underperformers',  count: segments.underperformers, alert: true },
  { key: 'budgetSpenders', label: 'Budget spenders',  count: segments.budgetSpenders,  alert: true },
  { key: 'active',         label: 'Active products',  count: segments.active,       alert: true },
  { key: 'inactive',       label: 'Inactive products',count: segments.inactive,     alert: false },
]

const OVERVIEW = {
  all:            { products: segments.total,           spend: 15395.20, revenue: 32441.78, roas: 210.73 },
  losers:         { products: segments.losers,          spend:  4155.14, revenue:   482.00, roas:  11.60 },
  underperformers:{ products: segments.underperformers, spend:  5904.87, revenue:  3146.34, roas:  53.25 },
  budgetSpenders: { products: segments.budgetSpenders,  spend:  1583.41, revenue:  4202.40, roas: 265.40 },
  active:         { products: segments.active,          spend: 10499.06, revenue: 22152.16, roas: 211.00 },
  inactive:       { products: segments.inactive,        spend:      0,   revenue:      0,   roas:   null },
}

function GadsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" style={{ marginRight: 3 }}>
      <path d="M2.5 19.5L9 8.5l4.5 7.8-2 3.2H2.5z" fill="#4285F4"/>
      <path d="M14.5 19.5L21 8.5l-4.5-7.8-8 13.9 2 4.9z" fill="#FBBC04"/>
      <circle cx="21" cy="8.5" r="3" fill="#34A853"/>
    </svg>
  )
}

export default function ProductTable() {
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')

  const ov = OVERVIEW[activeTab]
  const rawRows = productList[activeTab] || productList.all
  const rows = rawRows.filter(r => r.id.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="section-wrap" style={{ marginBottom: 28 }}>
      <div className="section-title">Product analytics</div>
      <div className="section-subtitle">A complete analysis of your product portfolio, organized into key product segments.</div>

      <div className="tabs">
        {TABS.map(t => (
          <div
            key={t.key}
            className={`tab ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => { setActiveTab(t.key); setSearch('') }}
          >
            {t.label}
            <span className={`tab-badge ${t.alert && activeTab !== t.key ? 'alert' : ''}`}>
              {t.alert && activeTab !== t.key && <span style={{ marginRight: 2 }}>⚠</span>}
              {t.count.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Overview row */}
      <div className="overview-row" style={{ marginBottom: 20, background: 'white' }}>
        <div className="overview-stat">
          <div className="overview-stat-label">Total products</div>
          <div className="overview-stat-value">{ov.products.toLocaleString()}</div>
          <div className="overview-stat-sub">
            {activeTab === 'all' ? '100% of all products in the feed' :
             activeTab === 'inactive' ? '0 spend in selected period' :
             `${((ov.products / segments.total) * 100).toFixed(2)}% of all products`}
          </div>
        </div>
        <div className="overview-stat">
          <div className="overview-stat-label">Total spend</div>
          <div className="overview-stat-value">{fmt(ov.spend)}</div>
          <div className="overview-stat-sub">
            {activeTab === 'all' ? '100% of total budget' :
             activeTab === 'inactive' ? 'No spend' :
             `${((ov.spend / 15395.20) * 100).toFixed(2)}% of total budget`}
          </div>
        </div>
        <div className="overview-stat">
          <div className="overview-stat-label">Total revenue</div>
          <div className="overview-stat-value">{fmt(ov.revenue)}</div>
          <div className="overview-stat-sub">
            {activeTab === 'all' ? '100% of the total revenue' :
             `${((ov.revenue / 32441.78) * 100).toFixed(2)}% of the total revenue`}
          </div>
        </div>
        <div className="overview-stat">
          <div className="overview-stat-label">Average ROAS</div>
          <div className="overview-stat-value" style={{ color: ov.roas != null && ov.roas < 100 ? '#DC2626' : '#111827' }}>
            {ov.roas != null ? fmtPct(ov.roas) : '—'}
          </div>
          <div className="overview-stat-sub">
            {activeTab === 'all' ? '1x equal the average ROAS' :
             ov.roas != null
               ? `${(ov.roas / 210.73).toFixed(2)}x the account average`
               : 'No revenue data'}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="search-wrap">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth={2}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          className=""
          placeholder="Search by product ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ border: 'none', outline: 'none', fontSize: 13, color: '#374151', width: '100%', fontFamily: 'inherit', background: 'transparent' }}
        />
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="product-table-wrap">
          <table className="product-table">
            <thead>
              <tr>
                <th>Product group ID ↑</th>
                <th>Name ↑</th>
                <th className="sortable"><span className="badge-gads"><GadsIcon />Spend ↑</span></th>
                <th className="sortable"><span className="badge-gads"><GadsIcon />ROAS ↑</span></th>
                <th className="sortable"><span className="badge-gads"><GadsIcon />Conversions ↑</span></th>
                <th className="sortable"><span className="badge-gads"><GadsIcon />Conv. Value ↑</span></th>
                <th className="sortable"><span className="badge-gads"><GadsIcon />Clicks ↑</span></th>
                <th className="sortable"><span className="badge-gads"><GadsIcon />Impressions ↑</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: '#9CA3AF', padding: 32 }}>No products found</td></tr>
              )}
              {rows.map(r => (
                <tr key={r.id}>
                  <td>
                    <span className="product-id-link">{r.id}</span>
                    {r.variants && <span className="variant-badge">{r.variants} variants</span>}
                  </td>
                  <td style={{ color: '#9CA3AF', fontSize: 12 }}>—</td>
                  <td>{fmt(r.spend)}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: r.roas < 100 ? '#DC2626' : r.roas > 300 ? '#15803D' : '#111827' }}>
                      {fmtPct(r.roas)}
                    </span>
                  </td>
                  <td>{r.conversions.toFixed(2)}</td>
                  <td>{fmt(r.convValue)}</td>
                  <td>{r.clicks.toLocaleString()}</td>
                  <td>{r.impressions.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

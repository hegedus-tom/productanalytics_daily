import { useState, useEffect } from 'react'
import { segments, getProductListForPeriod, getOverviewForPeriod } from '../data/mockData'
import FilterBar from './FilterBar'
import ProductModal from './ProductModal'
import SaveViewModal from './SaveViewModal'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

function fmt(n) { return '€' + n.toLocaleString('en-EU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function fmtPct(n) { return n.toFixed(2) + '%' }

const TABS = [
  { key: 'all',            label: 'All products',    count: segments.total,           alert: false },
  { key: 'losers',         label: 'Losers',           count: segments.losers,          alert: true  },
  { key: 'underperformers',label: 'Underperformers',  count: segments.underperformers, alert: true  },
  { key: 'budgetSpenders', label: 'Budget spenders',  count: segments.budgetSpenders,  alert: true  },
  { key: 'active',         label: 'Active products',  count: segments.active,          alert: true  },
  { key: 'inactive',       label: 'Inactive products',count: segments.inactive,        alert: false },
]


const TAB_ALERT = {
  losers: {
    tag: 'Where you\'re losing money',
    value: '€4,155.14',
    body: '<b>26.99%</b> of the total budget has been spent on products with <b>ROAS lower than 100%</b>. This money goes into promotion of <b>509 products</b> (<b>8.12%</b> of the promoted products). These products are generating <b>ROAS 11.60%</b>. This money can be reallocated to better products.',
  },
  underperformers: {
    tag: 'Spend on low-ROAS products',
    value: '€5,904.87',
    body: '<b>38.36%</b> of the total budget has been invested in products with <b>ROAS lower than 210.73%</b>. This budget goes into promotion of <b>554 products</b> (<b>8.84%</b> of the promoted products). These products are generating <b>ROAS 53.25%</b>. This money can be reallocated to better products.',
  },
  budgetSpenders: {
    tag: 'Spend concentration',
    value: '0.14%',
    body: '<b>0.14%</b> of all promoted products (<b>9 products</b>) used <b>10%</b> of the total budget.',
  },
  active: {
    tag: 'Active products',
    value: '12.60%',
    body: '<b>12.60%</b> of promoted products (<b>790 products</b>) has more than <b>10 clicks</b> in the last 30 days. These products used <b>68.23% of the budget</b>.',
  },
}

const TAB_INFO = {
  losers: {
    title: 'What are "Loser" products?',
    body: 'Losers are products that generate less revenue than the amount spent on advertising. This means they don\'t even cover their ad costs. These products should be considered for exclusion or their budgets should be significantly reduced.',
  },
  underperformers: {
    title: 'What are "Underperformer" products?',
    body: 'A product is considered underperforming when it has received sufficient testing (e.g., more than xy clicks) but fails to meet the minimum ROAS target. These products are an ideal segment for future optimization.',
  },
  budgetSpenders: {
    title: 'What are "Budget Spenders"?',
    body: 'Budget Spenders are products that take the largest share of your advertising budget. While they may drive revenue, relying on a small group creates risk if they drop out and leaves little budget for other products to prove their potential.',
  },
  active: {
    title: 'What are "Active" products?',
    body: 'Really active products are those that the algorithms have tested (e.g., received more than 10 clicks) and are currently displayed in campaigns. Ideally, your entire portfolio should be promoted. If some products are missing, the algorithms have skipped them.',
  },
}

const ROAS_BUCKETS = [
  { label: '<50%',     min: 0,   max: 50,       color: '#DC2626' },
  { label: '50–100%',  min: 50,  max: 100,      color: '#F97316' },
  { label: '100–150%', min: 100, max: 150,      color: '#F59E0B' },
  { label: '150–200%', min: 150, max: 200,      color: '#A3E635' },
  { label: '200–300%', min: 200, max: 300,      color: '#22C55E' },
  { label: '300%+',    min: 300, max: Infinity, color: '#15803D' },
]

function buildBuckets(products) {
  return ROAS_BUCKETS.map(b => ({
    ...b,
    count: products.filter(p => p.roas >= b.min && p.roas < b.max).length,
  }))
}

function BucketTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="ct">
      <div className="ct-date">{d.label}</div>
      <div className="ct-row">
        <span className="ct-label">Products</span>
        <span className="ct-val">{d.count}</span>
      </div>
    </div>
  )
}

function TabChart({ products }) {
  const data = buildBuckets(products)
  const hasData = data.some(d => d.count > 0)
  if (!hasData) return null
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        ROAS distribution — products in this segment
      </div>
      <ResponsiveContainer width="100%" height={80}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barCategoryGap="20%">
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip content={<BucketTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
          <Bar dataKey="count" radius={[3, 3, 0, 0]} maxBarSize={48}
            label={{ position: 'top', fontSize: 10, fontWeight: 700, fill: '#374151', formatter: v => v > 0 ? v : '' }}>
            {data.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Column definitions: key = data field, string = locale-compare, number = numeric sort
const COLS = [
  { key: 'id',          label: 'Product group ID', type: 'string', gads: false },
  { key: 'name',        label: 'Name',             type: 'string', gads: false },
  { key: 'spend',       label: 'Spend',            type: 'number', gads: true  },
  { key: 'roas',        label: 'ROAS',             type: 'number', gads: true  },
  { key: 'conversions', label: 'Conversions',      type: 'number', gads: true  },
  { key: 'convValue',   label: 'Conv. Value',      type: 'number', gads: true  },
  { key: 'clicks',      label: 'Clicks',           type: 'number', gads: true  },
  { key: 'impressions', label: 'Impressions',      type: 'number', gads: true  },
]

function GadsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 192 192" style={{ marginRight: 3, flexShrink: 0 }}>
      {/* Blue left bar */}
      <path d="M32 160 L96 32 L96 112 L64 160 Z" fill="#4285F4"/>
      {/* Yellow right bar */}
      <path d="M96 32 L160 160 L128 160 L96 112 Z" fill="#FBBC04"/>
      {/* Green circle — top right */}
      <circle cx="160" cy="32" r="32" fill="#34A853"/>
    </svg>
  )
}

function SortArrow({ col, sortCol, sortDir }) {
  const active = sortCol === col
  return (
    <span style={{
      marginLeft: 4, fontSize: 11, lineHeight: 1,
      color: active ? '#6D28D9' : '#D1D5DB',
      transition: 'color 0.15s',
    }}>
      {active && sortDir === 'desc' ? '↓' : '↑'}
    </span>
  )
}

export default function ProductTable({ activeTab: externalTab, onTabChange, onSaveView, externalFilters, period = '30D', periodInfo }) {
  const [internalTab, setInternalTab] = useState('all')
  const activeTab = externalTab ?? internalTab
  function setActiveTab(t) { setInternalTab(t); onTabChange?.(t) }

  const [search,       setSearch]       = useState('')
  const [filters,      setFilters]      = useState([])
  const [sortCol,      setSortCol]      = useState(null)
  const [sortDir,      setSortDir]      = useState('asc')
  const [modalId,      setModalId]      = useState(null)
  const [saveViewOpen, setSaveViewOpen] = useState(false)

  // apply externally triggered filters (from saved view click in sidebar)
  // externalFilters is wrapped as { filters, ts } in App so re-clicking the same view always fires
  useEffect(() => {
    if (externalFilters?.filters) {
      setFilters(externalFilters.filters)
    }
  }, [externalFilters])

  function handleSort(colKey) {
    if (sortCol === colKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(colKey)
      setSortDir('asc')
    }
  }

  const periodProductList = getProductListForPeriod(period)
  const periodOverview    = getOverviewForPeriod(period)
  const ov      = periodOverview[activeTab]    ?? periodOverview.all
  const rawRows = periodProductList[activeTab] ?? periodProductList.all

  const rows = rawRows
    .filter(r => r.id.toLowerCase().includes(search.toLowerCase()))
    .filter(r => filters.every(f => {
      const val = r[f.dataKey] ?? 0
      if (f.op === 'lt') return val < f.value
      if (f.op === 'gt') return val > f.value
      return val === f.value
    }))
    .slice()
    .sort((a, b) => {
      if (!sortCol) return 0
      const col = COLS.find(c => c.key === sortCol)
      const av = a[sortCol] ?? ''
      const bv = b[sortCol] ?? ''
      let cmp = col?.type === 'string'
        ? String(av).localeCompare(String(bv))
        : (av - bv)
      return sortDir === 'asc' ? cmp : -cmp
    })

  return (
    <>
    {modalId && <ProductModal productId={modalId} onClose={() => setModalId(null)} />}
    <div className="section-wrap" style={{ marginBottom: 28 }}>
      <div className="section-title">Product intelligence</div>
      <div className="section-subtitle">A complete analysis of your product portfolio, organized into key product segments.</div>

      {saveViewOpen && (
        <SaveViewModal
          filters={filters}
          periodInfo={periodInfo}
          onSave={(name, f) => onSaveView?.(name, f)}
          onClose={() => setSaveViewOpen(false)}
        />
      )}
      <FilterBar filters={filters} onChange={setFilters} onSaveView={() => setSaveViewOpen(true)} />

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

      {/* Tab info box */}
      {TAB_INFO[activeTab] && (
        <div style={{
          background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 10,
          padding: '14px 18px', marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 14 }}>💬</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#6D28D9' }}>{TAB_INFO[activeTab].title}</span>
          </div>
          <p style={{ fontSize: 13, color: '#4C1D95', lineHeight: 1.65, margin: 0 }}>
            {TAB_INFO[activeTab].body}
          </p>
        </div>
      )}

      {/* Key alert box */}
      {TAB_ALERT[activeTab] && (
        <div style={{
          background: '#FEF9F9', border: '1px solid #FECACA', borderRadius: 10,
          padding: '14px 18px', marginBottom: 16,
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 15 }}>🔴</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#DC2626' }}>Key alerts</span>
          </div>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 12, marginLeft: 22 }}>
            Insights requiring your attention.
          </div>
          {/* Insight card */}
          <div style={{ background: 'white', border: '1px solid #FECACA', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#B45309', marginBottom: 8 }}>
              {TAB_ALERT[activeTab].tag}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: '#DC2626', flexShrink: 0 }}>
                {TAB_ALERT[activeTab].value}
              </span>
              <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.65 }}
                dangerouslySetInnerHTML={{ __html: TAB_ALERT[activeTab].body }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab chart + compact stats */}
      <div style={{ background: 'white', border: '1px solid #F3F4F6', borderRadius: 10, padding: '14px 18px', marginBottom: 16 }}>
        <TabChart products={rawRows} />
        <div style={{ display: 'flex', gap: 0, borderTop: rawRows.length ? '1px solid #F3F4F6' : 'none', paddingTop: rawRows.length ? 12 : 0, flexWrap: 'wrap' }}>
          {[
            { label: 'Products',     value: ov.products.toLocaleString(),   sub: activeTab === 'all' ? '100% of feed' : activeTab === 'inactive' ? 'no spend' : `${((ov.products / segments.total) * 100).toFixed(1)}% of feed` },
            { label: 'Spend',        value: fmt(ov.spend),                  sub: activeTab === 'all' ? '100% of budget' : activeTab === 'inactive' ? 'no spend' : `${((ov.spend / 15395.20) * 100).toFixed(1)}% of budget` },
            { label: 'Revenue',      value: fmt(ov.revenue),                sub: activeTab === 'all' ? '100% of revenue' : `${((ov.revenue / 32441.78) * 100).toFixed(1)}% of revenue` },
            { label: 'Avg ROAS',     value: ov.roas != null ? fmtPct(ov.roas) : '—', sub: activeTab === 'all' ? 'account avg' : ov.roas != null ? `${(ov.roas / 210.73).toFixed(2)}x avg` : 'no data', roasVal: ov.roas },
          ].map((s, i, arr) => (
            <div key={s.label} style={{ flex: '1 1 120px', padding: '0 20px 0 0', borderRight: i < arr.length - 1 ? '1px solid #F3F4F6' : 'none', marginRight: i < arr.length - 1 ? 20 : 0 }}>
              <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: s.roasVal != null && s.roasVal < 100 ? '#DC2626' : '#111827', lineHeight: 1.2 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="search-wrap">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth={2}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
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
                {COLS.map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      {col.gads && <GadsIcon />}
                      {col.label}
                      <SortArrow col={col.key} sortCol={sortCol} sortDir={sortDir} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: '#9CA3AF', padding: 32 }}>No products found</td></tr>
              )}
              {rows.map(r => (
                <tr key={r.id}>
                  <td>
                    <span className="product-id-link" onClick={() => setModalId(r.id)} style={{ cursor: 'pointer' }}>{r.id}</span>
                    {r.variants && <span className="variant-badge">{r.variants} variants</span>}
                  </td>
                  <td style={{ fontSize: 12, color: '#374151', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name || '—'}</td>
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
    </>
  )
}

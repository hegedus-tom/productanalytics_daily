import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import { segments, getProductListForPeriod, getOverviewForPeriod } from '../data/mockData'
import ProductModal from './ProductModal'

function fmt(n) { return '€' + n.toLocaleString('en-EU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function fmtPct(n) { return n.toFixed(2) + '%' }


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

export const TAB_INFO = {
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

const TOTAL_SPEND   = 15395.20
const TOTAL_REVENUE = 32441.78
const AVG_ROAS      = 210.73
const TOTAL_PRODUCTS = segments.total

function SlimBar({ value, max, color, height = 6 }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div style={{ background: '#F3F4F6', borderRadius: 4, height, overflow: 'hidden', flex: 1 }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.4s ease' }} />
    </div>
  )
}

function SegmentCharts({ ov, activeTab }) {
  const isInactive = activeTab === 'inactive'
  const isAll      = activeTab === 'all'

  const prodPct    = isAll ? 100 : (ov.products / TOTAL_PRODUCTS) * 100
  const spendPct   = isAll ? 100 : isInactive ? 0 : (ov.spend / TOTAL_SPEND) * 100
  const revPct     = isAll ? 100 : (ov.revenue / TOTAL_REVENUE) * 100
  const roasRatio  = ov.roas != null ? ov.roas / AVG_ROAS : null

  const roasColor  = ov.roas == null ? '#9CA3AF' : ov.roas < 100 ? '#DC2626' : ov.roas < AVG_ROAS ? '#F59E0B' : '#15803D'

  // Mini comparison bar data (spend vs revenue for this segment)
  const barData = [
    { label: 'Spend',   value: isInactive ? 0 : ov.spend,   fill: '#DDD6FE' },
    { label: 'Revenue', value: ov.revenue, fill: '#A78BFA'  },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>

      {/* Products */}
      <div style={{ background: 'white', border: '1px solid #F3F4F6', borderRadius: 10, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Products</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{ov.products.toLocaleString()}</div>
        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 3 }}>
          {isAll ? '100% of feed' : `${prodPct.toFixed(1)}% of ${TOTAL_PRODUCTS.toLocaleString()} total`}
        </div>
      </div>

      {/* Spend */}
      <div style={{ background: 'white', border: '1px solid #F3F4F6', borderRadius: 10, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Spend</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{isInactive ? '€0' : fmt(ov.spend)}</div>
        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 3 }}>
          {isInactive ? 'No spend in period' : isAll ? '100% of total budget' : `${spendPct.toFixed(1)}% of total budget`}
        </div>
      </div>

      {/* Revenue */}
      <div style={{ background: 'white', border: '1px solid #F3F4F6', borderRadius: 10, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Revenue</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{fmt(ov.revenue)}</div>
        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 3 }}>
          {isAll ? '100% of total revenue' : `${revPct.toFixed(1)}% of total revenue`}
        </div>
      </div>

      {/* ROAS */}
      <div style={{ background: 'white', border: '1px solid #F3F4F6', borderRadius: 10, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Avg ROAS</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: roasColor, lineHeight: 1 }}>
          {ov.roas != null ? fmtPct(ov.roas) : '—'}
        </div>
        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 3 }}>
          {roasRatio != null ? `${roasRatio.toFixed(2)}× account avg` : 'No revenue data'}
        </div>
      </div>

    </div>
  )
}

export default function ProductTable({ activeTab: externalTab, onTabChange, filters = [], setFilters, period = '30D', periodInfo }) {
  const [internalTab, setInternalTab] = useState('all')
  const activeTab = externalTab ?? internalTab
  function setActiveTab(t) { setInternalTab(t); onTabChange?.(t) }

  const [search,  setSearch]  = useState('')
  const [sortCol, setSortCol] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [modalId, setModalId] = useState(null)

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

      {/* Overview slim charts */}
      <SegmentCharts ov={ov} activeTab={activeTab} />

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

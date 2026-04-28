import { useState, useRef } from 'react'
import Sidebar from './components/Sidebar'
import KPISummary from './components/KPISummary'
import PerformanceTrend from './components/PerformanceTrend'
import PerformanceInsights from './components/PerformanceInsights'
import ProductCoverage from './components/ProductCoverage'
import TopMovers from './components/TopMovers'
import ProductTable from './components/ProductTable'
import CurrentView from './views/CurrentView'
import DateRangePicker from './components/DateRangePicker'
import LimitedDateRangePicker from './components/LimitedDateRangePicker'
import LockedSection from './components/LockedSection'
import FilterBar from './components/FilterBar'
import SaveViewModal from './components/SaveViewModal'
import { TAB_INFO } from './components/ProductTable'
import { segments } from './data/mockData'

const PRODUCT_TABS = [
  { key: 'all',             label: 'All products',     count: segments.total,           alert: false },
  { key: 'losers',          label: 'Losers',            count: segments.losers,          alert: true  },
  { key: 'underperformers', label: 'Underperformers',   count: segments.underperformers, alert: true  },
  { key: 'budgetSpenders',  label: 'Budget spenders',   count: segments.budgetSpenders,  alert: true  },
  { key: 'active',          label: 'Active products',   count: segments.active,          alert: true  },
  { key: 'inactive',        label: 'Inactive products', count: segments.inactive,        alert: false },
]

const TAB_DEFAULT_FILTERS = {
  all:             [],
  losers:          [{ key: 'roas',    label: 'ROAS',    dataKey: 'roas',     op: 'lt', value: 100  }],
  underperformers: [{ key: 'roas',    label: 'ROAS',    dataKey: 'roas',     op: 'lt', value: 211  }],
  budgetSpenders:  [{ key: 'spend',   label: 'Spend',   dataKey: 'spend',    op: 'gt', value: 500  }],
  active:          [{ key: 'clicks',  label: 'Clicks',  dataKey: 'clicks',   op: 'gt', value: 10   }],
  inactive:        [{ key: 'spend',   label: 'Spend',   dataKey: 'spend',    op: 'eq', value: 0    }],
}

const TABS = [
  { key: 'daily',   label: 'Daily',   badge: 'New ✦' },
  { key: 'limited', label: 'Limited', badge: 'New ✦' },
  { key: 'current', label: 'Current', badge: null },
]

function DailyContent({ period, periodInfo, onInsightClick, tableRef, productTab, setProductTab, filters, setFilters, limited }) {
  const info = TAB_INFO[productTab]
  return (
    <>
      {info && (
        <div style={{
          background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 10,
          padding: '12px 18px', marginBottom: 20, marginTop: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 13 }}>💬</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#6D28D9' }}>{info.title}</span>
          </div>
          <p style={{ fontSize: 13, color: '#4C1D95', lineHeight: 1.6, margin: 0 }}>{info.body}</p>
        </div>
      )}
      <PerformanceTrend period={period} />
      <PerformanceInsights onInsightClick={onInsightClick} />
      <KPISummary period={period} />
      <hr className="divider" />
      <ProductCoverage />
      <hr className="divider" />
      {limited ? <TopMovers blurBody /> : <TopMovers />}
      <div ref={tableRef}>
        <ProductTable
          activeTab={productTab}
          onTabChange={setProductTab}
          filters={filters}
          setFilters={setFilters}
          period={period}
          periodInfo={periodInfo}
        />
      </div>
    </>
  )
}

export default function App() {
  const [tab, setTab]               = useState('daily')
  const [periodInfo, setPeriodInfo] = useState({ key: '30D', isCustom: false, start: null, end: null })
  const [productTab, setProductTab] = useState('all')
  const [savedViews, setSavedViews] = useState([])
  const [forcedPeriod, setForcedPeriod] = useState(null)
  const [filters, setFilters]           = useState([])
  const [saveViewOpen, setSaveViewOpen] = useState(false)
  const [productTabs, setProductTabs]   = useState([...PRODUCT_TABS])
  const [addingTab, setAddingTab]       = useState(false)
  const [newTabName, setNewTabName]     = useState('')
  const tableRef   = useRef(null)
  const newTabRef  = useRef(null)
  const dragIndex  = useRef(null)

  const period = periodInfo.key

  function handleApply(periodKey, start, end) {
    const isCustom = !periodKey || periodKey === 'custom'
    setPeriodInfo({ key: isCustom ? '30D' : periodKey, isCustom, start, end })
    setForcedPeriod(null)
  }

  function handleInsightClick(tabKey) {
    setProductTab(tabKey)
    setTimeout(() => tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  function handleSaveView(name, f) {
    const savedPeriod = periodInfo.isCustom
      ? { ...periodInfo, start: periodInfo.start?.toISOString(), end: periodInfo.end?.toISOString() }
      : { key: periodInfo.key, isCustom: false }
    setSavedViews(prev => [...prev, { id: Date.now(), name, filters: f, periodInfo: savedPeriod }])
  }

  function handleSelectView(view) {
    if (view.filters) setFilters(view.filters)
    if (view.periodInfo) {
      setPeriodInfo(view.periodInfo)
      setForcedPeriod({ ...view.periodInfo, ts: Date.now() })
    }
    setTimeout(() => tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* ── Top tab bar ── */}
      <div style={{
        height: 42, background: 'white', borderBottom: '1px solid #E5E7EB',
        display: 'flex', alignItems: 'stretch', flexShrink: 0, paddingLeft: 24, zIndex: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', paddingRight: 24, borderRight: '1px solid #F3F4F6', marginRight: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#111827', letterSpacing: '-0.03em' }}>
            d<span style={{ color: '#DC2626' }}>•</span>tidot
          </span>
        </div>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '0 20px', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: tab === t.key ? 700 : 500,
            color: tab === t.key ? '#6D28D9' : '#6B7280',
            borderBottom: tab === t.key ? '2px solid #6D28D9' : '2px solid transparent',
            display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit',
          }}>
            {t.label}
            {t.badge && <span style={{ fontSize: 10, fontWeight: 700, background: '#EDE9FE', color: '#6D28D9', padding: '2px 6px', borderRadius: 20 }}>{t.badge}</span>}
          </button>
        ))}
      </div>

      {/* ── Body ── */}
      <div className="app" style={{ flex: 1, overflow: 'hidden' }}>
        <Sidebar
          savedViews={savedViews}
          onSelectView={handleSelectView}
          onDeleteView={id => setSavedViews(prev => prev.filter(v => v.id !== id))}
        />

        <div className="main" style={{ display: 'flex', flexDirection: 'column' }}>

          {/* Sticky header area */}
          <div style={{ position: 'sticky', top: 0, flexShrink: 0, background: 'white', borderBottom: '1px solid #E5E7EB', zIndex: 10 }}>
            {/* Title + date picker row */}
            <div className="page-header" style={{ borderBottom: 'none', paddingBottom: 6 }}>
              <h1 className="page-title">Product analytics</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {tab === 'daily' ? (
                  <DateRangePicker onApply={handleApply} forcedPeriod={forcedPeriod} />
                ) : tab === 'limited' ? (
                  <LimitedDateRangePicker onApply={handleApply} forcedPeriod={forcedPeriod} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: 'white', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#374151' }}>
                    <span>📅</span> Last 30 days <span style={{ color: '#9CA3AF' }}>▾</span>
                  </div>
                )}
              </div>
            </div>

            {/* Filter bar + product tabs — only for daily + limited */}
            {tab !== 'current' && (
              <>
                {saveViewOpen && (
                  <SaveViewModal
                    filters={filters}
                    periodInfo={periodInfo}
                    onSave={(name, f) => { handleSaveView(name, f); setSaveViewOpen(false) }}
                    onClose={() => setSaveViewOpen(false)}
                  />
                )}
                <div style={{ display: 'flex', gap: 0, overflowX: 'auto', padding: '0 24px', alignItems: 'center', borderBottom: '1px solid #F3F4F6' }}>
                  {productTabs.map((t, i) => (
                    <button
                      key={t.key}
                      draggable
                      onDragStart={() => { dragIndex.current = i }}
                      onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderLeft = '2px solid #6D28D9' }}
                      onDragLeave={e => { e.currentTarget.style.borderLeft = '' }}
                      onDrop={e => {
                        e.currentTarget.style.borderLeft = ''
                        const from = dragIndex.current
                        if (from === null || from === i) return
                        setProductTabs(prev => {
                          const next = [...prev]
                          const [moved] = next.splice(from, 1)
                          next.splice(i, 0, moved)
                          return next
                        })
                        dragIndex.current = null
                      }}
                      onDragEnd={() => { dragIndex.current = null }}
                      onClick={() => { setProductTab(t.key); if (TAB_DEFAULT_FILTERS[t.key]) setFilters(TAB_DEFAULT_FILTERS[t.key]) }}
                      style={{
                        padding: '10px 16px', border: 'none', borderBottom: `2px solid ${productTab === t.key ? '#6D28D9' : 'transparent'}`,
                        background: 'none', cursor: 'grab', fontFamily: 'inherit',
                        fontSize: 13, fontWeight: productTab === t.key ? 700 : 500,
                        color: productTab === t.key ? '#6D28D9' : '#6B7280',
                        display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
                        flexShrink: 0, userSelect: 'none',
                      }}
                    >
                      {t.label}
                      {t.count != null && (
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: '1px 6px', borderRadius: 20,
                          background: t.alert && productTab !== t.key ? '#FEE2E2' : '#F3F4F6',
                          color: t.alert && productTab !== t.key ? '#DC2626' : '#6B7280',
                        }}>
                          {t.alert && productTab !== t.key && '⚠ '}{t.count.toLocaleString()}
                        </span>
                      )}
                      {t.custom && (
                        <span
                          onClick={e => { e.stopPropagation(); setProductTabs(prev => prev.filter(c => c.key !== t.key)); if (productTab === t.key) setProductTab('all') }}
                          style={{ marginLeft: 2, color: '#D1D5DB', fontSize: 14, lineHeight: 1, cursor: 'pointer' }}
                          title="Remove tab"
                        >×</span>
                      )}
                    </button>
                  ))}

                  {/* Add tab */}
                  {addingTab ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', marginLeft: 4 }}>
                      <input
                        ref={newTabRef}
                        autoFocus
                        value={newTabName}
                        onChange={e => setNewTabName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && newTabName.trim()) {
                            const key = `custom_${Date.now()}`
                            setProductTabs(prev => [...prev, { key, label: newTabName.trim(), custom: true }])
                            setProductTab(key)
                            setNewTabName('')
                            setAddingTab(false)
                          }
                          if (e.key === 'Escape') { setAddingTab(false); setNewTabName('') }
                        }}
                        onBlur={() => { setAddingTab(false); setNewTabName('') }}
                        placeholder="Tab name…"
                        style={{
                          fontSize: 13, border: '1px solid #C4B5FD', borderRadius: 6,
                          padding: '4px 10px', outline: 'none', fontFamily: 'inherit',
                          width: 130, color: '#374151',
                        }}
                      />
                      <span style={{ fontSize: 11, color: '#9CA3AF' }}>↵ to add</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingTab(true)}
                      title="Add tab"
                      style={{
                        marginLeft: 6, width: 28, height: 28, borderRadius: 6,
                        border: '1.5px dashed #D1D5DB', background: 'none',
                        color: '#9CA3AF', fontSize: 18, lineHeight: 1, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#6D28D9'; e.currentTarget.style.color = '#6D28D9' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.color = '#9CA3AF' }}
                    >+</button>
                  )}
                </div>
                <div style={{ padding: '6px 24px' }}>
                  <FilterBar
                    filters={filters}
                    onChange={setFilters}
                    onSaveView={() => setSaveViewOpen(true)}
                  />
                </div>
              </>
            )}
          </div>

          <div className="content">
            {tab === 'daily' && (
              <DailyContent period={period} periodInfo={periodInfo} onInsightClick={handleInsightClick} tableRef={tableRef}
                productTab={productTab} setProductTab={setProductTab}
                filters={filters} setFilters={setFilters} />
            )}
            {tab === 'limited' && (
              <DailyContent period={period} periodInfo={periodInfo} onInsightClick={handleInsightClick} tableRef={tableRef}
                productTab={productTab} setProductTab={setProductTab}
                filters={filters} setFilters={setFilters} limited />
            )}
            {tab === 'current' && <CurrentView />}
          </div>
        </div>
      </div>
    </div>
  )
}

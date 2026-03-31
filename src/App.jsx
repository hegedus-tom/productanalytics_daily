import { useState, useRef } from 'react'
import Sidebar from './components/Sidebar'
import KPISummary from './components/KPISummary'
import PerformanceTrend from './components/PerformanceTrend'
import PerformanceInsights from './components/PerformanceInsights'
import DayOfWeekChart from './components/DayOfWeekChart'
import ProductCoverage from './components/ProductCoverage'
import TopMovers from './components/TopMovers'
import ProductTable from './components/ProductTable'
import CurrentView from './views/CurrentView'
import DateRangePicker from './components/DateRangePicker'
import LimitedDateRangePicker from './components/LimitedDateRangePicker'
import LockedSection from './components/LockedSection'

const TABS = [
  { key: 'daily',   label: 'Daily',   badge: 'New ✦' },
  { key: 'limited', label: 'Limited', badge: 'New ✦' },
  { key: 'current', label: 'Current', badge: null },
]

function DailyContent({ period, periodInfo, onInsightClick, tableRef, productTab, setProductTab, onSaveView, activeViewFilters, limited }) {
  return (
    <>
      <KPISummary period={period} />
      <PerformanceInsights onInsightClick={onInsightClick} />
      <PerformanceTrend period={period} />
      <hr className="divider" />
      <ProductCoverage />
      <hr className="divider" />
      {limited ? <TopMovers blurBody /> : <TopMovers />}
      <DayOfWeekChart />
      <div ref={tableRef}>
        <ProductTable
          activeTab={productTab}
          onTabChange={setProductTab}
          onSaveView={onSaveView}
          externalFilters={activeViewFilters}
          period={period}
          periodInfo={periodInfo}
        />
      </div>
    </>
  )
}

export default function App() {
  const [tab, setTab]               = useState('daily')
  const [periodInfo, setPeriodInfo] = useState({ key: '7D', isCustom: false, start: null, end: null })
  const [productTab, setProductTab] = useState('all')
  const [savedViews, setSavedViews] = useState([])
  const [activeViewFilters, setActiveViewFilters] = useState(null)
  // used to force DateRangePicker to reflect a loaded view's period
  const [forcedPeriod, setForcedPeriod] = useState(null)
  const tableRef = useRef(null)

  const period = periodInfo.key

  function handleApply(periodKey, start, end) {
    const isCustom = !periodKey || periodKey === 'custom'
    setPeriodInfo({ key: isCustom ? '30D' : periodKey, isCustom, start, end })
    setForcedPeriod(null) // user made a manual change, clear forced
  }

  function handleInsightClick(tabKey) {
    setProductTab(tabKey)
    setTimeout(() => tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  function handleSaveView(name, filters) {
    // For dynamic presets (7D etc.) keep key only; for custom, snapshot the dates
    const savedPeriod = periodInfo.isCustom
      ? { ...periodInfo, start: periodInfo.start?.toISOString(), end: periodInfo.end?.toISOString() }
      : { key: periodInfo.key, isCustom: false }
    setSavedViews(prev => [...prev, { id: Date.now(), name, filters, periodInfo: savedPeriod }])
  }

  function handleSelectView(view) {
    setActiveViewFilters({ filters: view.filters, ts: Date.now() })
    // restore period from the saved view
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

        <div className="main">
          <div className="page-header">
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

          <div className="content">
            {tab === 'daily' && (
              <DailyContent period={period} periodInfo={periodInfo} onInsightClick={handleInsightClick} tableRef={tableRef}
                productTab={productTab} setProductTab={setProductTab}
                onSaveView={handleSaveView} activeViewFilters={activeViewFilters} />
            )}
            {tab === 'limited' && (
              <DailyContent period={period} periodInfo={periodInfo} onInsightClick={handleInsightClick} tableRef={tableRef}
                productTab={productTab} setProductTab={setProductTab}
                onSaveView={handleSaveView} activeViewFilters={activeViewFilters} limited />
            )}
            {tab === 'current' && <CurrentView />}
          </div>
        </div>
      </div>
    </div>
  )
}

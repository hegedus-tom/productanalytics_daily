import { useState } from 'react'
import Sidebar from './components/Sidebar'
import KPISummary from './components/KPISummary'
import PerformanceTrend from './components/PerformanceTrend'
import PerformanceInsights from './components/PerformanceInsights'
import ProductCatalogOverview from './components/ProductCatalogOverview'
import DayOfWeekChart from './components/DayOfWeekChart'
import ProductCoverage from './components/ProductCoverage'
import TopMovers from './components/TopMovers'
import ProductTable from './components/ProductTable'
import CurrentView from './views/CurrentView'

const PERIODS = ['7D', '14D', '30D']
const PERIOD_LABELS = { '7D': 'Last 7 days', '14D': 'Last 14 days', '30D': 'Last 30 days' }

export default function App() {
  const [tab, setTab]       = useState('daily')   // 'daily' | 'current'
  const [period, setPeriod] = useState('30D')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* ── Top tab bar ───────────────────────────────────────────────── */}
      <div style={{
        height: 42, background: 'white', borderBottom: '1px solid #E5E7EB',
        display: 'flex', alignItems: 'stretch', flexShrink: 0, paddingLeft: 24,
        zIndex: 20,
      }}>
        {/* Logo mark */}
        <div style={{ display: 'flex', alignItems: 'center', paddingRight: 24, borderRight: '1px solid #F3F4F6', marginRight: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#111827', letterSpacing: '-0.03em' }}>
            d<span style={{ color: '#DC2626' }}>•</span>tidot
          </span>
        </div>

        {[
          { key: 'daily',   label: 'Daily',   badge: 'New ✦' },
          { key: 'current', label: 'Current',  badge: null },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '0 20px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: tab === t.key ? 700 : 500,
              color: tab === t.key ? '#6D28D9' : '#6B7280',
              borderBottom: tab === t.key ? '2px solid #6D28D9' : '2px solid transparent',
              display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit',
            }}
          >
            {t.label}
            {t.badge && (
              <span style={{
                fontSize: 10, fontWeight: 700, background: '#EDE9FE', color: '#6D28D9',
                padding: '2px 6px', borderRadius: 20,
              }}>
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Body (sidebar + main) ─────────────────────────────────────── */}
      <div className="app" style={{ flex: 1, overflow: 'hidden' }}>
        <Sidebar />

        <div className="main">
          {/* Page header */}
          <div className="page-header">
            <h1 className="page-title">Product analytics</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {tab === 'daily' ? (
                <div className="period-selector">
                  {PERIODS.map(p => (
                    <button key={p} className={`period-btn ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
                      {PERIOD_LABELS[p]}
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px',
                  background: 'white', border: '1px solid #E5E7EB', borderRadius: 8,
                  fontSize: 13, fontWeight: 500, color: '#374151',
                }}>
                  <span>📅</span> Last 30 days <span style={{ color: '#9CA3AF' }}>▾</span>
                </div>
              )}
            </div>
          </div>

          <div className="content">
            {tab === 'daily' ? (
              <>
                <KPISummary period={period} />
                <PerformanceTrend period={period} />
                <PerformanceInsights />
                <hr className="divider" />
                <ProductCatalogOverview />
                <DayOfWeekChart />
                <hr className="divider" />
                <ProductCoverage />
                <hr className="divider" />
                <TopMovers />
                <ProductTable />
              </>
            ) : (
              <CurrentView />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

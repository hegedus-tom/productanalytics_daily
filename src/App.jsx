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

const PERIODS = ['7D', '14D', '30D']
const PERIOD_LABELS = { '7D': 'Last 7 days', '14D': 'Last 14 days', '30D': 'Last 30 days' }

export default function App() {
  const [period, setPeriod] = useState('30D')

  return (
    <div className="app">
      <Sidebar />

      <div className="main">
        {/* Page header */}
        <div className="page-header">
          <h1 className="page-title">Product analytics</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="period-selector">
              {PERIODS.map(p => (
                <button
                  key={p}
                  className={`period-btn ${period === p ? 'active' : ''}`}
                  onClick={() => setPeriod(p)}
                >
                  {PERIOD_LABELS[p]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="content">
          {/* 1. KPI cards with period comparison */}
          <KPISummary period={period} />

          {/* 2. Performance trend — the centrepiece of daily data */}
          <PerformanceTrend period={period} />

          {/* 3. Performance insights / alerts */}
          <PerformanceInsights />

          <hr className="divider" />

          {/* 4. Product catalog overview + active product sparkline */}
          <ProductCatalogOverview />

          {/* 5. Best days to advertise (day-of-week) */}
          <DayOfWeekChart />

          <hr className="divider" />

          {/* 6. Product coverage / budget concentration */}
          <ProductCoverage />

          <hr className="divider" />

          {/* 7. Top movers week-over-week */}
          <TopMovers />

          {/* 8. Full product analytics table */}
          <ProductTable />
        </div>
      </div>
    </div>
  )
}

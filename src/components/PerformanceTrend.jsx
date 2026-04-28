import { useState } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts'
import { dailyStats } from '../data/mockData'
import HowToRead from './HowToRead'

const AVG_ROAS = 228

// 7-day rolling average
function withRollingAvg(data) {
  return data.map((d, i) => {
    const window = data.slice(Math.max(0, i - 6), i + 1).filter(x => x.roas != null && !x.partial)
    const avg = window.length ? window.reduce((s, x) => s + x.roas, 0) / window.length : null
    return { ...d, roasAvg: avg != null ? parseFloat(avg.toFixed(1)) : null }
  })
}

function CustomDot(props) {
  const { cx, cy, payload } = props
  if (!payload.anomaly || payload.anomaly === 'partial') return null
  const color = payload.anomaly === 'low' ? '#DC2626' : '#16A34A'
  return <circle cx={cx} cy={cy} r={5} fill={color} stroke="white" strokeWidth={2} />
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null

  const roasAvgEntry = payload.find(p => p.dataKey === 'roasAvg')

  return (
    <div className="ct">
      <div className="ct-date">{d.date} ({d.dow})</div>
      <div className="ct-row">
        <span className="ct-label">Spend</span>
        <span className="ct-val">€{d.spend?.toFixed(2)}</span>
      </div>
      <div className="ct-row">
        <span className="ct-label">Revenue</span>
        <span className="ct-val">€{d.revenue?.toFixed(2)}</span>
      </div>
      <div className="ct-row">
        <span className="ct-label">ROAS</span>
        <span className="ct-val" style={{ color: d.roas < 100 ? '#DC2626' : d.roas > 300 ? '#15803D' : '#111827', fontWeight: 700 }}>
          {d.roas != null ? d.roas.toFixed(1) + '%' : '–'}
        </span>
      </div>
      {roasAvgEntry?.value != null && (
        <div className="ct-row">
          <span className="ct-label">7-day avg ROAS</span>
          <span className="ct-val" style={{ color: '#7C3AED' }}>{roasAvgEntry.value.toFixed(1)}%</span>
        </div>
      )}
      {d.anomaly === 'low'     && <div className="ct-anomaly">⚠ ROAS below normal — check product segments</div>}
      {d.anomaly === 'high'    && <div className="ct-anomaly" style={{ color: '#15803D' }}>★ Unusually strong ROAS day</div>}
      {d.anomaly === 'partial' && <div className="ct-anomaly" style={{ color: '#92400E' }}>⏳ Partial day — data still syncing</div>}
    </div>
  )
}

const OVERLAYS = [
  { key: 'revenue', label: 'Revenue', color: '#0EA5E9' },
]

export default function PerformanceTrend({ period }) {
  const [active, setActive] = useState(new Set()) // which overlays are on

  function toggleOverlay(key) {
    setActive(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const valid  = dailyStats.filter(d => !d.partial)
  const sliced = period === '7D' ? valid.slice(-7) : period === '14D' ? valid.slice(-14) : valid
  const withPartial = period === '30D' ? [...sliced, dailyStats[dailyStats.length - 1]] : sliced
  const data   = withRollingAvg(withPartial)

  const anomalyDays = data.filter(d => d.anomaly === 'low')
  const showRevenue = active.has('revenue')

  return (
    <div className="card section-wrap" style={{ marginBottom: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <div>
          <div className="card-title">Performance over time</div>
          <div className="card-subtitle">
            Daily spend, ROAS and 7-day rolling average — add overlays to correlate metrics
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>Overlay:</span>
          {OVERLAYS.map(o => (
            <button
              key={o.key}
              onClick={() => toggleOverlay(o.key)}
              style={{
                padding: '5px 12px', borderRadius: 6,
                border: `1.5px solid ${active.has(o.key) ? o.color : '#E5E7EB'}`,
                background: active.has(o.key) ? o.color + '15' : 'white',
                color: active.has(o.key) ? o.color : '#6B7280',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              {active.has(o.key) && <span style={{ fontSize: 10 }}>✓</span>}
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Anomaly banner */}
      {anomalyDays.length > 0 && (
        <div className="anomaly-banner">
          <span>⚠</span>
          <span>
            <b>Low ROAS detected</b> on {anomalyDays.map(d => d.dateShort).join(', ')}.
            Spend was active but returns were below target ROAS. Review product segments below.
          </span>
        </div>
      )}

      <HowToRead text="Spend bars show daily budget. The purple line is daily ROAS — the dashed line smooths it to a 7-day average so you can separate real trends from daily noise. Red/green dots flag outlier days. Toggle Revenue to see how it moves together with ROAS." />

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 10, right: 60, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis
            dataKey="dateShort"
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false} tickLine={false}
            interval={period === '30D' ? 4 : period === '14D' ? 1 : 0}
          />
          {/* Left Y: spend + revenue */}
          <YAxis
            yAxisId="left"
            tickFormatter={v => `€${v}`}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false} tickLine={false}
            width={55}
          />
          {/* Right Y: ROAS % */}
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={v => `${v}%`}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false} tickLine={false}
            width={50}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Reference lines */}
          <ReferenceLine yAxisId="right" y={100}
            stroke="#FCA5A5" strokeDasharray="5 4" strokeWidth={1.5}
            label={{ value: 'Target ROAS', position: 'right', fill: '#EF4444', fontSize: 10 }} />
          <ReferenceLine yAxisId="right" y={AVG_ROAS}
            stroke="#C4B5FD" strokeDasharray="5 4" strokeWidth={1.5}
            label={{ value: 'Avg ROAS', position: 'right', fill: '#7C3AED', fontSize: 10 }} />

          {/* Spend bars — always */}
          <Bar yAxisId="left" dataKey="spend" fill="#DDD6FE" radius={[3, 3, 0, 0]} name="Spend (€)" maxBarSize={28} />

          {/* Revenue overlay */}
          {showRevenue && (
            <Line yAxisId="left" type="monotone" dataKey="revenue"
              stroke="#0EA5E9" strokeWidth={2} dot={false} activeDot={{ r: 4 }} name="Revenue (€)" />
          )}

          {/* ROAS line — always */}
          <Line yAxisId="right" type="monotone" dataKey="roas"
            stroke="#7C3AED" strokeWidth={2.5}
            dot={<CustomDot />} activeDot={{ r: 5, fill: '#7C3AED' }}
            connectNulls={false} name="ROAS (%)" />

          {/* 7-day rolling average — always */}
          <Line yAxisId="right" type="monotone" dataKey="roasAvg"
            stroke="#7C3AED" strokeWidth={1.5} strokeDasharray="6 3"
            dot={false} activeDot={false} name="7-day avg ROAS" connectNulls />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginTop: 12, fontSize: 11, color: '#9CA3AF', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 14, height: 10, borderRadius: 2, background: '#DDD6FE', display: 'inline-block' }} />
          Daily spend
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 28, height: 2.5, background: '#7C3AED', display: 'inline-block', borderRadius: 2 }} />
          ROAS
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 28, height: 0, borderTop: '2px dashed #7C3AED', display: 'inline-block' }} />
          7-day avg ROAS
        </span>
        {showRevenue && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 28, height: 2, background: '#0EA5E9', display: 'inline-block', borderRadius: 2 }} />
            Revenue
          </span>
        )}
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#DC2626', display: 'inline-block' }} />
          Low ROAS day
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
          High ROAS day
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 28, height: 2, background: '#FCA5A5', display: 'inline-block' }} />
          Target ROAS (100%)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 28, height: 2, background: '#C4B5FD', display: 'inline-block' }} />
          Avg ROAS ({AVG_ROAS}%)
        </span>
      </div>
    </div>
  )
}

import { useState } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Legend
} from 'recharts'
import { dailyStats } from '../data/mockData'
import HowToRead from './HowToRead'

const AVG_ROAS = 228

function CustomDot(props) {
  const { cx, cy, payload } = props
  if (!payload.anomaly || payload.anomaly === 'partial') return null
  const color = payload.anomaly === 'low' ? '#DC2626' : '#16A34A'
  return <circle cx={cx} cy={cy} r={5} fill={color} stroke="white" strokeWidth={2} />
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  return (
    <div className="ct">
      <div className="ct-date">{d?.date} ({d?.dow})</div>
      <div className="ct-row">
        <span className="ct-label">Spend</span>
        <span className="ct-val">€{d?.spend?.toFixed(2)}</span>
      </div>
      <div className="ct-row">
        <span className="ct-label">Revenue</span>
        <span className="ct-val">€{d?.revenue?.toFixed(2)}</span>
      </div>
      <div className="ct-row">
        <span className="ct-label">ROAS</span>
        <span className="ct-val" style={{ color: d?.roas < 100 ? '#DC2626' : d?.roas > 300 ? '#15803D' : '#111827' }}>
          {d?.roas != null ? d.roas.toFixed(1) + '%' : '–'}
        </span>
      </div>
      <div className="ct-row">
        <span className="ct-label">Clicks</span>
        <span className="ct-val">{d?.clicks?.toLocaleString()}</span>
      </div>
      <div className="ct-row">
        <span className="ct-label">Active products</span>
        <span className="ct-val">{d?.activeProducts?.toLocaleString()}</span>
      </div>
      {d?.anomaly === 'low'     && <div className="ct-anomaly">⚠ ROAS below normal — check budget allocation</div>}
      {d?.anomaly === 'high'    && <div className="ct-anomaly" style={{ color: '#15803D' }}>★ Unusually strong ROAS day</div>}
      {d?.anomaly === 'partial' && <div className="ct-anomaly" style={{ color: '#92400E' }}>⏳ Partial day — data still syncing</div>}
    </div>
  )
}

const METRIC_CONFIG = {
  roas: {
    subtitle:   'Daily spend vs ROAS — see how your return on ad spend is trending',
    howToRead:  'Bars show how much you spent each day. The purple line shows your ROAS — the higher, the better. Red dots = days your ROAS was dangerously low. Green dots = exceptional days. The dashed line at 100% is break-even: below it, you\'re losing money.',
    lineLabel:  'ROAS (%)',
    lineColor:  '#7C3AED',
  },
  revenue: {
    subtitle:   'Daily spend vs revenue — see how much your ads are generating',
    howToRead:  'Bars show how much you spent each day. The blue line shows your daily revenue. When the revenue line is far above the bars, your ads are generating strong returns. A narrowing gap may signal declining efficiency.',
    lineLabel:  'Revenue (€)',
    lineColor:  '#0EA5E9',
  },
  clicks: {
    subtitle:   'Daily spend vs clicks — see how much traffic your ads are driving',
    howToRead:  'Bars show daily spend. The amber line shows how many clicks your ads received each day. Compare spend to clicks to spot days where you paid more per click — a sign of rising competition or worsening quality scores.',
    lineLabel:  'Clicks',
    lineColor:  '#F59E0B',
  },
}

export default function PerformanceTrend({ period }) {
  const [metric, setMetric] = useState('roas')
  const cfg = METRIC_CONFIG[metric]

  const valid = dailyStats.filter(d => !d.partial)
  const sliced = period === '7D' ? valid.slice(-7) : period === '14D' ? valid.slice(-14) : valid

  // include partial day at end for 30D so the chart shows it grayed
  const data = period === '30D' ? [...sliced, dailyStats[dailyStats.length - 1]] : sliced

  const anomalyDays = data.filter(d => d.anomaly === 'low')
  const hasLow = anomalyDays.length > 0

  return (
    <div className="card section-wrap" style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <div>
          <div className="card-title">Performance over time</div>
          <div className="card-subtitle">{cfg.subtitle}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 11, background: '#EDE9FE', color: '#6D28D9', padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>
            New with daily data
          </span>
          {['roas', 'revenue', 'clicks'].map(m => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              style={{
                padding: '5px 12px', borderRadius: 6, border: '1px solid #E5E7EB',
                background: metric === m ? '#6D28D9' : 'white',
                color: metric === m ? 'white' : '#6B7280',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
              }}
            >
              {m === 'roas' ? 'ROAS' : m === 'revenue' ? 'Revenue' : 'Clicks'}
            </button>
          ))}
        </div>
      </div>

      {hasLow && (
        <div className="anomaly-banner">
          <span>⚠</span>
          <span>
            <b>Low ROAS detected</b> on {anomalyDays.map(d => d.dateShort).join(', ')}.
            Budget was spent but returns were below break-even. Check product segments below.
          </span>
        </div>
      )}

      <HowToRead text={cfg.howToRead} />

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 10, right: 55, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis
            dataKey="dateShort"
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false} tickLine={false}
            interval={period === '30D' ? 4 : period === '14D' ? 1 : 0}
          />
          <YAxis
            yAxisId="left"
            tickFormatter={v => `€${v}`}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false} tickLine={false}
            width={55}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={v => metric === 'clicks' ? v.toLocaleString() : `${v}%`}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false} tickLine={false}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          {metric === 'roas' && <>
            <ReferenceLine
              yAxisId="right" y={100}
              stroke="#FCA5A5" strokeDasharray="5 4" strokeWidth={1.5}
              label={{ value: 'Break-even', position: 'right', fill: '#EF4444', fontSize: 10 }}
            />
            <ReferenceLine
              yAxisId="right" y={AVG_ROAS}
              stroke="#C4B5FD" strokeDasharray="5 4" strokeWidth={1.5}
              label={{ value: 'Avg ROAS', position: 'right', fill: '#7C3AED', fontSize: 10 }}
            />
          </>}
          <Bar
            yAxisId="left"
            dataKey="spend"
            fill="#DDD6FE"
            radius={[3, 3, 0, 0]}
            name="Spend (€)"
            maxBarSize={28}
          />
          {metric === 'roas' && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="roas"
              stroke="#7C3AED"
              strokeWidth={2.5}
              dot={<CustomDot />}
              activeDot={{ r: 5, fill: '#7C3AED' }}
              connectNulls={false}
              name="ROAS (%)"
            />
          )}
          {metric === 'revenue' && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#0EA5E9"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
              name="Revenue (€)"
            />
          )}
          {metric === 'clicks' && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="clicks"
              stroke="#F59E0B"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
              name="Clicks"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      <div style={{ display: 'flex', gap: 20, marginTop: 12, fontSize: 11, color: '#9CA3AF', flexWrap: 'wrap' }}>
        {/* Always shown */}
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 14, height: 10, borderRadius: 2, background: '#DDD6FE', display: 'inline-block' }} />
          Daily spend
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 28, height: 2, background: cfg.lineColor, display: 'inline-block', borderRadius: 2 }} />
          {cfg.lineLabel}
        </span>

        {/* ROAS-only items */}
        {metric === 'roas' && <>
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
            Break-even (100%)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 28, height: 2, background: '#C4B5FD', display: 'inline-block' }} />
            Avg ROAS ({AVG_ROAS}%)
          </span>
        </>}
      </div>
    </div>
  )
}

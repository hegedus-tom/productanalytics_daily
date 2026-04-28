import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from 'recharts'
import { dowStats } from '../data/mockData'
import HowToRead from './HowToRead'
import UpgradeModal from './UpgradeModal'
import { useState } from 'react'

const AVG = 228

function barColor(roas) {
  if (roas >= 270) return '#16A34A'
  if (roas >= 210) return '#7C3AED'
  if (roas >= 175) return '#F59E0B'
  return '#DC2626'
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="ct">
      <div className="ct-date">{d.day}</div>
      <div className="ct-row"><span className="ct-label">Avg ROAS</span><span className="ct-val">{d.roas.toFixed(1)}%</span></div>
      <div className="ct-row"><span className="ct-label">Avg Spend</span><span className="ct-val">€{d.avgSpend.toFixed(0)}</span></div>
      <div className="ct-row"><span className="ct-label">Avg Revenue</span><span className="ct-val">€{d.avgRevenue.toFixed(0)}</span></div>
      <div style={{ marginTop: 8, fontSize: 11, color: d.roas >= AVG ? '#15803D' : '#DC2626', fontWeight: 600 }}>
        {d.roas >= AVG
          ? `↑ ${(d.roas - AVG).toFixed(0)}pp above average`
          : `↓ ${(AVG - d.roas).toFixed(0)}pp below average`}
      </div>
    </div>
  )
}

export default function DayOfWeekChart({ blurBody }) {
  const [showUpgrade, setShowUpgrade] = useState(false)
  const best = [...dowStats].sort((a, b) => b.roas - a.roas)[0]

  const body = (
    <>
      <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#15803D' }}>
        <b>Tip:</b> Your campaigns perform best on <b>{best.day}s</b> with an average ROAS of <b>{best.roas.toFixed(1)}%</b>.
        Consider increasing bids or budgets on {best.day}s.
      </div>

      <HowToRead text="This chart shows the average ROAS for each day of the week over the last 30 days. Green bars = above your average. Orange bars = below average. Use this to decide when to increase or reduce your ad spend." />

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={dowStats} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={45} domain={[0, 350]} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={AVG} stroke="#C4B5FD" strokeDasharray="5 4" strokeWidth={1.5}
            label={{ value: `Avg ${AVG}%`, position: 'right', fill: '#7C3AED', fontSize: 10 }} />
          <Bar dataKey="roas" radius={[4, 4, 0, 0]} maxBarSize={52} label={{ position: 'top', fontSize: 11, fontWeight: 700, formatter: v => `${v.toFixed(0)}%`, fill: '#374151' }}>
            {dowStats.map((d, i) => (
              <Cell key={i} fill={barColor(d.roas)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 11, color: '#9CA3AF', flexWrap: 'wrap' }}>
        {[['#16A34A', '≥270% ROAS (excellent)'], ['#7C3AED', '210–270% ROAS (good)'], ['#F59E0B', '175–210% ROAS (ok)'], ['#DC2626', '<175% ROAS (low)']].map(([color, label]) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: 'inline-block' }} />
            {label}
          </span>
        ))}
      </div>
    </>
  )

  return (
    <>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      <div className="card section-wrap" style={{ marginBottom: 28 }}>
        {/* Header — always visible */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div>
            <div className="card-title">Best days to advertise</div>
            <div className="card-subtitle">Average ROAS by day of week — where your budget works hardest</div>
          </div>
        </div>

        {/* Body */}
        {blurBody ? (
          <div style={{ position: 'relative' }}>
            <div style={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.6 }}>
              {body}
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: 'white', borderRadius: 16, padding: '24px 32px', boxShadow: '0 8px 40px rgba(0,0,0,0.13)', textAlign: 'center', maxWidth: 340, border: '1px solid #EDE9FE' }}>
                <div style={{ width: 44, height: 44, background: '#EDE9FE', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6D28D9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Upgrade to unlock this section</div>
                <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, marginBottom: 18 }}>
                  Day-of-week ROAS patterns require more than 7 days of data.
                </div>
                <button
                  onClick={() => setShowUpgrade(true)}
                  style={{ width: '100%', padding: '10px', borderRadius: 10, border: 'none', background: '#6D28D9', fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  onMouseEnter={e => e.currentTarget.style.background = '#5B21B6'}
                  onMouseLeave={e => e.currentTarget.style.background = '#6D28D9'}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Unlock
                </button>
              </div>
            </div>
          </div>
        ) : body}
      </div>
    </>
  )
}

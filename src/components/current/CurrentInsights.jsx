import { useState } from 'react'

const insights = [
  {
    tag: 'Where you\'re losing money',
    value: '€4,155.14',
    body: '<b>26.99%</b> of the total budget has been spent on products with <b>ROAS lower than 100%</b>. This money goes into promotion of <b>509 products</b> (<b>8.12%</b> of the promoted products). These products are generating <b>ROAS 11.60%</b>. This money can be reallocated to better products.',
  },
  {
    tag: 'Spend on low-ROAS products',
    value: '€5,904.87',
    body: '<b>38.36%</b> of the total budget has been invested in products with <b>ROAS lower than 210.73%</b>. This budget goes into promotion of <b>554 products</b> (<b>8.84%</b> of the promoted products). These products are generating <b>ROAS 53.25%</b>. This money can be reallocated to better products.',
  },
  {
    tag: 'Spend concentration',
    value: '0.14%',
    body: '<b>0.14%</b> of all promoted products (<b>9 products</b>) used <b>10%</b> of the total budget.',
  },
  {
    tag: 'Active products',
    value: '12.60%',
    body: '<b>12.60%</b> of promoted products (<b>790 products</b>) has more than <b>10 clicks</b> in the last 30 days. These products used <b>68.23% of the budget</b>.',
  },
]

export default function CurrentInsights() {
  const [open, setOpen] = useState({})
  const toggle = i => setOpen(o => ({ ...o, [i]: !o[i] }))

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 20, lineHeight: 1 }}>🔴</span>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Performance insights</div>
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>Insights highlighting urgent issues, risks, and opportunities.</div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#991B1B' }}>Key alerts</span>
        </div>
        <div style={{ fontSize: 13, color: '#6B7280', marginLeft: 26 }}>Insights requiring your attention.</div>
      </div>

      {insights.map((ins, i) => (
        <div key={i} style={{
          background: '#FEF9F9', border: '1px solid #FECACA', borderRadius: 10,
          padding: '20px 24px', marginBottom: 12,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#B45309', marginBottom: 6 }}>{ins.tag}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#DC2626', marginBottom: 8 }}>{ins.value}</div>
            {open[i]
              ? <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: ins.body }} />
              : <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: ins.body.split('.')[0] + '.' }} />
            }
          </div>
          <button
            onClick={() => toggle(i)}
            style={{ border: 'none', background: 'none', color: '#DC2626', fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', marginLeft: 24, paddingTop: 2, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            {open[i] ? 'Show less ▲' : 'Show more ▼'}
          </button>
        </div>
      ))}
    </div>
  )
}

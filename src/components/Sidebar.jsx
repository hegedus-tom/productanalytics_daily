import { reports } from '../data/mockData'

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <span style={{ fontWeight: 700, fontSize: 13, color: '#374151' }}>Your reports</span>
        <button style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer', fontSize: 16, color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
      </div>

      <div style={{ flex: 1 }}>
        {reports.map(r => (
          <div key={r.id} className={`report-item ${r.active ? 'active' : ''}`}>
            <div>
              <div className="report-item-name">{r.name}</div>
              {r.dateRange && <div className="report-date">{r.dateRange}</div>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {r.alerts > 0 && <div className="report-alert">{r.alerts}</div>}
              <span style={{ fontSize: 16, color: '#D1D5DB', cursor: 'pointer' }}>···</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #F3F4F6' }}>
        <div className="sidebar-section-title">Data source</div>
        <a className="sidebar-ds-link">Footshop SE – Google Ads – s hopping Argjend</a>

        <div className="sidebar-section-title" style={{ marginTop: 4 }}>Product stats</div>
        <div className="sidebar-ds-sub">Google Ads product stats</div>
        <a className="sidebar-ds-link" style={{ fontSize: 12 }}>Google product stats – Argjend</a>
      </div>
    </div>
  )
}

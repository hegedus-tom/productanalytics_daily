import { useState, useRef, useEffect } from 'react'
import { reports as initialReports } from '../data/mockData'
import DeleteViewModal from './DeleteViewModal'
import RenameReportModal from './RenameReportModal'
import DeleteReportModal from './DeleteReportModal'

const OP_LABEL = { gt: '>', lt: '<', eq: '=' }
const PRESET_LABELS = { '7D': 'Last 7 days', '14D': 'Last 14 days', '30D': 'Last 30 days', 'TM': 'This Month' }
const MONTHS_S = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function sidebarPeriodLabel(pi) {
  if (!pi) return null
  if (pi.isCustom && pi.start && pi.end) {
    const s = new Date(pi.start), e = new Date(pi.end)
    return `📌 ${MONTHS_S[s.getMonth()]} ${s.getDate()} – ${MONTHS_S[e.getMonth()]} ${e.getDate()}`
  }
  return `🔄 ${PRESET_LABELS[pi.key] || pi.key}`
}

export default function Sidebar({ savedViews = [], onSelectView, onDeleteView }) {
  const [reports, setReports]           = useState(initialReports)
  const [hoveredView, setHoveredView]   = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)   // saved view to delete
  const [menuOpen, setMenuOpen]         = useState(null)   // report id with open dropdown
  const [renameReport, setRenameReport] = useState(null)   // report to rename
  const [deleteReport, setDeleteReport] = useState(null)   // report to delete
  const menuRef = useRef(null)

  // close dropdown on outside click
  useEffect(() => {
    const h = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(null) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <>
      {deleteTarget && (
        <DeleteViewModal
          viewName={deleteTarget.name}
          onConfirm={() => { onDeleteView?.(deleteTarget.id); setDeleteTarget(null) }}
          onClose={() => setDeleteTarget(null)}
        />
      )}
      {renameReport && (
        <RenameReportModal
          currentName={renameReport.name}
          onSave={name => setReports(prev => prev.map(r => r.id === renameReport.id ? { ...r, name } : r))}
          onClose={() => setRenameReport(null)}
        />
      )}
      {deleteReport && (
        <DeleteReportModal
          onConfirm={() => { setReports(prev => prev.filter(r => r.id !== deleteReport.id)); setDeleteReport(null) }}
          onClose={() => setDeleteReport(null)}
        />
      )}

      <div className="sidebar">
        <div className="sidebar-top">
          <span style={{ fontWeight: 700, fontSize: 13, color: '#374151' }}>Your reports</span>
          <button style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer', fontSize: 16, color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {reports.map(r => (
            <div key={r.id}>
              <div className={`report-item ${r.active ? 'active' : ''}`}>
                <div style={{ minWidth: 0 }}>
                  <div className="report-item-name">{r.name}</div>
                  {r.dateRange && <div className="report-date">{r.dateRange}</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, position: 'relative' }} ref={menuOpen === r.id ? menuRef : null}>
                  {r.alerts > 0 && <div className="report-alert">{r.alerts}</div>}

                  {/* Three-dot button */}
                  <span
                    onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === r.id ? null : r.id) }}
                    style={{ fontSize: 16, color: '#D1D5DB', cursor: 'pointer', padding: '2px 4px', borderRadius: 4, userSelect: 'none' }}
                  >···</span>

                  {/* Dropdown */}
                  {menuOpen === r.id && (
                    <div style={{
                      position: 'absolute', top: '100%', right: 0, zIndex: 50,
                      background: 'white', border: '1px solid #E5E7EB', borderRadius: 10,
                      boxShadow: '0 6px 24px rgba(0,0,0,0.12)', minWidth: 148, padding: '4px 0',
                    }}>
                      {/* Rename */}
                      <button
                        onClick={() => { setRenameReport(r); setMenuOpen(null) }}
                        style={{
                          width: '100%', padding: '10px 14px', border: 'none', background: 'none',
                          display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                          fontSize: 13, fontWeight: 500, color: '#374151', fontFamily: 'inherit',
                          textAlign: 'left',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Rename
                      </button>

                      <div style={{ height: 1, background: '#F3F4F6', margin: '2px 0' }} />

                      {/* Delete */}
                      <button
                        onClick={() => { setDeleteReport(r); setMenuOpen(null) }}
                        style={{
                          width: '100%', padding: '10px 14px', border: 'none', background: 'none',
                          display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                          fontSize: 13, fontWeight: 500, color: '#DC2626', fontFamily: 'inherit',
                          textAlign: 'left',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6"/><path d="M14 11v6"/>
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Saved views */}
              {savedViews.length > 0 && (
                <div style={{ paddingLeft: 12, marginBottom: 4 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '6px 8px 4px' }}>
                    Saved views
                  </div>
                  {savedViews.map(v => (
                    <div
                      key={v.id}
                      onClick={() => onSelectView?.(v)}
                      onMouseEnter={() => setHoveredView(v.id)}
                      onMouseLeave={() => setHoveredView(null)}
                      style={{
                        padding: '7px 8px', borderRadius: 7, cursor: 'pointer',
                        marginBottom: 2, position: 'relative',
                        background: hoveredView === v.id ? '#F5F3FF' : 'transparent',
                        transition: 'background 0.12s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#6D28D9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {v.name}
                          </span>
                        </div>
                        {hoveredView === v.id && (
                          <button
                            onClick={e => { e.stopPropagation(); setDeleteTarget(v) }}
                            style={{
                              width: 18, height: 18, borderRadius: '50%', border: '1px solid #FECACA',
                              background: '#FEF2F2', cursor: 'pointer', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', fontSize: 11, color: '#DC2626', flexShrink: 0,
                              lineHeight: 1, fontFamily: 'inherit', padding: 0,
                            }}
                          >×</button>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap', paddingLeft: 17 }}>
                        {v.periodInfo && (
                          <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 20, background: v.periodInfo.isCustom ? '#FEF3C7' : '#DCFCE7', color: v.periodInfo.isCustom ? '#92400E' : '#15803D' }}>
                            {sidebarPeriodLabel(v.periodInfo)}
                          </span>
                        )}
                        {v.filters.map(f => (
                          <span key={f.key} style={{ fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 20, background: '#EDE9FE', color: '#6D28D9' }}>
                            {f.label} {OP_LABEL[f.op]} {f.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
    </>
  )
}

import { useState } from 'react'
import { reports } from '../data/mockData'
import DeleteViewModal from './DeleteViewModal'

const OP_LABEL = { gt: '>', lt: '<', eq: '=' }

export default function Sidebar({ savedViews = [], onSelectView, onDeleteView }) {
  const [hoveredView, setHoveredView] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null) // view to confirm delete

  return (
    <>
      {deleteTarget && (
        <DeleteViewModal
          viewName={deleteTarget.name}
          onConfirm={() => { onDeleteView?.(deleteTarget.id); setDeleteTarget(null) }}
          onClose={() => setDeleteTarget(null)}
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
                <div>
                  <div className="report-item-name">{r.name}</div>
                  {r.dateRange && <div className="report-date">{r.dateRange}</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {r.alerts > 0 && <div className="report-alert">{r.alerts}</div>}
                  <span style={{ fontSize: 16, color: '#D1D5DB', cursor: 'pointer' }}>···</span>
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

                        {/* Delete button — visible on hover */}
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
                        {v.filters.map(f => (
                          <span key={f.key} style={{
                            fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 20,
                            background: '#EDE9FE', color: '#6D28D9',
                          }}>
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

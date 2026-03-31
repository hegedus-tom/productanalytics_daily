import { useState } from 'react'

export default function HowToRead({ text }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="how-to-read">
      <div className="how-to-read-toggle" onClick={() => setOpen(o => !o)}>
        <span style={{ fontSize: 14 }}>💬</span>
        <span>How to read this?</span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#7C3AED' }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && <p className="how-to-read-body">{text}</p>}
    </div>
  )
}

'use client'

import { Wind } from 'lucide-react'

export function Shell({ children, immersive = false }: { children: React.ReactNode; immersive?: boolean }) {
  return (
    <div className={`site-shell ${immersive ? 'site-shell--journey' : ''}`}>
      <header className="site-header">
        <a href="/" className="brand">
          <span className="brand-mark">S</span>
          <span>SANYO</span>
        </a>
        <span className="header-campaign">
          VISION BOARD <b>2027</b>
        </span>
        <span className="header-status">
          COOL NEW ME! <Wind size={15} />
        </span>
      </header>
      {children}
      <footer className="site-footer">
        <span>SANYO VIETNAM</span>
        <span>STAY COOL. LIVE BOLD.</span>
        <span>© 2027</span>
      </footer>
    </div>
  )
}

import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Right column: navbar + page content */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, overflow: 'hidden', height: '100%' }}>
        <Navbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
        {/* Page area — fills remaining height */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

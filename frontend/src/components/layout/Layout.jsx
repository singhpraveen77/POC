import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden h-full">
        <Navbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
        <div className="flex flex-col flex-1 min-h-0 overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
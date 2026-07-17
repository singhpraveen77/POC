import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import CreateTaskModal from '../kanban/CreateTaskModal'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [presetStatus, setPresetStatus] = useState('todo')

  function openCreateTask(status = 'todo') {
    setPresetStatus(status)
    setIsModalOpen(true)
  }

  return (
    <div className="app-shell">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCreateTask={() => openCreateTask('todo')}
      />

      {/* Right column: navbar + page content */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, overflow: 'hidden', height: '100%' }}>
        <Navbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
        {/* Page area — fills remaining height */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Outlet context={{ openCreateTask }} />
        </div>
      </div>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        presetStatus={presetStatus}
      />
    </div>
  )
}

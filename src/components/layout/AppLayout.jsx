import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import HMIPreview from './HMIPreview'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-blue-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((o) => !o)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen((o) => !o)} />

        <main className="flex-1 overflow-hidden flex">
          <div className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </div>
          <div className="w-72 flex-shrink-0 border-l border-slate-200 bg-white overflow-y-auto hidden lg:block">
            <HMIPreview />
          </div>
        </main>
      </div>
    </div>
  )
}

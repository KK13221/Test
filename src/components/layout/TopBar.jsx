import { Menu, Bell, LogOut, Wifi, WifiOff, User } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useMachine } from '../../context/MachineContext'

const PAGE_TITLES = {
  '/dashboard':   { title: 'Dashboard',         sub: 'System overview and metrics' },
  '/monitoring':  { title: 'Live Monitoring',    sub: 'Real-time sensor readings' },
  '/controls':    { title: 'Control Actions',    sub: 'Execute machine commands' },
  '/settings':    { title: 'Settings',           sub: 'Configure parameters and sensors' },
  '/logs':        { title: 'Event Logs',         sub: 'Machine activity history' },
  '/users':       { title: 'User Management',    sub: 'Manage operator accounts' },
  '/maintenance': { title: 'Maintenance',        sub: 'Track and schedule maintenance' },
}

export default function TopBar({ onMenuClick }) {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const { hasAlarm, isRunning } = useMachine()
  const page = PAGE_TITLES[pathname] || { title: 'Pressure Panel', sub: '' }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 gap-3 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
      >
        <Menu size={20} className="text-slate-600" />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="font-bold text-slate-800 text-base leading-tight">{page.title}</h1>
        <p className="text-xs text-slate-400 truncate">{page.sub}</p>
      </div>

      <div
        className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
          isRunning ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
        }`}
      >
        {isRunning ? <Wifi size={12} /> : <WifiOff size={12} />}
        {isRunning ? 'Online' : 'Offline'}
      </div>

      <button
        className={`relative p-2 rounded-xl transition-colors ${
          hasAlarm ? 'bg-red-100 text-red-600 animate-pulse' : 'hover:bg-slate-100 text-slate-400'
        }`}
      >
        <Bell size={20} />
        {hasAlarm && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <User size={14} className="text-white" />
        </div>
        <div className="hidden sm:block">
          <p className="text-xs font-semibold text-slate-700 leading-tight">{user?.name}</p>
          <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
        </div>
        <button
          onClick={logout}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors ml-1"
          title="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}

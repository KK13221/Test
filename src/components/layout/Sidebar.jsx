import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Activity, Sliders, Settings,
  FileText, Users, Wrench, ChevronLeft, Gauge,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/monitoring',  icon: Activity,        label: 'Monitoring' },
  { to: '/controls',    icon: Sliders,         label: 'Controls' },
  { to: '/settings',    icon: Settings,        label: 'Settings' },
  { to: '/logs',        icon: FileText,        label: 'Logs' },
  { to: '/users',       icon: Users,           label: 'Users' },
  { to: '/maintenance', icon: Wrench,          label: 'Maintenance' },
]

export default function Sidebar({ open, onToggle }) {
  return (
    <aside
      className={`flex-shrink-0 h-full bg-[#0F172A] flex flex-col transition-all duration-300 ${
        open ? 'w-56' : 'w-16'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-3 border-b border-slate-700/50 gap-3">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Gauge size={18} className="text-white" />
        </div>
        {open && (
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm leading-tight truncate">Pressure Panel</p>
            <p className="text-slate-400 text-xs truncate">Admin Console</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            {open && <span className="text-sm font-medium truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse */}
      <div className="p-2 border-t border-slate-700/50">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
        >
          <ChevronLeft
            size={18}
            className={`transition-transform duration-300 ${open ? '' : 'rotate-180'}`}
          />
        </button>
      </div>
    </aside>
  )
}

import { TrendingUp, TrendingDown } from 'lucide-react'

const colorMap = {
  blue:   { wrap: 'bg-blue-50 border-blue-100',     icon: 'bg-blue-100 text-blue-600' },
  indigo: { wrap: 'bg-indigo-50 border-indigo-100', icon: 'bg-indigo-100 text-indigo-600' },
  orange: { wrap: 'bg-orange-50 border-orange-100', icon: 'bg-orange-100 text-orange-600' },
  purple: { wrap: 'bg-purple-50 border-purple-100', icon: 'bg-purple-100 text-purple-600' },
}

export default function MetricCard({ label, value, unit, icon, trend, alert, color = 'blue' }) {
  const c = alert
    ? { wrap: 'bg-red-50 border-red-200', icon: 'bg-red-100 text-red-600' }
    : colorMap[color]

  return (
    <div className={`rounded-2xl p-5 border shadow-sm transition-all ${c.wrap}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon}`}>
          {icon}
        </div>
        {alert && (
          <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">ALERT</span>
        )}
      </div>
      <div className="tabular-nums">
        <span className="text-2xl font-bold text-slate-800">{value}</span>
        <span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>
      </div>
      <p className="text-xs text-slate-500 mt-1 font-medium">{label}</p>
      {trend !== undefined && (
        <div
          className={`flex items-center gap-1 mt-2 text-xs font-semibold ${
            trend >= 0 ? 'text-orange-500' : 'text-green-500'
          }`}
        >
          {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(trend).toFixed(1)}% from last
        </div>
      )}
    </div>
  )
}

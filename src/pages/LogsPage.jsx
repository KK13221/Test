import { useState } from 'react'
import { mockLogs } from '../data/mockData'
import Card from '../components/shared/Card'
import Button from '../components/shared/Button'
import { Download } from 'lucide-react'

const TYPE_COLORS = {
  INFO:    'bg-blue-100 text-blue-700',
  WARNING: 'bg-orange-100 text-orange-700',
  ALARM:   'bg-red-100 text-red-700',
  CONTROL: 'bg-green-100 text-green-700',
}

export default function LogsPage() {
  const [filter, setFilter] = useState('ALL')

  const filtered = filter === 'ALL' ? mockLogs : mockLogs.filter((l) => l.type === filter)

  const exportCSV = () => {
    const header = 'ID,Timestamp,Type,Event,Value,User\n'
    const rows = filtered
      .map((l) => `${l.id},"${l.timestamp}",${l.type},"${l.event}","${l.value}",${l.user}`)
      .join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pressure-panel-logs.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Event Logs</h2>
          <p className="text-sm text-slate-500">{filtered.length} events</p>
        </div>
        <Button variant="outline" onClick={exportCSV}>
          <Download size={15} /> Export CSV
        </Button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap">
        {['ALL', 'INFO', 'WARNING', 'ALARM', 'CONTROL'].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === t
                ? 'bg-[#1E3A5F] text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {['#', 'Timestamp', 'Type', 'Event', 'Value', 'User'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 text-xs text-slate-400 font-mono">{log.id}</td>
                  <td className="px-5 py-3 text-xs text-slate-600 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[log.type]}`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-700">{log.event}</td>
                  <td className="px-5 py-3 text-xs font-mono text-slate-500">{log.value}</td>
                  <td className="px-5 py-3 text-xs text-slate-500">{log.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

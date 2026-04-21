import { useState } from 'react'
import { maintenanceLog } from '../data/mockData'
import Card from '../components/shared/Card'
import Button from '../components/shared/Button'
import { Wrench, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

export default function MaintenancePage() {
  const [formDate, setFormDate] = useState('2024-06-15')
  const [formType, setFormType] = useState('Filter replacement')
  const [scheduled, setScheduled] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Maintenance</h2>
        <p className="text-sm text-slate-500">Track maintenance history and schedule upcoming work</p>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Last Maintenance</p>
              <p className="text-sm font-bold text-slate-800">Mar 15, 2024</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <AlertTriangle size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Next Due</p>
              <p className="text-sm font-bold text-orange-600">Jun 15, 2024</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Days Until Next</p>
              <p className="text-sm font-bold text-slate-800">56 days</p>
            </div>
          </div>
        </Card>
      </div>

      {/* History */}
      <Card title="Maintenance History">
        <div className="divide-y divide-slate-50">
          {maintenanceLog.map((entry, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Wrench size={16} className="text-slate-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-700">{entry.type}</p>
                <p className="text-xs text-slate-400">Technician: {entry.tech}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-slate-500">{entry.date}</p>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {entry.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Schedule form */}
      <Card title="Schedule Maintenance" className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Date</label>
            <input
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Type</label>
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {['Filter replacement', 'Sensor calibration', 'Full inspection', 'Belt replacement', 'Other'].map(
                (o) => <option key={o}>{o}</option>
              )}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <Button
            variant={scheduled ? 'success' : 'primary'}
            onClick={() => { setScheduled(true); setTimeout(() => setScheduled(false), 3000) }}
          >
            <Calendar size={15} />
            {scheduled ? 'Scheduled!' : 'Schedule Maintenance'}
          </Button>
        </div>
      </Card>
    </div>
  )
}

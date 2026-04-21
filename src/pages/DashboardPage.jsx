import { useMachine } from '../context/MachineContext'
import Card from '../components/shared/Card'
import Button from '../components/shared/Button'
import MetricCard from '../components/dashboard/MetricCard'
import PressureChart from '../components/dashboard/PressureChart'
import StatusBadge from '../components/dashboard/StatusBadge'
import { Gauge, Activity, Thermometer, Wind, Power, PowerOff, RefreshCcw, Server, Calendar, Clock } from 'lucide-react'

export default function DashboardPage() {
  const { isRunning, hasAlarm, values, history, start, stop, resetAlarm } = useMachine()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">System Overview</h2>
          <p className="text-sm text-slate-500 mt-0.5">Real-time machine status and metrics</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge isRunning={isRunning} hasAlarm={hasAlarm} />
          {hasAlarm && (
            <Button variant="danger" size="sm" onClick={resetAlarm}>
              <RefreshCcw size={13} /> Reset Alarm
            </Button>
          )}
          {isRunning ? (
            <Button variant="ghost" size="sm" onClick={stop}>
              <PowerOff size={13} /> Stop Machine
            </Button>
          ) : (
            <Button variant="success" size="sm" onClick={start}>
              <Power size={13} /> Start Machine
            </Button>
          )}
        </div>
      </div>

      {hasAlarm && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-700 font-bold text-sm">Active Alarm Detected</p>
            <p className="text-red-500 text-xs mt-0.5">One or more sensor values have exceeded threshold limits.</p>
          </div>
          <Button variant="danger" size="sm" onClick={resetAlarm}>Dismiss</Button>
        </div>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard label="ΔP Differential"    value={values.dp.toFixed(2)}   unit="kPa"    icon={<Gauge size={20} />}       trend={2.1}  alert={values.dp   > 4.5}  color="blue"   />
        <MetricCard label="System Pressure"     value={values.kPa.toFixed(1)}  unit="kPa"    icon={<Activity size={20} />}    trend={-0.8} alert={values.kPa  > 150}  color="indigo" />
        <MetricCard label="Temperature"         value={values.temp.toFixed(1)} unit="°C"     icon={<Thermometer size={20} />} trend={0.3}  alert={values.temp > 32}   color="orange" />
        <MetricCard label="Dust Concentration"  value={values.dust.toFixed(2)} unit="mg/m³" icon={<Wind size={20} />}        trend={-0.1} alert={values.dust > 3.0}  color="purple" />
      </div>

      <Card title="Pressure & Temperature History (Last 60 s)" className="px-5 pb-5">
        <PressureChart data={history} />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isRunning ? 'bg-green-100' : 'bg-slate-100'}`}>
              <Server size={18} className={isRunning ? 'text-green-600' : 'text-slate-400'} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Device Status</p>
              <p className={`text-sm font-bold ${isRunning ? 'text-green-600' : 'text-slate-500'}`}>
                {isRunning ? 'Online & Running' : 'Offline / Stopped'}
              </p>
              <p className="text-xs text-slate-400">ID: PP-001</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Calendar size={18} className="text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Last Maintenance</p>
              <p className="text-sm font-bold text-slate-800">Mar 15, 2024</p>
              <p className="text-xs text-slate-400">Next due: Jun 15, 2024</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Clock size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">System Uptime</p>
              <p className="text-sm font-bold text-slate-800">14d 7h 32m</p>
              <p className="text-xs text-slate-400">Since last restart</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

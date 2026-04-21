import { useMachine } from '../context/MachineContext'
import Card from '../components/shared/Card'
import Button from '../components/shared/Button'
import StatusBadge from '../components/dashboard/StatusBadge'
import { Power, PowerOff, RefreshCcw } from 'lucide-react'

function ValueRow({ label, value, unit, alert }) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border ${
        alert ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'
      }`}
    >
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <div className="text-right">
        <span className={`text-xl font-bold tabular-nums ${alert ? 'text-red-600' : 'text-slate-800'}`}>
          {value}
        </span>
        <span className="text-xs text-slate-400 ml-1">{unit}</span>
        {alert && <span className="ml-2 text-xs font-bold text-red-500">ALERT</span>}
      </div>
    </div>
  )
}

export default function MonitoringPage() {
  const { isRunning, hasAlarm, values, thresholds, start, stop, resetAlarm } = useMachine()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Live Monitoring</h2>
          <p className="text-sm text-slate-500">Real-time sensor readings — updates every 2 s</p>
        </div>
        <StatusBadge isRunning={isRunning} hasAlarm={hasAlarm} />
      </div>

      {/* Machine + values */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* SVG machine illustration */}
          <div className="flex-shrink-0">
            <svg width="150" height="170" viewBox="0 0 150 170" fill="none">
              {/* Cabinet body */}
              <rect x="25" y="30" width="100" height="110" rx="10" fill="#1e293b" />
              <rect x="32" y="38" width="86" height="94" rx="7" fill="#334155" />
              {/* Screen */}
              <rect x="42" y="48" width="66" height="45" rx="5" fill="#0f172a" />
              <rect x="48" y="55" width="54" height="6" rx="3" fill={isRunning ? '#4ade80' : '#475569'} />
              <rect x="48" y="65" width="40" height="5" rx="2.5" fill={isRunning ? '#60a5fa' : '#475569'} />
              <rect x="48" y="74" width="48" height="5" rx="2.5" fill={hasAlarm ? '#ef4444' : '#475569'} />
              {/* Status LED */}
              <circle cx="75" cy="112" r="7" fill={hasAlarm ? '#ef4444' : isRunning ? '#22c55e' : '#475569'} />
              {isRunning && (
                <circle cx="75" cy="112" r="12" fill={hasAlarm ? '#ef444415' : '#22c55e15'} />
              )}
              {/* Left pipe */}
              <rect x="5" y="78" width="20" height="10" rx="5" fill="#475569" />
              <rect x="0" y="80" width="8" height="6" rx="3" fill="#64748b" />
              {/* Right pipe */}
              <rect x="125" y="78" width="20" height="10" rx="5" fill="#475569" />
              <rect x="142" y="80" width="8" height="6" rx="3" fill="#64748b" />
              {/* Base */}
              <rect x="15" y="140" width="120" height="12" rx="5" fill="#475569" />
              <rect x="30" y="152" width="18" height="18" rx="3" fill="#334155" />
              <rect x="102" y="152" width="18" height="18" rx="3" fill="#334155" />
            </svg>
          </div>

          {/* Live readings grid */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ValueRow label="ΔP Differential" value={values.dp.toFixed(2)}   unit="kPa"    alert={values.dp   > thresholds.dp} />
            <ValueRow label="System Pressure"  value={values.kPa.toFixed(1)}  unit="kPa"    alert={values.kPa  > thresholds.kPa} />
            <ValueRow label="Temperature"      value={values.temp.toFixed(1)} unit="°C"     alert={values.temp > thresholds.temp} />
            <ValueRow label="Dust Level"       value={values.dust.toFixed(2)} unit="mg/m³" alert={values.dust > thresholds.dust} />
          </div>
        </div>
      </Card>

      {/* Controls */}
      <Card className="p-5">
        <p className="text-sm font-semibold text-slate-600 mb-3">Machine Control</p>
        <div className="flex items-center gap-3 flex-wrap">
          {isRunning ? (
            <Button variant="danger" onClick={stop}>
              <PowerOff size={16} /> Stop Machine
            </Button>
          ) : (
            <Button variant="success" onClick={start}>
              <Power size={16} /> Start Machine
            </Button>
          )}
          {hasAlarm && (
            <Button variant="warning" onClick={resetAlarm}>
              <RefreshCcw size={16} /> Reset Alarm
            </Button>
          )}
        </div>
      </Card>

      {/* Threshold reference */}
      <Card title="Alert Thresholds" className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
          {[
            { label: 'ΔP Max',       value: thresholds.dp,   unit: 'kPa' },
            { label: 'Pressure Max', value: thresholds.kPa,  unit: 'kPa' },
            { label: 'Temp Max',     value: thresholds.temp, unit: '°C' },
            { label: 'Dust Max',     value: thresholds.dust, unit: 'mg/m³' },
          ].map((t) => (
            <div key={t.label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <p className="text-xs text-slate-500 font-medium">{t.label}</p>
              <p className="text-lg font-bold text-slate-700 tabular-nums mt-0.5">{t.value}</p>
              <p className="text-xs text-slate-400">{t.unit}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

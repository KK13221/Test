import { useState, useEffect } from 'react'
import { useMachine } from '../../context/MachineContext'
import { useLocation } from 'react-router-dom'

export default function HMIPreview() {
  const { isRunning, hasAlarm, values, activeMode } = useMachine()
  const { pathname } = useLocation()
  const [clock, setClock] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const screenName = (pathname.replace('/', '') || 'dashboard').toUpperCase()
  const statusColor = hasAlarm ? '#ef4444' : isRunning ? '#22c55e' : '#64748b'
  const statusLabel = hasAlarm ? 'ALARM' : isRunning ? 'RUNNING' : 'STOPPED'
  const statusBg    = hasAlarm ? '#450a0a' : isRunning ? '#052e16' : '#1e293b'

  return (
    <div className="p-4 h-full flex flex-col gap-4">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">HMI Preview</p>

      <div className="bg-[#07111e] rounded-2xl p-4 border border-slate-700/50 shadow-inner flex flex-col gap-3 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-[#4ade80] tracking-widest">PRESSURE PANEL v2.1</span>
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ background: statusColor, boxShadow: `0 0 8px ${statusColor}` }}
          />
        </div>

        {/* Screen name */}
        <div className="bg-[#0d1f30] rounded-lg px-3 py-2">
          <p className="text-[#475569] font-mono text-[9px] uppercase tracking-widest">SCREEN</p>
          <p className="text-white font-mono text-sm font-bold">{screenName}</p>
        </div>

        {/* Status */}
        <div className="bg-[#0d1f30] rounded-lg px-3 py-2 flex items-center justify-between">
          <span className="text-[#475569] font-mono text-[9px] uppercase tracking-widest">STATUS</span>
          <span
            className="font-mono text-xs font-bold px-2 py-0.5 rounded"
            style={{ background: statusBg, color: statusColor }}
          >
            {statusLabel}
          </span>
        </div>

        {/* Live values */}
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: 'ΔP',   value: values.dp.toFixed(2),   unit: 'kPa' },
            { label: 'PRES',  value: values.kPa.toFixed(1),  unit: 'kPa' },
            { label: 'TEMP',  value: values.temp.toFixed(1),  unit: '°C'  },
            { label: 'DUST',  value: values.dust.toFixed(2),  unit: 'mg'  },
          ].map(({ label, value, unit }) => (
            <div key={label} className="bg-[#0d1f30] rounded-lg p-2">
              <p className="text-[#475569] font-mono text-[9px]">{label}</p>
              <p
                className="font-mono text-sm font-bold tabular-nums leading-tight"
                style={{ color: isRunning ? '#4ade80' : '#64748b' }}
              >
                {value}
              </p>
              <p className="text-[#334155] font-mono text-[9px]">{unit}</p>
            </div>
          ))}
        </div>

        {/* Active mode badge */}
        {activeMode && (
          <div className="bg-[#0c1e33] border border-blue-500/30 rounded-lg px-3 py-2">
            <p className="text-[#475569] font-mono text-[9px] uppercase">MODE ACTIVE</p>
            <p className="text-[#60a5fa] font-mono text-xs font-bold">{activeMode}</p>
          </div>
        )}

        {/* Alarm banner */}
        {hasAlarm && (
          <div className="bg-red-950/60 border border-red-600/40 rounded-lg px-3 py-2">
            <p className="text-red-400 font-mono text-[10px] font-bold">⚠ ALARM ACTIVE</p>
            <p className="text-red-500/70 font-mono text-[9px]">Threshold exceeded</p>
          </div>
        )}

        {/* Clock */}
        <div className="mt-auto pt-3 border-t border-slate-800">
          <p className="text-[#334155] font-mono text-[10px]">
            {clock.toLocaleTimeString('en-GB')}
          </p>
          <p className="text-[#1e293b] font-mono text-[9px]">
            {clock.toLocaleDateString('en-GB')}
          </p>
        </div>
      </div>

      {/* Device metadata */}
      <div className="space-y-1.5 text-xs text-slate-400">
        {[{ k: 'Device ID', v: 'PP-001' }, { k: 'Firmware', v: 'v2.1.4' }, { k: 'Protocol', v: 'MODBUS RTU' }].map(
          ({ k, v }) => (
            <div key={k} className="flex justify-between">
              <span>{k}</span>
              <span className="font-mono text-slate-600">{v}</span>
            </div>
          )
        )}
      </div>
    </div>
  )
}

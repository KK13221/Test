import { useState } from 'react'
import { useMachine } from '../context/MachineContext'
import Card from '../components/shared/Card'
import Button from '../components/shared/Button'
import StepperInput from '../components/shared/StepperInput'
import { Wind, RefreshCcw, Fan, Cpu, Stethoscope, Gamepad2, Timer, Play } from 'lucide-react'

const ACTIONS = [
  { id: 'CLEANING_MODE', label: 'Cleaning Mode',  icon: Wind,        desc: 'Initiate filter cleaning cycle' },
  { id: 'RESET_ALARM',   label: 'Reset Alarm',    icon: RefreshCcw,  desc: 'Clear active alarm state' },
  { id: 'FAN_CONTROL',   label: 'Fan Control',    icon: Fan,         desc: 'Toggle fan speed control' },
  { id: 'MOTOR_START',   label: 'Motor Start',    icon: Cpu,         desc: 'Start primary motor drive' },
  { id: 'DIAGNOSTICS',   label: 'Diagnostics',    icon: Stethoscope, desc: 'Run system diagnostics' },
  { id: 'MANUAL_CTRL',   label: 'Manual Control', icon: Gamepad2,    desc: 'Enable manual override' },
]

export default function ControlsPage() {
  const { activeMode, setActiveMode, resetAlarm } = useMachine()
  const [timer, setTimer]   = useState({ hh: 0, mm: 5, ss: 0 })
  const [delay, setDelay]   = useState({ sec: 30, mm: 2, ss: 30 })
  const [timerMsg, setTimerMsg] = useState('')

  const handleAction = (id) => {
    if (id === 'RESET_ALARM') { resetAlarm(); return }
    setActiveMode(activeMode === id ? null : id)
  }

  const initiateTimer = () => {
    const label = `${String(timer.hh).padStart(2,'0')}:${String(timer.mm).padStart(2,'0')}:${String(timer.ss).padStart(2,'0')}`
    setTimerMsg(`Timer initiated: ${label}`)
    setTimeout(() => setTimerMsg(''), 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Control Actions</h2>
        <p className="text-sm text-slate-500">Execute machine control commands</p>
      </div>

      {/* 6-action grid */}
      <Card title="Quick Actions" className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
          {ACTIONS.map(({ id, label, icon: Icon, desc }) => (
            <button
              key={id}
              onClick={() => handleAction(id)}
              className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${
                activeMode === id
                  ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  activeMode === id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Icon size={22} />
              </div>
              <span className="font-semibold text-slate-800 text-sm text-center">{label}</span>
              <span className="text-xs text-slate-400 text-center leading-snug">{desc}</span>
              {activeMode === id && (
                <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timer setup */}
        <Card title="Timer Setup" className="p-5">
          <div className="flex items-center justify-center gap-3 my-6">
            <StepperInput label="HH" value={timer.hh} onChange={(v) => setTimer((t) => ({ ...t, hh: v }))} max={23} unit="hours" />
            <span className="text-2xl font-bold text-slate-300 mt-4">:</span>
            <StepperInput label="MM" value={timer.mm} onChange={(v) => setTimer((t) => ({ ...t, mm: v }))} max={59} unit="min" />
            <span className="text-2xl font-bold text-slate-300 mt-4">:</span>
            <StepperInput label="SS" value={timer.ss} onChange={(v) => setTimer((t) => ({ ...t, ss: v }))} max={59} unit="sec" />
          </div>
          <Button variant="primary" className="w-full" size="lg" onClick={initiateTimer}>
            <Timer size={18} /> INITIATE TIMER
          </Button>
          {timerMsg && (
            <p className="text-center text-sm text-green-600 font-semibold mt-3">{timerMsg}</p>
          )}
        </Card>

        {/* Delay & Cycle setup */}
        <Card title="Delay & Cycle Setup" className="p-5">
          <div className="space-y-5 my-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                Delay (seconds)
              </label>
              <div className="flex items-center gap-4">
                <StepperInput
                  value={delay.sec}
                  onChange={(v) => setDelay((d) => ({ ...d, sec: v }))}
                  max={300} step={5} unit="sec"
                />
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-full transition-all"
                    style={{ width: `${(delay.sec / 300) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                Auto Cycle Interval
              </label>
              <div className="flex items-center gap-3">
                <StepperInput label="MM" value={delay.mm} onChange={(v) => setDelay((d) => ({ ...d, mm: v }))} max={59} unit="min" />
                <span className="text-xl font-bold text-slate-300 mt-4">:</span>
                <StepperInput label="SS" value={delay.ss} onChange={(v) => setDelay((d) => ({ ...d, ss: v }))} max={59} unit="sec" />
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full" size="lg">
            <Play size={16} /> Apply Cycle Settings
          </Button>
        </Card>
      </div>
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useMachine } from '../../context/MachineContext'
import { Settings, X, RefreshCw, ExternalLink, Wifi, AlertCircle } from 'lucide-react'

const STORAGE_KEY = 'pp_hmi_config'

const MODE_LABELS = {
  iframe:     'Web / VNC (iframe)',
  mjpeg:      'MJPEG Stream',
  screenshot: 'Screenshot (auto-refresh)',
}

function loadConfig() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {} }
  catch { return {} }
}
function saveConfig(cfg) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg))
}

/* ─── Shared HMI chrome wrappers ─── */
function HMIShell({ title, children, nav }) {
  return (
    <div className="flex-1 flex flex-col bg-[#9ec6dc] rounded-xl border-2 border-[#5a90a8] overflow-hidden min-h-0">
      {/* Header */}
      <div className="bg-[#0f2744] px-2 py-1 shrink-0">
        <div className="text-white text-[8px] font-black tracking-widest leading-none">HF GROUP</div>
        <div className="text-[#7ab0d0] text-[6px] tracking-widest uppercase">{title}</div>
      </div>
      {/* Body */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {children}
      </div>
      {/* Nav bar */}
      {nav && (
        <div className={`grid gap-1 mx-1.5 mb-1.5 shrink-0`} style={{ gridTemplateColumns: `repeat(${nav.length}, 1fr)` }}>
          {nav.map((label) => (
            <button key={label} className="bg-[#0f2744] text-white text-[7px] font-bold py-1 rounded tracking-wide">
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Machine SVG illustration ─── */
function MachineSVG({ isRunning, hasAlarm }) {
  const motorColor = hasAlarm ? '#ef4444' : isRunning ? '#22c55e' : '#94a3b8'
  const angle = -Math.PI / 2 + (isRunning ? 1.1 : 0)
  return (
    <svg viewBox="0 0 110 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Housing body */}
      <rect x="10" y="44" width="90" height="70" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.2"/>
      {/* Filter bags */}
      {[20, 36, 52, 68, 84].map((x, i) => (
        <g key={i}>
          <rect x={x} y="20" width="11" height="28" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8"/>
          <ellipse cx={x + 5.5} cy="20" rx="5.5" ry="2.5" fill="#cbd5e1"/>
          <ellipse cx={x + 5.5} cy="48" rx="5.5" ry="2.5" fill="#7c8fa0"/>
        </g>
      ))}
      {/* Top blue header bar */}
      <rect x="10" y="44" width="90" height="9" rx="2" fill="#2563eb"/>
      {/* Motor */}
      <rect x="38" y="4" width="34" height="18" rx="4" fill={motorColor}/>
      <rect x="46" y="0" width="18" height="6" rx="2" fill="#475569"/>
      {/* Status dot */}
      <circle cx="97" cy="52" r="4" fill={motorColor}/>
      {/* Inlet */}
      <rect x="0" y="85" width="13" height="10" rx="2" fill="#334155"/>
      {/* Outlet */}
      <rect x="97" y="74" width="13" height="10" rx="2" fill="#334155"/>
      {/* Pressure gauge */}
      <circle cx="24" cy="97" r="9" fill="#0f172a" stroke="#334155" strokeWidth="1"/>
      <line x1="24" y1="97" x2={24 + 6 * Math.cos(angle)} y2={97 + 6 * Math.sin(angle)}
        stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Hopper */}
      <path d="M18 114 L10 120 L100 120 L92 114 Z" fill="#0f172a" stroke="#334155" strokeWidth="1"/>
    </svg>
  )
}

/* ─── Screen 1: Monitoring / Dashboard ─── */
function HMIMonitoring() {
  const { isRunning, hasAlarm, values } = useMachine()
  return (
    <HMIShell title="PRESSURE PANEL" nav={['SETTINGS', 'CONTROLS']}>
      <div className="flex flex-col gap-1 p-1.5 flex-1 min-h-0">
        {/* Status dot */}
        <div className="flex items-center justify-between shrink-0">
          <span className="text-[7px] font-bold text-[#0f2744] tracking-wider">MONITORING</span>
          <div className={`w-2.5 h-2.5 rounded-full ${hasAlarm ? 'bg-red-500 animate-pulse' : isRunning ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}/>
        </div>

        {/* ΔP bar */}
        <div className="bg-[#0f2744] rounded px-2 py-0.5 flex items-center justify-between shrink-0">
          <span className="text-blue-200 text-[7px] font-black">ΔP</span>
          <span className="text-green-300 text-[10px] font-black font-mono">
            {values.dp.toFixed(2)} <span className="text-[7px] text-green-400 font-normal">kPa</span>
          </span>
        </div>

        {/* Value boxes */}
        <div className="grid grid-cols-3 gap-1 shrink-0">
          {[
            { label: 'kPa',   val: values.dp.toFixed(1) },
            { label: '°C',    val: values.temp.toFixed(1) },
            { label: 'mg/m³', val: values.dust.toFixed(2) },
          ].map(({ label, val }) => (
            <div key={label} className="bg-white rounded border border-slate-200 py-0.5 px-1 text-center">
              <div className="text-[6px] text-slate-400 font-semibold">{label}</div>
              <div className="text-[9px] font-black text-slate-800 font-mono leading-tight">{val}</div>
            </div>
          ))}
        </div>

        {/* Machine illustration */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <div className="w-full max-w-[86px] aspect-[110/120]">
            <MachineSVG isRunning={isRunning} hasAlarm={hasAlarm}/>
          </div>
        </div>
      </div>
    </HMIShell>
  )
}

/* ─── Screen 2: Filter Settings ─── */
function HMIFilterSettings() {
  const { filterSettings: fs } = useMachine()
  return (
    <HMIShell title="FILTER SETTINGS" nav={['BACK', 'SAVE', 'HOME']}>
      <div className="flex flex-col gap-1.5 p-1.5 flex-1 overflow-hidden">
        {/* Filter model inputs */}
        <div className="bg-white rounded border border-slate-200 p-1.5 shrink-0">
          <div className="text-[7px] font-black text-[#0f2744] mb-1 tracking-wide">FILTER MODEL</div>
          <div className="grid grid-cols-2 gap-1">
            {[['TC50', fs.tc50], ['E9TRB', fs.e9trb]].map(([label, val]) => (
              <div key={label}>
                <div className="text-[6px] text-slate-500 mb-0.5">{label}</div>
                <div className="bg-[#ddeef5] border border-slate-300 rounded px-1.5 py-0.5 text-[8px] font-black text-slate-800 font-mono text-center">
                  {val}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dust thresholds */}
        <div className="bg-white rounded border border-slate-200 p-1.5 flex-1">
          <div className="text-[7px] font-black text-[#0f2744] mb-1 tracking-wide">DUST LIMITS (mg/m³)</div>
          <div className="space-y-1">
            {[
              ['LOW',    fs.dustLow.toFixed(2)],
              ['HIGH',   fs.dustHigh.toFixed(2)],
              ['OFFSET', fs.calibrationOffset.toFixed(2)],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-[7px] text-slate-500 w-10">{label}</span>
                <div className="bg-[#ddeef5] border border-slate-300 rounded px-2 py-0.5 text-[8px] font-black text-slate-800 font-mono w-14 text-center">
                  {val}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HMIShell>
  )
}

/* ─── Screen 3: Controls ─── */
function HMIControls() {
  const { activeMode } = useMachine()
  const btns = [
    ['CLEANING', 'MODE', 'cleaning'],
    ['RESET',    'ALARM', 'reset_alarm'],
    ['FAN',      'CTRL',  'fan'],
    ['MOTOR',    'START', 'motor'],
    ['DIAGNO-',  'STICS', 'diagnostics'],
    ['MANUAL',   'CTRL',  'manual'],
  ]
  return (
    <HMIShell title="CONTROL PANEL" nav={['← BACK']}>
      <div className="flex-1 grid grid-cols-2 gap-1.5 p-1.5 overflow-hidden">
        {btns.map(([l1, l2, key]) => (
          <button
            key={key}
            className={`rounded p-1 text-[7px] font-bold text-white leading-tight flex flex-col items-center justify-center transition-colors ${
              activeMode === key ? 'bg-blue-600' : 'bg-[#0f2744]'
            }`}
          >
            <span>{l1}</span>
            <span>{l2}</span>
          </button>
        ))}
      </div>
    </HMIShell>
  )
}

/* ─── Screen 4: Timer Setup ─── */
function HMITimer() {
  return (
    <HMIShell title="TIMER SETUP" nav={['BACK', 'HOME', 'PARAMS']}>
      <div className="flex-1 flex flex-col items-center justify-center gap-2 p-2">
        <div className="text-[8px] font-black text-[#0f2744] tracking-wider">CLEANING TIMER</div>

        <div className="flex items-end gap-1.5">
          {[['HH', '00'], ['MM', '05'], ['SS', '30']].map(([unit, val]) => (
            <div key={unit} className="flex flex-col items-center gap-0.5">
              <button className="bg-[#0f2744] text-white text-[8px] w-7 h-5 rounded font-bold">+</button>
              <div className="bg-white border border-slate-300 rounded text-[11px] font-black w-7 h-6 flex items-center justify-center text-slate-800 font-mono">
                {val}
              </div>
              <button className="bg-[#0f2744] text-white text-[8px] w-7 h-5 rounded font-bold">−</button>
              <span className="text-[6px] text-[#0f2744] font-black">{unit}</span>
            </div>
          ))}
        </div>

        <button className="bg-[#0f2744] text-white text-[8px] font-black py-1.5 w-full rounded tracking-widest mt-1">
          INITIATE
        </button>
      </div>
    </HMIShell>
  )
}

/* ─── Screen 5: Parameters ─── */
function HMIParameters() {
  const { params } = useMachine()
  const items = [
    { label: 'kPa',   val: params.kPa.toFixed(1) },
    { label: 'mg/m³', val: params.dust.toFixed(2) },
    { label: '°C',    val: params.temp.toFixed(1) },
  ]
  return (
    <HMIShell title="PARAMETERS" nav={['BACK', 'HOME', 'SAVE']}>
      <div className="flex-1 flex flex-col justify-center gap-2 p-2">
        {items.map(({ label, val }) => (
          <div key={label} className="flex items-center gap-1.5 bg-white/40 rounded p-1.5">
            <span className="text-[8px] font-black text-[#0f2744] w-10 shrink-0">{label}</span>
            <div className="flex items-center gap-1 ml-auto">
              <button className="bg-[#0f2744] text-white text-[9px] w-5 h-5 rounded flex items-center justify-center font-bold">+</button>
              <div className="bg-white border border-slate-300 rounded text-[8px] font-black w-11 h-5 flex items-center justify-center text-slate-800 font-mono">
                {val}
              </div>
              <button className="bg-[#0f2744] text-white text-[9px] w-5 h-5 rounded flex items-center justify-center font-bold">−</button>
            </div>
          </div>
        ))}
      </div>
    </HMIShell>
  )
}

/* ─── Simulation router: picks screen based on current page ─── */
function HMISimulation() {
  const { pathname } = useLocation()

  if (pathname.includes('controls'))    return <HMIControls />
  if (pathname.includes('settings'))    return <HMIFilterSettings />
  if (pathname.includes('maintenance')) return <HMITimer />
  if (pathname.includes('logs') || pathname.includes('users')) return <HMIParameters />
  return <HMIMonitoring />
}

/* ─── iframe viewer ─── */
function IframeViewer({ url }) {
  const [loaded,  setLoaded]  = useState(false)
  const [errored, setErrored] = useState(false)
  return (
    <div className="relative flex-1 rounded-xl overflow-hidden bg-black border border-slate-700">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <RefreshCw size={18} className="text-blue-400 animate-spin" />
          <p className="text-slate-500 text-[10px]">Connecting…</p>
        </div>
      )}
      {errored ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
          <AlertCircle size={20} className="text-red-400" />
          <p className="text-red-400 text-xs font-semibold">Cannot reach device</p>
          <p className="text-slate-500 text-[10px] leading-snug">
            Check CORS settings or switch to MJPEG mode.
          </p>
        </div>
      ) : (
        <iframe
          src={url}
          title="HMI Live Screen"
          className={`w-full h-full border-0 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => { setLoaded(true); setErrored(false) }}
          onError={() => { setLoaded(true); setErrored(true) }}
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      )}
    </div>
  )
}

/* ─── MJPEG / screenshot viewer ─── */
function ImageViewer({ url, mode }) {
  const [key,     setKey]     = useState(0)
  const [loaded,  setLoaded]  = useState(false)
  const [errored, setErrored] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (mode !== 'screenshot') return
    intervalRef.current = setInterval(() => { setLoaded(false); setKey((k) => k + 1) }, 2000)
    return () => clearInterval(intervalRef.current)
  }, [mode])

  const src = mode === 'screenshot' ? `${url}?_t=${key}` : url
  return (
    <div className="relative flex-1 rounded-xl overflow-hidden bg-black border border-slate-700">
      {!loaded && !errored && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <RefreshCw size={18} className="text-blue-400 animate-spin" />
          <p className="text-slate-500 text-[10px]">
            {mode === 'mjpeg' ? 'Connecting to stream…' : 'Loading snapshot…'}
          </p>
        </div>
      )}
      {errored ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
          <AlertCircle size={20} className="text-red-400" />
          <p className="text-red-400 text-xs font-semibold">Stream unavailable</p>
          <p className="text-slate-500 text-[10px] leading-snug">Check device IP and stream URL.</p>
        </div>
      ) : (
        <img
          key={key} src={src} alt="HMI Live Screen"
          className={`w-full h-full object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => { setLoaded(true); setErrored(false) }}
          onError={() => { setLoaded(true); setErrored(true) }}
        />
      )}
    </div>
  )
}

/* ─────────────── Main component ─────────────────────────────── */
export default function HMIPreview() {
  const { isRunning, hasAlarm } = useMachine()
  const [config,       setConfig]       = useState(loadConfig)
  const [showSettings, setShowSettings] = useState(false)
  const [editUrl,      setEditUrl]      = useState('')
  const [editMode,     setEditMode]     = useState('iframe')
  const [clock,        setClock]        = useState(new Date())

  const isConnected = !!config.url

  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const handleSave = (cfg) => { saveConfig(cfg); setConfig(cfg); setShowSettings(false) }
  const handleDisconnect = () => { saveConfig({}); setConfig({}); setShowSettings(false) }
  const openSettings = () => { setEditUrl(config.url || ''); setEditMode(config.mode || 'iframe'); setShowSettings(true) }
  const handleSettingsSave = (e) => { e.preventDefault(); if (!editUrl.trim()) return; handleSave({ url: editUrl.trim(), mode: editMode }) }

  return (
    <div className="p-4 h-full flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">HMI Preview</p>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-amber-500 animate-pulse'}`}
            title={isConnected ? `Connected: ${config.url}` : 'Simulation mode'}
          />
          {isConnected && (
            <a href={config.url} target="_blank" rel="noopener noreferrer"
              className="text-slate-500 hover:text-blue-400 transition-colors" title="Open in new tab">
              <ExternalLink size={12} />
            </a>
          )}
          <button onClick={openSettings} className="text-slate-500 hover:text-white transition-colors" title="Hardware connection settings">
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* Settings overlay */}
      {showSettings && (
        <div className="bg-[#07111e] rounded-2xl border border-slate-700 p-4 flex flex-col gap-3 shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-white">Hardware Connection</p>
            <button onClick={() => setShowSettings(false)} className="text-slate-500 hover:text-white"><X size={14}/></button>
          </div>
          <p className="text-[10px] text-slate-500 -mt-1 leading-snug">
            Enter your HMI device URL. Leave blank to use the live simulation.
          </p>
          <form onSubmit={handleSettingsSave} className="space-y-2">
            <input
              type="text" value={editUrl} onChange={(e) => setEditUrl(e.target.value)}
              placeholder="http://192.168.1.100" autoFocus
              className="w-full bg-[#0d1f30] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
            <select value={editMode} onChange={(e) => setEditMode(e.target.value)}
              className="w-full bg-[#0d1f30] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500">
              {Object.entries(MODE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <div className="flex gap-2">
              <button type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 rounded-lg transition-colors">
                Connect
              </button>
              {isConnected && (
                <button type="button" onClick={handleDisconnect}
                  className="px-3 bg-red-900/50 hover:bg-red-800/50 text-red-400 text-xs font-semibold py-2 rounded-lg transition-colors">
                  Disconnect
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Main display */}
      {!showSettings && (
        <div className="flex-1 flex flex-col min-h-0">
          {isConnected ? (
            <div className="flex-1 flex flex-col gap-2 min-h-0">
              <div className="flex items-center justify-between shrink-0">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {MODE_LABELS[config.mode] || 'Live'}
                </span>
                <div className="flex items-center gap-1 text-green-400">
                  <Wifi size={10} />
                  <span className="text-[10px] font-semibold">LIVE</span>
                </div>
              </div>
              {config.mode === 'iframe'
                ? <IframeViewer url={config.url} />
                : <ImageViewer url={config.url} mode={config.mode} />
              }
              <div className="flex items-center justify-between bg-[#07111e] rounded-lg px-3 py-1.5 border border-slate-800 shrink-0">
                <span className="text-[10px] font-mono text-slate-500 truncate max-w-[140px]">{config.url}</span>
                <span className="text-[10px] font-mono text-slate-600">{clock.toLocaleTimeString('en-GB')}</span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-1.5 shrink-0">
                <span className="text-[9px] font-semibold text-amber-500 uppercase tracking-wider">Simulation</span>
                <button onClick={openSettings} className="text-[9px] text-slate-500 hover:text-blue-400 underline transition-colors">
                  Connect hardware →
                </button>
              </div>
              <HMISimulation />
            </div>
          )}
        </div>
      )}

      {/* Device info strip */}
      {!showSettings && (
        <div className="space-y-1 text-xs text-slate-500 shrink-0">
          <div className="flex justify-between">
            <span>Device</span>
            <span className="font-mono text-slate-600">PP-001</span>
          </div>
          <div className="flex justify-between">
            <span>Status</span>
            <span className={`font-semibold text-[11px] ${hasAlarm ? 'text-red-400' : isRunning ? 'text-green-400' : 'text-slate-500'}`}>
              {hasAlarm ? 'ALARM' : isRunning ? 'RUNNING' : 'STOPPED'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Mode</span>
            <span className="font-mono text-slate-600">{isConnected ? config.mode : 'Simulation'}</span>
          </div>
        </div>
      )}
    </div>
  )
}

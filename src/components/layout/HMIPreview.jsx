import { useState, useEffect, useRef } from 'react'
import { useMachine } from '../../context/MachineContext'
import { Settings, X, RefreshCw, ExternalLink, Monitor, Wifi, WifiOff, AlertCircle } from 'lucide-react'

const STORAGE_KEY = 'pp_hmi_config'

const MODE_LABELS = {
  iframe:     'Web / VNC (iframe)',
  mjpeg:      'MJPEG Stream',
  screenshot: 'Screenshot (auto-refresh)',
}

function loadConfig() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

function saveConfig(cfg) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg))
}

/* ─────────────── Setup form shown when no URL is configured ─── */
function SetupForm({ onSave }) {
  const [url,  setUrl]  = useState('')
  const [mode, setMode] = useState('iframe')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!url.trim()) return
    onSave({ url: url.trim(), mode })
  }

  return (
    <div className="flex-1 flex flex-col justify-center gap-4 px-1">
      <div className="text-center">
        <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Monitor size={22} className="text-slate-400" />
        </div>
        <p className="text-white text-sm font-semibold">Connect HMI Display</p>
        <p className="text-slate-500 text-xs mt-1 leading-snug">
          Enter the IP or URL of your hardware HMI screen
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            HMI URL / IP Address
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="http://192.168.1.100"
            className="w-full bg-[#0d1f30] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Stream Type
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full bg-[#0d1f30] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            {Object.entries(MODE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
        >
          Connect
        </button>
      </form>

      <div className="bg-[#0d1f30] rounded-xl p-3 text-[10px] text-slate-500 space-y-1.5">
        <p className="font-semibold text-slate-400">Connection options:</p>
        <p>• <span className="text-slate-300">Web / VNC</span> — HMI web interface or noVNC URL</p>
        <p>• <span className="text-slate-300">MJPEG</span> — screen capture stream (e.g. <code className="text-blue-400">http://IP/video</code>)</p>
        <p>• <span className="text-slate-300">Screenshot</span> — auto-refreshes a snapshot URL</p>
      </div>
    </div>
  )
}

/* ─────────────── Live iframe viewer ─────────────────────────── */
function IframeViewer({ url, onError }) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  const handleLoad  = () => { setLoaded(true); setErrored(false) }
  const handleError = () => { setLoaded(true); setErrored(true); onError?.() }

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
            Check the IP address, CORS settings, or use the MJPEG stream option instead.
          </p>
        </div>
      ) : (
        <iframe
          src={url}
          title="HMI Live Screen"
          className={`w-full h-full border-0 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleLoad}
          onError={handleError}
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      )}
    </div>
  )
}

/* ─────────────── MJPEG / screenshot img viewer ──────────────── */
function ImageViewer({ url, mode }) {
  const [key,     setKey]     = useState(0)
  const [loaded,  setLoaded]  = useState(false)
  const [errored, setErrored] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (mode !== 'screenshot') return
    intervalRef.current = setInterval(() => {
      setLoaded(false)
      setKey((k) => k + 1)
    }, 2000)
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
          <p className="text-slate-500 text-[10px] leading-snug">
            Check the device IP and stream URL format.
          </p>
        </div>
      ) : (
        <img
          key={key}
          src={src}
          alt="HMI Live Screen"
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
  const [config,       setConfig]      = useState(loadConfig)
  const [showSettings, setShowSettings] = useState(false)
  const [editUrl,      setEditUrl]     = useState('')
  const [editMode,     setEditMode]    = useState('iframe')
  const [clock,        setClock]       = useState(new Date())

  const isConnected = !!config.url

  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const handleSave = (cfg) => {
    saveConfig(cfg)
    setConfig(cfg)
    setShowSettings(false)
  }

  const handleDisconnect = () => {
    saveConfig({})
    setConfig({})
    setShowSettings(false)
  }

  const openSettings = () => {
    setEditUrl(config.url || '')
    setEditMode(config.mode || 'iframe')
    setShowSettings(true)
  }

  const handleSettingsSave = (e) => {
    e.preventDefault()
    if (!editUrl.trim()) return
    handleSave({ url: editUrl.trim(), mode: editMode })
  }

  return (
    <div className="p-4 h-full flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">HMI Preview</p>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`}
            title={isConnected ? `Connected: ${config.url}` : 'Not connected'}
          />
          {isConnected && (
            <a
              href={config.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-blue-400 transition-colors"
              title="Open in new tab"
            >
              <ExternalLink size={12} />
            </a>
          )}
          <button
            onClick={openSettings}
            className="text-slate-500 hover:text-white transition-colors"
            title="HMI connection settings"
          >
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* Settings overlay */}
      {showSettings && (
        <div className="bg-[#07111e] rounded-2xl border border-slate-700 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-white">HMI Connection</p>
            <button onClick={() => setShowSettings(false)} className="text-slate-500 hover:text-white">
              <X size={14} />
            </button>
          </div>
          <form onSubmit={handleSettingsSave} className="space-y-2">
            <input
              type="text"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              placeholder="http://192.168.1.100"
              className="w-full bg-[#0d1f30] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <select
              value={editMode}
              onChange={(e) => setEditMode(e.target.value)}
              className="w-full bg-[#0d1f30] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {Object.entries(MODE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
              >
                Save
              </button>
              {isConnected && (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-3 bg-red-900/50 hover:bg-red-800/50 text-red-400 text-xs font-semibold py-2 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Main display area */}
      {!showSettings && (
        <>
          {isConnected ? (
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {MODE_LABELS[config.mode] || 'Live'}
                </span>
                <div className="flex items-center gap-1 text-green-400">
                  <Wifi size={10} />
                  <span className="text-[10px] font-semibold">LIVE</span>
                </div>
              </div>

              {config.mode === 'iframe' ? (
                <IframeViewer url={config.url} />
              ) : (
                <ImageViewer url={config.url} mode={config.mode} />
              )}

              <div className="flex items-center justify-between bg-[#07111e] rounded-lg px-3 py-1.5 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 truncate max-w-[140px]">
                  {config.url}
                </span>
                <span className="text-[10px] font-mono text-slate-600">
                  {clock.toLocaleTimeString('en-GB')}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-[#07111e] rounded-2xl border border-slate-700/50 p-4 flex flex-col">
              <SetupForm onSave={handleSave} />
            </div>
          )}
        </>
      )}

      {/* Device metadata */}
      {!showSettings && (
        <div className="space-y-1 text-xs text-slate-500">
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
          {isConnected && (
            <div className="flex justify-between">
              <span>Mode</span>
              <span className="font-mono text-slate-600 capitalize">{config.mode}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

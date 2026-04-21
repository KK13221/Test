import { createContext, useContext, useState, useEffect } from 'react'

const MachineContext = createContext(null)

const DEFAULT_THRESHOLDS = { dp: 4.5, kPa: 150, temp: 32, dust: 3.0 }
const DEFAULT_PARAMS = { kPa: 120, dust: 2.5, temp: 28 }
const DEFAULT_FILTER = {
  tc50: 85,
  e9trb: 120,
  dustLow: 0.5,
  dustHigh: 3.0,
  calibrationOffset: 0.02,
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v))
}

function drift(current, range, min, max) {
  return clamp(current + (Math.random() - 0.5) * range, min, max)
}

function buildHistory() {
  const now = Date.now()
  return Array.from({ length: 30 }, (_, i) => ({
    t: new Date(now - (29 - i) * 2000).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    dp: parseFloat((1.5 + Math.random() * 1.5).toFixed(2)),
    kPa: parseFloat((90 + Math.random() * 20).toFixed(1)),
    temp: parseFloat((22 + Math.random() * 4).toFixed(1)),
  }))
}

export function MachineProvider({ children }) {
  const [isRunning, setIsRunning] = useState(false)
  const [hasAlarm, setHasAlarm] = useState(false)
  const [activeMode, setActiveMode] = useState(null)
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS)
  const [params, setParams] = useState(DEFAULT_PARAMS)
  const [filterSettings, setFilterSettings] = useState(DEFAULT_FILTER)
  const [values, setValues] = useState({ dp: 1.8, kPa: 98.5, temp: 24.3, dust: 1.2 })
  const [history, setHistory] = useState(buildHistory)

  useEffect(() => {
    if (!isRunning) return
    const id = setInterval(() => {
      setValues((prev) => {
        const next = {
          dp: drift(prev.dp, 0.3, 0, 6),
          kPa: drift(prev.kPa, 5, 50, 200),
          temp: drift(prev.temp, 0.5, 15, 45),
          dust: drift(prev.dust, 0.2, 0, 5),
        }
        const alarm =
          next.dp > thresholds.dp ||
          next.kPa > thresholds.kPa ||
          next.temp > thresholds.temp ||
          next.dust > thresholds.dust
        setHasAlarm(alarm)
        setHistory((h) => [
          ...h.slice(-29),
          {
            t: new Date().toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
            dp: parseFloat(next.dp.toFixed(2)),
            kPa: parseFloat(next.kPa.toFixed(1)),
            temp: parseFloat(next.temp.toFixed(1)),
          },
        ])
        return next
      })
    }, 2000)
    return () => clearInterval(id)
  }, [isRunning, thresholds])

  return (
    <MachineContext.Provider
      value={{
        isRunning,
        hasAlarm,
        activeMode,
        setActiveMode,
        values,
        history,
        thresholds,
        setThresholds,
        params,
        setParams,
        filterSettings,
        setFilterSettings,
        start: () => setIsRunning(true),
        stop: () => { setIsRunning(false); setActiveMode(null) },
        resetAlarm: () => setHasAlarm(false),
      }}
    >
      {children}
    </MachineContext.Provider>
  )
}

export function useMachine() {
  return useContext(MachineContext)
}

export default function StatusBadge({ isRunning, hasAlarm }) {
  if (hasAlarm) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        ALARM
      </span>
    )
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
        isRunning ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isRunning ? 'bg-green-500 animate-pulse' : 'bg-slate-400'
        }`}
      />
      {isRunning ? 'RUNNING' : 'STOPPED'}
    </span>
  )
}

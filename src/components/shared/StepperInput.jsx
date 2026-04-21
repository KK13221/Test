import { Minus, Plus } from 'lucide-react'

export default function StepperInput({ label, value, onChange, min = 0, max = 999, step = 1, unit = '' }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {label && (
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{label}</span>
      )}
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, parseFloat((value - step).toFixed(4))))}
          className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors"
        >
          <Minus size={14} className="text-slate-600" />
        </button>
        <span className="w-14 text-center font-bold text-slate-800 text-lg tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, parseFloat((value + step).toFixed(4))))}
          className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-200 flex items-center justify-center hover:bg-green-50 hover:border-green-200 transition-colors"
        >
          <Plus size={14} className="text-slate-600" />
        </button>
      </div>
      {unit && <span className="text-xs text-slate-400">{unit}</span>}
    </div>
  )
}

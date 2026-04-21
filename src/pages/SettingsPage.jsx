import { useState } from 'react'
import { useMachine } from '../context/MachineContext'
import Card from '../components/shared/Card'
import Button from '../components/shared/Button'
import StepperInput from '../components/shared/StepperInput'
import { Save, RotateCcw } from 'lucide-react'

function Field({ label, value, onChange, min, max, step = 0.1, unit }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-xs text-slate-400 w-14 flex-shrink-0">{unit}</span>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const { filterSettings, setFilterSettings, params, setParams, thresholds, setThresholds } = useMachine()
  const [lf, setLf] = useState({ ...filterSettings })
  const [lp, setLp] = useState({ ...params })
  const [lt, setLt] = useState({ ...thresholds })
  const [saved, setSaved] = useState('')

  const save = (which) => {
    if (which === 'filter')     setFilterSettings(lf)
    if (which === 'params')     setParams(lp)
    if (which === 'thresholds') setThresholds(lt)
    setSaved(which)
    setTimeout(() => setSaved(''), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
        <p className="text-sm text-slate-500">Configure machine parameters and sensors</p>
      </div>

      {/* Filter & Sensor */}
      <Card title="Filter & Sensor Settings" className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
          <Field label="TC50"               value={lf.tc50}               onChange={(v) => setLf((f) => ({ ...f, tc50: v }))}               min={0}  max={200} step={1}    unit="%" />
          <Field label="E9TRB"              value={lf.e9trb}              onChange={(v) => setLf((f) => ({ ...f, e9trb: v }))}              min={0}  max={300} step={1}    unit="units" />
          <Field label="Dust Low Threshold" value={lf.dustLow}            onChange={(v) => setLf((f) => ({ ...f, dustLow: v }))}            min={0}  max={5}   step={0.1}  unit="mg/m³" />
          <Field label="Dust High Threshold"value={lf.dustHigh}           onChange={(v) => setLf((f) => ({ ...f, dustHigh: v }))}           min={0}  max={10}  step={0.1}  unit="mg/m³" />
          <Field label="Calibration Offset" value={lf.calibrationOffset}  onChange={(v) => setLf((f) => ({ ...f, calibrationOffset: v }))}  min={-1} max={1}   step={0.01} unit="offset" />
        </div>
        <div className="flex gap-2 mt-5">
          <Button onClick={() => save('filter')} variant={saved === 'filter' ? 'success' : 'primary'}>
            <Save size={15} /> {saved === 'filter' ? 'Saved!' : 'Save Settings'}
          </Button>
          <Button variant="ghost" onClick={() => setLf({ ...filterSettings })}>
            <RotateCcw size={15} /> Reset
          </Button>
        </div>
      </Card>

      {/* Parameter config */}
      <Card title="Parameter Configuration" className="p-5">
        <div className="flex flex-wrap justify-center gap-8 mt-4 mb-2">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">Pressure (kPa)</span>
            <StepperInput value={lp.kPa}  onChange={(v) => setLp((p) => ({ ...p, kPa: v }))}  min={0} max={300} step={5}   unit="kPa" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">Dust (mg/m³)</span>
            <StepperInput value={lp.dust} onChange={(v) => setLp((p) => ({ ...p, dust: v }))} min={0} max={10}  step={0.5} unit="mg/m³" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">Temperature (°C)</span>
            <StepperInput value={lp.temp} onChange={(v) => setLp((p) => ({ ...p, temp: v }))} min={0} max={60}  step={1}   unit="°C" />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <Button onClick={() => save('params')} variant={saved === 'params' ? 'success' : 'primary'}>
            <Save size={15} /> {saved === 'params' ? 'Saved!' : 'Save Parameters'}
          </Button>
          <Button variant="ghost" onClick={() => setLp({ ...params })}>
            <RotateCcw size={15} /> Reset
          </Button>
        </div>
      </Card>

      {/* Alert thresholds */}
      <Card title="Alert Thresholds" className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
          <Field label="ΔP Threshold"          value={lt.dp}   onChange={(v) => setLt((t) => ({ ...t, dp: v }))}   min={0} max={10}  step={0.1} unit="kPa" />
          <Field label="Pressure Threshold"    value={lt.kPa}  onChange={(v) => setLt((t) => ({ ...t, kPa: v }))}  min={0} max={300} step={1}   unit="kPa" />
          <Field label="Temperature Threshold" value={lt.temp} onChange={(v) => setLt((t) => ({ ...t, temp: v }))} min={0} max={60}  step={0.5} unit="°C" />
          <Field label="Dust Threshold"        value={lt.dust} onChange={(v) => setLt((t) => ({ ...t, dust: v }))} min={0} max={10}  step={0.1} unit="mg/m³" />
        </div>
        <div className="flex gap-2 mt-5">
          <Button onClick={() => save('thresholds')} variant={saved === 'thresholds' ? 'success' : 'primary'}>
            <Save size={15} /> {saved === 'thresholds' ? 'Saved!' : 'Save Thresholds'}
          </Button>
          <Button variant="ghost" onClick={() => setLt({ ...thresholds })}>
            <RotateCcw size={15} /> Reset
          </Button>
        </div>
      </Card>
    </div>
  )
}

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

export default function PressureChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="t"
          tick={{ fontSize: 10, fill: '#94a3b8' }}
          interval="preserveStartEnd"
          tickLine={false}
        />
        <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            background: '#1e293b', border: 'none', borderRadius: 12,
            color: '#f8fafc', fontSize: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          }}
          labelStyle={{ color: '#94a3b8', marginBottom: 4 }}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} iconType="circle" iconSize={8} />
        <Line type="monotone" dataKey="dp"   name="ΔP (kPa)"       stroke="#3b82f6" strokeWidth={2}   dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
        <Line type="monotone" dataKey="temp" name="Temp (°C)"       stroke="#f97316" strokeWidth={2}   dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
        <Line type="monotone" dataKey="kPa"  name="Pressure (kPa)" stroke="#8b5cf6" strokeWidth={1.5} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} strokeDasharray="4 2" />
      </LineChart>
    </ResponsiveContainer>
  )
}

const eventTypes = ['INFO', 'WARNING', 'ALARM', 'CONTROL']
const events = [
  'Machine started', 'Machine stopped', 'Pressure spike detected',
  'Temperature exceeded threshold', 'Dust level high', 'Cleaning cycle initiated',
  'Fan control activated', 'Alarm reset by operator', 'Motor started',
  'Diagnostics run', 'Manual override enabled', 'Calibration updated',
  'Settings saved', 'Parameter updated', 'Maintenance reminder triggered',
]

function rand(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a
}

export const mockLogs = Array.from({ length: 50 }, (_, i) => {
  const type = eventTypes[rand(0, 3)]
  const date = new Date(Date.now() - i * 1800 * 1000)
  return {
    id: 50 - i,
    timestamp: date.toLocaleString(),
    type,
    event: events[rand(0, events.length - 1)],
    value: type === 'ALARM' ? `${(Math.random() * 5).toFixed(2)} kPa` : '-',
    user: ['admin', 'operator1', 'system'][rand(0, 2)],
  }
})

export const maintenanceLog = [
  { date: '2024-03-15', type: 'Filter replacement', tech: 'John D.', status: 'completed' },
  { date: '2024-02-01', type: 'Sensor calibration', tech: 'Sarah M.', status: 'completed' },
  { date: '2023-12-10', type: 'Full inspection', tech: 'Mike R.', status: 'completed' },
  { date: '2023-10-05', type: 'Belt replacement', tech: 'John D.', status: 'completed' },
]

export const mockUsers = [
  { id: 1, name: 'Admin User', username: 'admin', role: 'admin', lastLogin: '2024-04-21 09:14', status: 'active' },
  { id: 2, name: 'Operator 1', username: 'operator1', role: 'operator', lastLogin: '2024-04-20 14:30', status: 'active' },
  { id: 3, name: 'Viewer User', username: 'viewer1', role: 'viewer', lastLogin: '2024-04-18 08:00', status: 'inactive' },
]

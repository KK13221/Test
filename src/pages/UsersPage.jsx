import { mockUsers } from '../data/mockData'
import Card from '../components/shared/Card'
import Button from '../components/shared/Button'
import { UserPlus, Shield, User, Eye } from 'lucide-react'

const ROLE_STYLES = {
  admin:    { cls: 'bg-blue-100 text-blue-700',   icon: Shield },
  operator: { cls: 'bg-green-100 text-green-700', icon: User },
  viewer:   { cls: 'bg-slate-100 text-slate-600', icon: Eye },
}

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-sm text-slate-500">{mockUsers.length} accounts registered</p>
        </div>
        <Button variant="primary">
          <UserPlus size={15} /> Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['admin', 'operator', 'viewer'].map((role) => {
          const count = mockUsers.filter((u) => u.role === role).length
          const { cls, icon: Icon } = ROLE_STYLES[role]
          return (
            <Card key={role} className="p-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cls}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium capitalize">{role}s</p>
                  <p className="text-2xl font-bold text-slate-800">{count}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {['Name', 'Username', 'Role', 'Last Login', 'Status'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((u) => {
                const { cls, icon: Icon } = ROLE_STYLES[u.role]
                return (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{u.name[0]}</span>
                        </div>
                        <span className="text-sm font-medium text-slate-700">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs font-mono text-slate-500">{u.username}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>
                        <Icon size={10} />
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">{u.lastLogin}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          u.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

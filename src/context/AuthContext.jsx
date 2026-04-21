import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const USERS = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
  { id: 2, username: 'operator', password: 'op123', role: 'operator', name: 'Operator 1' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('pp_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = (username, password) => {
    const found = USERS.find(
      (u) => u.username === username && u.password === password
    )
    if (found) {
      const { password: _pwd, ...safeUser } = found
      setUser(safeUser)
      localStorage.setItem('pp_user', JSON.stringify(safeUser))
      return { success: true }
    }
    return { success: false, error: 'Invalid username or password' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('pp_user')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

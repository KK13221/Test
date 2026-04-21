import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { MachineProvider } from './context/MachineContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import MonitoringPage from './pages/MonitoringPage'
import ControlsPage from './pages/ControlsPage'
import SettingsPage from './pages/SettingsPage'
import LogsPage from './pages/LogsPage'
import UsersPage from './pages/UsersPage'
import MaintenancePage from './pages/MaintenancePage'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MachineProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="monitoring" element={<MonitoringPage />} />
              <Route path="controls" element={<ControlsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="logs" element={<LogsPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="maintenance" element={<MaintenancePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </MachineProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

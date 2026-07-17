import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { TaskProvider } from './context/TaskContext'

import ProtectedRoute from './components/auth/ProtectedRoute'
import RedirectIfAuth from './components/auth/RedirectIfAuth'
import LoginPage from './components/auth/LoginPage'
import SignupPage from './components/auth/SignupPage'
import Layout from './components/layout/Layout'

import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import KanbanBoard from './components/kanban/KanbanBoard'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Routes>
              {/* Public routes */}
              <Route
                path="/login"
                element={
                  <RedirectIfAuth>
                    <LoginPage />
                  </RedirectIfAuth>
                }
              />
              <Route
                path="/signup"
                element={
                  <RedirectIfAuth>
                    <SignupPage />
                  </RedirectIfAuth>
                }
              />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="/boards" element={<KanbanBoard />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { checkAuth } from './redux/auth/authThunk'

import ProtectedRoute from './components/auth/ProtectedRoute'
import RedirectIfAuth from './components/auth/RedirectIfAuth'
// \import SignupPage from './components/auth/SignupPage'
import Layout from './components/layout/Layout'
import { Toaster } from 'react-hot-toast'

import WorkspaceList from './pages/WorkspaceList'
import BoardList from './pages/BoardList'
import KanbanBoard from './components/kanban/KanbanBoard'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import VerifyEmailCodePage from './pages/VerifyEmailCodePage'

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
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
      
          <Route
            path="/verify-email"
            element={
              <RedirectIfAuth>
                <VerifyEmailPage />
              </RedirectIfAuth>
            }
          />
          <Route
            path="/verify-email/code"
            element={
              <RedirectIfAuth>
                <VerifyEmailCodePage />
              </RedirectIfAuth>
            }
          />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<WorkspaceList />} />
              <Route path="/workspaces/:workspaceId" element={<BoardList />} />
              <Route path="/boards/:boardId" element={<KanbanBoard />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

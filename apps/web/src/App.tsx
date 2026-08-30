import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TeacherDashboard from './pages/TeacherDashboard'
import StudentDashboard from './pages/StudentDashboard'
import QuizPage from './pages/QuizPage'
import ProtectedRoute from './components/ProtectedRoute'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-bg)] mb-4"
            style={{
              boxShadow: '-5px -5px 15px var(--shadow-light), 5px 5px 15px var(--shadow-dark)'
            }}>
            <svg className="animate-spin h-8 w-8 text-[var(--color-primary)]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="text-[var(--color-text-secondary)]">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} replace /> : <RegisterPage />} />
      <Route path="/teacher" element={<ProtectedRoute requiredRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/student" element={<ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/quiz/:lessonId" element={<ProtectedRoute requiredRole="student"><QuizPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={user ? (user.role === 'teacher' ? '/teacher' : '/student') : '/login'} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

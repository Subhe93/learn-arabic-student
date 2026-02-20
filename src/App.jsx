import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { SubscriptionProvider } from './contexts/SubscriptionContext'
import ProtectedRoute from './components/ProtectedRoute'
import SubscriptionGuard from './components/SubscriptionGuard'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import EmailConfirmationPage from './pages/EmailConfirmationPage'
import ConfirmEmailPage from './pages/ConfirmEmailPage'
import SubscriptionPlansPage from './pages/SubscriptionPlansPage'
import ProfilePage from './pages/ProfilePage'
import CoursesPage from './pages/CoursesPage'
import LearningContainerPage from './pages/LearningContainerPage'
import UpcomingSessionsPage from './pages/UpcomingSessionsPage'

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          <Route 
            path="/email-confirmation" 
            element={
              <ProtectedRoute requireConfirmation={false}>
                <EmailConfirmationPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/auth/confirm" element={<ConfirmEmailPage />} />
          <Route 
            path="/subscription/plans" 
            element={
              <ProtectedRoute>
                <SubscriptionPlansPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sessions" 
            element={
              <ProtectedRoute>
                <SubscriptionGuard>
                  <UpcomingSessionsPage />
                </SubscriptionGuard>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses" 
            element={
              <ProtectedRoute>
                <SubscriptionGuard>
                  <CoursesPage />
                </SubscriptionGuard>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/learn/:levelId/:lessonId/:tab" 
            element={
              <ProtectedRoute>
                <SubscriptionGuard>
                  <LearningContainerPage />
                </SubscriptionGuard>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/learn/:levelId/:lessonId" 
            element={
              <ProtectedRoute>
                <SubscriptionGuard>
                  <LearningContainerPage />
                </SubscriptionGuard>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/learn/:levelId" 
            element={
              <ProtectedRoute>
                <SubscriptionGuard>
                  <LearningContainerPage />
                </SubscriptionGuard>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/learn" 
            element={
              <ProtectedRoute>
                <SubscriptionGuard>
                  <LearningContainerPage />
                </SubscriptionGuard>
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<LoginPage />} />
          </Routes>
        </Router>
      </SubscriptionProvider>
    </AuthProvider>
  )
}

export default App


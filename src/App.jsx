import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProfilePage from './pages/ProfilePage'
import CoursesPage from './pages/CoursesPage'
import LearningContainerPage from './pages/LearningContainerPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/learn" element={<LearningContainerPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App


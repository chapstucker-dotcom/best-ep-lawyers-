import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import FirmPage from './pages/FirmPage'
import CategoryPage from './pages/CategoryPage'
import AuthCallback from './pages/AuthCallback'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="firms/:slug" element={<FirmPage />} />
          <Route path="categories/:category" element={<CategoryPage />} />
          <Route path="auth/callback" element={<AuthCallback />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
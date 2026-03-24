import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'

const Layout = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Best EP Lawyers
            </Link>

            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
              <Link to="/categories/employment" className="text-gray-700 hover:text-blue-600">
                Employment Law
              </Link>
              <Link to="/categories/labor" className="text-gray-700 hover:text-blue-600">
                Labor Law
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">{user.email}</span>
                  <Button onClick={handleSignOut} variant="outline">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button>Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Best EP Lawyers</h3>
              <p className="text-gray-400">
                Find the best employment and labor law firms in your area.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Practice Areas</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/categories/employment" className="hover:text-white">Employment Law</Link></li>
                <li><Link to="/categories/labor" className="hover:text-white">Labor Law</Link></li>
                <li><Link to="/categories/wrongful-termination" className="hover:text-white">Wrongful Termination</Link></li>
                <li><Link to="/categories/discrimination" className="hover:text-white">Discrimination</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-gray-400">
                {user ? (
                  <>
                    <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
                    <li><button onClick={handleSignOut} className="hover:text-white">Sign Out</button></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login" className="hover:text-white">Sign In</Link></li>
                    <li><Link to="/signup" className="hover:text-white">Sign Up</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Best EP Lawyers. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
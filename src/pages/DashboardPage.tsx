import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'

const DashboardPage = () => {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            </div>

            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Welcome back!</h2>
              <p className="text-gray-600">
                Signed in as: <span className="font-medium">{user.email}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Firm Profile Card */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Firm Profile</h3>
                <p className="text-blue-700 mb-4">
                  Complete your law firm profile to appear in our directory.
                </p>
                <Button className="w-full">Edit Profile</Button>
              </div>

              {/* Listings Card */}
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Your Listings</h3>
                <p className="text-green-700 mb-4">
                  Manage your firm's presence in our directory.
                </p>
                <Button variant="outline" className="w-full">
                  View Listings
                </Button>
              </div>

              {/* Analytics Card */}
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Analytics</h3>
                <p className="text-purple-700 mb-4">
                  View insights about your firm's visibility.
                </p>
                <Button variant="outline" className="w-full">
                  View Analytics
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-600 text-center">
                  No recent activity to display. Start by completing your firm profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
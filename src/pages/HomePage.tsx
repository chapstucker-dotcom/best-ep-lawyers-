
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import FirmCard from '../components/FirmCard'
import CategoryPills from '../components/CategoryPills'
import PricingSection from '../components/PricingSection'


const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [firms, setFirms] = useState([])
  const [filteredFirms, setFilteredFirms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch firms from Supabase
    const fetchFirms = async () => {
      setLoading(true)
      try {
        const { data, error } = await import('../lib/supabase').then(({ supabase }) =>
          supabase.from('firms').select('*')
        )
        if (error) throw error
        setFirms(data || [])
      } catch (err) {
        setFirms([])
      } finally {
        setLoading(false)
      }
    }
    fetchFirms()
  }, [])

  useEffect(() => {
    let filtered = firms
    if (searchTerm) {
      filtered = filtered.filter(firm =>
        firm.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firm.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firm.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (selectedCategory) {
      filtered = filtered.filter(firm =>
        Array.isArray(firm.categories)
          ? firm.categories.includes(selectedCategory)
          : (firm.categories || '').includes(selectedCategory)
      )
    }
    setFilteredFirms(filtered)
  }, [searchTerm, selectedCategory, firms])

  return (
    <div className="min-h-screen">
      {loading && (
        <div className="text-center py-12 text-lg text-gray-500">Loading firms...</div>
      )}
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find the Best Employment Law Firms
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Connect with top-rated employment and labor law attorneys in your area
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search by firm name, location, or practice area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-6 py-4 text-lg rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50 text-gray-900"
              />
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Practice Areas</h2>
          <CategoryPills
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>
      </section>

      {/* Firms Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              {selectedCategory ? `${selectedCategory} Firms` : 'Featured Law Firms'}
            </h2>
            <span className="text-gray-600">{filteredFirms.length} firms found</span>
          </div>

          {filteredFirms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No firms found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('')
                }}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFirms.map((firm) => (
                <Link key={firm.id} to={`/firms/${firm.slug}`}>
                  <FirmCard firm={firm} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Are You a Law Firm?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join our directory and connect with clients seeking employment law services.
          </p>
          <Link to="/signup">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              List Your Firm
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
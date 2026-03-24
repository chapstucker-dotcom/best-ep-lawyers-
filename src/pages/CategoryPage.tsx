import { useParams, Link } from 'react-router-dom'

import React, { useState, useEffect } from 'react';
import FirmCard from '../../EP BEST LAWYERS/src/components/FirmCard';
import { Button } from '../components/ui/button'

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>()

  // Convert URL-friendly category back to display format
  const displayCategory = category?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  const [categoryFirms, setCategoryFirms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!category) return
    setLoading(true)
    import('../lib/supabase').then(({ supabase }) => {
      // Fetch firms where any category matches the URL param
      supabase.from('firms').select('*')
        .contains('categories', [displayCategory])
        .then(({ data, error }) => {
          setCategoryFirms(data || [])
          setLoading(false)
        })
    })
  }, [category, displayCategory])

  if (!displayCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">The category you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg text-gray-500">Loading firms...</div>
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{displayCategory} Law Firms</h1>
            <p className="text-xl text-gray-600 mb-6">
              Find experienced {displayCategory.toLowerCase()} attorneys in your area
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categoryFirms.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Firms Found</h2>
              <p className="text-gray-600 mb-8">
                We don't have any {displayCategory.toLowerCase()} firms listed yet.
              </p>
              <div className="space-x-4">
                <Link to="/">
                  <Button variant="outline">Browse All Firms</Button>
                </Link>
                <Link to="/signup">
                  <Button>List Your Firm</Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {categoryFirms.length} {displayCategory} Firm{categoryFirms.length !== 1 ? 's' : ''} Found
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryFirms.map((firm) => (
                  <Link key={firm.id} to={`/firms/${firm.slug}`}>
                    <FirmCard firm={firm} onClick={() => {}} />
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Are You a {displayCategory} Law Firm?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join our directory and connect with clients seeking {displayCategory.toLowerCase()} legal services.
          </p>
          <Link to="/signup">
            <Button className="bg-white text-blue-600 hover:bg-gray-50">
              List Your Firm
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default CategoryPage
import { useParams, Link } from 'react-router-dom'

import { Button } from '../components/ui/button'
import { Badge } from '../components/Badge'

const FirmPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [firm, setFirm] = useState(null)
  const [similarFirms, setSimilarFirms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    import('../lib/supabase').then(({ supabase }) => {
      supabase.from('firms').select('*').eq('slug', slug).single()
        .then(({ data, error }) => {
          if (!error && data) {
            setFirm(data)
            // Fetch similar firms by category
            supabase.from('firms').select('*')
              .neq('id', data.id)
              .contains('categories', data.categories)
              .limit(3)
              .then(({ data: similar, error: simErr }) => {
                setSimilarFirms(similar || [])
                setLoading(false)
              })
          } else {
            setFirm(null)
            setSimilarFirms([])
            setLoading(false)
          }
        })
    })
  }, [slug])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg text-gray-500">Loading firm...</div>
  }
  if (!firm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Firm Not Found</h1>
          <p className="text-gray-600 mb-8">The law firm you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{firm.name}</h1>
              <p className="text-xl text-gray-600 mb-4">{firm.location}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {firm.categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
              <p className="text-gray-700 max-w-2xl">{firm.description}</p>
            </div>
            <div className="lg:ml-8">
              <Button size="lg" className="w-full lg:w-auto">
                Contact This Firm
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About {firm.name}</h2>
                <p className="text-gray-700 leading-relaxed mb-6">{firm.description}</p>

                {/* Practice Areas */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Practice Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {firm.categories.map((category) => (
                      <Link key={category} to={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                          {category}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Address:</strong> {firm.location}</p>
                    <p><strong>Phone:</strong> {firm.phone || 'Contact for phone number'}</p>
                    <p><strong>Email:</strong> {firm.email || 'Contact for email address'}</p>
                    <p><strong>Website:</strong> {firm.website ? (
                      <a href={firm.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        {firm.website}
                      </a>
                    ) : 'Not available'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Services Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Services Offered</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {firm.services?.map((service, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <p className="text-gray-700">{service}</p>
                    </div>
                  )) || (
                    <p className="text-gray-600 col-span-2">Service details coming soon.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
                <Button className="w-full mb-3">
                  Request Consultation
                </Button>
                <Button variant="outline" className="w-full">
                  Call Now
                </Button>
              </div>

              {/* Quick Facts */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Facts</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Founded:</span>
                    <span className="font-medium">{firm.founded || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">{firm.size || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Languages:</span>
                    <span className="font-medium">{firm.languages?.join(', ') || 'English'}</span>
                  </div>
                </div>
              </div>

              {/* Similar Firms */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Firms</h3>
                <div className="space-y-3">
                  {similarFirms.map((similarFirm) => (
                    <Link
                      key={similarFirm.id}
                      to={`/firms/${similarFirm.slug}`}
                      className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900">{similarFirm.name}</h4>
                      <p className="text-sm text-gray-600">{similarFirm.location}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FirmPage
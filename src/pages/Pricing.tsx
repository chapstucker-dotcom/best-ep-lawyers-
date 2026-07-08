export default function Pricing() {
  document.title = "Law Firm Pricing | El Paso's Best Lawyers";

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-[#0F2A43] text-center mb-4">
          Law Firm Pricing
        </h1>

        <p className="text-center text-gray-600 mb-12">
          Start free. Upgrade any time.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-2">Expert</h2>
            <p className="text-3xl font-bold mb-4">$299/mo</p>
            <p>Enhanced firm profile, lead capture, analytics dashboard, and up to 5 attorney profiles.</p>
          </div>

          <div className="bg-white border-2 border-[#D4A62A] rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-2">Category Featured</h2>
            <p className="text-3xl font-bold mb-4">$2,000/mo</p>
            <p>Premium placement, homepage exposure, priority lead routing, and up to 10 attorney profiles.</p>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-2">Category Exclusive</h2>
            <p className="text-3xl font-bold mb-4">$5,000/mo</p>
            <p>One firm per category, top placement, Category Owner badge, competitor lockout, and up to 20 attorney profiles.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
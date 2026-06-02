import { Scale } from 'lucide-react';

export default function Footer() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0F2A43] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scale className="h-8 w-8 text-[#F5B800]" />
              <span className="text-xl font-bold">El Paso's Best Lawyers</span>
            </div>
            <p className="text-sm text-gray-300">
              Find trusted attorneys in El Paso, TX
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">For Residents</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => scrollToSection('search')} className="hover:text-[#F5B800]">Find Lawyers</button></li>
              <li><button onClick={() => scrollToSection('categories')} className="hover:text-[#F5B800]">Categories</button></li>
              <li><button onClick={() => scrollToSection('resources')} className="hover:text-[#F5B800]">Resources</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">For Law Firms</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => scrollToSection('list-form')} className="hover:text-[#F5B800]">List Your Firm</button></li>
              <li><button onClick={() => scrollToSection('pricing')} className="hover:text-[#F5B800]">Pricing</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => scrollToSection('disclaimers')} className="hover:text-[#F5B800]">Disclaimers</button></li>
              <li><button className="hover:text-[#F5B800]">Privacy Policy</button></li>
              <li><button className="hover:text-[#F5B800]">Terms of Service</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 text-sm text-gray-400">
          <p className="mb-4">
            <strong>No Legal Advice:</strong> Information on this site is for general informational purposes only and is not legal advice. 
            No attorney-client relationship is formed by using this site.
          </p>
          <p className="mb-4">
            <strong>Advertising Disclosure:</strong> Some listings are paid advertisements. Featured labels indicate paid placement.
          </p>
          <p>© 2025 El Paso's Best Lawyers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}



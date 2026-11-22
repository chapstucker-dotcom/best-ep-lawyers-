import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export type DirectoryReturn = {
  searchQuery: string;
  searchInput: string;
  suggestedSearchAreas?: string[];
  selectedCategory: string;
  featuredOnly: boolean;
  freeConsultationOnly: boolean;
  sortBy: string;
};

export type ProfileNavigationState = {
  fromHome?: boolean;
  directoryReturn?: DirectoryReturn;
};

export default function PublicProfileNavigation({ firmId }: { firmId?: string }) {
  const location = useLocation();
  const state = location.state as ProfileNavigationState | null;
  const directoryReturn = state?.directoryReturn;
  const searchLink = { pathname: '/', hash: '#search' };

  return (
    <header className="border-b bg-[#061A2C] text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8">
        <Link to="/" className="font-serif text-xl font-black text-white">
          El Paso&apos;s Best Lawyers
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-2">
          <Link to="/" className="rounded-lg px-3 py-2 text-sm font-bold hover:bg-white/10">Home</Link>
          <Link to={searchLink} className="rounded-lg border border-white/25 px-3 py-2 text-sm font-bold hover:bg-white/10">Find Lawyers</Link>
        </nav>
      </div>
      {(firmId || directoryReturn || state?.fromHome) && (
        <div className="border-t border-white/10 bg-[#F8FAFC] text-[#0F2A43]">
          <nav aria-label="Return navigation" className="mx-auto flex max-w-7xl flex-wrap gap-x-5 gap-y-2 px-4 py-3 text-sm font-semibold sm:px-8">
            {firmId && <Link to={`/firm/${encodeURIComponent(firmId)}`} state={state} className="inline-flex items-center gap-2 hover:underline"><ArrowLeft className="h-4 w-4" /> Back to Firm Profile</Link>}
            {directoryReturn ? (
              <Link to={searchLink} state={{ directoryReturn }} className="inline-flex items-center gap-2 hover:underline"><ArrowLeft className="h-4 w-4" /> Back to Search Results</Link>
            ) : state?.fromHome && !firmId ? (
              <Link to="/" className="inline-flex items-center gap-2 hover:underline"><ArrowLeft className="h-4 w-4" /> Back to Homepage</Link>
            ) : null}
          </nav>
        </div>
      )}
    </header>
  );
}

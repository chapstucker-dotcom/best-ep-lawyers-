import { Globe, Mail, Phone, Scale } from "lucide-react";

export default function Footer() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-[#0F2A43] text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-4">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <Scale className="h-8 w-8 text-[#D4A62A]" />
              <h2 className="text-2xl font-bold">
                El Paso&apos;s Best Lawyers
              </h2>
            </div>

            <p className="leading-relaxed text-gray-300">
              Connecting People with El Paso&apos;s Legal Community.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <a
                href="https://www.elpasosbestlawyers.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition hover:text-[#D4A62A]"
              >
                <Globe className="h-4 w-4 text-[#D4A62A]" />
                ElPasosBestLawyers.com
              </a>

              <a
                href="mailto:support@elpasosbestlawyers.com"
                className="flex items-center gap-2 transition hover:text-[#D4A62A]"
              >
                <Mail className="h-4 w-4 text-[#D4A62A]" />
                support@elpasosbestlawyers.com
              </a>

              <a
                href="tel:+19155392283"
                className="flex items-center gap-2 transition hover:text-[#D4A62A]"
              >
                <Phone className="h-4 w-4 text-[#D4A62A]" />
                (915) 539-2283
              </a>
            </div>

            <p className="mt-8 font-semibold text-[#D4A62A]">
              Complimentary Law Firm Listings Available
            </p>
          </div>

          <div>
            <h3 className="mb-5 font-bold">For Residents</h3>

            <ul className="space-y-3 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("search")}
                  className="transition hover:text-[#D4A62A]"
                >
                  Find Lawyers
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("categories")}
                  className="transition hover:text-[#D4A62A]"
                >
                  Browse Practice Areas
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("resources")}
                  className="transition hover:text-[#D4A62A]"
                >
                  Legal Resources
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-bold">For Law Firms</h3>

            <ul className="space-y-3 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("list-form")}
                  className="transition hover:text-[#D4A62A]"
                >
                  Claim Your Complimentary Listing
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("pricing")}
                  className="transition hover:text-[#D4A62A]"
                >
                  Membership Options
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-bold">Legal</h3>

            <ul className="space-y-3 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("disclaimers")}
                  className="transition hover:text-[#D4A62A]"
                >
                  Disclaimers
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className="transition hover:text-[#D4A62A]"
                >
                  Privacy Policy
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className="transition hover:text-[#D4A62A]"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-sm text-gray-400">
          <p className="mb-4">
            <strong>No Legal Advice:</strong> Information provided on this
            platform is for general informational purposes only and does not
            constitute legal advice. Use of this website does not create an
            attorney-client relationship.
          </p>

          <p className="mb-4">
            <strong>Advertising Disclosure:</strong> Some firm profiles may
            include paid promotional placement. Any featured or sponsored
            listings are clearly identified.
          </p>

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p>
              © {new Date().getFullYear()} El Paso&apos;s Best Lawyers. All
              rights reserved.
            </p>

            <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
              Built in El Paso. Built for El Paso.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { useSeo } from "../hooks/use-seo";

export default function Terms() {
  useSeo({
    title: "Terms of Service | El Paso's Best Lawyers",
    description:
      "Terms of Service for use of the El Paso's Best Lawyers legal directory and legal-help request platform.",
    path: "/terms",
    robots: "index, follow",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link to="/" className="font-bold text-[#0F2A43]">
            El Paso&apos;s Best Lawyers
          </Link>
          <Link to="/" className="text-sm font-semibold text-[#0F2A43]">
            Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-14">
        <article className="rounded-2xl bg-white p-8 shadow-sm md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1FA8A1]">
            Legal
          </p>
          <h1 className="mt-2 text-4xl font-bold text-[#0F2A43]">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm text-gray-500">
            Last updated: October 7, 2026
          </p>

          <div className="mt-8 space-y-8 leading-7 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-[#0F2A43]">
                About El Paso&apos;s Best Lawyers
              </h2>
              <p className="mt-3">
                El Paso&apos;s Best Lawyers is a legal directory and
                information platform designed to help people discover, compare,
                and contact law firms serving the El Paso area. El Paso&apos;s
                Best Lawyers is not a law firm and does not provide legal
                representation or legal advice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F2A43]">
                No Legal Advice or Attorney-Client Relationship
              </h2>
              <p className="mt-3">
                Information on this website is provided for general
                informational purposes and is not legal advice. Using the site
                or submitting a request does not create an attorney-client
                relationship with El Paso&apos;s Best Lawyers.
              </p>
              <p className="mt-3">
                An attorney-client relationship with a participating law firm
                can arise only if that law firm agrees to represent you under
                its own procedures and terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F2A43]">
                Legal-Help and Consultation Requests
              </h2>
              <p className="mt-3">
                If you submit a legal-help or consultation request, we may use
                the information you provide to identify a relevant legal
                category and, when available, route the request to a
                participating law firm for review. Submission does not
                guarantee that your request will be routed, that a law firm
                will respond, or that any law firm will accept your matter.
              </p>
              <p className="mt-3">
                Do not use the website for emergencies or rely on a submission
                to preserve a legal deadline. If you face an emergency, contact
                the appropriate emergency service. If a legal deadline may
                apply, contact a qualified attorney directly as soon as
                possible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F2A43]">
                Law-Firm Listings and Advertising
              </h2>
              <p className="mt-3">
                Some law-firm listings, profiles, showcases, or placements on
                the platform may be paid advertising or promotional placements.
                Paid placement may affect where or how a participating firm is
                displayed or how eligible inquiries are routed. A paid listing
                is not a guarantee or representation that a particular lawyer
                or law firm is the best choice for a particular matter.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F2A43]">
                Directory Information
              </h2>
              <p className="mt-3">
                We work to provide useful directory information, but law-firm,
                attorney, practice-area, contact, and other information can
                change. You should independently verify information that is
                important to your decision, including an attorney&apos;s
                licensing status, qualifications, experience, and availability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F2A43]">
                Your Use of the Site
              </h2>
              <p className="mt-3">
                You agree not to misuse the website, interfere with its
                operation, attempt unauthorized access, submit unlawful or
                fraudulent material, impersonate another person, or use
                automated methods to disrupt or improperly extract information
                from the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F2A43]">
                Third-Party Websites and Services
              </h2>
              <p className="mt-3">
                The site may contain links to law firms and other third parties.
                El Paso&apos;s Best Lawyers does not control those third-party
                websites, services, content, availability, or practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F2A43]">
                Site Content
              </h2>
              <p className="mt-3">
                The design, branding, original text, graphics, and other
                original site materials are protected by applicable
                intellectual-property laws. Third-party names, logos, and
                materials remain the property of their respective owners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F2A43]">
                Changes to These Terms
              </h2>
              <p className="mt-3">
                We may update these Terms as the platform changes. The date
                above identifies the most recent version posted on the site.
                Continued use of the site after an updated version is posted is
                subject to the then-current Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F2A43]">
                Contact Us
              </h2>
              <p className="mt-3">
                Questions about these Terms may be sent to{" "}
                <a
                  href="mailto:support@elpasosbestlawyers.com"
                  className="font-semibold text-[#0F2A43] underline"
                >
                  support@elpasosbestlawyers.com
                </a>
                .
              </p>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { useSeo } from "../hooks/use-seo";

export default function Privacy() {
  useSeo({
    title: "Privacy Policy | El Paso's Best Lawyers",
    description:
      "Privacy Policy for El Paso's Best Lawyers, including how information submitted through the directory is collected, used, and shared.",
    path: "/privacy",
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
            Privacy
          </p>
          <h1 className="mt-2 text-4xl font-bold text-[#0F2A43]">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-gray-500">
            Last updated: October 7, 2026
          </p>

          <div className="mt-8 space-y-8 leading-7 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-[#0F2A43]">
                Information We Collect
              </h2>
              <p className="mt-3">
                When you submit a legal-help or consultation request, we may
                collect information you provide, including your name, email
                address, phone number if provided, a description of your legal
                issue, where the matter occurred or is located, and information
                about timing.
              </p>
              <p className="mt-3">
                Please share only what is necessary. Do not submit confidential
                communications, Social Security numbers, financial account
                numbers, medical records, or other highly sensitive information
                through a general website form.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F2A43]">
                Website and Attribution Information
              </h2>
              <p className="mt-3">
                We may collect information about how you reached and used the
                site, such as the page you visited, referring page, campaign or
                source information, and similar technical or attribution data.
                The site also uses browser storage for certain preferences and
                account or signup workflows.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F2A43]">
                How We Use Information
              </h2>
              <p className="mt-3">
                We use information to operate the directory, process and route
                legal-help requests, communicate with users, administer law-firm
                accounts, measure site performance, understand traffic sources,
                improve the service, and protect the operation of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F2A43]">
                Legal-Help Requests and Participating Law Firms
              </h2>
              <p className="mt-3">
                When a legal-help request can be routed through the platform,
                information you submit may be provided to a participating law
                firm for review. El Paso&apos;s Best Lawyers also receives an
                administrative copy of submitted requests. If a request is not
                routed to a law firm, it may remain with El Paso&apos;s Best
                Lawyers for administrative handling.
              </p>
              <p className="mt-3">
                Submitting a request does not create an attorney-client
                relationship with El Paso&apos;s Best Lawyers or guarantee that
                a law firm will accept or respond to your matter.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F2A43]">
                Analytics and Advertising Measurement
              </h2>
              <p className="mt-3">
                We use analytics and advertising measurement technologies,
                including Meta Pixel, to understand visits and measure actions
                such as page views and successful lead-form submissions. These
                technologies may collect device, browser, usage, and similar
                technical information according to the provider&apos;s own
                technologies and policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F2A43]">
                Service Providers
              </h2>
              <p className="mt-3">
                We use service providers to host and operate the website,
                maintain data and accounts, deliver email notifications,
                process law-firm subscription payments, and provide analytics
                and measurement. These providers may process information as
                necessary to provide their services to us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F2A43]">
                Data Security
              </h2>
              <p className="mt-3">
                We take reasonable steps intended to protect information used
                to operate the platform. No website, transmission method, or
                storage system can be guaranteed to be completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F2A43]">
                Third-Party Websites
              </h2>
              <p className="mt-3">
                The directory may link to law-firm websites and other
                third-party services. Their privacy practices are governed by
                their own policies, not this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F2A43]">
                Changes to This Policy
              </h2>
              <p className="mt-3">
                We may update this Privacy Policy as the platform changes. The
                date above identifies the most recent version posted on this
                site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F2A43]">
                Contact Us
              </h2>
              <p className="mt-3">
                Questions about this Privacy Policy may be sent to{" "}
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

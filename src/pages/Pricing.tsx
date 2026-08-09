import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Scale } from "lucide-react";
import PricingSection from "@/components/PricingSection";

export default function Pricing() {
  document.title = "Law Firm Pricing | El Paso's Best Lawyers";

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-white/10 bg-[#06224A] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 font-bold">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4A62A] text-[#06224A]">
              <Scale className="h-5 w-5" />
            </span>
            <span>El Paso&apos;s Best Lawyers</span>
          </Link>

          <Link
            to="/login"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white hover:text-[#06224A]"
          >
            Firm Login
          </Link>
        </div>
      </header>

      <section className="bg-[#06224A] px-4 pb-16 pt-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <Link
            to="/"
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to directory
          </Link>

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D4A62A]">
            Built for El Paso Law Firms
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Turn your directory profile into a client acquisition asset.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/75">
            Create a professional presence, showcase your attorneys, receive
            consultation requests, measure engagement, and compete for premium
            placement in the categories that matter to your firm.
          </p>
        </div>
      </section>

      <PricingSection />

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-[#06224A] px-7 py-10 text-center text-white shadow-xl sm:px-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#D4A62A]">
            Ready when you are
          </p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Build your firm profile in minutes.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/70">
            Create your account, complete your firm profile, add attorneys, and
            choose the visibility level that fits your growth goals.
          </p>
          <Link
            to="/signup"
            className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#D4A62A] px-7 py-4 font-extrabold text-[#06224A] transition hover:bg-[#E3B53A]"
          >
            Create Firm Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}

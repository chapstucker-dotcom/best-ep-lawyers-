"use client";
import React from "react";
import { CATEGORIES } from "@/lib/constants";
import { SAMPLE_FIRMS } from "@/lib/sampleData";
import { FirmCard } from "@/components/FirmCard";
import { CategoryPills } from "@/components/CategoryPills";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  const [query, setQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return SAMPLE_FIRMS.filter((f) => {
      const matchesQuery = q ? f.name.toLowerCase().includes(q) || f.blurb.toLowerCase().includes(q) : true;
      const matchesCategory = selectedCategory ? f.categories.includes(selectedCategory as any) : true;
      return matchesQuery && matchesCategory;
    });
  }, [query, selectedCategory]);

  return (
    <div>
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="/" className="text-base font-bold">Best EP Lawyers</a>
          <nav className="hidden gap-6 text-sm md:flex">
            <a className="hover:underline" href="#directory">Directory</a>
            <a className="hover:underline" href="#education">Education</a>
            <a className="hover:underline" href="#pricing">Plans</a>
          </nav>
          <a href="/admin" className="rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white hover:opacity-90">
            List Your Firm
          </a>
        </div>
      </header>

      <section className="bg-gradient-to-b from-amber-50 to-white">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-10">
          <div className="mb-8 text-center">
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">El Paso, Texas</span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">Best EP Lawyers</h1>
            <p className="mx-auto mt-2 max-w-2xl text-gray-600">
              Search trusted El Paso law firms, compare plans, and learn how Texas law works.
            </p>
          </div>

          <div className="mx-auto grid max-w-3xl gap-3 rounded-2xl border bg-white p-3 shadow-sm md:grid-cols-[1fr,200px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by firm name…"
              className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
              aria-label="Search by firm name"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
              aria-label="Filter by category"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
            <span className="text-gray-600">Popular:</span>
            <div className="flex flex-wrap gap-2">
              {["Personal Injury", "Family Law", "Criminal Defense", "Immigration"].map((p) => (
                <button key={p} onClick={() => setSelectedCategory(p)} className="rounded-full bg-gray-100 px-3 py-1 hover:bg-gray-200">
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="directory" className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Law Firm Directory</h2>
            <a href="/admin" className="text-sm font-medium text-blue-700 hover:underline">Law firm? Get listed →</a>
          </div>
          {results.length === 0 ? (
            <p className="rounded-xl border bg-white p-6 text-center text-gray-600">No firms match your search. Try a different name or category.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((f) => (
                <FirmCard key={f.id} firm={f} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="education" className="border-t bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-bold">Educational Resources</h2>
          <p className="mt-2 text-gray-600">Learn how Texas law firms work, what questions to ask, and how to budget for legal help in El Paso.</p>
          <div className="mt-8 grid gap-4">
            <article className="rounded-2xl border bg-white p-5">
              <h3 className="text-lg font-semibold">How to Choose the Right Lawyer in Texas</h3>
              <p className="mt-2">Texas lawyers must be licensed by the State Bar of Texas. Verify standing, check experience in your practice area, ask about fees, and read recent reviews.</p>
            </article>
            <article className="rounded-2xl border bg-white p-5">
              <h3 className="text-lg font-semibold">Common Fee Arrangements Under Texas Law</h3>
              <p className="mt-2">PI often uses contingency; family, immigration, business may be flat or hourly. Get a written agreement and ask about filing/service/expert costs.</p>
            </article>
            <article className="rounded-2xl border bg-white p-5">
              <h3 className="text-lg font-semibold">Top Practice Areas in El Paso</h3>
              <p className="mt-2">Personal Injury, Criminal Defense, Family Law, Immigration, Real Estate, Business & Corporate.</p>
            </article>
            <article className="rounded-2xl border bg-white p-5">
              <h3 className="text-lg font-semibold">Disclaimer</h3>
              <p className="mt-2">This site provides general information and listings only and is not legal advice. No attorney–client relationship is formed.</p>
            </article>
          </div>
        </div>
      </section>

      <Pricing />
      <Footer />
    </div>
  );
}

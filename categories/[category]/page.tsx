import React from "react";
import { CATEGORIES } from "@/lib/constants";
import { SAMPLE_FIRMS } from "@/lib/sampleData";
import { FirmCard } from "@/components/FirmCard";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return CATEGORIES.map(c => ({ category: c }));
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = decodeURIComponent(params.category);
  if (!CATEGORIES.includes(category as any)) return notFound();
  const firms = SAMPLE_FIRMS.filter(f => f.categories.includes(category as any));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <a href="/" className="text-sm text-blue-700 hover:underline">← All categories</a>
      <h1 className="mt-4 text-3xl font-bold">{category} Lawyers in El Paso</h1>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {firms.map(f => <FirmCard key={f.id} firm={f} />)}
      </div>
    </main>
  );
}

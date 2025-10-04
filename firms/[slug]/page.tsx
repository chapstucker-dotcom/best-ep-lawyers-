import React from "react";
import { SAMPLE_FIRMS } from "@/lib/sampleData";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";

export async function generateStaticParams() {
  return SAMPLE_FIRMS.map(f => ({ slug: f.slug }));
}

export default function FirmPage({ params }: { params: { slug: string } }) {
  const firm = SAMPLE_FIRMS.find(f => f.slug === params.slug);
  if (!firm) return notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <a href="/" className="text-sm text-blue-700 hover:underline">← Back to results</a>
      <div className="mt-4 overflow-hidden rounded-2xl border bg-white">
        <div className="relative h-56 w-full">
          <Image src={firm.photo} alt={firm.name} fill className="object-cover" />
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{firm.name}</h1>
            <Badge plan={firm.plan} />
          </div>
          <p className="text-gray-700">{firm.blurb}</p>
          {firm.about && <p className="text-gray-700">{firm.about}</p>}
          <div className="text-sm">
            <p className="font-medium">{firm.address}</p>
            <p className="mt-1">
              <a className="hover:underline" href={`tel:${firm.phone}`}>{firm.phone}</a> ·{" "}
              <a className="hover:underline" href={`mailto:${firm.email}`}>{firm.email}</a>
            </p>
            <p className="mt-1">
              <a className="text-blue-700 hover:underline" href={firm.website} target="_blank">Visit Website →</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

import React from "react";
import Image from "next/image";
import { Badge } from "./Badge";
import type { Firm } from "@/lib/sampleData";

export function FirmCard({ firm }: { firm: Firm }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-40 w-full">
        <Image
          src={firm.photo}
          alt={`${firm.name} photo`}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight">
            <a href={`/firms/${firm.slug}`} className="hover:underline">
              {firm.name}
            </a>
          </h3>
          <Badge plan={firm.plan} />
        </div>
        <p className="text-sm text-gray-600">{firm.blurb}</p>
        <div className="flex flex-wrap gap-2">
          {firm.categories.map((cat) => (
            <span key={cat} className="text-xs rounded-full bg-gray-100 px-2 py-0.5">
              {cat}
            </span>
          ))}
        </div>
        <div className="grid gap-1 text-sm">
          <p className="font-medium">{firm.address}</p>
          <p>
            <a href={`tel:${firm.phone}`} className="hover:underline">
              {firm.phone}
            </a>{" "}
            ·{" "}
            <a href={`mailto:${firm.email}`} className="hover:underline">
              {firm.email}
            </a>
          </p>
          <a
            href={firm.website}
            target="_blank"
            rel="noreferrer"
            className="text-blue-700 hover:underline"
          >
            Visit Website →
          </a>
        </div>
      </div>
    </article>
  );
}

"use client";
import React from "react";
import { CATEGORIES } from "@/lib/constants";

export function CategoryPills({
  selected,
  setSelected,
}: {
  selected: string;
  setSelected: (c: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((c) => {
        const active = selected === c;
        return (
          <button
            key={c}
            onClick={() => setSelected(active ? "" : c)}
            className={[
              "rounded-full border px-3 py-1 text-sm",
              active ? "bg-black text-white border-black" : "hover:bg-gray-100",
            ].join(" ")}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}

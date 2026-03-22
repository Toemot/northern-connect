"use client";

import { cn } from "@/lib/utils";
import type { Category } from "@/types/database";

interface CategoryChipsProps {
  categories: Category[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
}

export function CategoryChips({ categories, selected, onSelect }: CategoryChipsProps) {
  const serviceCategories = categories.filter((c) => c.layer === "services");

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
      role="group"
      aria-label="Filter by category"
    >
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
          selected === null
            ? "bg-brand-500 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
        aria-pressed={selected === null}
      >
        All
      </button>
      {serviceCategories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.slug === selected ? null : cat.slug)}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
            selected === cat.slug
              ? "bg-brand-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
          aria-pressed={selected === cat.slug}
        >
          {cat.icon_emoji} {cat.name}
        </button>
      ))}
    </div>
  );
}

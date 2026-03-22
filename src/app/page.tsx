"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ListingCard } from "@/components/listings/ListingCard";
import { CategoryChips } from "@/components/listings/CategoryChips";
import type { Category, ListingWithDetails } from "@/types/database";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [listings, setListings] = useState<ListingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  // Load categories once on mount
  useEffect(() => {
    supabase
      .from("category")
      .select("*")
      .order("display_order")
      .then(({ data }) => setCategories(data ?? []));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Search listings whenever query or category changes
  const search = useCallback(async () => {
    setLoading(true);
    let q = supabase
      .from("listing")
      .select(`
        *,
        organization:organization_id ( id, name, phone, email, website, address, city, latitude, longitude ),
        category:category_id ( id, name, slug, icon_emoji, layer )
      `)
      .eq("status", "active")
      .order("last_verified_at", { ascending: false });

    if (query.trim()) {
      q = q.ilike("title", `%${query.trim()}%`);
    }

    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) q = q.eq("category_id", cat.id);
    }

    const { data } = await q.limit(40);
    setListings((data as ListingWithDetails[]) ?? []);
    setLoading(false);
  }, [query, selectedCategory, categories]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (categories.length > 0 || query.trim()) {
      search();
    }
  }, [query, selectedCategory, categories, search]);

  return (
    <>
      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-bold text-brand-700">
            Northern Connect
          </Link>
          <Link
            href="/auth/login"
            className="text-sm font-medium text-gray-600 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
          >
            Agency login
          </Link>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-2xl px-4 pb-16">
        {/* Hero search */}
        <div className="py-6">
          <h1 className="mb-1 text-2xl font-bold text-gray-900">
            Find help in Prince George
          </h1>
          <p className="mb-4 text-gray-500 text-sm">
            Services, programs, and community activities for Northern BC residents.
          </p>

          {/* Search input */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search services, food, housing…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search for services"
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Category filter chips */}
        {categories.length > 0 && (
          <div className="mb-4">
            <CategoryChips
              categories={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>
        )}

        {/* Results */}
        <section aria-label="Service listings" aria-live="polite" aria-busy={loading}>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-32 animate-pulse rounded-xl bg-gray-100"
                  aria-hidden
                />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              <p className="text-lg font-medium">No results found</p>
              <p className="mt-1 text-sm">
                Try a different search or browse all categories.
              </p>
            </div>
          ) : (
            <>
              <p className="mb-3 text-sm text-gray-500">
                {listings.length} {listings.length === 1 ? "result" : "results"}
                {selectedCategory && ` in "${selectedCategory.replace("-", " ")}"`}
              </p>
              <div className="space-y-3">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </>
          )}
        </section>

        {/* Events strip */}
        <div className="mt-8 rounded-xl bg-brand-50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-brand-800">Community Events</h2>
            <Link
              href="/events"
              className="text-sm font-medium text-brand-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
            >
              See all →
            </Link>
          </div>
          <p className="mt-1 text-sm text-brand-600">
            Things happening in and around Prince George.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 px-4 py-6 text-center text-xs text-gray-400">
        <p>Northern Connect · Prince George, BC · On the unceded territory of the Lheidli T&apos;enneh</p>
        <div className="mt-2 flex justify-center gap-4">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          <Link href="/indigenous-content-policy" className="hover:underline">Indigenous Content Policy</Link>
        </div>
      </footer>
    </>
  );
}

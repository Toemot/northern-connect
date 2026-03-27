"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import type { Category } from "@/types/database";

interface EditListingPageProps {
  params: Promise<{ id: string }>;
}

export default function EditListingPage({ params }: EditListingPageProps) {
  const router = useRouter();
  const supabase = createClient();

  const [listingId, setListingId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category_id: "",
    description: "",
    eligibility_notes: "",
    languages_served: "English",
    status: "draft" as string,
  });

  useEffect(() => {
    async function init() {
      const { id } = await params;
      setListingId(id);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      const { data: au } = await supabase
        .from("agency_user")
        .select("organization_id")
        .eq("id", user.id)
        .single();
      if (!au) { router.push("/auth/login"); return; }

      // Load categories
      const { data: cats } = await supabase
        .from("category")
        .select("*")
        .eq("layer", "services")
        .order("display_order");
      setCategories(cats ?? []);

      // Load existing listing
      const { data: listing } = await supabase
        .from("listing")
        .select("*")
        .eq("id", id)
        .eq("organization_id", au.organization_id)
        .single();

      if (!listing) {
        setError("Listing not found or you don't have access.");
        setFetching(false);
        return;
      }

      setForm({
        title: listing.title ?? "",
        category_id: listing.category_id ?? "",
        description: listing.description ?? "",
        eligibility_notes: listing.eligibility_notes ?? "",
        languages_served: (listing.languages_served ?? ["English"]).join(", "),
        status: listing.status ?? "draft",
      });
      setFetching(false);
    }
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase
      .from("listing")
      .update({
        category_id: form.category_id || null,
        title: form.title,
        description: form.description || null,
        eligibility_notes: form.eligibility_notes || null,
        languages_served: form.languages_served.split(",").map((s) => s.trim()).filter(Boolean),
        status: form.status,
      })
      .eq("id", listingId);

    if (error) {
      setError("Could not update listing. Please try again.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  async function handleDelete() {
    setDeleting(true);
    const { error } = await supabase
      .from("listing")
      .delete()
      .eq("id", listingId);

    if (error) {
      setError("Could not delete listing. Please try again.");
      setDeleting(false);
    } else {
      router.push("/dashboard");
    }
  }

  const field = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  if (fetching) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center text-gray-500">
        Loading listing...
      </main>
    );
  }

  return (
    <main id="main-content" className="mx-auto max-w-2xl px-4 pb-16">
      <div className="py-4">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-brand-600">
          ← Back to dashboard
        </Link>
      </div>

      <h1 className="mb-6 text-xl font-bold text-gray-900">Edit Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Title */}
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-gray-700">
            Service title <span aria-hidden className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            required
            value={form.title}
            onChange={(e) => field("title", e.target.value)}
            placeholder="e.g. Emergency Food Bank"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={form.category_id}
            onChange={(e) => field("category_id", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon_emoji} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={(e) => field("description", e.target.value)}
            placeholder="What does this service offer? Who runs it?"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Eligibility */}
        <div>
          <label htmlFor="eligibility" className="mb-1.5 block text-sm font-medium text-gray-700">
            Who can access this service?
          </label>
          <textarea
            id="eligibility"
            rows={2}
            value={form.eligibility_notes}
            onChange={(e) => field("eligibility_notes", e.target.value)}
            placeholder="e.g. Open to all PG residents. No referral needed."
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Languages */}
        <div>
          <label htmlFor="languages" className="mb-1.5 block text-sm font-medium text-gray-700">
            Languages served (comma-separated)
          </label>
          <input
            id="languages"
            type="text"
            value={form.languages_served}
            onChange={(e) => field("languages_served", e.target.value)}
            placeholder="English, French, Carrier"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => field("status", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="needs_review">Needs Review</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save Changes"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
        </div>
      </form>

      {/* Delete section */}
      <div className="mt-10 border-t border-gray-200 pt-6">
        <h2 className="text-sm font-semibold text-red-700 mb-2">Danger Zone</h2>
        {!showDeleteConfirm ? (
          <Button type="button" variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
            Delete this listing
          </Button>
        ) : (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800 mb-3">
              Are you sure? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button type="button" variant="danger" size="sm" disabled={deleting} onClick={handleDelete}>
                {deleting ? "Deleting…" : "Yes, delete permanently"}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

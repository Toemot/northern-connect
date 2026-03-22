"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import type { Category } from "@/types/database";

export default function NewListingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [categories, setCategories] = useState<Category[]>([]);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    category_id: "",
    description: "",
    eligibility_notes: "",
    languages_served: "English",
  });

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      const { data: au } = await supabase
        .from("agency_user")
        .select("organization_id")
        .eq("id", user.id)
        .single();
      if (!au) { router.push("/auth/login"); return; }
      setOrgId(au.organization_id);

      const { data: cats } = await supabase
        .from("category")
        .select("*")
        .eq("layer", "services")
        .order("display_order");
      setCategories(cats ?? []);
    }
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orgId) return;
    setError(null);
    setLoading(true);

    const { error } = await supabase.from("listing").insert({
      organization_id: orgId,
      category_id: form.category_id || null,
      title: form.title,
      description: form.description || null,
      eligibility_notes: form.eligibility_notes || null,
      languages_served: form.languages_served.split(",").map((s) => s.trim()).filter(Boolean),
      status: "draft",
    });

    if (error) {
      setError("Could not save listing. Please try again.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  const field = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <main id="main-content" className="mx-auto max-w-2xl px-4 pb-16">
      <div className="py-4">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-brand-600">
          ← Back to dashboard
        </Link>
      </div>

      <h1 className="mb-6 text-xl font-bold text-gray-900">Add New Listing</h1>

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

        <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
          ⚠ This listing will be saved as <strong>Draft</strong>. Set it to <strong>Active</strong> after calling the organization to verify it is still operating.
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save as Draft"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
        </div>
      </form>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export default function NewEventPage() {
  const router = useRouter();
  const supabase = createClient();

  const [orgId, setOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    location_name: "",
    address: "",
    is_free: true,
    recurrence: "one_time",
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
    }
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orgId) return;
    setError(null);
    setLoading(true);

    const startDatetime = form.start_date && form.start_time
      ? new Date(`${form.start_date}T${form.start_time}`).toISOString()
      : null;

    const endDatetime = form.end_date && form.end_time
      ? new Date(`${form.end_date}T${form.end_time}`).toISOString()
      : null;

    if (!startDatetime) {
      setError("Please provide a start date and time.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("event").insert({
      organization_id: orgId,
      title: form.title,
      description: form.description || null,
      start_datetime: startDatetime,
      end_datetime: endDatetime,
      location_name: form.location_name || null,
      address: form.address || null,
      is_free: form.is_free,
      recurrence: form.recurrence,
      is_active: true,
    });

    if (error) {
      setError("Could not save event. Please try again.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  const field = (key: keyof typeof form, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <main id="main-content" className="mx-auto max-w-2xl px-4 pb-16">
      <div className="py-4">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-brand-600">
          ← Back to dashboard
        </Link>
      </div>

      <h1 className="mb-6 text-xl font-bold text-gray-900">Add New Event</h1>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Title */}
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-gray-700">
            Event title <span aria-hidden className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            required
            value={form.title}
            onChange={(e) => field("title", e.target.value)}
            placeholder="e.g. Community Potluck Dinner"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={form.description}
            onChange={(e) => field("description", e.target.value)}
            placeholder="What is this event about? Who should attend?"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Start date/time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="start_date" className="mb-1.5 block text-sm font-medium text-gray-700">
              Start date <span aria-hidden className="text-red-500">*</span>
            </label>
            <input
              id="start_date"
              type="date"
              required
              value={form.start_date}
              onChange={(e) => field("start_date", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div>
            <label htmlFor="start_time" className="mb-1.5 block text-sm font-medium text-gray-700">
              Start time <span aria-hidden className="text-red-500">*</span>
            </label>
            <input
              id="start_time"
              type="time"
              required
              value={form.start_time}
              onChange={(e) => field("start_time", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* End date/time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="end_date" className="mb-1.5 block text-sm font-medium text-gray-700">
              End date
            </label>
            <input
              id="end_date"
              type="date"
              value={form.end_date}
              onChange={(e) => field("end_date", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div>
            <label htmlFor="end_time" className="mb-1.5 block text-sm font-medium text-gray-700">
              End time
            </label>
            <input
              id="end_time"
              type="time"
              value={form.end_time}
              onChange={(e) => field("end_time", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-gray-700">
            Venue / Location name
          </label>
          <input
            id="location"
            type="text"
            value={form.location_name}
            onChange={(e) => field("location_name", e.target.value)}
            placeholder="e.g. Prince George Civic Centre"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            id="address"
            type="text"
            value={form.address}
            onChange={(e) => field("address", e.target.value)}
            placeholder="e.g. 808 Civic Plaza, Prince George, BC"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Free / Paid */}
        <div className="flex items-center gap-3">
          <input
            id="is_free"
            type="checkbox"
            checked={form.is_free}
            onChange={(e) => field("is_free", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
          />
          <label htmlFor="is_free" className="text-sm font-medium text-gray-700">
            This event is free
          </label>
        </div>

        {/* Recurrence */}
        <div>
          <label htmlFor="recurrence" className="mb-1.5 block text-sm font-medium text-gray-700">
            Recurrence
          </label>
          <select
            id="recurrence"
            value={form.recurrence}
            onChange={(e) => field("recurrence", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="one_time">One-time event</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Biweekly</option>
            <option value="monthly">Monthly</option>
            <option value="annual">Annual</option>
          </select>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Create Event"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
        </div>
      </form>
    </main>
  );
}

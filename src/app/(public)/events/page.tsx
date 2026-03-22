import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EventCard } from "@/components/events/EventCard";
import type { Metadata } from "next";
import type { Event } from "@/types/database";

export const metadata: Metadata = {
  title: "Community Events — Northern Connect",
  description: "Events and community activities happening in Prince George and Northern BC.",
};

type DateFilter = "today" | "week" | "month" | "all";

interface PageProps {
  searchParams: Promise<{ filter?: DateFilter }>;
}

type EventWithOrg = Event & {
  organization: { name: string } | null;
  organization_name?: string;
};

function getDateRange(filter: DateFilter): { from?: string; to?: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (filter === "today") {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return { from: today.toISOString(), to: tomorrow.toISOString() };
  }
  if (filter === "week") {
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return { from: today.toISOString(), to: nextWeek.toISOString() };
  }
  if (filter === "month") {
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    return { from: today.toISOString(), to: nextMonth.toISOString() };
  }
  return { from: today.toISOString() };
}

export default async function EventsPage({ searchParams }: PageProps) {
  const { filter = "week" } = await searchParams;
  const supabase = await createClient();
  const { from, to } = getDateRange(filter);

  let q = supabase
    .from("event")
    .select("*, organization:organization_id (name)")
    .eq("is_active", true)
    .gte("start_datetime", from!)
    .order("start_datetime", { ascending: true });

  if (to) q = q.lte("start_datetime", to);

  const { data } = await q.limit(40);
  const events = (data as unknown as EventWithOrg[]) ?? [];

  const filters: { label: string; value: DateFilter }[] = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "All Upcoming", value: "all" },
  ];

  return (
    <main id="main-content" className="mx-auto max-w-2xl px-4 pb-16">
      <div className="py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back
        </Link>
      </div>

      <h1 className="mb-4 text-2xl font-bold text-gray-900">Community Events</h1>

      {/* Date filter tabs */}
      <nav aria-label="Filter events by date" className="mb-6 flex gap-2 border-b border-gray-200">
        {filters.map(({ label, value }) => (
          <Link
            key={value}
            href={`/events?filter=${value}`}
            className={`pb-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded
              ${filter === value
                ? "border-b-2 border-brand-500 text-brand-600"
                : "text-gray-500 hover:text-gray-700"
              }`}
            aria-current={filter === value ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>

      <section aria-label="Events list">
        {events.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <p className="text-lg font-medium">No events found</p>
            <p className="mt-1 text-sm">Try a different date range.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={{
                  ...event,
                  organization_name: event.organization?.name,
                }}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

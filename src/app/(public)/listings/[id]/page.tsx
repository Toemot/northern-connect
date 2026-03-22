import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Globe, Clock, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("listing")
    .select("title, description")
    .eq("id", id)
    .eq("status", "active")
    .single();

  if (!data) return { title: "Not Found — Northern Connect" };
  return {
    title: `${data.title} — Northern Connect`,
    description: data.description ?? undefined,
  };
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listing")
    .select(`
      *,
      organization:organization_id ( * ),
      category:category_id ( id, name, slug, icon_emoji, layer )
    `)
    .eq("id", id)
    .eq("status", "active")
    .single();

  if (!listing) notFound();

  const org = listing.organization as Record<string, string>;

  return (
    <main id="main-content" className="mx-auto max-w-2xl px-4 pb-16">
      {/* Back nav */}
      <div className="py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to search
        </Link>
      </div>

      {/* Header */}
      <header>
        {listing.category && (
          <p className="mb-1 text-sm font-medium text-brand-500">
            {(listing.category as Record<string, string>).icon_emoji}{" "}
            {(listing.category as Record<string, string>).name}
          </p>
        )}
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
          <Badge variant="green" className="mt-1 shrink-0">Active</Badge>
        </div>
        <p className="mt-0.5 text-base text-gray-600">{org.name}</p>
        {listing.last_verified_at && (
          <p className="mt-1 text-xs text-gray-400">
            Last verified: {formatDate(listing.last_verified_at)}
            {listing.verified_by && ` by ${listing.verified_by}`}
          </p>
        )}
      </header>

      {/* Info rows */}
      <section aria-label="Contact information" className="mt-6 space-y-3 rounded-xl border border-gray-200 p-4">
        {org.address && (
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden />
            <div>
              <p className="text-sm font-medium text-gray-900">Address</p>
              <p className="text-sm text-gray-600">{org.address}, {org.city}, {org.province}</p>
            </div>
          </div>
        )}
        {org.phone && (
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden />
            <div>
              <p className="text-sm font-medium text-gray-900">Phone</p>
              <a
                href={`tel:${org.phone}`}
                className="text-sm text-brand-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
              >
                {org.phone}
              </a>
            </div>
          </div>
        )}
        {org.website && (
          <div className="flex items-start gap-3">
            <Globe className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden />
            <div>
              <p className="text-sm font-medium text-gray-900">Website</p>
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
              >
                {org.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          </div>
        )}
        {listing.hours && (
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden />
            <div>
              <p className="text-sm font-medium text-gray-900">Hours</p>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {JSON.stringify(listing.hours, null, 2)}
              </p>
            </div>
          </div>
        )}
        {listing.languages_served && listing.languages_served.length > 0 && (
          <div className="flex items-start gap-3">
            <Users className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden />
            <div>
              <p className="text-sm font-medium text-gray-900">Languages</p>
              <p className="text-sm text-gray-600">{listing.languages_served.join(", ")}</p>
            </div>
          </div>
        )}
      </section>

      {/* About */}
      {listing.description && (
        <section aria-labelledby="about-heading" className="mt-6">
          <h2 id="about-heading" className="mb-2 text-base font-semibold text-gray-900">About this service</h2>
          <p className="text-sm leading-relaxed text-gray-700">{listing.description}</p>
        </section>
      )}

      {/* Eligibility */}
      {listing.eligibility_notes && (
        <section aria-labelledby="eligibility-heading" className="mt-6">
          <h2 id="eligibility-heading" className="mb-2 text-base font-semibold text-gray-900">Who can access this</h2>
          <p className="text-sm leading-relaxed text-gray-700">{listing.eligibility_notes}</p>
        </section>
      )}

      {/* Action buttons */}
      <div className="mt-8 flex gap-3">
        {org.phone && (
          <a
            href={`tel:${org.phone}`}
            className="flex-1 rounded-xl bg-brand-500 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            📞 Call
          </a>
        )}
        {org.address && (
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(`${org.address}, ${org.city}, BC`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-xl border border-brand-500 px-4 py-3 text-center text-sm font-semibold text-brand-600 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            📍 Get Directions
          </a>
        )}
      </div>
    </main>
  );
}

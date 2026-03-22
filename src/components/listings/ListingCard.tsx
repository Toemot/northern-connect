import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { ListingWithDetails } from "@/types/database";

interface ListingCardProps {
  listing: ListingWithDetails;
}

export function ListingCard({ listing }: ListingCardProps) {
  const isVerifiedRecently =
    listing.last_verified_at &&
    new Date(listing.last_verified_at) >
      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      aria-label={`${listing.title} — ${listing.organization.name}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {listing.category && (
            <p className="mb-1 text-xs font-medium text-brand-500">
              {listing.category.icon_emoji} {listing.category.name}
            </p>
          )}
          <h2 className="truncate text-base font-semibold text-gray-900">
            {listing.title}
          </h2>
          <p className="mt-0.5 truncate text-sm text-gray-500">
            {listing.organization.name}
          </p>
        </div>
        <Badge variant="green" className="shrink-0">
          Open
        </Badge>
      </div>

      {listing.organization.address && (
        <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden />
          <span className="truncate">{listing.organization.address}, {listing.organization.city}</span>
        </p>
      )}

      {listing.organization.phone && (
        <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
          <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden />
          {listing.organization.phone}
        </p>
      )}

      <div className="mt-2 flex items-center gap-2">
        {isVerifiedRecently ? (
          <span className="flex items-center gap-1 text-xs text-green-600">
            <Clock className="h-3 w-3" aria-hidden />
            Verified recently
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-yellow-600">
            <Clock className="h-3 w-3" aria-hidden />
            Verify before visiting
          </span>
        )}
        {listing.languages_served.length > 1 && (
          <Badge variant="blue" className="text-xs">
            {listing.languages_served.length} languages
          </Badge>
        )}
      </div>
    </Link>
  );
}

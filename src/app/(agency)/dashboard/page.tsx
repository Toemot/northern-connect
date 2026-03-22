import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusCircle, LogOut, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Northern Connect",
  robots: "noindex",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  // Auth guard
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Load agency user + org
  const { data: agencyUser } = await supabase
    .from("agency_user")
    .select("*, organization:organization_id (*)")
    .eq("id", user.id)
    .single();

  if (!agencyUser) redirect("/auth/login");

  const org = agencyUser.organization as Record<string, string>;

  // Load listings for this org
  const { data: listings } = await supabase
    .from("listing")
    .select("*, category:category_id (name, icon_emoji)")
    .eq("organization_id", agencyUser.organization_id)
    .order("updated_at", { ascending: false });

  const allListings = listings ?? [];
  const active       = allListings.filter((l) => l.status === "active").length;
  const needsReview  = allListings.filter((l) => l.status === "needs_review").length;
  const inactive     = allListings.filter((l) => l.status === "inactive").length;

  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 pb-16">
      {/* Header */}
      <header className="flex items-center justify-between py-6">
        <div>
          <Link href="/" className="text-sm text-gray-500 hover:text-brand-600">
            ← Northern Connect
          </Link>
          <h1 className="mt-1 text-xl font-bold text-gray-900">{org.name}</h1>
          <p className="text-sm text-gray-500">{agencyUser.display_name} · {agencyUser.role}</p>
        </div>
        <form action="/auth/signout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </form>
      </header>

      {/* Stats */}
      <section aria-label="Listing statistics" className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
          <CheckCircle className="mx-auto mb-1 h-5 w-5 text-green-600" aria-hidden />
          <p className="text-2xl font-bold text-green-700">{active}</p>
          <p className="text-xs text-green-600">Active</p>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-center">
          <AlertCircle className="mx-auto mb-1 h-5 w-5 text-yellow-600" aria-hidden />
          <p className="text-2xl font-bold text-yellow-700">{needsReview}</p>
          <p className="text-xs text-yellow-600">Needs Review</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
          <XCircle className="mx-auto mb-1 h-5 w-5 text-gray-400" aria-hidden />
          <p className="text-2xl font-bold text-gray-600">{inactive}</p>
          <p className="text-xs text-gray-500">Inactive</p>
        </div>
      </section>

      {/* Actions */}
      <div className="mb-6 flex gap-3">
        <Link
          href="/listings/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <PlusCircle className="h-4 w-4" aria-hidden />
          Add New Listing
        </Link>
      </div>

      {/* Listings table */}
      <section aria-labelledby="listings-heading">
        <h2 id="listings-heading" className="mb-3 text-base font-semibold text-gray-900">
          Your Listings ({allListings.length})
        </h2>

        {allListings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center text-gray-500">
            <p className="font-medium">No listings yet</p>
            <p className="mt-1 text-sm">Add your first service listing above.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-medium uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left" scope="col">Listing</th>
                  <th className="px-4 py-3 text-left" scope="col">Status</th>
                  <th className="px-4 py-3 text-left hidden sm:table-cell" scope="col">Last Verified</th>
                  <th className="px-4 py-3 text-right" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allListings.map((listing) => {
                  const cat = listing.category as Record<string, string> | null;
                  const overdue =
                    !listing.last_verified_at ||
                    listing.last_verified_at < ninetyDaysAgo;
                  return (
                    <tr key={listing.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{listing.title}</p>
                        {cat && (
                          <p className="text-xs text-gray-500">
                            {cat.icon_emoji} {cat.name}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            listing.status === "active" ? "green"
                            : listing.status === "needs_review" ? "yellow"
                            : "gray"
                          }
                        >
                          {listing.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {listing.last_verified_at ? (
                          <span className={overdue ? "text-yellow-600" : "text-gray-600"}>
                            {formatDate(listing.last_verified_at)}
                            {overdue && " ⚠"}
                          </span>
                        ) : (
                          <span className="text-red-500">Never verified</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/listings/${listing.id}/edit`}
                          className="mr-3 text-brand-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

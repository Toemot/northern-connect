/**
 * Admin — Pending Registrations
 * Access: /admin/pending
 * Protected by ADMIN_SECRET env var in the URL: /admin/pending?key=YOUR_SECRET
 * Uses service role key to bypass RLS and see pending orgs.
 */

import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { ApproveRejectButtons } from './ApproveRejectButtons';

interface PendingOrg {
  id: string;
  name: string;
  type: string;
  address: string | null;
  email: string | null;
  website: string | null;
  phone: string | null;
  is_indigenous_org: boolean;
  registration_status: string;
  created_at: string;
}

export default async function AdminPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  // Simple secret key gate — set ADMIN_SECRET in Vercel env vars
  const secret = process.env.ADMIN_SECRET ?? 'change-me-in-vercel-env';
  if (key !== secret) return notFound();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // service role bypasses RLS
    { auth: { persistSession: false } }
  );

  const { data: pending } = await supabase
    .from('organization')
    .select('id, name, type, address, email, website, phone, is_indigenous_org, registration_status, created_at')
    .eq('registration_status', 'pending')
    .order('created_at', { ascending: true });

  const { data: recent } = await supabase
    .from('organization')
    .select('id, name, type, email, registration_status, created_at')
    .in('registration_status', ['approved', 'rejected', 'flagged'])
    .order('created_at', { ascending: false })
    .limit(10);

  const orgs = (pending ?? []) as PendingOrg[];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Admin — Pending Registrations
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        {orgs.length} pending · Approving makes the org visible to the public.
      </p>

      {orgs.length === 0 ? (
        <div className="rounded-xl bg-green-50 border border-green-200 px-6 py-10 text-center text-green-800">
          <p className="text-lg font-medium">All clear — no pending registrations.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orgs.map((org) => (
            <div key={org.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900">{org.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5 capitalize">{org.type}</p>
                  {org.address && (
                    <p className="text-sm text-gray-600 mt-1">{org.address}, Prince George, BC</p>
                  )}
                  {org.email && (
                    <a href={`mailto:${org.email}`} className="text-sm text-brand-700 hover:underline block mt-0.5">
                      {org.email}
                    </a>
                  )}
                  {org.website && (
                    <a href={org.website} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline block mt-0.5">
                      {org.website} ↗
                    </a>
                  )}
                  {org.phone && <p className="text-sm text-gray-600 mt-0.5">{org.phone}</p>}
                  {org.is_indigenous_org && (
                    <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      🌿 Indigenous organization
                    </span>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Submitted {new Date(org.created_at).toLocaleDateString('en-CA', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>

                <ApproveRejectButtons orgId={org.id} adminKey={key ?? ''} />
              </div>
            </div>
          ))}
        </div>
      )}

      {recent && recent.length > 0 && (
        <div className="mt-10">
          <h2 className="text-base font-semibold text-gray-700 mb-3">Recently Actioned</h2>
          <div className="space-y-2">
            {recent.map((org) => (
              <div key={org.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-2">
                <div>
                  <span className="text-sm font-medium text-gray-800">{org.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{org.email}</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                  org.registration_status === 'approved' ? 'bg-green-100 text-green-800' :
                  org.registration_status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {org.registration_status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

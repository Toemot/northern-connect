'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { geocodeAddress } from '@/lib/geocode';

const ORG_TYPES = [
  { value: 'service',     label: 'Community Service / Non-profit' },
  { value: 'business',    label: 'Local Business' },
  { value: 'hotel',       label: 'Hotel / Accommodation' },
  { value: 'community',   label: 'Community / Cultural Organization' },
  { value: 'government',  label: 'Government / Public Service' },
];

export default function RegisterPage() {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    type: 'service',
    address: '',
    phone: '',
    email: '',
    website: '',
    is_indigenous_org: false,
    contact_name: '',
  });

  const supabase = createClient();

  const set = (field: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Geocode the address
      const geo = await geocodeAddress(form.address);

      // 2. Insert organization as 'pending'
      const { data: org, error: orgErr } = await supabase
        .from('organization')
        .insert({
          name: form.name,
          type: form.type,
          address: form.address,
          city: 'Prince George',
          province: 'BC',
          phone: form.phone || null,
          email: form.email || null,
          website: form.website || null,
          latitude: geo?.lat ?? null,
          longitude: geo?.lng ?? null,
          is_indigenous_org: form.is_indigenous_org,
          registration_status: 'pending',
        })
        .select('id')
        .single();

      if (orgErr) throw new Error(orgErr.message);

      // 3. Create Supabase Auth account for the contact
      const { error: authErr } = await supabase.auth.signUp({
        email: form.email,
        password: Math.random().toString(36).slice(-10) + 'Aa1!', // temp password — magic link sent
        options: {
          data: {
            organization_id: org.id,
            display_name: form.contact_name,
          },
        },
      });

      if (authErr && !authErr.message.includes('already registered')) {
        throw new Error(authErr.message);
      }

      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (step === 'success') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
          <div className="text-4xl mb-4" aria-hidden>✅</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Registration submitted</h1>
          <p className="text-sm text-gray-600 mb-4">
            Your organization has been submitted for review. We&apos;ll email you at{' '}
            <strong>{form.email}</strong> once it&apos;s approved — usually within 1–2 business days.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Check your inbox for a login link to set up your dashboard.
          </p>
          <Link href="/" className="text-sm text-brand-700 font-medium hover:underline">
            ← Back to Northern Connect
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="mx-auto max-w-xl px-4 py-10">
      <Link href="/" className="text-sm text-brand-700 font-medium hover:underline mb-6 block">
        ← Northern Connect
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">List your organization</h1>
      <p className="text-sm text-gray-500 mb-6">
        Free for all Prince George organizations. Your listing will appear after a
        brief review — usually 1–2 business days.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Organization name" required>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Prince George Food Bank"
            className={inputClass}
          />
        </Field>

        <Field label="Organization type" required>
          <select
            value={form.type}
            onChange={(e) => set('type', e.target.value)}
            className={inputClass}
          >
            {ORG_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </Field>

        <Field label="Street address in Prince George" required>
          <input
            type="text"
            required
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
            placeholder="e.g. 554 George St"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-gray-400">
            Used to show your location on the map and distance from users.
          </p>
        </Field>

        <Field label="Contact email" required>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="info@yourorg.ca"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-gray-400">
            Your dashboard login link will be sent here.
          </p>
        </Field>

        <Field label="Contact name" required>
          <input
            type="text"
            required
            value={form.contact_name}
            onChange={(e) => set('contact_name', e.target.value)}
            placeholder="Your full name"
            className={inputClass}
          />
        </Field>

        <Field label="Phone number (optional)">
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="250-XXX-XXXX"
            className={inputClass}
          />
        </Field>

        <Field label="Website (optional)">
          <input
            type="url"
            value={form.website}
            onChange={(e) => set('website', e.target.value)}
            placeholder="https://yourwebsite.ca"
            className={inputClass}
          />
        </Field>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_indigenous_org}
            onChange={(e) => set('is_indigenous_org', e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          <span className="text-sm text-gray-700">
            This is an Indigenous-led organization or provides Indigenous-specific services
          </span>
        </label>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-brand-700 py-3 text-sm font-semibold text-white hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-60 transition-colors"
        >
          {loading ? 'Submitting…' : 'Submit for review — free'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          By submitting, you confirm this is a real organization in Prince George, BC.
          Spam submissions will be permanently blocked.
        </p>
      </form>
    </main>
  );
}

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none ' +
  'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20';

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden>*</span>}
      </label>
      {children}
    </div>
  );
}

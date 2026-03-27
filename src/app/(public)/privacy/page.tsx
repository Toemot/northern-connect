import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Northern Connect",
  description: "How Northern Connect collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/" className="text-sm text-brand-700 font-medium hover:underline mb-6 block">
        ← Northern Connect
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: March 2026</p>

      <div className="prose prose-sm prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-800">1. Who We Are</h2>
          <p className="text-sm text-gray-700 mt-2">
            Northern Connect is an independent, community-driven platform that helps residents of
            Prince George and Northern BC find local services, programs, and community activities.
            Northern Connect is not affiliated with any government body or health authority.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800">2. Information We Collect</h2>
          <div className="mt-2 space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-700">For Public Visitors (No Account)</h3>
              <p className="text-sm text-gray-700 mt-1">
                We do not require an account to browse listings or events. We do not use cookies
                for tracking. If analytics are enabled, we use privacy-first, cookieless analytics
                (Plausible.io) that do not track individual users.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">For Registered Organizations</h3>
              <p className="text-sm text-gray-700 mt-1">
                When an organization registers, we collect: organization name, type, address, phone,
                email, website, and a contact person&apos;s name and email. This information is used
                solely to manage your organization&apos;s listings on the platform.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800">3. How We Use Your Information</h2>
          <ul className="text-sm text-gray-700 mt-2 space-y-1 list-disc pl-5">
            <li>To display your organization&apos;s services and events to the public</li>
            <li>To verify and maintain the accuracy of listings</li>
            <li>To communicate with registered organizations about their accounts</li>
            <li>To improve the platform based on aggregate, anonymized usage patterns</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800">4. Data Storage &amp; Security</h2>
          <p className="text-sm text-gray-700 mt-2">
            All data is stored in Canada (Montreal, QC) using Supabase&apos;s ca-central-1 region,
            in compliance with British Columbia&apos;s Personal Information Protection Act (PIPA).
            We use industry-standard encryption (TLS) for data in transit and Row-Level Security
            policies to restrict data access.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800">5. Data Sharing</h2>
          <p className="text-sm text-gray-700 mt-2">
            We do not sell, rent, or share personal information with third parties. Organization
            listings are displayed publicly by design — this is the core purpose of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800">6. Your Rights</h2>
          <p className="text-sm text-gray-700 mt-2">
            Registered organizations can request to have their account and all associated data
            deleted at any time by contacting us. Public visitors have no personal data stored
            to request deletion of.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800">7. Contact</h2>
          <p className="text-sm text-gray-700 mt-2">
            For privacy-related questions, contact:{" "}
            <a href="mailto:hello@northernconnect.ca" className="text-brand-700 hover:underline">
              hello@northernconnect.ca
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}

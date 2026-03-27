import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Northern Connect",
  description: "Terms and conditions for using Northern Connect.",
};

export default function TermsPage() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/" className="text-sm text-brand-700 font-medium hover:underline mb-6 block">
        ← Northern Connect
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: March 2026</p>

      <div className="prose prose-sm prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-800">1. Acceptance of Terms</h2>
          <p className="text-sm text-gray-700 mt-2">
            By using Northern Connect, you agree to these Terms of Service. If you do not agree,
            please do not use the platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800">2. Purpose of the Platform</h2>
          <p className="text-sm text-gray-700 mt-2">
            Northern Connect is a community information directory. It provides general reference
            information about services, programs, and community activities in Prince George and
            Northern BC. It is not a substitute for professional advice of any kind.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800">3. No Guarantees of Accuracy</h2>
          <p className="text-sm text-gray-700 mt-2">
            While we take reasonable care to ensure information is accurate, Northern Connect
            cannot guarantee that all listings, hours, addresses, or contact details are current.
            <strong> Always verify directly with organizations before visiting or making decisions.</strong>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800">4. Not Professional Advice</h2>
          <p className="text-sm text-gray-700 mt-2">
            Northern Connect does not provide legal, medical, financial, housing, immigration,
            or safety advice. Information on this platform is a starting point for your own
            research, not a final answer.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800">5. User Responsibility</h2>
          <p className="text-sm text-gray-700 mt-2">
            You are responsible for any action taken based on information found on Northern Connect.
            We are not liable for any loss, injury, or damage resulting from your use of
            information on this platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800">6. Organization Listings</h2>
          <p className="text-sm text-gray-700 mt-2">
            Organizations that register to list their services agree to provide accurate information
            and to keep their listings up to date. Northern Connect reserves the right to remove
            listings that are inaccurate, misleading, or violate these terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800">7. Prohibited Use</h2>
          <ul className="text-sm text-gray-700 mt-2 space-y-1 list-disc pl-5">
            <li>Using the platform to harass, mislead, or harm others</li>
            <li>Submitting false or misleading organization information</li>
            <li>Scraping or mass-downloading data from the platform</li>
            <li>Attempting to access admin or agency features without authorization</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800">8. Changes to Terms</h2>
          <p className="text-sm text-gray-700 mt-2">
            We may update these terms from time to time. Continued use of the platform after
            changes constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800">9. Contact</h2>
          <p className="text-sm text-gray-700 mt-2">
            Questions about these terms? Contact:{" "}
            <a href="mailto:hello@northernconnect.ca" className="text-brand-700 hover:underline">
              hello@northernconnect.ca
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}

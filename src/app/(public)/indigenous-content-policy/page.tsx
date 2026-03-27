import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Indigenous Content Policy — Northern Connect",
  description: "Our commitment to respectful engagement with Indigenous communities.",
};

export default function IndigenousContentPolicyPage() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/" className="text-sm text-brand-700 font-medium hover:underline mb-6 block">
        ← Northern Connect
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Indigenous Content Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: March 2026</p>

      <div className="prose prose-sm prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-800">Acknowledgement</h2>
          <p className="text-sm text-gray-700 mt-2">
            Northern Connect operates on the unceded traditional territory of the Lheidli
            T&apos;enneh. We acknowledge all Indigenous peoples whose traditional territories
            encompass the communities served by this platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800">Our Commitment</h2>
          <p className="text-sm text-gray-700 mt-2">
            Northern Connect is committed to respectful, consent-based engagement with Indigenous
            communities and organizations. Our approach is guided by:
          </p>
          <ul className="text-sm text-gray-700 mt-2 space-y-1 list-disc pl-5">
            <li>The United Nations Declaration on the Rights of Indigenous Peoples (UNDRIP)</li>
            <li>British Columbia&apos;s Declaration on the Rights of Indigenous Peoples Act (DRIPA)</li>
            <li>The First Nations principles of OCAP® (Ownership, Control, Access, Possession)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800">Consent-Based Listings</h2>
          <p className="text-sm text-gray-700 mt-2">
            No Indigenous organization, service, or cultural activity will be listed on Northern
            Connect without the <strong>written, informed consent</strong> of the appropriate
            authority within that organization or community. This includes:
          </p>
          <ul className="text-sm text-gray-700 mt-2 space-y-1 list-disc pl-5">
            <li>Indigenous-led service organizations</li>
            <li>Cultural programs and events</li>
            <li>Any content that references Indigenous communities, cultures, or practices</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800">Data Sovereignty</h2>
          <p className="text-sm text-gray-700 mt-2">
            Indigenous organizations retain full ownership of their data on this platform. They may
            request removal, modification, or transfer of their information at any time. Northern
            Connect will comply with such requests promptly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800">What We Will Not Do</h2>
          <ul className="text-sm text-gray-700 mt-2 space-y-1 list-disc pl-5">
            <li>List Indigenous organizations or cultural content without prior consent</li>
            <li>Speak for or represent Indigenous communities</li>
            <li>Use Indigenous cultural knowledge for commercial purposes</li>
            <li>Share Indigenous organization data with third parties without consent</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800">Reporting Concerns</h2>
          <p className="text-sm text-gray-700 mt-2">
            If you believe any content on Northern Connect misrepresents or has been published
            without proper consent from an Indigenous organization, please contact us immediately:{" "}
            <a href="mailto:hello@northernconnect.ca" className="text-brand-700 hover:underline">
              hello@northernconnect.ca
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}

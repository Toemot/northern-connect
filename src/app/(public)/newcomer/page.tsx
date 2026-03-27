import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'New to Prince George | Northern Connect',
  description:
    'A practical guide for international students, new families, and newcomers arriving in Prince George, BC.',
};

const TABS = [
  { id: 'students', label: '🎓 International Students' },
  { id: 'families', label: '🏡 New Families' },
  { id: 'newcomers', label: '🌍 General Newcomers' },
];

export default async function NewcomerGuidePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = 'students' } = await searchParams;

  return (
    <main id="main-content" className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">New to Prince George?</h1>
      <p className="text-gray-600 mb-6">
        A practical starting point — not a substitute for contacting organizations directly.
        Verify everything before acting on it.
      </p>

      {/* Tab navigation */}
      <div className="flex gap-2 mb-8 flex-wrap" role="tablist">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={`/newcomer?tab=${t.id}`}
            role="tab"
            aria-selected={tab === t.id}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors
              ${tab === t.id
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* ── INTERNATIONAL STUDENTS ── */}
      {tab === 'students' && (
        <div className="space-y-6">
          <Section title="Schools in Prince George">
            <OrgLink
              name="University of Northern BC (UNBC)"
              detail="3333 University Way — undergraduate, graduate, international programs"
              href="https://www.unbc.ca/international"
            />
            <OrgLink
              name="College of New Caledonia (CNC)"
              detail="3330 22nd Ave — diplomas, certificates, trades, ESL"
              href="https://cnc.bc.ca/"
            />
          </Section>

          <Section title="Before You Arrive — Checklist">
            <Checklist items={[
              'Confirm your study permit is approved (IRCC)',
              'Arrange accommodation — on-campus or homestay via UNBC/CNC',
              'Register for BC Medical Services Plan (MSP) — 3-month waiting period applies; get UHIP bridge coverage',
              'Book your SIN appointment at Service Canada PG (1266 4th Ave)',
              'Open a Canadian bank account — most banks require a passport + study permit',
              'Buy a BC Transit pass (monthly or per-trip) — no Uber in PG yet',
            ]} />
          </Section>

          <Section title="On Arrival — First Week">
            <Checklist items={[
              'Register with your school\'s international student office',
              'Collect your UHIP card and carry it at all times',
              'Find your nearest walk-in clinic (search "Medical & Health" on Northern Connect)',
              'Connect with a cultural community — search "Newcomer Guide" on Northern Connect',
              'Learn BC Transit routes — free trip planner at bctransit.com/prince-george',
            ]} />
          </Section>

          <Section title="Useful Services on Northern Connect">
            <p className="text-sm text-gray-600 mb-2">
              Search these categories for listings near you:
            </p>
            <div className="flex flex-wrap gap-2">
              {['newcomer-guide', 'student-services', 'mental-health', 'food-nutrition', 'transportation'].map(slug => (
                <Link
                  key={slug}
                  href={`/?category=${slug}`}
                  className="bg-blue-50 text-blue-800 text-sm px-3 py-1 rounded-full border border-blue-200 hover:bg-blue-100"
                >
                  {slug.replace(/-/g, ' ')}
                </Link>
              ))}
            </div>
          </Section>

          <SafetyNote />
        </div>
      )}

      {/* ── NEW FAMILIES ── */}
      {tab === 'families' && (
        <div className="space-y-6">
          <Section title="School District 57 — Prince George">
            <p className="text-sm text-gray-600 mb-3">
              SD57 operates all public K–12 schools in PG. Enrolment is based on
              your home address (catchment area). Visit sd57.bc.ca to find your
              catchment school before choosing where to live.
            </p>
            <OrgLink
              name="SD57 — Find a School by Catchment"
              detail="Enter your address to see which school your children would attend"
              href="https://www.sd57.bc.ca/apps/pages/index.jsp?uREC_ID=1144473"
            />
            <OrgLink
              name="School District No. 57 — Main Site"
              detail="Registration, programs, French Immersion, Indigenous programs"
              href="https://www.sd57.bc.ca/"
            />
          </Section>

          <Section title="Neighbourhoods — What to Know">
            <p className="text-sm text-gray-600 mb-2">
              Prince George has several distinct areas. A real estate agent familiar
              with PG is your best guide for current availability and pricing.
              General notes:
            </p>
            <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5">
              <li><strong>Hart Highlands / Hart Area</strong> — north of the city, newer developments, family-oriented, access to Hart Highway</li>
              <li><strong>College Heights</strong> — south of downtown, close to UNBC and CNC, mix of families and students</li>
              <li><strong>Westwood / Nechako</strong> — established west-side neighbourhoods, schools nearby, parks</li>
              <li><strong>Downtown / Central</strong> — walkable, close to services and amenities; varies by block</li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">
              For current safety and crime information, contact the RCMP Prince George
              non-emergency line: <strong>250-562-3371</strong> or visit{' '}
              <a href="https://bc.rcmp-grc.gc.ca" className="underline">bc.rcmp-grc.gc.ca</a>.
              Northern Connect does not provide crime or safety zone data.
            </p>
          </Section>

          <Section title="Finding a Real Estate Agent">
            <p className="text-sm text-gray-600 mb-2">
              Search <strong>&ldquo;Real Estate&rdquo;</strong> on Northern Connect for agents
              listed in Prince George. Also check:
            </p>
            <OrgLink
              name="BC Real Estate Association"
              detail="Find a licensed REALTOR® in Prince George"
              href="https://www.bcrea.bc.ca/"
            />
          </Section>

          <Section title="Children's Activities">
            <p className="text-sm text-gray-600">
              Search these categories on Northern Connect for what&apos;s near you:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {['youth-programs', 'sports-recreation', 'arts-culture', 'family-children'].map(slug => (
                <Link
                  key={slug}
                  href={`/?category=${slug}`}
                  className="bg-green-50 text-green-800 text-sm px-3 py-1 rounded-full border border-green-200 hover:bg-green-100"
                >
                  {slug.replace(/-/g, ' ')}
                </Link>
              ))}
            </div>
          </Section>

          <SafetyNote />
        </div>
      )}

      {/* ── GENERAL NEWCOMERS ── */}
      {tab === 'newcomers' && (
        <div className="space-y-6">
          <Section title="First Steps in Prince George">
            <Checklist items={[
              'Apply for BC Medical Services Plan (MSP) at gov.bc.ca/msp — 3-month wait; get private bridge coverage',
              'Apply for a Social Insurance Number (SIN) at Service Canada, 1266 4th Ave',
              'Get a BC Services Card (health card) — same office',
              'Register children for school at SD57 — sd57.bc.ca',
              'Open a bank account — major banks are downtown on George St',
              'Get a BC Transit pass at bctransit.com/prince-george',
            ]} />
          </Section>

          <Section title="Settlement Services in PG">
            <OrgLink
              name="Success BC — Newcomer Services"
              detail="Employment, language, settlement support for immigrants and refugees"
              href="https://successbc.ca/"
            />
            <OrgLink
              name="Prince George Native Friendship Centre (PGNAFC)"
              detail="Services for Indigenous peoples, urban newcomers, cultural programs"
              href="http://www.pgnfc.com/"
            />
          </Section>

          <Section title="Find Services Near You">
            <div className="flex flex-wrap gap-2">
              {['newcomer-guide', 'financial-assistance', 'mental-health', 'legal-advocacy', 'employment-training'].map(slug => (
                <Link
                  key={slug}
                  href={`/?category=${slug}`}
                  className="bg-purple-50 text-purple-800 text-sm px-3 py-1 rounded-full border border-purple-200 hover:bg-purple-100"
                >
                  {slug.replace(/-/g, ' ')}
                </Link>
              ))}
            </div>
          </Section>

          <SafetyNote />
        </div>
      )}
    </main>
  );
}

/* ── Shared sub-components ── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-gray-200 rounded-xl p-5">
      <h2 className="text-base font-semibold text-gray-800 mb-4">{title}</h2>
      {children}
    </section>
  );
}

function OrgLink({ name, detail, href }: { name: string; detail: string; href: string }) {
  return (
    <div className="mb-3">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-blue-700 hover:underline"
      >
        {name} ↗
      </a>
      <p className="text-xs text-gray-500 mt-0.5">{detail}</p>
    </div>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-gray-700">
          <span className="text-green-500 mt-0.5 shrink-0">✓</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SafetyNote() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
      <strong>Important:</strong> All information on this page is for general
      reference only and may be out of date. Always verify directly with each
      organization. Northern Connect does not provide legal, immigration, medical,
      or safety advice. You are responsible for decisions made based on this
      information.
    </div>
  );
}

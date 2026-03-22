-- Northern Connect — Initial Schema
-- Run this migration in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/eafzmqbynbanavdcwuah/sql

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CATEGORY (lookup table — seeded at launch, not user-editable)
-- ============================================================
CREATE TABLE IF NOT EXISTS category (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  layer         TEXT NOT NULL CHECK (layer IN ('services', 'community_life')),
  icon_emoji    TEXT,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- ORGANIZATION (core entity)
-- ============================================================
CREATE TABLE IF NOT EXISTS organization (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                        TEXT NOT NULL,
  type                        TEXT NOT NULL DEFAULT 'service',
  address                     TEXT,
  city                        TEXT NOT NULL DEFAULT 'Prince George',
  province                    TEXT NOT NULL DEFAULT 'BC',
  phone                       TEXT,
  email                       TEXT,
  website                     TEXT,
  latitude                    NUMERIC(9, 6),
  longitude                   NUMERIC(9, 6),
  is_indigenous_org           BOOLEAN NOT NULL DEFAULT FALSE,
  indigenous_consent_on_file  BOOLEAN NOT NULL DEFAULT FALSE,
  is_active                   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- AGENCY_USER (links Supabase Auth user to an organization)
-- ============================================================
CREATE TABLE IF NOT EXISTS agency_user (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  display_name    TEXT NOT NULL,
  role            TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor'))
);

-- ============================================================
-- LISTING (service directory entry)
-- ============================================================
CREATE TABLE IF NOT EXISTS listing (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id  UUID NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  category_id      UUID REFERENCES category(id) ON DELETE SET NULL,
  title            TEXT NOT NULL,
  description      TEXT,
  eligibility_notes TEXT,
  languages_served TEXT[] NOT NULL DEFAULT ARRAY['English'],
  hours            JSONB,
  last_verified_at TIMESTAMPTZ,
  verified_by      TEXT,
  status           TEXT NOT NULL DEFAULT 'draft'
                     CHECK (status IN ('active', 'inactive', 'draft', 'needs_review')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- EVENT (community life / events section)
-- ============================================================
CREATE TABLE IF NOT EXISTS event (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id  UUID REFERENCES organization(id) ON DELETE SET NULL,
  title            TEXT NOT NULL,
  description      TEXT,
  start_datetime   TIMESTAMPTZ NOT NULL,
  end_datetime     TIMESTAMPTZ,
  location_name    TEXT,
  address          TEXT,
  is_free          BOOLEAN NOT NULL DEFAULT TRUE,
  recurrence       TEXT NOT NULL DEFAULT 'one_time'
                     CHECK (recurrence IN ('one_time', 'weekly', 'biweekly', 'monthly', 'annual')),
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDIGENOUS_CONSENT
-- ============================================================
CREATE TABLE IF NOT EXISTS indigenous_consent (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id       UUID NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  consent_type          TEXT NOT NULL CHECK (consent_type IN ('listing', 'event', 'cultural')),
  consenting_authority  TEXT NOT NULL,
  consent_date          DATE NOT NULL,
  review_date           DATE,
  consent_document_ref  TEXT
);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organization_updated_at
  BEFORE UPDATE ON organization
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER listing_updated_at
  BEFORE UPDATE ON listing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW-LEVEL SECURITY
-- ============================================================
ALTER TABLE organization       ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing            ENABLE ROW LEVEL SECURITY;
ALTER TABLE event              ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_user        ENABLE ROW LEVEL SECURITY;
ALTER TABLE category           ENABLE ROW LEVEL SECURITY;
ALTER TABLE indigenous_consent ENABLE ROW LEVEL SECURITY;

-- Public: read active listings only
CREATE POLICY "public_read_active_listings"
  ON listing FOR SELECT
  USING (status = 'active');

-- Public: read all active organizations
CREATE POLICY "public_read_active_orgs"
  ON organization FOR SELECT
  USING (is_active = TRUE);

-- Public: read all categories
CREATE POLICY "public_read_categories"
  ON category FOR SELECT
  USING (TRUE);

-- Public: read active events
CREATE POLICY "public_read_active_events"
  ON event FOR SELECT
  USING (is_active = TRUE);

-- Agency: full access to their own org's listings
CREATE POLICY "agency_manage_own_listings"
  ON listing FOR ALL
  USING (
    organization_id = (
      SELECT organization_id FROM agency_user WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id = (
      SELECT organization_id FROM agency_user WHERE id = auth.uid()
    )
  );

-- Agency: full access to their own org's events
CREATE POLICY "agency_manage_own_events"
  ON event FOR ALL
  USING (
    organization_id = (
      SELECT organization_id FROM agency_user WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id = (
      SELECT organization_id FROM agency_user WHERE id = auth.uid()
    )
  );

-- Agency: read and update their own organization record
CREATE POLICY "agency_read_own_org"
  ON organization FOR SELECT
  USING (
    id = (SELECT organization_id FROM agency_user WHERE id = auth.uid())
  );

CREATE POLICY "agency_update_own_org"
  ON organization FOR UPDATE
  USING (
    id = (SELECT organization_id FROM agency_user WHERE id = auth.uid())
  );

-- Agency: read own user record
CREATE POLICY "agency_read_own_user"
  ON agency_user FOR SELECT
  USING (id = auth.uid());

-- ============================================================
-- CATEGORY SEED DATA
-- ============================================================
INSERT INTO category (name, slug, layer, icon_emoji, display_order) VALUES
  ('Food & Nutrition',          'food-nutrition',        'services',        '🍎', 1),
  ('Shelter & Housing',         'shelter-housing',       'services',        '🏠', 2),
  ('Mental Health & Wellness',  'mental-health',         'services',        '💙', 3),
  ('Financial Assistance',      'financial-assistance',  'services',        '💰', 4),
  ('Medical & Health',          'medical-health',        'services',        '🏥', 5),
  ('Family & Children',         'family-children',       'services',        '👨‍👩‍👧', 6),
  ('Transportation',            'transportation',        'services',        '🚌', 7),
  ('Indigenous Services',       'indigenous-services',   'services',        '🌿', 8),
  ('Employment & Training',     'employment-training',   'services',        '💼', 9),
  ('Legal & Advocacy',          'legal-advocacy',        'services',        '⚖️', 10),
  ('Community Events',          'community-events',      'community_life',  '🎉', 11),
  ('Sports & Recreation',       'sports-recreation',     'community_life',  '⚽', 12),
  ('Arts & Culture',            'arts-culture',          'community_life',  '🎨', 13),
  ('Volunteering',              'volunteering',          'community_life',  '🤝', 14),
  ('Youth Programs',            'youth-programs',        'community_life',  '🌟', 15),
  ('Senior Programs',           'senior-programs',       'community_life',  '🌸', 16)
ON CONFLICT (slug) DO NOTHING;

-- Northern Connect — Migration 002: Photos + Self-Registration Status
-- Run this in Supabase SQL Editor AFTER 001_initial_schema.sql:
-- https://supabase.com/dashboard/project/eafzmqbynbanavdcwuah/sql/new

-- ============================================================
-- ADD PHOTO SUPPORT
-- ============================================================
ALTER TABLE organization
  ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE listing
  ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- ============================================================
-- ADD SELF-REGISTRATION APPROVAL WORKFLOW
-- agencies who self-register start as 'pending' until approved
-- ============================================================
ALTER TABLE organization
  ADD COLUMN IF NOT EXISTS registration_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (registration_status IN ('pending', 'approved', 'rejected', 'flagged'));

-- ============================================================
-- UPDATE PUBLIC READ POLICY
-- public can only see APPROVED + active organizations
-- ============================================================
DROP POLICY IF EXISTS "public_read_active_orgs" ON organization;

CREATE POLICY "public_read_active_orgs"
  ON organization FOR SELECT
  USING (is_active = TRUE AND registration_status = 'approved');

-- ============================================================
-- SELF-REGISTRATION INSERT POLICY
-- anyone can submit a registration — it lands as 'pending'
-- only the service role key (admin) can approve/reject
-- ============================================================
CREATE POLICY "public_register_organization"
  ON organization FOR INSERT
  WITH CHECK (registration_status = 'pending');

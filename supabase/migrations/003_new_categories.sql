-- Northern Connect — Migration 003: New Categories
-- Run in Supabase SQL Editor after 001 and 002:
-- https://supabase.com/dashboard/project/eafzmqbynbanavdcwuah/sql/new

INSERT INTO category (name, slug, layer, icon_emoji, display_order) VALUES
  ('Student Services',    'student-services',   'services',       '🎓', 17),
  ('Schools & Childcare', 'schools-childcare',  'services',       '🏫', 18),
  ('Newcomer Guide',      'newcomer-guide',     'services',       '🌍', 19),
  ('Real Estate',         'real-estate',        'community_life', '🏡', 20),
  ('Rideshare & Transit', 'rideshare-transit',  'community_life', '🚌', 21),
  ('Safety Resources',    'safety-resources',   'services',       '🛡️', 22)
ON CONFLICT (slug) DO NOTHING;

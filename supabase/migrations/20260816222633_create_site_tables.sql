/*
# Create episodes, site_content, and site_theme tables

1. Overview
   Persistent storage for the Antics site's Edit Mode. Replaces localStorage.
   Single-tenant, no sign-in — client-side 32-click + password gates writes.
   All tables allow anon + authenticated CRUD.

2. New Tables
   a) episodes — id, title, description, status, runtime, thumbnail, hidden, pinned, sort_order, created_at
   b) site_content — id, value, styles(jsonb), updated_at
   c) site_theme — id(default 'active'), preset, accent, background, primary_text, secondary_text, border, grid, updated_at

3. Security — RLS enabled on all, anon+authenticated full CRUD (intentionally public single-tenant)
4. Seeds default theme row
*/

CREATE TABLE IF NOT EXISTS episodes (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT '',
  runtime text NOT NULL DEFAULT '0:00',
  thumbnail text NOT NULL,
  hidden boolean NOT NULL DEFAULT false,
  pinned boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_episodes" ON episodes;
CREATE POLICY "anon_select_episodes" ON episodes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_episodes" ON episodes;
CREATE POLICY "anon_insert_episodes" ON episodes FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_episodes" ON episodes;
CREATE POLICY "anon_update_episodes" ON episodes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_episodes" ON episodes;
CREATE POLICY "anon_delete_episodes" ON episodes FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS site_content (
  id text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  styles jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_site_content" ON site_content;
CREATE POLICY "anon_select_site_content" ON site_content FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_site_content" ON site_content;
CREATE POLICY "anon_insert_site_content" ON site_content FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_site_content" ON site_content;
CREATE POLICY "anon_update_site_content" ON site_content FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_site_content" ON site_content;
CREATE POLICY "anon_delete_site_content" ON site_content FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS site_theme (
  id text PRIMARY KEY DEFAULT 'active',
  preset text NOT NULL DEFAULT 'red',
  accent text NOT NULL DEFAULT '#cc1414',
  background text NOT NULL DEFAULT '#0a0a0a',
  primary_text text NOT NULL DEFAULT '#e5e5e5',
  secondary_text text NOT NULL DEFAULT '#9ca3af',
  border text NOT NULL DEFAULT '#8b0000',
  grid text NOT NULL DEFAULT 'rgba(204, 20, 20, 0.09)',
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE site_theme ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_site_theme" ON site_theme;
CREATE POLICY "anon_select_site_theme" ON site_theme FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_site_theme" ON site_theme;
CREATE POLICY "anon_insert_site_theme" ON site_theme FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_site_theme" ON site_theme;
CREATE POLICY "anon_update_site_theme" ON site_theme FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_site_theme" ON site_theme;
CREATE POLICY "anon_delete_site_theme" ON site_theme FOR DELETE TO anon, authenticated USING (true);

INSERT INTO site_theme (id, preset) VALUES ('active', 'red') ON CONFLICT (id) DO NOTHING;
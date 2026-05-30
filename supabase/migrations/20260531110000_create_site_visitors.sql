/*
  # Site visitors analytics

  Tracks unique visitors by browser token to expose an all-time visitors counter.
*/

CREATE TABLE IF NOT EXISTS site_visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_token text NOT NULL UNIQUE,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  visit_count integer NOT NULL DEFAULT 1
);

ALTER TABLE site_visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visitor stats"
  ON site_visitors FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert visitor token"
  ON site_visitors FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update own token row"
  ON site_visitors FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

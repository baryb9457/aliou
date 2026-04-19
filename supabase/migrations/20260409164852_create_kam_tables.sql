/*
  # Kam - Contact Requests & Devis Tables

  ## Summary
  Creates the core data model for the Kam professional services platform.

  ## New Tables

  ### contact_requests
  Stores all inbound client inquiries submitted through the contact form.
  - `id` - UUID primary key
  - `name` - Client full name
  - `email` - Client email address
  - `phone` - Optional phone number
  - `service_type` - Type of service requested (web, IT, admin, other)
  - `message` - Detailed description of the request
  - `status` - Workflow status: pending | in_progress | quoted | completed
  - `created_at` - Submission timestamp

  ### devis
  Stores quotes created by the admin in response to contact requests.
  - `id` - UUID primary key
  - `request_id` - Optional FK to contact_requests
  - `client_name` - Client name on the quote
  - `client_email` - Client email on the quote
  - `items` - JSONB array of line items {description, quantity, unit_price}
  - `total_amount` - Computed total
  - `notes` - Optional admin notes / terms
  - `status` - Quote status: draft | sent | accepted | rejected
  - `created_at` / `updated_at` - Timestamps

  ## Security
  - RLS enabled on both tables
  - Public can INSERT contact_requests (contact form)
  - Only authenticated users (admin) can SELECT/UPDATE/DELETE contact_requests
  - Only authenticated users can full CRUD on devis
*/

CREATE TABLE IF NOT EXISTS contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  service_type text DEFAULT 'other',
  message text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact request"
  ON contact_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can view all requests"
  ON contact_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated admin can update requests"
  ON contact_requests FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can delete requests"
  ON contact_requests FOR DELETE
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS devis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES contact_requests(id) ON DELETE SET NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  total_amount decimal(10,2) DEFAULT 0,
  notes text DEFAULT '',
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE devis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated admin can view devis"
  ON devis FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated admin can insert devis"
  ON devis FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can update devis"
  ON devis FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can delete devis"
  ON devis FOR DELETE
  TO authenticated
  USING (true);

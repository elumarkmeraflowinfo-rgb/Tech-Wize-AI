/*
  # Tech-Wize Platform Database Schema
  
  Complete database schema for the Tech-Wize AI-powered digital production platform.
  
  ## New Tables
  1. profiles - User profiles with roles
  2. service_categories - Service organization
  3. service_packages - Pricing tiers
  4. projects - Client orders
  5. project_assets - File uploads
  6. project_revisions - Revision tracking
  7. payments - Transactions
  8. notifications - User notifications
  9. automation_logs - Workflow tracking
  10. video_templates - Template library
  11. ai_prompts - AI prompt library
  12. project_timeline - Audit log
  13. analytics_events - Analytics tracking
  
  ## Security
  - RLS enabled on all tables
  - Role-based access (client, editor, admin)
  - Clients access own data only
  - Editors access assigned projects
  - Admins have full access
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('client', 'admin', 'editor');
CREATE TYPE project_status AS ENUM ('pending_payment', 'queued', 'in_production', 'in_review', 'awaiting_approval', 'in_revision', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('mpesa', 'card', 'bank_transfer', 'cash');
CREATE TYPE project_priority AS ENUM ('low', 'normal', 'high', 'urgent');
CREATE TYPE asset_type AS ENUM ('logo', 'image', 'video', 'document', 'final_output', 'work_in_progress');
CREATE TYPE notification_type AS ENUM ('order_confirmation', 'status_update', 'payment_received', 'delivery_ready', 'revision_requested', 'system');
CREATE TYPE video_duration AS ENUM ('15s', '30s', '60s', '90s');
CREATE TYPE target_platform AS ENUM ('tiktok', 'instagram', 'youtube', 'whatsapp', 'facebook', 'multiple');
CREATE TYPE template_style AS ENUM ('minimal', 'bold', 'corporate', 'creative', 'energetic', 'elegant');

-- 1. Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone_number text,
  whatsapp_number text,
  company_name text,
  role user_role DEFAULT 'client' NOT NULL,
  avatar_url text,
  bio text,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Service categories
CREATE TABLE IF NOT EXISTS service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  icon text,
  display_order int DEFAULT 0 NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 3. Service packages
CREATE TABLE IF NOT EXISTS service_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES service_categories(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  price_kes numeric(10,2) NOT NULL,
  delivery_days int NOT NULL,
  features jsonb DEFAULT '[]'::jsonb NOT NULL,
  includes_voiceover boolean DEFAULT false NOT NULL,
  includes_music boolean DEFAULT true NOT NULL,
  includes_script boolean DEFAULT false NOT NULL,
  revision_count int DEFAULT 1 NOT NULL,
  max_duration video_duration DEFAULT '30s' NOT NULL,
  is_popular boolean DEFAULT false NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  display_order int DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 4. Projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  package_id uuid REFERENCES service_packages(id) ON DELETE SET NULL,
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
  status project_status DEFAULT 'pending_payment' NOT NULL,
  priority project_priority DEFAULT 'normal' NOT NULL,
  
  title text NOT NULL,
  description text NOT NULL,
  target_platform target_platform DEFAULT 'multiple' NOT NULL,
  video_duration video_duration DEFAULT '30s' NOT NULL,
  
  script_provided boolean DEFAULT false NOT NULL,
  custom_script text,
  brand_colors jsonb DEFAULT '[]'::jsonb,
  cta_text text,
  cta_url text,
  
  total_amount numeric(10,2) NOT NULL,
  payment_status payment_status DEFAULT 'pending' NOT NULL,
  revision_count_used int DEFAULT 0 NOT NULL,
  max_revisions int DEFAULT 1 NOT NULL,
  
  deadline_date timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  
  client_notes text,
  internal_notes text,
  
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 5. Project assets
CREATE TABLE IF NOT EXISTS project_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  asset_type asset_type NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size bigint,
  mime_type text,
  uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  is_approved boolean DEFAULT false NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 6. Project revisions
CREATE TABLE IF NOT EXISTS project_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  revision_number int NOT NULL,
  requested_by uuid REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  description text NOT NULL,
  status project_status DEFAULT 'in_revision' NOT NULL,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 7. Payments
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL NOT NULL,
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'KES' NOT NULL,
  payment_method payment_method NOT NULL,
  transaction_ref text UNIQUE,
  mpesa_receipt_number text,
  phone_number text,
  status payment_status DEFAULT 'pending' NOT NULL,
  payment_date timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 8. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  link text,
  is_read boolean DEFAULT false NOT NULL,
  sent_via text[] DEFAULT ARRAY['email']::text[],
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 9. Automation logs
CREATE TABLE IF NOT EXISTS automation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_type text NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  action_taken text NOT NULL,
  status text DEFAULT 'success' NOT NULL,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 10. Video templates
CREATE TABLE IF NOT EXISTS video_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES service_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  thumbnail_url text,
  preview_url text,
  duration video_duration DEFAULT '30s' NOT NULL,
  style template_style DEFAULT 'minimal' NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  usage_count int DEFAULT 0 NOT NULL,
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 11. AI prompts
CREATE TABLE IF NOT EXISTS ai_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_type text NOT NULL,
  name text NOT NULL,
  template_text text NOT NULL,
  variables jsonb DEFAULT '[]'::jsonb,
  category text,
  usage_count int DEFAULT 0 NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 12. Project timeline
CREATE TABLE IF NOT EXISTS project_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  status project_status NOT NULL,
  changed_by uuid REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 13. Analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_assigned_to ON projects(assigned_to);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_assets_project_id ON project_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_payments_project_id ON payments(project_id);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_project_timeline_project_id ON project_timeline(project_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for service_categories (public read)
CREATE POLICY "Anyone can view active service categories"
  ON service_categories FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Admins can manage service categories"
  ON service_categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for service_packages (public read)
CREATE POLICY "Anyone can view active service packages"
  ON service_packages FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Admins can manage service packages"
  ON service_packages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for projects
CREATE POLICY "Clients can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Clients can create own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Clients can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Editors can view assigned projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Editors and admins can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'editor')
    )
  );

-- RLS Policies for project_assets
CREATE POLICY "Project participants can view assets"
  ON project_assets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_assets.project_id
      AND (
        projects.client_id = auth.uid() OR
        projects.assigned_to = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Project participants can upload assets"
  ON project_assets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_assets.project_id
      AND (
        projects.client_id = auth.uid() OR
        projects.assigned_to = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      )
    )
  );

-- RLS Policies for project_revisions
CREATE POLICY "Project participants can view revisions"
  ON project_revisions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_revisions.project_id
      AND (
        projects.client_id = auth.uid() OR
        projects.assigned_to = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Clients can request revisions"
  ON project_revisions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_revisions.project_id
      AND projects.client_id = auth.uid()
    )
  );

-- RLS Policies for payments
CREATE POLICY "Clients can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Clients can create own payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for automation_logs (admin only)
CREATE POLICY "Admins can view automation logs"
  ON automation_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for video_templates (public read, admin write)
CREATE POLICY "Anyone can view active templates"
  ON video_templates FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Admins can manage templates"
  ON video_templates FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for ai_prompts (editors and admins)
CREATE POLICY "Editors and admins can view prompts"
  ON ai_prompts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can manage prompts"
  ON ai_prompts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for project_timeline
CREATE POLICY "Project participants can view timeline"
  ON project_timeline FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_timeline.project_id
      AND (
        projects.client_id = auth.uid() OR
        projects.assigned_to = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      )
    )
  );

-- RLS Policies for analytics_events (admin only)
CREATE POLICY "Admins can view analytics"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'client'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_service_packages_updated_at
  BEFORE UPDATE ON service_packages
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

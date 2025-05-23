/*
  # Add page versioning and history

  1. New Tables
    - page_versions
      - id (uuid, primary key)
      - page_id (uuid, references pages)
      - version (integer)
      - content (jsonb)
      - metadata (jsonb)
      - created_at (timestamp)
      - created_by (uuid, references auth.users)
      - comment (text)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create page_versions table
CREATE TABLE IF NOT EXISTS page_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES pages(id) ON DELETE CASCADE,
  version integer NOT NULL,
  content jsonb NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  comment text,
  UNIQUE (page_id, version)
);

-- Enable RLS
ALTER TABLE page_versions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view page versions"
  ON page_versions
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM pages
    WHERE id = page_versions.page_id
    AND (NOT is_draft OR auth.uid() IN (
      SELECT user_id FROM editor_settings WHERE is_admin(user_id)
    ))
  ));

CREATE POLICY "Admins can create page versions"
  ON page_versions
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

-- Function to automatically create a version when a page is updated
CREATE OR REPLACE FUNCTION create_page_version()
RETURNS TRIGGER AS $$
DECLARE
  next_version integer;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version), 0) + 1
  INTO next_version
  FROM page_versions
  WHERE page_id = NEW.id;

  -- Create new version
  INSERT INTO page_versions (
    page_id,
    version,
    content,
    metadata,
    created_by,
    comment
  ) VALUES (
    NEW.id,
    next_version,
    NEW.content,
    NEW.metadata,
    auth.uid(),
    'Page updated'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for page updates
CREATE TRIGGER on_page_version
  AFTER UPDATE OF content, metadata ON pages
  FOR EACH ROW
  EXECUTE FUNCTION create_page_version();
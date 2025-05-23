/*
  # Components Table Schema

  1. New Table
    - components
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - category (text)
      - blocks (jsonb)
      - thumbnail (text)
      - created_at (timestamp)
      - updated_at (timestamp)
      - user_id (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create components table
CREATE TABLE IF NOT EXISTS components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  blocks jsonb NOT NULL,
  thumbnail text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE components ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view all components" ON components;
  DROP POLICY IF EXISTS "Users can create components" ON components;
  DROP POLICY IF EXISTS "Users can update own components" ON components;
  DROP POLICY IF EXISTS "Users can delete own components" ON components;
END $$;

-- Create policies
CREATE POLICY "Users can view all components"
  ON components
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create components"
  ON components
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own components"
  ON components
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own components"
  ON components
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_components_updated_at ON components;

-- Create trigger for updated_at
CREATE TRIGGER update_components_updated_at
  BEFORE UPDATE ON components
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
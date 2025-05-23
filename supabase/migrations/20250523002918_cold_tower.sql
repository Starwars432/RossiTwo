-- Create theme_presets table
CREATE TABLE IF NOT EXISTS theme_presets (
  id text PRIMARY KEY,
  name text NOT NULL,
  theme jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE theme_presets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all theme presets"
  ON theme_presets
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create theme presets"
  ON theme_presets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own theme presets"
  ON theme_presets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own theme presets"
  ON theme_presets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_theme_presets_updated_at
  BEFORE UPDATE ON theme_presets
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
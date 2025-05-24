/*
  # Add theme column to editor_settings table

  1. Changes
    - Add `theme` column of type `jsonb` to `editor_settings` table
    - Set default value to empty JSON object
    - Make column nullable to maintain compatibility with existing rows

  2. Notes
    - Using `jsonb` type for better performance and indexing capabilities
    - Default empty object prevents null issues in application code
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'editor_settings' 
    AND column_name = 'theme'
  ) THEN
    ALTER TABLE editor_settings 
    ADD COLUMN theme jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;
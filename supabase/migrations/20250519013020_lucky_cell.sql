/*
  # Fix Authentication Trigger and Policies

  1. Changes
    - Add INSERT policy for profiles table to allow the trigger function to create profiles
    - Update trigger function to use service role for profile creation
    - Add missing policies for profile management

  2. Security
    - Maintain RLS while allowing system-level operations
    - Ensure proper access control for user data
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Enable the postgres role to bypass RLS
ALTER TABLE profiles FORCE ROW LEVEL SECURITY;

-- Create more permissive policies for profiles
CREATE POLICY "System can create profiles"
  ON profiles
  FOR INSERT
  TO postgres
  WITH CHECK (true);

CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Update the handle_new_user function to use service role
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER -- This makes the function run with elevated privileges
SET search_path = public -- This is important for security
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;
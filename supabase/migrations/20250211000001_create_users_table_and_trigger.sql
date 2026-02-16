-- Create public.users table for user profiles
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Create updated_at trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TRIGGER: Auto-create user profile on signup
-- ============================================

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger that calls the function when a new user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- MANUAL FIX: Insert current missing user
-- ============================================
-- This will insert your existing auth user into the public.users table
-- Replace 'edf52eda-c0bf-46e0-b03c-23ef4131578f' with your actual user ID if different

-- First, let's see what auth users exist that don't have public profiles
-- Run this query separately to see the missing users:
-- SELECT id, email FROM auth.users
-- WHERE id NOT IN (SELECT id FROM public.users);

-- Insert the missing user (UNCOMMENT AND RUN THIS):
-- INSERT INTO public.users (id, email)
-- SELECT id, email
-- FROM auth.users
-- WHERE id = 'edf52eda-c0bf-46e0-b03c-23ef4131578f'
-- ON CONFLICT (id) DO NOTHING;

-- Or to insert ALL missing auth users at once (UNCOMMENT AND RUN THIS):
-- INSERT INTO public.users (id, email)
-- SELECT id, email
-- FROM auth.users
-- WHERE id NOT IN (SELECT id FROM public.users)
-- ON CONFLICT (id) DO NOTHING;

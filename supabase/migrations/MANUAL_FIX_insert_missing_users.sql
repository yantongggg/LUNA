-- ============================================
-- MANUAL FIX: Insert missing user records
-- ============================================
-- Run this in Supabase SQL Editor to fix your current missing user issue
-- File: MANUAL_FIX_insert_missing_users.sql

-- Step 1: Check which auth users are missing from public.users
-- This will show you what needs to be fixed
SELECT
  au.id,
  au.email,
  au.created_at as auth_created_at,
  pu.id as public_user_id,
  pu.email as public_email
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- Step 2: Insert ALL missing auth users into public.users
-- This fixes the foreign key constraint error
INSERT INTO public.users (id, email)
SELECT id, email
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Verify the fix worked
SELECT
  au.id,
  au.email,
  'NOW SYNCED' as status
FROM auth.users au
INNER JOIN public.users pu ON au.id = pu.id
WHERE au.id = 'edf52eda-c0bf-46e0-b03c-23ef4131578f';

-- Expected result: Should return 1 row showing your user is now synced

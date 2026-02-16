-- ============================================
-- LUNA Evidence Reports Storage Bucket Setup
-- ============================================
-- Run this in Supabase SQL Editor to create the storage bucket
-- for backing up forensic PDF reports

-- Step 1: Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES (
  'evidence_reports',
  'evidence_reports',
  true
)
ON CONFLICT (id) DO UPDATE SET
  public = true;

-- Step 2: Create RLS policies for the bucket
-- Policy: Allow authenticated users to upload their own reports
CREATE POLICY "Users can upload their own evidence reports"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'evidence_reports'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow authenticated users to read their own reports
CREATE POLICY "Users can read their own evidence reports"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'evidence_reports'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow authenticated users to update their own reports
CREATE POLICY "Users can update their own evidence reports"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'evidence_reports'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'evidence_reports'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow authenticated users to delete their own reports
CREATE POLICY "Users can delete their own evidence reports"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'evidence_reports'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Step 3: (Optional) Allow public read access if you want shared reports
-- Uncomment if you need public access
-- CREATE POLICY "Public can read evidence reports"
-- ON storage.objects
-- FOR SELECT
-- TO public
-- USING (bucket_id = 'evidence_reports');

-- ============================================
-- VERIFICATION
-- ============================================
-- Run this query to verify the bucket was created:
-- SELECT * FROM storage.buckets WHERE id = 'evidence_reports';

-- Run this query to verify the policies were created:
-- SELECT * FROM pg_policies WHERE tablename = 'objects';

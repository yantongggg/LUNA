-- Fix: Use composite unique constraint instead of single evidence_url
-- This allows the same evidence_url to be used by different users
-- But prevents duplicate (user_id, evidence_url) combinations

-- Drop the old single-column unique index if it exists
DROP INDEX IF EXISTS incident_reports_evidence_url_unique_idx;

-- Create composite unique constraint on (user_id, evidence_url)
-- This aligns with the frontend upsert logic: onConflict: 'user_id,evidence_url'
CREATE UNIQUE INDEX IF NOT EXISTS incident_reports_user_evidence_unique_idx
ON public.incident_reports(user_id, evidence_url)
WHERE evidence_url IS NOT NULL;

-- Add comment explaining the constraint
COMMENT ON INDEX public.incident_reports_user_evidence_unique_idx IS
'Ensures each user can only have one report per evidence URL. Allows multiple reports with NULL evidence_url. Allows same evidence_url for different users.';

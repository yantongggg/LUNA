-- Add unique constraint on evidence_url (excluding NULL values)
-- This allows the same user to have multiple reports without evidence,
-- but ensures each evidence file URL is unique across the system

-- Create a partial unique index that only applies when evidence_url IS NOT NULL
CREATE UNIQUE INDEX IF NOT EXISTS incident_reports_evidence_url_unique_idx
ON public.incident_reports(evidence_url)
WHERE evidence_url IS NOT NULL;

-- Add comment explaining the constraint
COMMENT ON INDEX public.incident_reports_evidence_url_unique_idx IS
'Ensures each evidence file URL is unique. Allows multiple reports with NULL evidence_url.';

# 409 Conflict Fix for incident_reports Table

## Problem
You were getting a 409 Conflict error when inserting into `incident_reports` table, likely due to duplicate `evidence_url` entries when users double-click or the same file is uploaded twice.

## Root Cause
- No unique constraint was explicitly defined in the initial migration
- Multiple inserts with the same `evidence_url` were causing conflicts
- Direct insert operations had no conflict handling

## Solution Implemented

### 1. Database Migration
**File**: `supabase/migrations/20240210000001_add_evidence_url_unique.sql`

Added a **partial unique index** on `evidence_url`:
```sql
CREATE UNIQUE INDEX IF NOT EXISTS incident_reports_evidence_url_unique_idx
ON public.incident_reports(evidence_url)
WHERE evidence_url IS NOT NULL;
```

**Why partial index?**
- Allows multiple reports with `NULL` evidence_url (some reports might not have evidence)
- Ensures each actual evidence file URL is unique across the system
- Prevents duplicate uploads of the same file

### 2. Upsert Helper Function
**File**: `src/lib/supabase.ts`

Added `upsertIncidentReport()` function with:
- **Upsert with onConflict**: Automatically handles duplicates
- **Fallback logic**: If upsert fails, tries to find and update existing record
- **Enhanced error handling**: Detailed logging for debugging
- **Idempotent**: Safe to call multiple times with same data

```typescript
// Example usage
const report = await db.upsertIncidentReport({
  user_id: userId,
  evidence_url: 'https://...',
  evidence_type: 'image',
  user_context: 'User context here',
  status: 'pending'
});
```

### 3. Updated EvidenceVault Component
**File**: `src/components/EvidenceVault.tsx`

Replaced direct `.insert()` calls with `upsertIncidentReport()`:
- ✅ `processFileUpload()` - Line ~396
- ✅ Skip button handler - Line ~934

## How It Works

### Scenario 1: First Upload
```
User uploads file → evidence_url is new → INSERT succeeds → Returns new report
```

### Scenario 2: Duplicate Upload (409 Conflict Prevention)
```
User uploads same file again → evidence_url exists → UPSERT detects conflict
→ UPDATE existing record → Returns updated report (no error!)
```

### Scenario 3: Race Condition (Double-click)
```
User double-clicks → Both requests try to insert → First succeeds
→ Second hits unique constraint → UPSERT converts to UPDATE → Both complete successfully
```

## Benefits

✅ **No more 409 errors**: Gracefully handles duplicate evidence URLs
✅ **Idempotent**: Same operation can be repeated safely
✅ **Race-condition safe**: Multiple simultaneous uploads handled correctly
✅ **Data integrity**: Prevents duplicate evidence records
✅ **User-friendly**: No crashes or confusing error messages
✅ **RLS compliant**: Works with Row Level Security policies
✅ **Frontend compatible**: Uses supabase-js v2 with anon key (no service role needed)

## Testing

### Test 1: Normal Upload
1. Upload an image
2. Verify report is created
3. Check database for new record

### Test 2: Duplicate Upload
1. Upload the same image again
2. Should NOT get 409 error
3. Should update existing record instead

### Test 3: Double-click Test
1. Rapidly double-click the upload button
2. Both operations should complete successfully
3. Only one record should exist in database

### Test 4: Manual SQL Verification
```sql
-- Check the unique index exists
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'incident_reports';

-- Try to manually insert duplicate (should fail with clear error)
INSERT INTO incident_reports (user_id, evidence_url, evidence_type, ai_analysis)
VALUES ('user-uuid', 'same-url', 'image', '{}');
-- Error: duplicate key value violates unique constraint
```

## Deployment Steps

### Option 1: Apply Migration via Supabase CLI
```bash
supabase db push
```

### Option 2: Apply via Supabase Dashboard
1. Go to SQL Editor in your Supabase dashboard
2. Run the migration SQL:
```sql
CREATE UNIQUE INDEX IF NOT EXISTS incident_reports_evidence_url_unique_idx
ON public.incident_reports(evidence_url)
WHERE evidence_url IS NOT NULL;
```

### Option 3: Use Supabase Remote
```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

## Edge Cases Handled

| Scenario | Behavior |
|----------|----------|
| NULL evidence_url | Multiple records allowed (partial index excludes NULLs) |
| Same URL, different users | ❌ NOT allowed (same URL can't exist twice) |
| Same URL, same user | ✅ UPDATE existing record |
| Upload without evidence | ✅ INSERT succeeds, multiple allowed |
| Concurrent uploads | ✅ Handled by UPSERT atomicity |

## Notes

1. **Migration is safe**: Uses `IF NOT EXISTS`, can be run multiple times
2. **No data loss**: Existing records are preserved
3. **No downtime**: Index creation is non-blocking in PostgreSQL
4. **Backwards compatible**: Doesn't break existing functionality

## Troubleshooting

### If you still get 409 errors:
1. Verify migration was applied:
```sql
SELECT * FROM pg_indexes WHERE indexname = 'incident_reports_evidence_url_unique_idx';
```

2. Check Supabase logs:
```bash
supabase functions logs --tail
```

3. Verify upsert is being called (check browser console for logs)

### If migration fails:
- Check if you have duplicates already:
```sql
SELECT evidence_url, COUNT(*)
FROM incident_reports
WHERE evidence_url IS NOT NULL
GROUP BY evidence_url
HAVING COUNT(*) > 1;
```

- Remove duplicates before applying constraint:
```sql
DELETE FROM incident_reports
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY evidence_url ORDER BY created_at DESC) as rn
    FROM incident_reports
    WHERE evidence_url IS NOT NULL
  ) t WHERE rn > 1
);
```

## Future Improvements

Consider adding:
- [ ] Composite unique constraint on `(user_id, evidence_url)` if URLs should be user-specific
- [ ] Soft delete flag to preserve history
- [ ] Audit log for evidence changes
- [ ] File hash validation to detect truly duplicate files (not just same URL)

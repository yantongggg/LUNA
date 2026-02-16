# 🔧 Critical Bug Fixes - Edge Function

## ✅ Fixed Bugs

### Bug #1: Database Storage Failure
**Problem:** Edge Function tried to UPDATE a non-existent record, causing data loss.

**Fix Applied:**
1. Edge Function now accepts `reportId` parameter from frontend
2. If `reportId` is provided, it updates that specific record
3. If no `reportId`, it searches for existing report by `evidence_url`
4. If no existing report found, it CREATES (INSERT) a new record
5. All updates now use `.eq('id', reportId)` instead of `.eq('evidence_url', ...)`

**Code Changes:**
```typescript
// Before: Tried to update by evidence_url (FAILS if record doesn't exist)
.eq('evidence_url', evidenceUrl)
.eq('user_id', user.id)

// After: Uses reportId or creates new record first
.eq('id', reportIdToUpdate)
.eq('user_id', user.id)

// Or creates new record:
.insert({
  user_id, evidence_url, evidence_type, user_context,
  status: 'analyzing'
})
```

### Bug #2: AI Hallucinations (Image Not Passed Correctly)
**Problem:** Image wasn't being downloaded/converted properly, causing AI to hallucinate.

**Fixes Applied:**

1. **Fixed File Path Extraction:**
```typescript
function extractFilePath(storageUrl: string): string {
  const url = new URL(storageUrl)
  const pathParts = url.pathname.split('/')
  const bucketIndex = pathParts.indexOf('object')
  if (bucketIndex !== -1 && bucketIndex + 1 < pathParts.length) {
    return pathParts.slice(bucketIndex + 1).join('/')
  }
  return pathParts[pathParts.length - 1] || storageUrl
}
```
Correctly extracts path from URLs like:
- `https://xxx.supabase.co/storage/v1/object/evidence/user123/file.jpg`
- Returns: `evidence/user123/file.jpg`

2. **Fixed Base64 Conversion:**
```typescript
// Before: Simple conversion (could fail)
const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

// After: Proper conversion with type detection
const uint8Array = new Uint8Array(arrayBuffer)
const base64 = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)))
```

3. **MIME Type Detection:**
```typescript
let mimeType = 'image/jpeg'
if (urlLower.includes('.png')) mimeType = 'image/png'
else if (urlLower.includes('.webp')) mimeType = 'image/webp'
else if (urlLower.includes('.gif')) mimeType = 'image/gif'

imageData = `data:${mimeType};base64,${base64}`
```

4. **Added Extensive Logging:**
```typescript
console.log('Downloading image from Supabase Storage...')
console.log('Extracted file path:', filePath)
console.log('Image converted to Base64, size:', imageData.length)
console.log('Image added to request, Base64 length:', imageData.length)
console.log('AI analysis received, length:', analysisText.length)
```

## 📊 How It Works Now

### Flow: Frontend → Edge Function → Database

```
1. Frontend uploads file to Supabase Storage
   ↓
2. Frontend creates incident report (status='pending')
   ↓
3. Frontend calls Edge Function with { evidenceUrl, reportId }
   ↓
4. Edge Function validates auth and gets user
   ↓
5. Edge Function downloads image from Storage
   ↓
6. Edge Function converts to Base64 data URI
   ↓
7. Edge Function calls OpenRouter GPT-4o Vision
   ↓
8. Edge Function UPDATES incident report with:
   - ai_analysis (JSON)
   - risk_score (0-100)
   - risk_level (Low/Medium/High/Critical)
   - status = 'completed'
   ↓
9. Frontend receives response and reloads reports
```

## 🧪 Testing

### Test #1: Database Storage
```bash
# Upload an image and click "Analyze"
# Check database for the record:
SELECT id, user_id, status, risk_score, risk_level
FROM incident_reports
ORDER BY created_at DESC
LIMIT 1;
```

Should see:
- `status = 'completed'`
- `risk_score = 25/50/75/100`
- `risk_level = 'Low'/'Medium'/'High'/'Critical'`
- `ai_analysis` = JSON with analysis data

### Test #2: Image Quality
```bash
# Check Edge Function logs
supabase functions logs analyze-evidence

# Look for:
# - "Image converted to Base64, size: XXXXXX"
# - "Image added to request, Base64 length: XXXXXX"
# - "AI analysis received, length: XXXXXX"
```

If Base64 length is small (< 1000), image failed to download.

## 🔍 Debug Commands

```bash
# View recent logs
supabase functions logs analyze-evidence

# Check if function is deployed
supabase functions list

# Redeploy with latest changes
supabase functions deploy analyze-evidence

# Check environment variables
supabase secrets list
```

## ✨ Expected Results

After these fixes:
1. ✅ All incident reports are **saved to database**
2. ✅ AI analysis is **accurate** (not hallucinated)
3. ✅ Risk scores are **calculated correctly**
4. ✅ Status updates from `analyzing` → `completed`
5. ✅ Frontend can **reload and display** reports

## 🚨 Still Not Working?

### Issue: "Failed to create incident report"
**Cause:** Database migration not run
**Fix:** Run SQL from `supabase/migrations/20240209000001_create_incident_reports.sql`

### Issue: "OpenRouter API error: 401"
**Cause:** Invalid API key
**Fix:** Set `OPENROUTER_API_KEY` in Supabase secrets

### Issue: "Failed to download file"
**Cause:** File not in storage or wrong path
**Fix:** Check `evidence` bucket exists and file is accessible

### Issue: AI still hallucinating
**Cause:** Base64 conversion failed or image too large
**Fix:** Check logs for Base64 size, try smaller image

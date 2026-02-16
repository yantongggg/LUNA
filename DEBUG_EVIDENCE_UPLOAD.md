# Debug Guide - Evidence Upload Issue

## Problem: "After add photo, nothing happens"

### Step 1: Check Browser Console

Open browser DevTools (F12) and check the Console tab. You should see:

1. When you click "Add Evidence" button:
   ```
   Add Evidence button clicked
   fileInputRef.current: <input>
   ```

2. When you select a file:
   ```
   Files selected: 1 image/jpeg
   Showing context dialog for image analysis
   showContextDialog changed: true
   ```

### Step 2: Common Issues & Fixes

#### Issue 1: Dialog not appearing
**Symptoms**: Console shows "Showing context dialog" but no modal appears

**Fix**: Check if there's a CSS z-index issue. The modal should have `z-50`.

#### Issue 2: File type not detected
**Symptoms**: Console shows `Files selected: 0` or wrong file type

**Fix**: The file might not be an image. Try with a JPG/PNG file.

#### Issue 3: Authentication error
**Symptoms**: Console shows "User not authenticated"

**Fix**:
1. Make sure Supabase auth is working
2. Check if `.env` file has correct credentials
3. Try logging out and back in

#### Issue 4: Edge Function not deployed
**Symptoms**: Console shows "Error analyzing evidence" with 404 or 500 error

**Fix**: Deploy the Edge Function:
```bash
supabase functions deploy analyze-evidence
```

#### Issue 5: Database migration not run
**Symptoms**: Error about table "incident_reports" not existing

**Fix**: Run the SQL migration in Supabase SQL Editor:
1. Go to: https://supabase.com/dashboard/project/cfncybumrvnmdbvyogkr/sql
2. Copy and run the SQL from: `supabase/migrations/20240209000001_create_incident_reports.sql`

### Step 3: Test Step-by-Step

#### Test A: Can you upload without AI analysis?
1. Click "Add Evidence"
2. Select an image
3. When dialog appears, click "Skip"
4. Should see upload feedback and file appear in list

#### Test B: Does the dialog appear?
1. Click "Add Evidence"
2. Select any image file
3. Should immediately see "AI Evidence Analysis" dialog

#### Test C: Check state in React DevTools
1. Install React DevTools browser extension
2. Go to Components tab
3. Find EvidenceVault component
4. Check these state values:
   - `showContextDialog` - should be `true` after selecting image
   - `pendingFile` - should have the File object
   - `currentUserId` - should have a UUID string

### Step 4: Manual Test Code

If nothing works, add this test button to verify file input works:

```tsx
<button
  onClick={() => {
    const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    console.log('Test file created:', testFile);
    setPendingFile(testFile);
    setShowContextDialog(true);
  }}
>
  Test Dialog (Debug)
</button>
```

### Step 5: Verify Configuration

Check these files exist and are correct:
1. `.env` - Has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
2. `src/lib/supabase.ts` - Supabase client is initialized
3. Supabase project - Database migration has been run
4. Supabase Edge Function - `analyze-evidence` is deployed

### Quick Test Commands

```bash
# Check if Supabase is configured
curl https://cfncybumrvnmdbvyogkr.supabase.co/rest/v1/

# Check Edge Function status
supabase functions list

# View Edge Function logs
supabase functions logs analyze-evidence
```

### Expected Console Output (Working Flow)

```
Add Evidence button clicked
fileInputRef.current: <input type='file'>
Files selected: 1 image/jpeg
Showing context dialog for image analysis
showContextDialog changed: true
pendingFile: IMG_1234.jpg
currentUserId: null
Checking authentication...
User authenticated: abc123-def456-...
[User clicks "Analyze Evidence"]
handleAnalyzeEvidence called
pendingFile: IMG_1234.jpg
currentUserId: abc123-def456-...
Starting analysis process...
Step 1: Uploading evidence to Supabase Storage...
✓ Evidence uploaded successfully: https://...
Step 2: Creating incident report...
✓ Incident report created: uuid-...
Step 3: Calling AI analysis Edge Function...
✓ AI analysis complete: {...}
Step 4: Reloading incident reports...
✓ Reports reloaded
✓ File added to local state
Analysis process completed
```

If you don't see this output, paste your console logs here for help!

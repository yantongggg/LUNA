# 🧠 Smart Evidence Analyzer - Setup Guide

## Overview

The **Smart Evidence Analyzer** is an AI-powered feature within Luna's Evidence Vault that uses OpenAI's GPT-4o to analyze evidence (images, audio) and generate structured legal incident reports for domestic violence survivors.

## Features

- **AI-Powered Forensic Analysis**: Analyzes visual evidence using GPT-4o Vision API
- **Risk Assessment**: Provides risk scores (Low/Medium/High/Critical) with detailed indicators
- **Legal Documentation**: Generates structured reports suitable for restraining orders and police reports
- **Abuse Category Detection**: Identifies various types of abuse (Physical, Emotional, Economic, Coercive Control, etc.)
- **Actionable Recommendations**: Provides immediate, legal, documentation, and support resource recommendations
- **Secure Storage**: All evidence encrypted with AES-256 and stored in Supabase Storage

## Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  React Frontend │ ───> │ Supabase Backend │ ───> │  OpenAI GPT-4o  │
│  EvidenceVault  │      │  Edge Function   │      │   Vision API    │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                 │
                                 v
                        ┌──────────────────┐
                        │ PostgreSQL DB    │
                        │ incident_reports │
                        └──────────────────┘
```

## Setup Instructions

### Prerequisites

1. **Supabase Project**: Already set up at `https://cfncybumrvnmdbvyogkr.supabase.co`
2. **OpenAI API Key**: Get one from https://platform.openai.com/api-keys
3. **Node.js & npm**: For running the development server

### Step 1: Database Setup

Run the SQL migration in your Supabase SQL Editor:

```bash
# Go to: https://supabase.com/dashboard/project/cfncybumrvnmdbvyogkr/sql
# Copy and run the contents of: supabase/migrations/20240209000001_create_incident_reports.sql
```

This will create:
- `incident_reports` table with RLS enabled
- `evidence` storage bucket
- Proper security policies

### Step 2: Environment Variables

1. Copy the example env file:
```bash
cp .env.example .env
```

2. Get your Supabase keys:
   - Go to: https://supabase.com/dashboard/project/cfncybumrvnmdbvyogkr/settings/api
   - Copy `anon public` key to `VITE_SUPABASE_ANON_KEY`

3. Update `.env`:
```env
VITE_SUPABASE_URL=https://cfncybumrvnmdbvyogkr.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

### Step 3: Deploy Edge Function

1. Install Supabase CLI (if not already installed):
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link to your project:
```bash
supabase link --project-ref cfncybumrvnmdbvyogkr
```

4. Set OpenAI API Key as secret:
```bash
supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
```

5. Deploy the Edge Function:
```bash
supabase functions deploy analyze-evidence
```

### Step 4: Run Development Server

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` and navigate to Evidence Vault.

## Usage Guide

### For Users

1. **Upload Evidence**:
   - Click "Add Evidence" in the Evidence Vault
   - Select an image from your device
   - Optionally add context (what happened, when, who involved)

2. **AI Analysis**:
   - Click "Analyze Evidence" to trigger AI analysis
   - Wait 10-30 seconds for the analysis to complete
   - View the detailed incident report

3. **View Reports**:
   - Scroll to "AI Analysis Reports" section
   - Click on any report to view full details
   - Export reports as text files for legal use

### Understanding the Report

- **Risk Level**: Overall danger assessment (Low/Medium/High/Critical)
- **Risk Score**: Numerical score (0-100)
- **Abuse Categories**: Types of abuse identified
- **Evidence Analysis**: Detailed observations from the evidence
- **Legal Findings**: Potential charges and evidence strength
- **Recommended Actions**: Immediate steps, legal actions, documentation needs

## API Reference

### Database Schema

```sql
incident_reports {
  id: UUID (primary key)
  user_id: UUID (foreign key to auth.users)
  evidence_url: TEXT
  evidence_type: 'image' | 'audio' | 'document'
  user_context: TEXT
  ai_analysis: JSONB
  risk_score: INTEGER (0-100)
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical'
  status: 'pending' | 'analyzing' | 'completed' | 'error'
  error_message: TEXT
  created_at: TIMESTAMPTZ
  updated_at: TIMESTAMPTZ
}
```

### Edge Function: `analyze-evidence`

**Endpoint**: `POST /functions/v1/analyze-evidence`

**Request Body**:
```json
{
  "evidenceUrl": "string",
  "userContext": "string (optional)",
  "evidenceType": "image" | "audio" | "document"
}
```

**Response**:
```json
{
  "success": true,
  "analysis": {
    "incident_summary": "string",
    "abuse_categories": ["string"],
    "risk_assessment": { ... },
    "evidence_analysis": { ... },
    "legal_findings": { ... },
    "recommended_actions": { ... },
    "follow_up_questions": ["string"],
    "disclaimer": "string"
  },
  "riskScore": 75,
  "riskLevel": "High"
}
```

## Security Features

1. **Row Level Security (RLS)**: Users can only access their own data
2. **AES-256 Encryption**: All files encrypted at rest
3. **Secure Storage**: Files stored in private Supabase Storage bucket
4. **Auth Required**: All API calls require valid authentication
5. **No Local Traces**: Evidence wiped from local device after upload

## Cost Considerations

- **OpenAI GPT-4o**: ~$0.01-0.03 per image analysis
- **Supabase Storage**: $0.021/GB stored
- **Supabase Database**: Included in free tier (up to 500MB)

## Troubleshooting

### Edge Function Not Deploying

```bash
# Check function logs
supabase functions logs analyze-evidence

# Redeploy
supabase functions deploy analyze-evidence
```

### OpenAI API Errors

- Verify API key is set correctly in Supabase secrets
- Check OpenAI account has credits
- Ensure `gpt-4o` model is available in your region

### Database Errors

- Run migration again in Supabase SQL Editor
- Check RLS policies are enabled
- Verify storage bucket exists

## Future Enhancements

- [ ] Audio evidence analysis
- [ ] Document analysis (PDF, text files)
- [ ] Batch analysis for multiple files
- [ ] Timeline view of incident reports
- [ ] Direct integration with legal aid services
- [ ] Export to PDF format
- [ ] Multi-language support

## Support

For issues or questions:
1. Check Supabase logs: Dashboard > Edge Functions > Logs
2. Review browser console for frontend errors
3. Verify environment variables are set correctly

## Disclaimer

This AI analysis tool is for informational purposes only and should be reviewed by qualified legal counsel. The recommendations provided do not constitute legal advice.

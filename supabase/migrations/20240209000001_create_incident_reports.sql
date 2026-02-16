-- Create incident_reports table for AI-generated legal evidence analysis
CREATE TABLE IF NOT EXISTS public.incident_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  evidence_url TEXT,
  evidence_type TEXT CHECK (evidence_type IN ('image', 'audio', 'document')),
  user_context TEXT,
  ai_analysis JSONB NOT NULL DEFAULT '{}'::jsonb,
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100) DEFAULT 0,
  risk_level TEXT CHECK (risk_level IN ('Low', 'Medium', 'High', 'Critical')),
  status TEXT CHECK (status IN ('pending', 'analyzing', 'completed', 'error')) DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS incident_reports_user_id_idx ON public.incident_reports(user_id);
CREATE INDEX IF NOT EXISTS incident_reports_created_at_idx ON public.incident_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS incident_reports_risk_score_idx ON public.incident_reports(risk_score);

-- Enable Row Level Security
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own incident reports
CREATE POLICY "Users can view their own incident reports"
  ON public.incident_reports
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own incident reports"
  ON public.incident_reports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own incident reports"
  ON public.incident_reports
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own incident reports"
  ON public.incident_reports
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket for evidence files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('evidence', 'evidence', false, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'audio/wav', 'audio/mpeg', 'audio/mp4', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies: Users can only upload to their own folder
CREATE POLICY "Users can upload evidence to their folder"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'evidence' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view their own evidence"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'evidence' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own evidence"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'evidence' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_incident_reports_updated_at
  BEFORE UPDATE ON public.incident_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

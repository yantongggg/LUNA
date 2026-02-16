// Supabase Client Configuration
import { createClient } from '@jsr/supabase__supabase-js'

// Environment variables - these should be set in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cfncybumrvnmdbvyogkr.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface IncidentReport {
  id: string
  user_id: string
  evidence_url: string | null
  evidence_type: 'image' | 'audio' | 'document' | null
  user_context: string | null
  ai_analysis: AIAnalysis | null
  risk_score: number
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical' | null
  status: 'pending' | 'analyzing' | 'completed' | 'error'
  error_message: string | null
  created_at: string
  updated_at: string
}

export interface AIAnalysis {
  incident_summary: string
  abuse_categories: string[]
  risk_assessment: {
    level: 'Low' | 'Medium' | 'High' | 'Critical'
    score: number
    indicators: string[]
    escalation_risk: 'None' | 'Low' | 'Medium' | 'High'
    immediate_danger: boolean
  }
  evidence_analysis: {
    visible_damage: string[]
    environmental_context: string[]
    temporal_markers: string[]
    supporting_details: string[]
  }
  legal_findings: {
    potential_charges: string[]
    evidence_strength: 'Weak' | 'Moderate' | 'Strong' | 'Conclusive'
    corroboration_needed: string[]
    documentation_adequate: boolean
  }
  recommended_actions: {
    immediate: string[]
    legal: string[]
    documentation: string[]
    support_resources: string[]
  }
  follow_up_questions: string[]
  disclaimer: string
}

// Database helper functions
export const db = {
  // Incident Reports
  async createIncidentReport(data: {
    user_id: string
    evidence_url?: string
    evidence_type?: 'image' | 'audio' | 'document'
    user_context?: string
  }) {
    const { data: report, error } = await supabase
      .from('incident_reports')
      .insert({
        user_id: data.user_id,
        evidence_url: data.evidence_url || null,
        evidence_type: data.evidence_type || null,
        user_context: data.user_context || null,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error
    return report as IncidentReport
  },

  // Upsert incident report (conflict-safe insert/update)
  async upsertIncidentReport(data: {
    user_id: string
    evidence_url?: string
    evidence_type?: 'image' | 'audio' | 'document'
    user_context?: string
    ai_analysis?: any
    risk_score?: number
    risk_level?: 'Low' | 'Medium' | 'High' | 'Critical'
    status?: 'pending' | 'analyzing' | 'completed' | 'error'
  }) {
    // Use upsert with onConflict to handle duplicate evidence_url
    // If evidence_url exists, update the record; otherwise insert new
    const { data: report, error } = await supabase
      .from('incident_reports')
      .upsert(
        {
          user_id: data.user_id,
          evidence_url: data.evidence_url || null,
          evidence_type: data.evidence_type || null,
          user_context: data.user_context || null,
          ai_analysis: data.ai_analysis || {},
          risk_score: data.risk_score ?? 0,
          risk_level: data.risk_level || null,
          status: data.status || 'pending',
        },
        {
          onConflict: 'user_id,evidence_url',
          ignoreDuplicates: false, // Update on conflict
        }
      )
      .select()
      .single()

    if (error) {
      // Enhanced error logging for debugging
      console.error('Upsert error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      })

      // If upsert fails on conflict, try a different approach
      if (error.code === '23505') {
        // Unique violation - try to find and update existing record
        console.log('Conflict detected, attempting to fetch existing record...')

        const { data: existing, error: fetchError } = await supabase
          .from('incident_reports')
          .select('*')
          .eq('evidence_url', data.evidence_url)
          .eq('user_id', data.user_id)
          .maybeSingle()

        if (existing && !fetchError) {
          // Update existing record
          const { data: updated, error: updateError } = await supabase
            .from('incident_reports')
            .update({
              user_context: data.user_context || existing.user_context,
              ai_analysis: data.ai_analysis || existing.ai_analysis,
              risk_score: data.risk_score ?? existing.risk_score,
              risk_level: data.risk_level || existing.risk_level,
              status: data.status || existing.status,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id)
            .select()
            .single()

          if (updateError) throw updateError
          return updated as IncidentReport
        }
      }

      throw error
    }

    return report as IncidentReport
  },

  async getIncidentReports(userId: string) {
    const { data, error } = await supabase
      .from('incident_reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as IncidentReport[]
  },

  async getIncidentReport(id: string) {
    const { data, error } = await supabase
      .from('incident_reports')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as IncidentReport
  },

  async updateIncidentReport(
    id: string,
    updates: Partial<IncidentReport>
  ) {
    const { data, error } = await supabase
      .from('incident_reports')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as IncidentReport
  },

  async deleteIncidentReport(id: string) {
    const { error } = await supabase
      .from('incident_reports')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Storage
  async uploadEvidence(
    userId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ path: string; url: string }> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    const filePath = fileName

    const { data, error } = await supabase.storage
      .from('evidence')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from('evidence')
      .getPublicUrl(filePath)

    return {
      path: filePath,
      url: urlData.publicUrl,
    }
  },

  async deleteEvidence(path: string) {
    const { error } = await supabase.storage
      .from('evidence')
      .remove([path])

    if (error) throw error
  },

  async getEvidenceUrl(path: string) {
    const { data } = supabase.storage
      .from('evidence')
      .getPublicUrl(path)

    return data.publicUrl
  },
}

// Edge Function helpers
export const edgeFunctions = {
  async analyzeEvidence(params: {
    evidenceUrl: string
    userContext?: string
    evidenceType: 'image' | 'audio' | 'document'
    reportId?: string
    userId?: string
  }) {
    // Use direct fetch instead of supabase.functions.invoke()
    // Reason: invoke() forces supabase-js auth logic which causes 401 for anonymous users
    const { data: { session } } = await supabase.auth.getSession()

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'apikey': supabaseAnonKey, // Always include anon key
    }

    // Only add Authorization if user is logged in
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/analyze-evidence`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(params),
      }
    )

    // Handle non-2xx responses
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Edge function error (${response.status}): ${errorText}`
      )
    }

    return await response.json()
  },
}

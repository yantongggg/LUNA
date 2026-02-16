// Supabase Edge Function: Smart Evidence Analyzer
// Analyzes evidence (images/audio) using OpenRouter GPT-4o for forensic analysis
//
// ============================================================
// DUAL AUTHENTICATION MODE
// ============================================================
// 1. USER-AUTHENTICATED MODE:
//    - Requires valid Supabase user JWT in Authorization header
//    - Validates via userClient.auth.getUser()
//    - Extracts user.id from JWT
//
// 2. ANONYMOUS/DEV MODE:
//    - No valid user JWT required
//    - Accepts anon key OR missing Authorization
//    - Uses userId from request body if valid UUID
//    - Generates UUID if userId invalid/missing
//    - All DB ops use adminClient (service role) to bypass RLS
//
// Detection: isJwtLike(token) && getUser() succeeds → user mode
//            otherwise → anonymous mode
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

// System prompt for Forensic Analyst AI
const FORENSIC_ANALYST_SYSTEM_PROMPT = `You are 'Luna', an AI Forensic Analyst and Domestic Violence Safety Expert.
Your task is to analyze an image (evidence) and user notes to identify patterns of abuse and structure them for legal use.

CRITICAL: Output strictly valid JSON with this structure (no markdown formatting, no code blocks):
{
  "incident_summary": "Objective 1-sentence summary of the event.",
  "abuse_categories": ["Physical", "Emotional", "Economic", "Coercive Control", "Verbal", "Sexual", "Digital", "Stalking", "Neglect", "Other"],
  "risk_assessment": {
    "level": "Low" | "Medium" | "High" | "Critical",
    "score": 0-100,
    "indicators": ["specific observed indicators"],
    "escalation_risk": "None" | "Low" | "Medium" | "High",
    "immediate_danger": boolean
  },
  "evidence_analysis": {
    "visible_damage": ["description of any visible injuries, damage, or concerning elements"],
    "environmental_context": ["description of environment, location, setting"],
    "temporal_markers": ["any time/date indicators visible in evidence"],
    "supporting_details": ["additional forensic observations"]
  },
  "legal_findings": {
    "potential_charges": ["relevant legal classifications based on evidence"],
    "evidence_strength": "Weak" | "Moderate" | "Strong" | "Conclusive",
    "corroboration_needed": ["what additional evidence would strengthen the case"],
    "documentation_adequate": boolean
  },
  "recommended_actions": {
    "immediate": ["immediate safety recommendations"],
    "legal": ["recommended legal actions"],
    "documentation": ["what additional documentation to gather"],
    "support_resources": ["types of support services to contact"]
  },
  "follow_up_questions": ["important clarifying questions for the user"],
  "disclaimer": "Standard legal disclaimer about AI limitations and need for professional legal counsel"
}

GUIDELINES:
- Be objective and factual in your analysis
- Focus on visible evidence and user-provided context
- Use precise legal and medical terminology where appropriate
- Avoid speculation; state what is observable
- Prioritize user safety in all recommendations
- Include appropriate disclaimers about AI limitations
- If image is unclear or insufficient, state so clearly
- Maintain professional, supportive tone
- Consider patterns of abuse, not just isolated incidents
- Identify power imbalances, control tactics, or coercion indicators`

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Check if token looks like JWT (3 parts separated by dots)
 * Note: This is a heuristic, not cryptographic validation
 */
function isJwtLike(token: string): boolean {
  return token.split('.').length === 3
}

/**
 * Validate if string is a valid UUID v4 format
 * Required for database user_id column (UUID type)
 */
function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

/**
 * Safe token logging - never expose full token
 */
function safeTokenInfo(token: string): string {
  if (!token || token.length < 12) return "(none or too short)"
  return `${token.slice(0, 12)}... len=${token.length}`
}

/**
 * Extract file path from Supabase Storage URL
 */
function extractFilePath(storageUrl: string): string {
  try {
    const url = new URL(storageUrl)
    const parts = url.pathname.split("/")
    const bucketIndex = parts.indexOf("object")
    if (bucketIndex !== -1 && bucketIndex + 1 < parts.length) {
      return parts.slice(bucketIndex + 1).join("/")
    }
    return parts[parts.length - 1] || storageUrl
  } catch {
    return storageUrl
  }
}

/**
 * Safe base64 encoding for large binary (avoid call stack overflow)
 */
function uint8ToBase64(u8: Uint8Array): string {
  const CHUNK = 0x8000
  let binary = ""
  for (let i = 0; i < u8.length; i += CHUNK) {
    const chunk = u8.subarray(i, i + CHUNK)
    binary += String.fromCharCode(...chunk)
  }
  return btoa(binary)
}

// ============================================================
// MAIN HANDLER
// ============================================================

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // ============================================================
    // PARSE REQUEST BODY
    // ============================================================
    let body: any
    try {
      body = await req.json()
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const { evidenceUrl, userContext, evidenceType, reportId, userId } = body

    // Validate required fields
    if (!evidenceUrl) {
      return new Response(
        JSON.stringify({ success: false, error: "evidenceUrl is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // ============================================================
    // ENVIRONMENT SETUP
    // ============================================================
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? ""
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY") ?? ""

    if (!SUPABASE_URL || !ANON_KEY || !SERVICE_ROLE_KEY) {
      console.error("[analyze-evidence] Missing Supabase environment variables")
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    if (!OPENROUTER_API_KEY) {
      console.error("[analyze-evidence] OPENROUTER_API_KEY not configured")
      return new Response(
        JSON.stringify({ success: false, error: "OPENROUTER_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // ============================================================
    // CLIENT SETUP
    // ============================================================
    // adminClient: Service role for DB/Storage operations (bypasses RLS)
    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    // userClient: For validating user JWT only (not used for DB ops)
    const authHeader = req.headers.get("Authorization") ?? ""
    const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : ""

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    })

    // ============================================================
    // AUTHENTICATION LOGIC
    // ============================================================
    let authMode: "user" | "anonymous" = "anonymous"
    let effectiveUserId: string | null = null

    console.log("[analyze-evidence] === REQUEST START ===")
    console.log("[analyze-evidence] evidenceUrl:", evidenceUrl)
    console.log("[analyze-evidence] evidenceType:", evidenceType ?? "image")
    console.log("[analyze-evidence] reportId:", reportId ?? "(none)")
    console.log("[analyze-evidence] userId from body:", userId ?? "(none)")
    console.log("[analyze-evidence] authHeader:", bearer ? safeTokenInfo(bearer) : "none")

    // Try user-authenticated mode if token looks like JWT
    if (bearer && isJwtLike(bearer)) {
      console.log("[analyze-evidence] Token looks like JWT, attempting validation...")

      try {
        const { data, error } = await userClient.auth.getUser(bearer)

        if (!error && data?.user?.id) {
          authMode = "user"
          effectiveUserId = data.user.id
          console.log("[analyze-evidence] ✓ USER-AUTHENTICATED MODE")
          console.log("[analyze-evidence] User ID:", effectiveUserId)
        } else {
          console.log("[analyze-evidence] JWT validation failed:", error?.message ?? "Unknown")
          console.log("[analyze-evidence] Falling back to anonymous mode...")
        }
      } catch (err) {
        console.log("[analyze-evidence] JWT validation threw error:", err)
        console.log("[analyze-evidence] Falling back to anonymous mode...")
      }
    } else if (bearer) {
      console.log("[analyze-evidence] Token does not look like JWT (likely anon key)")
      console.log("[analyze-evidence] Using anonymous mode...")
    } else {
      console.log("[analyze-evidence] No Authorization header, using anonymous mode...")
    }

    // Anonymous mode: Use userId from body if valid UUID, otherwise generate
    if (!effectiveUserId) {
      authMode = "anonymous"
      console.log("[analyze-evidence] ✓ ANONYMOUS/DEV MODE")

      if (typeof userId === "string" && isUuid(userId)) {
        effectiveUserId = userId
        console.log("[analyze-evidence] Using userId from body:", effectiveUserId)
      } else {
        effectiveUserId = crypto.randomUUID()
        console.log("[analyze-evidence] Generated new UUID:", effectiveUserId)
        console.log("[analyze-evidence] ⚠ TIP: Provide stable userId in body for better data isolation")
      }
    }

    console.log("[analyze-evidence] Final auth mode:", authMode)
    console.log("[analyze-evidence] Effective user ID:", effectiveUserId)
    console.log("[analyze-evidence] ==============================")

    // ============================================================
    // FIND OR CREATE REPORT
    // ============================================================
    let reportIdToUse = reportId as string | undefined

    if (!reportIdToUse) {
      // Check for existing report by (user_id, evidence_url)
      // Uses composite unique constraint
      const { data: existing, error: findError } = await adminClient
        .from("incident_reports")
        .select("id")
        .eq("user_id", effectiveUserId)
        .eq("evidence_url", evidenceUrl)
        .maybeSingle()

      if (findError) {
        console.error("[analyze-evidence] Error finding existing report:", findError)
      }

      if (existing?.id) {
        reportIdToUse = existing.id
        console.log("[analyze-evidence] Found existing report:", reportIdToUse)
      } else {
        // Create new report
        console.log("[analyze-evidence] Creating new incident report...")
        const { data: created, error: createError } = await adminClient
          .from("incident_reports")
          .insert({
            user_id: effectiveUserId,
            evidence_url: evidenceUrl,
            evidence_type: evidenceType ?? "image",
            user_context: userContext ?? null,
            status: "analyzing",
            risk_score: 0,
            risk_level: null,
            ai_analysis: {},
          })
          .select("id")
          .single()

        if (createError) {
          console.error("[analyze-evidence] Error creating report:", createError)
          return new Response(
            JSON.stringify({ success: false, error: `Failed to create report: ${createError.message}` }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          )
        }

        reportIdToUse = created.id
        console.log("[analyze-evidence] Created new report:", reportIdToUse)
      }
    }

    // ============================================================
    // DOWNLOAD & ENCODE IMAGE
    // ============================================================
    let imageData: string | null = null

    if (evidenceUrl.includes("supabase.co")) {
      console.log("[analyze-evidence] Downloading image from Supabase Storage...")
      const filePath = extractFilePath(evidenceUrl)
      console.log("[analyze-evidence] Extracted file path:", filePath)

      const { data: fileData, error: fileError } = await adminClient
        .storage
        .from("evidence")
        .download(filePath)

      if (fileError) {
        console.error("[analyze-evidence] Error downloading file:", fileError)

        // Update report status to error
        await adminClient
          .from("incident_reports")
          .update({ status: "error", error_message: `Failed to download file: ${fileError.message}` })
          .eq("id", reportIdToUse)

        return new Response(
          JSON.stringify({ success: false, error: `Failed to download file: ${fileError.message}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }

      if (!fileData) {
        console.error("[analyze-evidence] File data is empty")
        return new Response(
          JSON.stringify({ success: false, error: "File data is empty" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }

      const arrayBuffer = await fileData.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)

      // Detect MIME type
      let mimeType = "image/jpeg"
      const urlLower = evidenceUrl.toLowerCase()
      if (urlLower.includes(".png")) mimeType = "image/png"
      else if (urlLower.includes(".webp")) mimeType = "image/webp"
      else if (urlLower.includes(".gif")) mimeType = "image/gif"

      const base64 = uint8ToBase64(uint8Array)
      imageData = `data:${mimeType};base64,${base64}`

      console.log("[analyze-evidence] Image converted to Base64, size:", imageData.length, "chars")
    }

    // ============================================================
    // CALL OPENROUTER API
    // ============================================================
    const messages: any[] = [{ role: "system", content: FORENSIC_ANALYST_SYSTEM_PROMPT }]

    const userPrompt = userContext
      ? `User Context: ${userContext}\n\nPlease analyze this evidence and provide a forensic assessment for legal documentation purposes.`
      : "Please analyze this evidence and provide a forensic assessment for legal documentation purposes."

    messages.push({ role: "user", content: userPrompt })

    // Add image if available
    if (imageData && (evidenceType ?? "image") === "image") {
      messages[1].content = [
        { type: "text", text: userPrompt },
        { type: "image_url", image_url: { url: imageData, detail: "high" } },
      ]
    }

    console.log("[analyze-evidence] Calling OpenRouter API (model: openai/gpt-4o)...")

    const openrouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://luna-safety.app",
        "X-Title": "Luna Safety App",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages,
        max_tokens: 3000,
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    })

    if (!openrouterResponse.ok) {
      const errorText = await openrouterResponse.text()
      console.error("[analyze-evidence] OpenRouter API error:", openrouterResponse.status, errorText)

      // Update report status to error
      await adminClient
        .from("incident_reports")
        .update({
          status: "error",
          error_message: `OpenRouter error: ${openrouterResponse.status} - ${errorText}`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", reportIdToUse)

      return new Response(
        JSON.stringify({
          success: false,
          error: `OpenRouter API error: ${openrouterResponse.status}`,
          details: errorText
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const openrouterData = await openrouterResponse.json()
    const analysisText = openrouterData.choices?.[0]?.message?.content

    if (!analysisText) {
      console.error("[analyze-evidence] No analysis content returned from AI")

      await adminClient
        .from("incident_reports")
        .update({ status: "error", error_message: "No AI content returned" })
        .eq("id", reportIdToUse)

      return new Response(
        JSON.stringify({ success: false, error: "No AI content returned" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Parse AI response
    let analysisData: any
    try {
      analysisData = typeof analysisText === "string" ? JSON.parse(analysisText) : analysisText
    } catch (parseError) {
      console.error("[analyze-evidence] Failed to parse AI response:", analysisText?.slice?.(0, 200))

      await adminClient
        .from("incident_reports")
        .update({ status: "error", error_message: "AI returned non-JSON" })
        .eq("id", reportIdToUse)

      return new Response(
        JSON.stringify({ success: false, error: "AI returned non-JSON" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Extract risk level
    const riskLevel = analysisData?.risk_assessment?.level || "Medium"
    const riskScoreMap: Record<string, number> = { Low: 25, Medium: 50, High: 75, Critical: 100 }
    const riskScore = riskScoreMap[riskLevel] ?? 50

    // ============================================================
    // UPDATE REPORT WITH RESULTS
    // ============================================================
    const { error: updateError } = await adminClient
      .from("incident_reports")
      .update({
        ai_analysis: analysisData,
        risk_score: riskScore,
        risk_level: riskLevel,
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", reportIdToUse)

    if (updateError) {
      console.error("[analyze-evidence] Error saving analysis:", updateError)
      // Don't return error - analysis succeeded, just DB update failed
    }

    console.log("[analyze-evidence] ✓ Analysis completed successfully")
    console.log("[analyze-evidence] Report ID:", reportIdToUse)
    console.log("[analyze-evidence] Risk Level:", riskLevel)
    console.log("[analyze-evidence] Risk Score:", riskScore)

    // ============================================================
    // RETURN SUCCESS RESPONSE
    // ============================================================
    return new Response(
      JSON.stringify({
        success: true,
        authMode,
        effectiveUserId,
        reportId: reportIdToUse,
        analysis: analysisData,
        riskScore,
        riskLevel,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (error: any) {
    console.error("[analyze-evidence] === UNHANDLED ERROR ===")
    console.error("[analyze-evidence] Error:", error?.message ?? error)
    console.error("[analyze-evidence] Stack:", error?.stack)

    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message ?? "An unexpected error occurred"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})

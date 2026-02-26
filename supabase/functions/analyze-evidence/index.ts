// Supabase Edge Function: Smart Evidence Analyzer (DEMO VERSION - NO AUTH)
// Analyzes evidence (images/audio) using OpenRouter GPT-4o for forensic analysis

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

// System prompt for Forensic AI Analyst
const FORENSIC_ANALYST_SYSTEM_PROMPT = `You are a Forensic AI Analyst trained to analyze evidence for domestic violence incident reports intended for law enforcement (PDRM - Royal Malaysia Police).

Your analysis must be:
- OBJECTIVE: State only what is visibly observable in the evidence
- CLINICAL: Use professional, forensic terminology
- PRECISE: Avoid speculation, opinion, or emotional language
- LEGALLY SOUND: Focus on facts that would be admissible in court

CRITICAL OUTPUT REQUIREMENTS:
1. You MUST return ONLY valid JSON - no markdown, no code blocks, no conversational text
2. Do NOT wrap your response in \`\`\`json or \`\`\` markers
3. Start your response immediately with the opening curly brace {
4. End your response with the closing curly brace }
5. Do not include any text before or after the JSON

Return your analysis in this exact JSON format:
{
  "incident_summary": "Objective 1-sentence summary of the incident based on visible evidence",
  "clinical_observations": ["list of objective, clinically documented findings"],
  "risk_level": "Low" | "Medium" | "High" | "Critical",
  "risk_score": 0-100,
  "recommendations": ["specific, actionable recommendations for victim safety and legal action"],
  "abuse_categories": ["Physical", "Emotional", "Economic", "Coercive Control", "Verbal", "Sexual", "Digital", "Stalking", "Neglect", "Other"],
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
    "documentation_adequate": true/false
  },
  "recommended_actions": {
    "immediate": ["immediate safety recommendations"],
    "legal": ["recommended legal actions"],
    "documentation": ["what additional documentation to gather"],
    "support_resources": ["types of support services to contact"]
  },
  "follow_up_questions": ["important clarifying questions for the victim"]
}

ANALYSIS GUIDELINES:
1. Document visible injuries, damage, or concerning elements objectively
2. Note environmental context (location conditions, signs of struggle, etc.)
3. Identify temporal markers (dates, times, sequence indicators)
4. Assess evidence strength for legal proceedings
5. Recommend specific corroborating evidence needed
6. Suggest immediate, legal, documentation, and support actions
7. Maintain professional, clinical tone throughout

REMEMBER: Output ONLY the raw JSON object. No markdown formatting, no code blocks, no additional text.`;

// Extract file path from storage URL
function extractFilePath(storageUrl: string): string {
  try {
    const url = new URL(storageUrl)
    // 解码路径（防止文件名有空格等特殊字符）
    const path = decodeURIComponent(url.pathname)
    
    // 情况 1: 标准公开 URL (.../public/evidence/folder/file.jpg)
    // 我们只需要 folder/file.jpg
    if (path.includes("/public/evidence/")) {
      return path.split("/public/evidence/")[1]
    }
    
    // 情况 2: 签名私有 URL (.../sign/evidence/folder/file.jpg)
    if (path.includes("/sign/evidence/")) {
      return path.split("/sign/evidence/")[1]
    }

    // 情况 3: 最后的保底方案
    // 如果路径里包含 "evidence/"，取它后面的所有内容
    const parts = path.split("/")
    const bucketIndex = parts.indexOf("evidence")
    if (bucketIndex !== -1 && bucketIndex + 1 < parts.length) {
      return parts.slice(bucketIndex + 1).join("/")
    }
    
    return path
  } catch {
    return storageUrl
  }
}

// Safe base64 encoding for large binary
function uint8ToBase64(u8: Uint8Array): string {
  const CHUNK = 0x8000
  let binary = ""
  for (let i = 0; i < u8.length; i += CHUNK) {
    const chunk = u8.subarray(i, i + CHUNK)
    binary += String.fromCharCode(...chunk)
  }
  return btoa(binary)
}

/**
 * Sanitize and extract JSON from AI response
 * Handles Markdown code blocks, trailing text, and common formatting issues
 */
function sanitizeAndExtractJSON(rawText: string): string {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Empty or invalid response from AI');
  }

  let cleaned = rawText.trim();

  // Remove markdown code blocks: ```json and ```
  cleaned = cleaned.replace(/```json\s*/gi, '');
  cleaned = cleaned.replace(/```\s*/g, '');

  // Remove any other markdown-style code blocks
  cleaned = cleaned.replace(/^```\s*([\s\S]*?)\s*```$/g, '$1');

  // Try to extract JSON using regex (find first { to last })
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // Trim again and return
  return cleaned.trim();
}

/**
 * Parse AI response with robust error handling
 */
function parseAIResponse(rawText: string): any {
  console.log('Raw AI response (first 300 chars):', rawText.slice(0, 300));

  // First attempt: Direct parse
  try {
    return JSON.parse(rawText);
  } catch (directError) {
    console.log('Direct JSON parse failed, attempting sanitization...');
  }

  // Second attempt: Sanitize and parse
  try {
    const sanitized = sanitizeAndExtractJSON(rawText);
    console.log('Sanitized JSON (first 300 chars):', sanitized.slice(0, 300));
    return JSON.parse(sanitized);
  } catch (sanitizeError) {
    console.error('Sanitization also failed:', sanitizeError);
    console.error('Full raw response:', rawText);
    throw new Error(`Invalid JSON response from AI. Could not extract valid JSON from response.`);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  let userIdToUse: string | undefined
  let reportIdToUpdate: string | undefined

  // Create Admin Client (Service Role) - God Mode, ignores RLS
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? ""
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""

  // Always use adminClient for everything
  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  try {
    // Parse request body
    let requestBody: any
    try {
      requestBody = await req.json()
    } catch (e) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid request body. Please provide valid JSON." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      )
    }

    const { evidenceUrl, userContext, evidenceType, reportId, userId } = requestBody

    if (!evidenceUrl) {
      return new Response(
        JSON.stringify({ success: false, error: "evidenceUrl is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      )
    }

    console.log("Analyzing evidence (DEMO MODE):", { evidenceUrl, evidenceType, reportId, userId })

    // --- AUTH BYPASS (Modified for Demo) ---
    // Instead of checking the Token, we simply trust the userId sent by the frontend.
    // If no userId is sent, we use the fallback ID we fixed earlier.
    
    if (userId) {
        userIdToUse = userId
    } else {
        // Fallback to the ID we manually inserted into the DB, just in case
        userIdToUse = "edf52eda-c0bf-46e0-b03c-23ef4131578f" 
    }
    
    console.log("Using User ID (Skipped Auth Check):", userIdToUse)

    // --- Find/create report ---
    reportIdToUpdate = reportId

    if (!reportIdToUpdate) {
      // Use adminClient to bypass RLS
      const { data: existingReport } = await adminClient
        .from("incident_reports")
        .select("id")
        .eq("evidence_url", evidenceUrl)
        .eq("user_id", userIdToUse)
        .single()

      if (existingReport) {
        reportIdToUpdate = existingReport.id
        console.log("Found existing report:", reportIdToUpdate)
      } else {
        console.log("Creating new incident report...")
        const { data: newReport, error: createError } = await adminClient
          .from("incident_reports")
          .insert({
            user_id: userIdToUse,
            evidence_url: evidenceUrl,
            evidence_type: evidenceType || "image",
            user_context: userContext || null,
            status: "analyzing",
            risk_score: 0,
            risk_level: null,
            ai_analysis: {},
          })
          .select("id")
          .single()

        if (createError) {
          console.error("Error creating report:", createError)
          throw new Error(`Failed to create incident report: ${createError.message}`)
        }

        reportIdToUpdate = newReport.id
        console.log("Created new report:", reportIdToUpdate)
      }
    }

    // --- Download + base64 image ---
    let imageData: string | null = null

    if (evidenceUrl.includes("supabase.co")) {
      console.log("Downloading image from Supabase Storage...")
      const filePath = extractFilePath(evidenceUrl)
      
      // Use adminClient to download (bypasses storage policies)
      const { data: fileData, error: fileError } = await adminClient
        .storage
        .from("evidence")
        .download(filePath)

      if (fileError) {
        console.error("Error downloading file:", fileError)
        throw new Error(`Failed to download file: ${fileError.message}`)
      }
      if (!fileData) throw new Error("File data is empty")

      const arrayBuffer = await fileData.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)

      let mimeType = "image/jpeg"
      const urlLower = evidenceUrl.toLowerCase()
      if (urlLower.includes(".png")) mimeType = "image/png"
      else if (urlLower.includes(".webp")) mimeType = "image/webp"
      else if (urlLower.includes(".gif")) mimeType = "image/gif"

      const base64 = uint8ToBase64(uint8Array)
      imageData = `data:${mimeType};base64,${base64}`

      console.log("Image converted to Base64, size:", imageData.length)
    }

    // --- OpenRouter API (using Google Gemini 2.0 Flash via OpenRouter) ---
    const openrouterApiKey = Deno.env.get("OPENROUTER_API_KEY")
    if (!openrouterApiKey) throw new Error("OPENROUTER_API_KEY is not configured")

    console.log("Using OpenRouter with Gemini 2.0 Flash for analysis...")

    // Build messages with Forensic Analyst persona
    const messages: any[] = [{ role: "system", content: FORENSIC_ANALYST_SYSTEM_PROMPT }];

    // Build user prompt for forensic analysis
    let userPrompt = userContext
      ? `Victim Statement: "${userContext}"\n\n`
      : "No victim statement provided.\n\n";

    userPrompt += "Analyze the attached evidence and provide a comprehensive forensic assessment following the JSON schema specified. Focus on objective, clinically documented findings suitable for law enforcement reporting.";

    // Build content based on type
    if (imageData && evidenceType === "image") {
      // Image mode: send text + image
      messages.push({
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          { type: "image_url", image_url: { url: imageData, detail: "high" } },
        ]
      });
    } else {
      // Audio or text-only mode
      messages.push({
        role: "user",
        content: userPrompt
      });
    }


    // Call OpenRouter API with Gemini 2.5 Flash
    const openrouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openrouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://luna-safety.app",
        "X-Title": "Luna Forensic AI - Evidence Analysis",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        max_tokens: 4000,  // Increased from 800 to prevent truncation of complex JSON responses
        temperature: 0.7,  // Slightly lower for more consistent forensic analysis
        response_format: { type: "json_object" },
      }),
    })

    if (!openrouterResponse.ok) {
      const errorText = await openrouterResponse.text()
      console.error("OpenRouter API error:", errorText)
      throw new Error(`OpenRouter API error: ${openrouterResponse.status} - ${errorText}`)
    }

    const openrouterData = await openrouterResponse.json()
    const analysisText = openrouterData.choices?.[0]?.message?.content
    if (!analysisText) throw new Error("No analysis returned from AI")

    // Parse AI response with robust sanitization
    let analysisData: any
    try {
      analysisData = parseAIResponse(analysisText)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      throw parseError
    }

    // Extract risk level from forensic analysis
    const riskLevel = analysisData?.risk_level || "Medium"
    const riskScore = analysisData?.risk_score || 50

    // Map the new forensic JSON structure to maintain compatibility
    // The frontend expects ai_analysis in a specific format
    const formattedAnalysis = {
      incident_summary: analysisData?.incident_summary || "No summary provided.",
      clinical_observations: analysisData?.clinical_observations || [],
      abuse_categories: analysisData?.abuse_categories || [],
      risk_assessment: {
        level: riskLevel,
        score: riskScore,
        indicators: analysisData?.clinical_observations || [],
        escalation_risk: riskLevel === "High" || riskLevel === "Critical" ? "High" : "Medium",
        immediate_danger: riskLevel === "Critical"
      },
      evidence_analysis: analysisData?.evidence_analysis || {
        visible_damage: [],
        environmental_context: [],
        temporal_markers: [],
        supporting_details: []
      },
      legal_findings: analysisData?.legal_findings || {
        potential_charges: [],
        evidence_strength: "Moderate",
        corroboration_needed: [],
        documentation_adequate: false
      },
      recommended_actions: analysisData?.recommended_actions || {
        immediate: [],
        legal: [],
        documentation: [],
        support_resources: []
      },
      follow_up_questions: analysisData?.follow_up_questions || [],
      recommendations: analysisData?.recommendations || []
    }

    // Save results using adminClient
    const { error: updateError } = await adminClient
      .from("incident_reports")
      .update({
        ai_analysis: formattedAnalysis,
        risk_score: riskScore,
        risk_level: riskLevel,
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", reportIdToUpdate)
      .eq("user_id", userIdToUse)

    if (updateError) {
      console.error("Error saving analysis:", updateError)
      throw new Error(`Failed to save analysis: ${updateError.message}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        reportId: reportIdToUpdate,
        analysis: formattedAnalysis,
        riskScore,
        riskLevel,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  } catch (error: any) {
    console.error("Error in analyze-evidence function:", error)

    // best-effort update report status
    try {
      if (reportIdToUpdate && userIdToUse) {
        await adminClient
          .from("incident_reports")
          .update({
            status: "error",
            error_message: error?.message ?? String(error),
            updated_at: new Date().toISOString(),
          })
          .eq("id", reportIdToUpdate)
          .eq("user_id", userIdToUse)
      }
    } catch (e) {
      console.error("Error updating failure status:", e)
    }

    const msg = error?.message ?? "An unexpected error occurred"
    // Always return 400 for errors now, since 401 (Auth) is basically disabled
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  }
})

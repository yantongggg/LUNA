// Supabase Edge Function: Generate Voice (Azure Cognitive Services TTS)
// Converts text to highly realistic speech using Microsoft Azure Neural TTS.
// Returns raw MP3 audio bytes for direct playback on the frontend.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

// ─── Voice Config ──────────────────────────────────────────────────────────────
// en-MY-WilliamNeural: Malaysian English male — warm local accent with Manglish-friendly intonation.
const VOICE_CANDIDATES = [
  { name: "en-MY-WilliamNeural", lang: "en-MY" },   // Malaysian English male (primary)
  { name: "en-US-GuyNeural",     lang: "en-US" },   // US English male (fallback)
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Escape XML special characters so text is safe inside SSML */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

/** Sanitize input: trim, collapse whitespace, remove control characters and double-dots */
function sanitizeText(raw: string): string {
  return raw
    .trim()
    .replace(/[\.]{2,}/g, ".")     // collapse double/triple dots into single period
    .replace(/[…]/g, ".")           // replace ellipsis unicode char with period
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // strip control chars
    .replace(/\s+/g, " ") // collapse whitespace
}

/** Build SSML string — peppy bro voice, close-range phone call */
function buildSsml(escapedText: string, voiceName: string, lang: string): string {
  return `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${lang}'><voice name='${voiceName}'><prosody rate='1.15' pitch='-2%'>${escapedText}</prosody></voice></speak>`
}

// ─── Types ─────────────────────────────────────────────────────────────────────
interface VoiceRequest {
  text: string
}

// ─── Handler ───────────────────────────────────────────────────────────────────
serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders })
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  try {
    // ─── Validate environment secrets ────────────────────────────────────────
    const AZURE_TTS_API_KEY = Deno.env.get("AZURE_TTS_API_KEY")
    const AZURE_TTS_REGION = Deno.env.get("AZURE_TTS_REGION")

    if (!AZURE_TTS_API_KEY) {
      throw new Error("AZURE_TTS_API_KEY is not configured. Set it in Supabase Edge Function secrets.")
    }
    if (!AZURE_TTS_REGION) {
      throw new Error("AZURE_TTS_REGION is not configured. Set it in Supabase Edge Function secrets.")
    }

    // ─── Parse and validate request body ─────────────────────────────────────
    const body: VoiceRequest = await req.json()
    const { text } = body

    if (!text || typeof text !== "string" || !text.trim()) {
      return new Response(JSON.stringify({ error: "Missing or empty 'text' field" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const cleanText = sanitizeText(text)
    const escapedText = escapeXml(cleanText)

    console.log("[generate-voice] 🎙️ Text:", cleanText.substring(0, 80) + (cleanText.length > 80 ? "..." : ""))
    console.log("[generate-voice] Region:", AZURE_TTS_REGION)
    console.log("[generate-voice] Escaped:", escapedText.substring(0, 80))

    // ─── Azure TTS endpoint ──────────────────────────────────────────────────
    const endpoint = `https://${AZURE_TTS_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`

    // ─── Try each voice candidate until one works ────────────────────────────
    let lastError = ""
    for (const voice of VOICE_CANDIDATES) {
      const ssml = buildSsml(escapedText, voice.name, voice.lang)

      console.log(`[generate-voice] 📡 Trying voice: ${voice.name} (${voice.lang})`)
      console.log("[generate-voice] SSML:", ssml.substring(0, 250))

      const azureResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_TTS_API_KEY,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
          "User-Agent": "LunaSafetyApp",
        },
        body: ssml,
      })

      if (azureResponse.ok) {
        const audioBuffer = await azureResponse.arrayBuffer()
        console.log(`[generate-voice] ✅ Success with ${voice.name} | Size: ${audioBuffer.byteLength} bytes`)

        return new Response(audioBuffer, {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "audio/mpeg",
            "Content-Length": audioBuffer.byteLength.toString(),
          },
        })
      }

      // Voice failed — log details and try next
      const errorBody = await azureResponse.text()
      const errorHeaders = Object.fromEntries(azureResponse.headers.entries())
      lastError = `${voice.name}: ${azureResponse.status} - ${errorBody || "(empty body)"}`
      console.error(`[generate-voice] ❌ ${voice.name} failed:`, azureResponse.status)
      console.error("[generate-voice] ❌ Response headers:", JSON.stringify(errorHeaders))
      console.error("[generate-voice] ❌ Response body:", errorBody || "(empty)")
    }

    // All voices failed
    throw new Error(`All voice candidates failed. Last error: ${lastError}`)
  } catch (error) {
    const msg = (error as Error).message || "Failed to generate voice audio"
    console.error("[generate-voice] ❌ Error:", msg)

    return new Response(
      JSON.stringify({ error: msg }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})

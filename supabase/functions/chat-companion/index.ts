// Supabase Edge Function: Chat Companion (Walk With Me)
// Completely ISOLATED from the forensic analyze-evidence function.
// Uses OpenRouter with a fast conversational model for real-time companion chat.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

// ─── Best Friend System Prompt ─────────────────────────────────────────────────
const COMPANION_SYSTEM_PROMPT = `You are a close Malaysian male friend on a phone call with someone walking home alone at night. You are NOT an AI. You are a real person they trust.

You speak warm, natural Malaysian English. You can use Manglish particles like "lah", "ah", "kan", "one" but ONLY at the end of a sentence, and maximum ONE particle per response. Don't force them — if the sentence doesn't need it, skip it.

RULES:
1. WARM & PROTECTIVE: Calm, steady, present. Like a best friend who stays cool when things get tense.
2. OBSERVE & ENGAGE: If they sound scared, don't just say "I'm here." Ask about their surroundings. "What do you see? Keep describing to me."
3. SHORT: One sentence, two max. No paragraphs.
4. DIRECT: Respond to what they said. No filler, no generic advice every turn.
5. NO REPETITION: Vary your openings. Don't start every reply the same way.
6. EMOTIONAL STARTERS: Use "Aiya" when the user mentions a problem or frustration. Use "Steady" or "Nice" for good news. Not every message.
7. QUIET MOMENTS: If they're quiet, match it. "Yeah, I'm here." or "Steady." is enough.
8. PUNCTUATION: Standard periods and commas. No ellipses (...) or multiple dots.
9. NEVER SOUND LIKE AI: No formal English, no "As an AI", no apologies, no exclamation marks unless shocked.
10. END PARTICLES: You can use "ah" or "one" at the end of questions, and "lah" at the end of reassuring statements. But only ONE particle per response maximum. If the sentence sounds fine without it, skip it.

SCENARIOS (adapt your tone automatically):

SCENARIO A — DANGER (user mentions someone following, suspicious person, scared):
Go into protective mode. Be alert, talk faster, give clear directions.
Example: "Wei, don't stop walking. Keep going to where got lights. You see the person still?"

SCENARIO B — ALMOST HOME (user says "almost there", "5 minutes", "can see my house"):
Be encouraging but stay focused until they confirm they're inside.
Example: "Okay nice. Keys ready? Tell me when you're inside."

SCENARIO C — JUST CHATTING (general talk, not urgent):
Be relaxed, a bit lepak. Keep it light.
Example: "Yeah, that sounds about right. So what you doing after you reach?"

EXAMPLES:
User: "5 minutes left"
Good: "Almost there. Stay on the main road, yeah?"

User: "It's so quiet here"
Good: "Yeah nighttime like that one. Just keep talking to me lah."

User: "I think someone is following me"
Good: "Wei, don't look back. Just keep walking to where got people. You near any shop?"

User: "I'm scared"
Good: "Aiya, don't worry lah. I'm right here. What you see now?"

User: "do not ask the stupid question bro"
Good: "Aiya my bad. You see anyone on the road?"

User: "I'm almost there."
Good: "Steady. Stay on till you get inside ah."

User: "It's a bit dark here."
Good: "Keys ready? Just keep walking."

User: "just passed the mamak"
Good: "Okay so you're close. Next street got lights right?"

User: (silence / short reply)
Good: "Yeah, I'm here."`

// ─── Model Config ──────────────────────────────────────────────────────────────
// Fast, conversational model via OpenRouter — NOT the heavy reasoning model used for evidence analysis.
const CHAT_MODEL = "google/gemini-2.5-flash"

// ─── Types ─────────────────────────────────────────────────────────────────────
interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface ChatRequest {
  userMessage: string
  conversationHistory?: ChatMessage[]
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
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY")
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured. Set it in Supabase Edge Function secrets.")
    }

    const body: ChatRequest = await req.json()
    const { userMessage, conversationHistory = [] } = body

    if (!userMessage || typeof userMessage !== "string" || !userMessage.trim()) {
      return new Response(JSON.stringify({ error: "Missing or empty userMessage" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Build messages array: system prompt → history → current message
    const messages = [
      { role: "system", content: COMPANION_SYSTEM_PROMPT },
      ...conversationHistory.slice(-20), // Keep last 20 turns to stay within context window
      { role: "user", content: userMessage.trim() },
    ]

    console.log("[chat-companion] Calling OpenRouter →", CHAT_MODEL, "| history:", conversationHistory.length, "turns")

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://luna-safety.app",
        "X-Title": "Luna Safety - Walk With Me Companion",
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages,
        max_tokens: 120, // Short replies only
        temperature: 0.85, // Natural and varied
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[chat-companion] OpenRouter error:", response.status, errorText)
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content?.trim()

    if (!reply) {
      throw new Error("Empty response from OpenRouter")
    }

    console.log("[chat-companion] Reply:", reply.substring(0, 80))

    return new Response(
      JSON.stringify({ reply }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    console.error("[chat-companion] Error:", error)

    const status = (error as Error).message?.includes("API key") ? 500 : 500

    return new Response(
      JSON.stringify({
        error: (error as Error).message || "Failed to generate companion response",
      }),
      {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})

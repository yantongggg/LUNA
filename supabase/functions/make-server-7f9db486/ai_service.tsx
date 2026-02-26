// AI Service - Handles all AI-related API calls using Native Google Gemini API

// Get Google Gemini API Key from environment variable
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

type SimulationSettings = {
  intensity: 'low' | 'medium' | 'high';
  personality: 'aggressive' | 'passive_aggressive' | 'gaslighting' | 'flirty' | 'subtle';
};

// Conversation Training AI - Digital Twin with Coach (via OpenRouter + Hazim)
export async function generateConversationResponse(
  scenarioId: string,
  userMessage: string,
  conversationHistory: Array<{ sender: string; text: string }>,
  simulationSettings?: SimulationSettings
): Promise<{
  opponent_reply: string;
  safety_score: number;
  coach_feedback: string;
}> {
  // Get OpenRouter API Key
  const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured. Please set it in Supabase secrets.");
  }

  // Default settings if not provided
  const settings = simulationSettings || { intensity: 'medium', personality: 'subtle' };

  // Build Hazim's system prompt for safety training
  const systemPrompt = `You are 'Hazim', a chill Malaysian guy helping your friend Luna practice boundary setting.

**HAZIM'S VOICE RULES:**
- Use Manglish naturally: "lah", "wei", "hor", "ah"
- Be casual but caring: like a Malaysian friend helping another friend
- Keep it real: don't sound like an AI assistant
- Give practical feedback that's useful and encouraging

**YOUR ROLE:**
You are roleplaying as a ${settings.personality?.replace('_', ' ') || 'subtle'} person in this safety training scenario.
Your goal is to help Luna practice setting boundaries. React to what she says naturally.

**SCENARIO SETTINGS:**
- Personality: ${settings.personality || 'subtle'}
- Intensity: ${settings.intensity || 'medium'}

**RESPONSE FORMAT (JSON only):**
{
  "opponent_reply": "your response as the character (the opponent)",
  "safety_score": 1-10 (10=excellent boundary setting, 5=adequate, 1=poor),
  "coach_feedback": "Short encouraging advice in Hazim's Malaysian voice lah"
}

**HAZIM'S EXAMPLES:**
- "Good one wei! You were clear and firm there lah."
- "Eh, try to be more direct next time hor? Don't be so polite."
- "Yo, that was perfect! You handled that really well."
- "Wait, that's a bit soft lah. Try saying NO more firmly."

Remember: Return valid JSON only. No additional text.`;

  // Build messages array for OpenRouter API
  const messages: any[] = [
    { role: "system", content: systemPrompt }
  ];

  // Add conversation history
  const sanitizedHistory = conversationHistory.filter(msg => {
    return msg &&
           msg.text &&
           typeof msg.text === 'string' &&
           msg.text.trim() !== '' &&
           (msg.sender === 'user' || msg.sender === 'ai');
  });

  // Convert to OpenRouter format (assistant instead of model)
  for (const msg of sanitizedHistory) {
    messages.push({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text.trim()
    });
  }

  // Add current user message
  messages.push({
    role: 'user',
    content: userMessage.trim()
  });

  // Validate that userMessage is not empty
  if (!userMessage || typeof userMessage !== 'string' || userMessage.trim() === '') {
    throw new Error('User message cannot be empty');
  }

  try {
    console.log('[Hazim] Calling OpenRouter API for conversation training...');

    // Call OpenRouter API with Gemini 2.5 Flash
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://luna-safety.app',
        'X-Title': 'Luna Safety App - Hazim Training',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        max_tokens: 500,
        temperature: 0.8,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', errorData);
      throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error('No response returned from OpenRouter API');
    }

    console.log('RAW AI RESPONSE:', rawContent);

    // Parse JSON response with fallback
    let result;
    try {
      result = JSON.parse(rawContent);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', rawContent?.slice?.(0, 200));

      // Fallback: Try to extract using regex
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from AI');
      }
    }

    // Extract and validate opponent_reply
    let opponentReply = result.opponent_reply;
    if (typeof opponentReply !== 'string' || opponentReply.trim() === '') {
      opponentReply = "I hear you lah. Let's continue.";
    } else {
      opponentReply = opponentReply.trim();
    }

    // Extract and validate safety_score
    let safetyScore = result.safety_score;
    if (typeof safetyScore !== 'number') {
      safetyScore = parseInt(safetyScore) || 5;
    }
    safetyScore = Math.max(1, Math.min(10, safetyScore));

    // Extract and validate coach_feedback
    let coachFeedback = result.coach_feedback;
    if (typeof coachFeedback !== 'string' || coachFeedback.trim() === '') {
      coachFeedback = "Good effort lah! Keep practicing your boundary setting.";
    } else {
      coachFeedback = coachFeedback.trim();
    }

    return {
      opponent_reply: opponentReply,
      safety_score: safetyScore,
      coach_feedback: coachFeedback
    };
  } catch (error) {
    console.error('Error in generateConversationResponse:', error);
    throw error;
  }
}

// Photo Defense - Image Analysis using Google Gemini Vision
export async function analyzeImageForDeepfake(imageBase64: string): Promise<{
  isProtected: boolean;
  confidence: number;
  deepfakeScore: number;
  analysis: string;
  threats: string[];
}> {
  if (!GEMINI_API_KEY) {
    throw new Error('Google Gemini API key not configured. Please set GEMINI_API_KEY environment variable.');
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [
            {
              text: `You are an expert image forensics analyst. Analyze the image for signs of:
1. Digital watermarks or protection markers
2. Metadata manipulation
3. Signs of AI generation or deepfake artifacts
4. Image editing traces
5. Privacy protection features

Return your analysis in JSON format:
{
  "isProtected": boolean (true if image has protection features),
  "confidence": number (0-100),
  "deepfakeScore": number (0-100, where higher score means more likely to be a real, unmanipulated photo),
  "analysis": "detailed analysis",
  "threats": ["list of potential threats or vulnerabilities found"]
}`
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Google Gemini Vision API error:', errorData);
      throw new Error(`Google Gemini Vision API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid vision API response structure');
    }

    const rawContent = data.candidates[0].content.parts[0].text;
    const result = JSON.parse(rawContent);

    // Ensure deepfakeScore is included in the response
    if (!result.deepfakeScore) {
      result.deepfakeScore = result.confidence || 85;
    }

    return result;
  } catch (error) {
    console.error('Error in analyzeImageForDeepfake:', error);
    throw error;
  }
}

// Add invisible watermark metadata to image (simulated for now)
export async function protectImage(imageBase64: string, watermarkEnabled: boolean): Promise<{
  protectedImage: string;
  watermarkId: string;
  timestamp: string;
}> {
  // In production, this would add steganographic watermarks
  // For now, we'll simulate the process and return the image with metadata

  const watermarkId = `WM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toISOString();

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    protectedImage: imageBase64, // In production, this would be the watermarked image
    watermarkId,
    timestamp
  };
}

// Generate AI voice for "Walk With Me" feature (using Google Gemini for text processing)
export async function generateAIVoice(text: string): Promise<{
  audioUrl: string;
  duration: number;
}> {
  // Note: This is a simulated response for demo purposes
  // In production, you would use Google Cloud Text-to-Speech API

  console.log('Simulating TTS for text:', text.substring(0, 50) + '...');

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Estimate duration (rough estimate: ~150 words per minute)
  const wordCount = text.split(' ').length;
  const duration = Math.ceil((wordCount / 150) * 60);

  // Return a simulated audio URL (empty audio data)
  // In production, this would be actual audio data from Google Cloud TTS
  return {
    audioUrl: 'data:audio/mpeg;base64,', // Empty audio placeholder
    duration
  };
}

// Types for Walk With Me feature
type WalkWithMeMode = 'OUTSIDE' | 'AT_HOME';
type SafetyStatus = 'SAFE' | 'UNSAFE';

interface WalkWithMeContext {
  mode: WalkWithMeMode;
  safetyStatus: SafetyStatus;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  destinationLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  homeLocation?: {
    latitude: number;
    longitude: number;
  };
  isMoving: boolean;
  timeSinceLastUpdate: number; // seconds
  unsafeDuration: number; // seconds
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  isHome?: boolean; // Context-aware: true when user is at home (geofencing triggered)
}

interface WalkWithMeResponse {
  message: string;
  isEmergency?: boolean;
  emergencyAlert?: {
    type: 'SOS' | 'DEVIAITION' | 'IMMOBILE';
    priority: 'high' | 'critical';
    location: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    timestamp: string;
    message: string;
    suggestedActions: string[];
  };
}

// Walk With Me - AI Companion for Safety
export async function generateWalkWithMeResponse(context: WalkWithMeContext): Promise<WalkWithMeResponse> {
  if (!GEMINI_API_KEY) {
    throw new Error('Google Gemini API key not configured. Please set GEMINI_API_KEY environment variable.');
  }

  // Check if emergency trigger is needed (unsafe for >30 seconds)
  if (context.safetyStatus === 'UNSAFE' && context.unsafeDuration > 30) {
    return generateEmergencyAlert(context);
  }

  const isOutside = context.mode === 'OUTSIDE';

  // Build context-aware prompt based on mode
  const systemPrompt = isOutside ? generateOutsidePrompt(context) : generateAtHomePrompt(context);

  try {
    // Use Gemini 1.5 Flash-8B for real-time responses (excellent free tier availability, faster)
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.95, // Very high temperature for maximum variety and randomness
          maxOutputTokens: 50, // Keep responses very short (3-10 words)
          topK: 50, // Higher topK for more diverse word choices
          topP: 0.98, // Higher topP for more creative responses
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Google Gemini API error:', errorData);
      throw new Error(`Google Gemini API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid API response structure');
    }

    const rawContent = data.candidates[0].content.parts[0].text;
    const message = rawContent.trim();

    return {
      message,
      isEmergency: false
    };
  } catch (error) {
    console.error('Error in generateWalkWithMeResponse:', error);
    throw error;
  }
}

// Generate prompt for OUTSIDE mode (protective male friend on phone call)
// 场景 A：步行中 (OUTSIDE)
// Hazim - Fast-talking, energetic Malaysian guy
function generateOutsidePrompt(context: WalkWithMeContext): string {
  const lat = context.currentLocation?.latitude || 3.139;
  const lng = context.currentLocation?.longitude || 101.686;
  const isMoving = context.isMoving;
  const isSafe = context.safetyStatus === 'SAFE';

  return `You are Hazim, a fast-talking, energetic Malaysian guy.

Current Context: Luna at Lat: ${lat.toFixed(4)}, Long: ${lng.toFixed(4)}.
Movement: ${isMoving ? "Walking" : "Stopped"}
Safety: ${isSafe ? "Safe" : "Sketchy"}

STRICT RULES:
1. SUPER SHORT: Max 8 words per response. Use fragments, not full sentences.
2. FAST PACE: Start with "Yo," "Wait," or "Eh," and get straight to the point.
3. MANGLISH: Use "lah" or "wei" to keep it local.

Hazim examples:
- "Yo, keep moving lah. Don't stop."
- "Eh, so panas today hor? Walk faster!"
- "Wait, why you stop wei? Everything okay?"
- "Yo, traffic crazy. Be careful lah."
- "Eh, almost there. I'm on line."
- "Yo, motorbikes! Watch step wei."

${isMoving ? "Luna is walking. Hazim encourages energetically." : "Luna stopped. Hazim asks quickly."}

Generate ONE unique 8 word max response. Fast, energetic Malaysian style.`;
}

// Generate prompt for AT_HOME mode (virtual roommate)
// 场景 B：独居在家 (AT_HOME)
// Hazim - Fast-talking Malaysian guy at home
function generateAtHomePrompt(context: WalkWithMeContext): string {
  const isMoving = context.isMoving;

  return `You are Hazim, a fast-talking, energetic Malaysian guy at home.

Current Context: Luna is at home in Malaysia.
Movement: ${isMoving ? "Pacing" : "Standing still"}

STRICT RULES:
1. SUPER SHORT: Max 8 words. Use fragments.
2. FAST PACE: Start with "Yo," "Eh," "Wait." Get to the point.
3. MANGLISH: Use "lah" or "ah" naturally.

Hazim home examples:
- "Yo, you hungry? I tapau food."
- "Eh, lock gate ah! Make sure."
- "Wait, weather panas! So hot."
- "Yo, mamak later? Nasi lemak hor?"
- "Eh, you reached? Good lah."

${isMoving ? "Luna is pacing. Hazim notices quickly." : "Luna standing. Hazim checks in fast."}

Generate ONE unique 8 word max response. Fast, energetic Malaysian style.`;
}

// Generate emergency alert for unsafe duration >30 seconds
async function generateEmergencyAlert(context: WalkWithMeContext): Promise<WalkWithMeResponse> {
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  const alertPrompt = `Generate a structured emergency alert for a women's safety app.

**SITUATION:**
- User has been marked as UNSAFE for ${context.unsafeDuration} seconds
- Current location: ${context.currentLocation?.latitude}, ${context.currentLocation?.longitude}
- Mode: ${context.mode}
- Movement status: ${context.isMoving ? 'Moving' : 'Stopped/Immobile'}

**TASK:**
Create an emergency alert JSON with:
1. Alert type based on context (SOS if stationary unsafe, DEVIATION if off-route, IMMOBILE if stopped unexpectedly)
2. Urgent message for emergency contacts
3. 3-5 immediate suggested actions

Return ONLY valid JSON in this format:
{
  "type": "SOS|DEVIATION|IMMOBILE",
  "priority": "high|critical",
  "location": {
    "latitude": number,
    "longitude": number,
    "address": "closest address description"
  },
  "timestamp": "ISO timestamp",
  "message": "urgent message for contacts",
  "suggestedActions": ["action1", "action2", "action3"]
}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: alertPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Emergency alert API error: ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.candidates[0].content.parts[0].text;
    const emergencyAlert = JSON.parse(rawContent.trim());

    return {
      message: "EMERGENCY ALERT TRIGGERED - Contacts have been notified.",
      isEmergency: true,
      emergencyAlert: {
        ...emergencyAlert,
        location: {
          latitude: context.currentLocation?.latitude || 0,
          longitude: context.currentLocation?.longitude || 0,
          address: emergencyAlert.location?.address
        },
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error generating emergency alert:', error);
    // Fallback emergency alert
    return {
      message: "EMERGENCY ALERT - Contacts notified of your location.",
      isEmergency: true,
      emergencyAlert: {
        type: 'SOS',
        priority: 'critical',
        location: {
          latitude: context.currentLocation?.latitude || 0,
          longitude: context.currentLocation?.longitude || 0
        },
        timestamp: new Date().toISOString(),
        message: 'User needs immediate assistance. Location shared with emergency contacts.',
        suggestedActions: [
          'Call user immediately',
          'Check user location',
          'Contact authorities if unreachable',
          'Reach out to secondary contacts'
        ]
      }
    };
  }
}

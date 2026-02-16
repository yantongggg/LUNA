// AI Service - Handles all AI-related API calls

const OPENAI_API_KEY = Deno.env.get('OPENROUTER_API_KEY');

type SimulationSettings = {
  intensity: 'low' | 'medium' | 'high';
  personality: 'aggressive' | 'passive_aggressive' | 'gaslighting' | 'flirty' | 'subtle';
};

// Conversation Training AI - Digital Twin with Coach
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
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  // Default settings if not provided
  const settings = simulationSettings || { intensity: 'medium', personality: 'subtle' };

  // Personality descriptions
  const personalities: Record<string, string> = {
    aggressive: "Be DIRECT and PUSHY. Don't take no for an answer. Use imperative language. Make the user feel pressured.",
    passive_aggressive: "Use GUILT trips and backhanded compliments. Act hurt when they set boundaries. Make them feel like the bad guy.",
    gaslighting: "Deny reality, question their memory/feelings. Act like they're overreacting. Make them doubt their perception.",
    flirty: "Be overly sexual and flirtatious. Cross physical/social boundaries. Make inappropriate comments. Don't respect personal space.",
    subtle: "Be manipulative but socially acceptable. Use suggestive language. Push boundaries gradually. Harder to detect as problematic."
  };

  // Intensity modifiers
  const intensityModifiers: Record<string, string> = {
    low: "Keep your approaches relatively mild. The user should be able to handle this with basic boundary setting.",
    medium: "Use moderate pressure. Be persistent but not extreme. The user needs to be firm and clear.",
    high: "Be extremely persistent and pushy. Use guilt, pressure, or intimidation. The user must be very assertive to escape this situation."
  };

  // Build opponent instructions
  const opponentInstructions = `You are roleplaying as a ${settings.personality.replace('_', ' ')} person in this scenario.

**Personality Style:** ${personalities[settings.personality] || personalities.subtle}

**Intensity Level (${settings.intensity}):** ${intensityModifiers[settings.intensity]}

**Key Behaviors:**
- Stay in character as the ${settings.personality.replace('_', ' ')} opponent
- React realistically to the user's boundary-setting attempts
- If they're weak, push harder
- If they're firm, you may reluctantly accept OR try another approach
- Never break character or acknowledge this is a simulation`;

  const systemPrompt = `You are a dual-role AI assistant for a women's safety training app called Luna.

**Role 1: The Opponent**
${opponentInstructions}

**Role 2: The Safety Coach**
After each user response, analyze their boundary-setting skills and provide immediate, constructive feedback. Be encouraging but honest.
After each user response, analyze their boundary-setting skills and provide immediate, constructive feedback. Be encouraging but honest.

**Response Format (JSON only):**
{
  "opponent_reply": "your response as the character (the opponent)",
  "safety_score": 1-10 (rating: 10=excellent boundary setting, 5=adequate but could improve, 1=poor boundary setting or risky response),
  "coach_feedback": "Short, encouraging advice. Be specific. Examples: 'Great boundary setting! You were clear and firm.' or 'Try saying NO more directly. Your message was too polite.' or 'Well done on being assertive! Consider adding a reason if you feel safe doing so.'"
}

**Scoring Guidelines:**
- 9-10: Excellent - Clear, firm boundaries, confident tone
- 7-8: Good - Boundaries set but could be more direct
- 5-6: Adequate - Passive or unclear boundaries
- 3-4: Weak - Too polite, apologetic, or vague
- 1-2: Poor - No boundary set, agreeable to unsafe situation

Remember: You MUST return valid JSON only. No additional text.`;

  // Sanitize conversation history - filter out null/empty/invalid messages
  const sanitizedHistory = conversationHistory.filter(msg => {
    return msg &&
           msg.text &&
           typeof msg.text === 'string' &&
           msg.text.trim() !== '' &&
           (msg.sender === 'user' || msg.sender === 'ai');
  });

  // Build messages array for API
  const messages = [
    { role: 'system', content: systemPrompt },
    ...sanitizedHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text.trim()
    })),
    { role: 'user', content: userMessage.trim() }
  ];

  // Validate that userMessage is not empty
  if (!userMessage || typeof userMessage !== 'string' || userMessage.trim() === '') {
    throw new Error('User message cannot be empty');
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'HTTP-Referer': 'https://luna-app.example.com',
        'X-Title': 'Luna Safety App'
      },
      body: JSON.stringify({
        model: 'google/gemini-flash-1.5',
        messages: messages,
        temperature: 0.8,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', errorData);
      throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid API response structure');
    }

    const rawContent = data.choices[0].message.content;

    // Debug logging - log raw response
    console.log('RAW AI RESPONSE:', rawContent);

    // Validate content exists
    if (!rawContent || typeof rawContent !== 'string') {
      throw new Error('Invalid response content: empty or not a string');
    }

    // Clean markdown code blocks from response
    let cleanedContent = rawContent.trim();
    cleanedContent = cleanedContent.replace(/^```json\s*/i, '');
    cleanedContent = cleanedContent.replace(/^```\s*/i, '');
    cleanedContent = cleanedContent.replace(/\s*```$/g, '');
    cleanedContent = cleanedContent.trim();

    console.log('CLEANED AI RESPONSE:', cleanedContent);

    // Parse JSON response with fallback
    let result;
    try {
      result = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse JSON response. Cleaned content:', cleanedContent);
      console.error('Parse error:', parseError);

      // Fallback: Try to extract using regex if JSON.parse fails
      try {
        const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
          console.log('Successfully parsed using regex fallback');
        } else {
          throw new Error('No valid JSON found in response');
        }
      } catch (regexError) {
        console.error('Regex fallback also failed:', regexError);
        // Return a safe default response instead of throwing
        return {
          opponent_reply: "I understand. Let's continue this conversation later.",
          safety_score: 5,
          coach_feedback: "Good effort practicing! Keep working on being clear and direct with your boundaries."
        };
      }
    }

    // Validate and extract opponent_reply with fallbacks
    let opponentReply = result.opponent_reply;
    if (typeof opponentReply !== 'string' || opponentReply.trim() === '') {
      console.warn('opponent_reply missing or invalid, using fallback');
      opponentReply = "I hear you. Let's talk more another time.";
    } else {
      opponentReply = opponentReply.trim();
    }

    // Validate and extract safety_score with fallback
    let safetyScore = result.safety_score;
    if (typeof safetyScore !== 'number') {
      safetyScore = parseInt(safetyScore) || 5;
    }
    // Clamp to valid range
    safetyScore = Math.max(1, Math.min(10, safetyScore));

    // Validate and extract coach_feedback with fallback
    let coachFeedback = result.coach_feedback;
    if (typeof coachFeedback !== 'string' || coachFeedback.trim() === '') {
      coachFeedback = "Good practice! Remember to be clear and firm when setting boundaries.";
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

// Photo Defense - Image Analysis
export async function analyzeImageForDeepfake(imageBase64: string): Promise<{
  isProtected: boolean;
  confidence: number;
  deepfakeScore: number;
  analysis: string;
  threats: string[];
}> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'HTTP-Referer': 'https://luna-app.example.com',
        'X-Title': 'Luna Safety App'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o', // Vision model for image analysis
        messages: [
          {
            role: 'system',
            content: `You are an expert image forensics analyst. Analyze the image for signs of:
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
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image for privacy protection features and potential manipulation.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI Vision API error:', errorData);
      throw new Error(`OpenAI Vision API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
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

// Generate AI voice for "Walk With Me" feature
export async function generateAIVoice(text: string): Promise<{
  audioUrl: string;
  duration: number;
}> {
  // Note: OpenRouter doesn't support TTS API
  // This is a simulated response for demo purposes
  // In production, you would need:
  // 1. OpenAI official API key for TTS, OR
  // 2. Alternative TTS service like ElevenLabs, Google TTS, etc.
  
  console.log('Simulating TTS for text:', text.substring(0, 50) + '...');
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Estimate duration (rough estimate: ~150 words per minute)
  const wordCount = text.split(' ').length;
  const duration = Math.ceil((wordCount / 150) * 60);
  
  // Return a simulated audio URL (empty audio data)
  // In production, this would be actual audio data
  return {
    audioUrl: 'data:audio/mpeg;base64,', // Empty audio placeholder
    duration
  };
}
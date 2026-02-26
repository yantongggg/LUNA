import { Hono } from "npm:hono";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
// Fix: Use direct named imports instead of namespace import
import {
  generateConversationResponse,
  generateWalkWithMeResponse,
  analyzeImageForDeepfake,
  protectImage,
  generateAIVoice
} from "./ai_service.tsx";

const app = new Hono();

// BRUTE FORCE FIX: Move corsHeaders to the top level as a GLOBAL CONSTANT
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
  'Access-Control-Expose-Headers': 'Content-Length, X-Request-ID',
  'Access-Control-Max-Age': '600',
};

// Enable logger
app.use('*', logger(console.log));

// Health check endpoint
app.get("/make-server-7f9db486/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Conversation Training AI Endpoint (Hazim - OpenRouter with Gemini 2.0 Flash)
app.post("/make-server-7f9db486/conversation/respond", async (c) => {
  try {
    const { scenarioId, userMessage, conversationHistory, simulationSettings } = await c.req.json();

    if (!scenarioId || !userMessage) {
      return c.json({ error: 'Missing required fields: scenarioId, userMessage' }, 400);
    }

    console.log('[Hazim] Conversation request:', {
      scenarioId,
      simulationSettings: simulationSettings || { intensity: 'medium', personality: 'subtle' },
      timestamp: new Date().toISOString()
    });

    const result = await generateConversationResponse(
      scenarioId,
      userMessage,
      conversationHistory || [],
      simulationSettings || { intensity: 'medium', personality: 'subtle' }
    );

    // Store conversation in KV store for history
    const sessionId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(sessionId, {
      scenarioId,
      messages: [...(conversationHistory || []), { sender: 'user', text: userMessage }, { sender: 'ai', text: result.opponent_reply }],
      coach_feedback: result.coach_feedback,
      safety_score: result.safety_score,
      timestamp: new Date().toISOString()
    });

    return c.json(result);
  } catch (error) {
    console.error('[Hazim] Error in conversation endpoint:', error);

    // Check for OpenRouter API key error
    if (error.message?.includes('OPENROUTER_API_KEY') || error.message?.includes('API key')) {
      return c.json({
        error: 'OpenRouter API key not configured',
        details: 'Please set OPENROUTER_API_KEY in Supabase Edge Function secrets',
        code: 'MISSING_API_KEY'
      }, 500);
    }

    return c.json({ error: `Failed to generate response: ${error.message}` }, 500);
  }
});

// Photo Defense - Verify Image
app.post("/make-server-7f9db486/photo/verify", async (c) => {
  try {
    const { imageBase64 } = await c.req.json();

    if (!imageBase64) {
      return c.json({ error: 'Missing image data' }, 400);
    }

    const result = await analyzeImageForDeepfake(imageBase64);

    return c.json(result);
  } catch (error) {
    console.error('[Backend] Error in photo verify endpoint:', error);

    if (error.message?.includes('GEMINI_API_KEY') || error.message?.includes('API key')) {
      return c.json({
        error: 'Google Gemini API key not configured',
        details: 'Please set GEMINI_API_KEY in Supabase Edge Function secrets',
        code: 'MISSING_API_KEY'
      }, 500);
    }

    return c.json({ error: `Failed to verify image: ${error.message}` }, 500);
  }
});

// Photo Defense - Protect Image
app.post("/make-server-7f9db486/photo/protect", async (c) => {
  try {
    const { imageBase64, watermarkEnabled } = await c.req.json();

    if (!imageBase64) {
      return c.json({ error: 'Missing image data' }, 400);
    }

    const result = await protectImage(imageBase64, watermarkEnabled);

    // Store protection record in KV store
    const recordId = `photo_${result.watermarkId}`;
    await kv.set(recordId, {
      watermarkId: result.watermarkId,
      timestamp: result.timestamp,
      watermarkEnabled
    });

    return c.json(result);
  } catch (error) {
    console.error('[Backend] Error in photo protect endpoint:', error);
    return c.json({ error: `Failed to protect image: ${error.message}` }, 500);
  }
});

// AI Guardian Voice Generation
app.post("/make-server-7f9db486/guardian/voice", async (c) => {
  try {
    const { text } = await c.req.json();

    if (!text) {
      return c.json({ error: 'Missing text for voice generation' }, 400);
    }

    const result = await generateAIVoice(text);

    return c.json(result);
  } catch (error) {
    console.error('[Backend] Error in guardian voice endpoint:', error);
    return c.json({ error: `Failed to generate voice: ${error.message}` }, 500);
  }
});

// Walk With Me - AI Companion Response
app.post("/make-server-7f9db486/walk-with-me/generate", async (c) => {
  try {
    const context = await c.req.json();

    console.log('[Backend] Walk With Me request:', {
      mode: context.mode,
      safetyStatus: context.safetyStatus,
      isHome: context.isHome,
      timestamp: new Date().toISOString()
    });

    // Validate required fields
    if (!context.mode || !context.safetyStatus) {
      return c.json({ error: 'Missing required fields: mode, safetyStatus' }, 400);
    }

    // Validate mode
    if (!['OUTSIDE', 'AT_HOME'].includes(context.mode)) {
      return c.json({ error: 'Invalid mode. Must be OUTSIDE or AT_HOME' }, 400);
    }

    // Validate safety status
    if (!['SAFE', 'UNSAFE'].includes(context.safetyStatus)) {
      return c.json({ error: 'Invalid safetyStatus. Must be SAFE or UNSAFE' }, 400);
    }

    // Direct function call - no namespace confusion
    const result = await generateWalkWithMeResponse(context);

    console.log('[Backend] Walk With Me response:', {
      message: result.message?.substring(0, 50),
      isEmergency: result.isEmergency,
      timestamp: new Date().toISOString()
    });

    return c.json(result);
  } catch (error) {
    console.error('[Backend] Error in Walk With Me endpoint:', error);

    // Check for GEMINI_API_KEY error specifically
    if (error.message?.includes('GEMINI_API_KEY') || error.message?.includes('API key') || error.message?.includes('not configured')) {
      return c.json({
        error: 'Google Gemini API key not configured',
        details: 'Please set GEMINI_API_KEY environment variable in Supabase Edge Function secrets',
        code: 'MISSING_API_KEY',
        help: 'Go to Supabase Dashboard > Edge Functions > make-server-7f9db486 > Secrets > Add GEMINI_API_KEY'
      }, 500);
    }

    return c.json({
      error: `Failed to generate response: ${error.message}`,
      stack: error.stack
    }, 500);
  }
});

// Walk With Me - Generate emergency alert directly
app.post("/make-server-7f9db486/walk-with-me/emergency", async (c) => {
  try {
    const context = await c.req.json();

    console.log('[Backend] Emergency alert request:', {
      hasLocation: !!context.currentLocation,
      mode: context.mode,
      timestamp: new Date().toISOString()
    });

    if (!context.currentLocation) {
      return c.json({ error: 'Missing currentLocation for emergency alert' }, 400);
    }

    // Force emergency mode
    const emergencyContext = {
      ...context,
      safetyStatus: 'UNSAFE' as const,
      unsafeDuration: 31 // Force trigger emergency
    };

    // Direct function call
    const result = await generateWalkWithMeResponse(emergencyContext);

    return c.json(result);
  } catch (error) {
    console.error('[Backend] Error in Walk With Me emergency endpoint:', error);

    if (error.message?.includes('GEMINI_API_KEY') || error.message?.includes('API key')) {
      return c.json({
        error: 'Google Gemini API key not configured',
        details: 'Please set GEMINI_API_KEY in Supabase Edge Function secrets',
        code: 'MISSING_API_KEY'
      }, 500);
    }

    return c.json({ error: `Failed to generate emergency alert: ${error.message}` }, 500);
  }
});

// BRUTE FORCE FIX: Intercept OPTIONS IMMEDIATELY - force response before ANY other logic
Deno.serve(async (req) => {
  // IMMEDIATE INTERCEPTION: Check for OPTIONS at the VERY BEGINNING
  // This happens BEFORE any try-catch, BEFORE Hono routing, BEFORE everything
  if (req.method === 'OPTIONS') {
    console.log('[Backend] ✅✅✅ OPTIONS INTERCEPTED - Returning HTTP 200 OK immediately');

    // FORCE: Return response immediately, do not pass through any other logic
    return new Response('ok', {
      status: 200,
      statusText: 'OK',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id',
        'Access-Control-Expose-Headers': 'Content-Length, X-Request-ID',
        'Access-Control-Max-Age': '600',
      }
    });
  }

  console.log('[Backend] 📨', req.method, 'request for:', new URL(req.url).pathname);

  // For all other methods, pass through Hono app
  try {
    const response = await app.fetch(req);

    // Add CORS headers to successful responses
    const responseBody = await response.text();
    const responseHeaders = new Headers();

    // Copy original headers
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    // Add CORS headers manually to every response
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE, PATCH');
    responseHeaders.set('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type, x-request-id');
    responseHeaders.set('Access-Control-Expose-Headers', 'Content-Length, X-Request-ID');
    responseHeaders.set('Access-Control-Max-Age', '600');

    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    console.error('[Backend] ❌ Request error:', error);

    // HEADERS IN ERROR: Ensure catch block also returns corsHeaders
    // or the browser will hide the actual error
    return new Response(JSON.stringify({
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      statusText: 'Internal Server Error',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id',
        'Content-Type': 'application/json'
      }
    });
  }
});

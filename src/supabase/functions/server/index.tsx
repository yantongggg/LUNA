import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as ai from "./ai_service.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-7f9db486/health", (c) => {
  return c.json({ status: "ok" });
});

// Conversation Training AI Endpoint
app.post("/make-server-7f9db486/conversation/respond", async (c) => {
  try {
    const { scenarioId, userMessage, conversationHistory, simulationSettings } = await c.req.json();

    if (!scenarioId || !userMessage) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const result = await ai.generateConversationResponse(
      scenarioId,
      userMessage,
      conversationHistory || [],
      simulationSettings
    );

    // Store conversation in KV store for history
    const sessionId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(sessionId, {
      scenarioId,
      messages: [...(conversationHistory || []), { sender: 'user', text: userMessage }, { sender: 'ai', text: result.opponent_reply }],
      feedback: {
        safety_score: result.safety_score,
        coach_feedback: result.coach_feedback
      },
      simulationSettings,
      timestamp: new Date().toISOString()
    });

    return c.json(result);
  } catch (error) {
    console.error('Error in conversation endpoint:', error);
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

    const result = await ai.analyzeImageForDeepfake(imageBase64);
    
    return c.json(result);
  } catch (error) {
    console.error('Error in photo verify endpoint:', error);
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

    const result = await ai.protectImage(imageBase64, watermarkEnabled);
    
    // Store protection record in KV store
    const recordId = `photo_${result.watermarkId}`;
    await kv.set(recordId, {
      watermarkId: result.watermarkId,
      timestamp: result.timestamp,
      watermarkEnabled
    });
    
    return c.json(result);
  } catch (error) {
    console.error('Error in photo protect endpoint:', error);
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

    const result = await ai.generateAIVoice(text);
    
    return c.json(result);
  } catch (error) {
    console.error('Error in guardian voice endpoint:', error);
    return c.json({ error: `Failed to generate voice: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);
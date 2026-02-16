# Luna AI Integration Guide

## Overview
Luna now has **real AI capabilities** powered by OpenAI's GPT-4o-mini and Vision API through a secure Supabase backend.

## ✅ Active AI Features

### 1. **Conversation Training AI** 🤖
**Location:** `ConversationTraining.tsx`

**What it does:**
- Realistic AI roleplay for boundary-setting practice
- Intelligent feedback on safety, boundary clarity, and exit strategies
- Contextual suggestions based on user responses
- Conversation history stored in Supabase KV store

**API Endpoint:** `POST /make-server-7f9db486/conversation/respond`

**How it works:**
```typescript
// User sends a message
→ AI analyzes the response for:
  • Boundary clarity
  • Safety level (low/medium/high)
  • Exit control
  • Strengths in the response
→ AI generates realistic roleplay response
→ Provides constructive feedback and alternative suggestions
```

**Model:** OpenAI GPT-4o-mini with JSON-structured responses

---

### 2. **Photo Privacy - AI Deepfake Detection** 🖼️
**Location:** `PhotoDefense.tsx`

**What it does:**
- Analyzes images for AI-generated content and deepfake artifacts
- Detects digital watermarks and protection markers
- Image forensics analysis
- Protection tracking via watermark IDs

**API Endpoints:**
- `POST /make-server-7f9db486/photo/verify` - Verify if photo is protected
- `POST /make-server-7f9db486/photo/protect` - Add protection metadata

**How it works:**
```typescript
// Protect Mode
→ User uploads photo
→ AI adds invisible watermark metadata
→ Stores protection record with watermark ID

// Verify Mode
→ User uploads photo
→ AI analyzes for:
  • Deepfake artifacts
  • Digital manipulation traces
  • Existing protection features
  • Privacy vulnerabilities
→ Returns confidence score and threat analysis
```

**Model:** OpenAI GPT-4o-mini Vision API

---

### 3. **AI Voice Generation** 🎙️ (Backend Ready)
**Location:** `ai_service.tsx` - `generateAIVoice()`

**What it does:**
- Generates realistic male voice for "Walk With Me" guardian feature
- Text-to-speech for simulated phone calls
- Helps users exit unsafe situations discreetly

**API Endpoint:** `POST /make-server-7f9db486/guardian/voice`

**How it works:**
```typescript
→ User activates Guardian Mode
→ AI generates natural-sounding male voice
→ Returns audio as base64 data URL
→ Can be played during simulated call
```

**Model:** OpenAI TTS-1 with "onyx" voice (male)

**Status:** ⚠️ Backend implemented, frontend integration pending

---

## 🔐 Security Architecture

### API Key Protection
- ✅ OpenAI API key stored as Supabase secret
- ✅ Never exposed to frontend code
- ✅ All AI calls routed through Supabase Edge Functions

### Data Privacy
- Conversation history stored temporarily in KV store
- Photo analysis results logged with watermark IDs
- No personal photos stored on backend (only base64 for analysis)

### Authentication
- Uses Supabase public anon key for frontend → backend communication
- Server validates requests using `Authorization: Bearer ${publicAnonKey}`

---

## 📡 Backend API Reference

### Base URL
```
https://${projectId}.supabase.co/functions/v1/make-server-7f9db486
```

### Endpoints

#### 1. Conversation AI
```typescript
POST /conversation/respond
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ${publicAnonKey}'
}
Body: {
  scenarioId: 'workplace' | 'public' | 'social',
  userMessage: string,
  conversationHistory: Array<{ sender: 'ai' | 'user', text: string }>
}

Response: {
  aiResponse: string,
  feedback: {
    safetyLevel: 'low' | 'medium' | 'high',
    boundaryClarity: string,
    exitControl: string,
    suggestions: string[],
    strengths: string[]
  }
}
```

#### 2. Photo Verification
```typescript
POST /photo/verify
Body: {
  imageBase64: string (data URL format)
}

Response: {
  isProtected: boolean,
  confidence: number (0-100),
  analysis: string,
  threats: string[]
}
```

#### 3. Photo Protection
```typescript
POST /photo/protect
Body: {
  imageBase64: string,
  watermarkEnabled: boolean
}

Response: {
  protectedImage: string (base64),
  watermarkId: string,
  timestamp: string (ISO 8601)
}
```

#### 4. Guardian Voice
```typescript
POST /guardian/voice
Body: {
  text: string
}

Response: {
  audioUrl: string (base64 audio data URL),
  duration: number (seconds)
}
```

---

## 🚀 Future AI Enhancements

### Recommended Next Steps:
1. **Sentiment Analysis** - Detect emotional distress in conversation training
2. **Location-Based Safety AI** - Risk assessment for "Walk With Me" feature
3. **Document OCR** - Extract text from evidence photos (legal docs, threats)
4. **Voice Cloning** - Personalized guardian voice from user's contacts
5. **Predictive Safety Scoring** - ML model to assess situation risk levels

### Advanced Features (Production):
- Real steganographic watermarking (not just metadata)
- Blockchain-based evidence verification
- End-to-end encrypted voice memos with AI transcription
- Multi-language support for conversation training

---

## 💡 Usage Tips

### For Conversation Training:
- Be authentic in your responses - AI learns from real boundary-setting attempts
- Try different approaches to see how AI adapts
- Fallback mode activates if AI service is unavailable

### For Photo Defense:
- AI analysis takes ~2-3 seconds
- Higher resolution images = better analysis
- Verification works on both original and AI-protected photos

### Debugging:
- Check browser console for detailed error logs
- All API errors are logged with full context
- Fallback responses ensure app never breaks

---

## 📊 Cost Considerations

**OpenAI API Usage:**
- Conversation Training: ~$0.0001 per message (GPT-4o-mini)
- Photo Analysis: ~$0.001 per image (Vision API)
- Voice Generation: ~$0.015 per 1000 characters (TTS)

**Estimated Monthly Cost (100 active users):**
- ~$5-15/month for moderate usage
- Scale with user base

---

## 🔧 Technical Stack

- **Backend:** Supabase Edge Functions (Deno runtime)
- **Web Framework:** Hono.js
- **AI Provider:** OpenAI API
- **Database:** Supabase KV Store
- **Frontend:** React + TypeScript

---

## ⚠️ Important Notes

1. **PII Warning:** Figma Make is not designed for production-level PII security. For real deployment, implement additional encryption and compliance measures.

2. **API Key Security:** Never commit the OpenAI API key to version control. It's stored securely in Supabase secrets.

3. **Rate Limiting:** OpenAI has rate limits. Implement request throttling for production.

4. **Error Handling:** All AI features have fallback modes to ensure app stability.

---

## 🎯 Testing the AI Features

### Test Conversation Training:
1. Navigate to "Safe Conversations"
2. Select any scenario (Workplace, Public, Social)
3. Type a boundary-setting response
4. Wait for AI analysis (look for the thinking indicator)
5. Review feedback and suggestions

### Test Photo Defense:
1. Navigate to "Photo Privacy Care"
2. Choose "Protect a Photo" or "Verify Protection"
3. Upload any image
4. Wait for AI processing
5. View protection status and analysis

---

**Questions?** Check the console logs for detailed debugging information!

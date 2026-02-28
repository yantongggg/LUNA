Here is the complete README file in Markdown format, with the new **Deepfake Protection Architecture** section integrated and the **Photo Privacy** feature updated.

# 🌙 LUNA - Women's Safety App v2.0

## Table of Contents
- [Overview](#overview)
- [Challenge Faced](https://github.com/yantongggg/LUNA/blob/main/README.md#challenge-faced-globally-problem-statement)
- [Features](#features)
- [Key Differentiators](#key-differentiators)
- [Technical Architecture](https://github.com/yantongggg/LUNA/blob/main/README.md#technical-architecture)
- [System Architecture](#system-architecture)
- [AI/ML Services Integration](#aiml-services-integration)
- [Deepfake Protection Architecture](#deepfake-protection-architecture)
- [Data Flow Diagrams](#data-flow-diagrams)
- [Workflow & User Journey](#workflow--user-journey)
- [Implementation Details](#implementation-details)
- [Deployment Guide](#deployment-guide)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Troubleshooting](#troubleshooting)
- [Future RoadMap](#future-roadmap)
- [Contributing](#contributing)
- [Deep fake protection](#Deepfake-Protection)
- [License](#license)
 
## YouTube Demo Video:
https://www.youtube.com/watch?v=ypPZL61ysrc

## PPT:
https://docs.google.com/presentation/d/1O6T61zQM2ffU-ku4k1Prbmp91K9yjNaf/edit?usp=sharing&ouid=100307772594735931276&rtpof=true&sd=true

---

## Overview

**LUNA** is a comprehensive women's safety application designed to provide protection, evidence collection, and support for women in potentially dangerous situations. The app disguises itself as a period tracking app to ensure user privacy and safety.

## Challenge Faced Globally (Problem Statement)
**The Safety & Digital Abuse Crisis Targeting Women**
LUNA was born out of a critical need to address the escalating threats women face in both physical and digital environments. Based on global and local Malaysian data from 2025-2026:

**Pervasive Physical Violence**: 1 in 3 women globally have experienced physical or sexual violence. In Malaysia, rising cases in states like Selangor and Johor highlight the urgent need for accessible intervention tools.

**The Deepfake Epidemic**: 95% of non-consensual deepfake content targets women. Current platforms lack native tools to detect or "immunize" photos against AI manipulation.

**Evidence Sabotage**: Victims of domestic abuse often cannot report incidents because abusers frequently erase evidence from local devices or block access to safe storage.

**Safety Tech Fragmentation**: Most existing solutions are either "Reactive SOS" apps (too visible) or "Health Tracking" apps (no safety features), leaving a gap for a unified, discreet ecosystem

### Mission
To empower women with tools for personal safety, evidence documentation, and emergency assistance while maintaining complete privacy through camouflage design.

### Key Goals
- **Safety First**: Provide immediate emergency response tools
- **Evidence Preservation**: Secure collection and storage of legal evidence
- **Privacy Protection**: Camouflage interface to hide true purpose
- **AI-Powered Support**: Intelligent coaching and analysis using multiple AI models
- **Community Resources**: Connect users with aid and support services

---

## Features

### 1. **Camouflage Home Screen** 🎭
- **Period tracking disguise** to protect user privacy
- **Triple-tap unlock mechanism** (PIN: 2468)
- **Calendar view** with cycle tracking
- **Seamless transition** to safety features
- **Quick exit** functionality

### 2. **AI Guardian Presence** 👥
- **Simulated call** feature for emergency exit
- **Location sharing** with trusted contacts
- **Real-time safety monitoring**
- **Silent/discreet activation** modes
- **Panic recording** with hold-to-record button

### 3. **Evidence Vault** 🔐
- **Encrypted Storage**: AES-256 encrypted evidence storage
- **Multi-format Support**: Images, audio, documents
- **Legal Documentation**: Auto-generated forensic PDF reports using jsPDF
- **Cloud Sync**: Secure Supabase storage with Row Level Security
- **AI-Powered Analysis**: Forensic analysis with risk scoring
- **Chain of Custody**: Complete timestamped audit trail

### 4. **Photo Privacy & Defense** 📸
- **AI Immunization**: Applies adversarial perturbation to "vaccinate" photos against generative AI manipulation.
- **Deepfake Detection**: Uses Google Gemini Vision to detect existing manipulations and calculate AI likelihood scores.
- **Steganographic Verification**: Embeds invisible signatures for authenticity checks.
- **Zero-Visual Impact**: Protection layers modify high-frequency pixels without visible distortion.
- **Integrity Verification**: SHA-256 hashing ensures file authenticity and chain of custody.

### 5. **Walk With Me** 🚶‍♀️
- **Live location sharing** with Google Maps integration
- **Home presence simulation**
- **AI-generated voice companionship** using Azure Neural TTS
- **Safe arrival notifications**
- **Emergency alerts** when unsafe >30 seconds
- **Two modes**: OUTSIDE (walking) and AT_HOME (virtual roommate)

### 6. **Safe Conversations** 💬
- **Practice Scenarios**: Workplace, Public, Social situations
- **AI Coaching**: Real-time boundary setting feedback
- **Hazim Persona**: Malaysian male friend for authentic coaching
- **5 Personality Types**: Aggressive, Passive-Aggressive, Gaslighting, Flirty, Subtle
- **3 Difficulty Levels**: Low, Medium, High intensity
- **Safety Scoring**: 1-10 score on response effectiveness
- **FAQ System**: Emergency and safety guidance

### 7. **Life Copilot** 🤖
- AI-powered personal assistant
- Wellness tips and daily support
- Emotional guidance and check-ins

### 8. **MyLayak Aid** 💰
- Financial assistance program matching
- NGO support resources
- Eligibility assessment for Malaysian aid programs

### 9. **User Profile** 👤
- Settings management
- Trusted contacts configuration
- Emergency preferences

---

## Key Differentiators

| Feature | LUNA | Other Apps |
|---------|------|------------|
| **Camouflage Interface** | ✅ Period tracker disguise | ❌ Obvious safety app |
| **AI-Powered Evidence Analysis** | ✅ Google Gemini 1.5 Flash | ❌ Manual entry only |
| **Deepfake Protection** | ✅ Adversarial Immunization | ❌ Not available |
| **Malaysian Voice** | ✅ Azure en-MY-WilliamNeural | ❌ Generic voices |
| **Hazim Coaching** | ✅ Localized persona | ❌ Generic AI |
| **Legal PDF Reports** | ✅ Auto-generated | ❌ Not available |
| **End-to-End Encryption** | ✅ AES-256 | ⚠️ Varies |
| **Open Source** | ✅ GitHub | ❌ Proprietary |

---

## Technical Architecture

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI Framework with hooks and state management |
| **TypeScript** | Latest | Type safety and enhanced developer experience |
| **Vite** | 6.3.5 | Build tool with SWC for fast HMR and optimized builds |
| **Tailwind CSS** | Latest | Utility-first CSS framework for styling |
| **Firebase Hosting** | Latest | Google Cloud global CDN hosting |

### UI Component Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| **Radix UI** | Latest | Headless, accessible component primitives (50+ components) |
| **Lucide React** | 0.487.0 | Comprehensive icon library |
| **Recharts** | 2.15.2 | Data visualization and charting |
| **React Day Picker** | 8.10.1 | Calendar component for period tracking |
| **Input OTP** | 1.4.2 | One-time password input component |

### Radix UI Components Used
- Accordion, Alert Dialog, Avatar, Aspect Ratio
- Checkbox, Collapsible, Context Menu
- Dialog, Dropdown Menu, Hover Card
- Label, Menubar, Navigation Menu, Popover, Progress
- Radio Group, Scroll Area, Select, Separator, Slider
- Switch, Tabs, Toggle, Toggle Group, Tooltip

### Backend & Cloud Infrastructure

| Technology | Purpose |
|------------|---------|
| **Supabase** | Backend-as-a-Service (Database, Auth, Storage, Edge Functions) |
| **PostgreSQL** | Primary relational database with JSONB support |
| **Supabase Storage** | Encrypted file storage with AES-256 |
| **Supabase Edge Functions** | Serverless compute on Deno runtime |
| **Row Level Security (RLS)** | Fine-grained database access control |
| **Firebase Hosting** | Global CDN deployment with automatic HTTPS |

### AI/ML Services

| AI Model | Provider | Purpose |
|----------|----------|---------|
| **Google Gemini 1.5 Flash** | Google (Native) | Evidence analysis, forensic reports, Walk With Me companion |
| **Google Gemini 2.5 Flash** | Google (via AI gateway) | Conversation training with Hazim persona |
| **Google Gemini Vision** | Google (Native) | Deepfake detection, image forensics |
| **Azure Neural TTS** | Microsoft | Text-to-speech with en-MY-WilliamNeural voice |

### Development Tools & Utilities

| Library | Version | Purpose |
|---------|---------|---------|
| **@vitejs/plugin-react-swc** | 3.10.2 | Fast React refresh with SWC |
| **Hono** | Latest | Lightweight web framework for Edge Functions |
| **jsPDF** | 4.1.0 | PDF generation for legal reports |
| **jsPDF-AutoTable** | 5.0.7 | PDF table generation |
| **QRCode** | 1.5.4 | QR code generation |
| **React Hook Form** | 7.55.0 | Form validation and management |
| **Sonner** | 2.0.3 | Toast notifications |
| **next-themes** | 0.4.6 | Theme management |
| **cmdk** | 1.1.1 | Command palette component |
| **embla-carousel-react** | 8.6.0 | Carousel component |
| **react-resizable-panels** | 2.1.7 | Resizable layout panels |
| **vaul** | 1.1.2 | Drawer/sheet component |

### Location & Maps Services

| Service | Purpose |
|---------|---------|
| **@vis.gl/react-google-maps** | 1.7.1 | Google Maps integration for React |
| **Google Maps JavaScript API** | Interactive maps, directions |
| **Google Directions API** | Route planning and navigation |
| **Google Geocoding API** | Address resolution |

### Build Configuration

```typescript
// Vite Configuration
{
  "target": "esnext",           // Modern browser target
  "outDir": "dist",             // Firebase Hosting public directory
  "port": 3000,                 // Development server port
  "plugins": ["react-swc"]      // Fast React refresh
}
```

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              LUNA Women's Safety App                                │
│                         (Single Page Application - React)                            │
│                        Deployed on Firebase Hosting (CDN)                           │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                 FRONTEND LAYER                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   React UI   │  │  Components  │  │    State     │  │  Navigation  │            │
│  │  (Vite + TS) │  │ (Radix UI)   │  │  Management  │  │   Routing    │            │
│  │  v18.3.1     │  │  50+ comps   │  │   useState   │  │   App.tsx    │            │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   Tailwind   │  │   Lucide     │  │   Recharts   │  │   Google     │            │
│  │     CSS      │  │   Icons      │  │  Charts      │  │    Maps      │            │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              API / SERVICE LAYER                                     │
│  ┌──────────────────────────┐  ┌──────────────────────────┐                        │
│  │   Supabase Client        │  │   Edge Functions         │                        │
│  │   (@jsr/supabase-js)     │  │   (Deno Runtime)         │                        │
│  │   - Database queries     │  │   - analyze-evidence     │                        │
│  │   - Storage operations   │  │   - make-server          │                        │
│  │   - Auth sessions        │  │   - chat-companion       │                        │
│  └──────────────────────────┘  │   - generate-voice       │                        │
│                                └──────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              AI/ML SERVICES LAYER                                    │
│  ┌──────────────────────────┐  ┌──────────────────────────┐  ┌─────────────────┐  │
│  │   Google Gemini AI       │  │   Azure Cognitive        │  │   AI Gateway    │  │
│  │   (Native API)           │  │   Services (TTS)         │  │   (Chat)        │  │
│  │                          │  │                          │  │                 │  │
│  │ - Gemini 1.5 Flash       │  │ - Neural TTS             │  │ - Gemini 2.5    │  │
│  │ - Gemini Vision          │  │ - en-MY-WilliamNeural    │  │   Flash         │  │
│  │ - Multimodal Analysis    │  │ - MP3 Audio Output       │  │ - Hazim Persona │  │
│  └──────────────────────────┘  └──────────────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND & STORAGE LAYER                                 │
│  ┌──────────────────────────┐  ┌──────────────────────────┐  ┌─────────────────┐  │
│  │   Supabase PostgreSQL    │  │   Supabase Storage       │  │   Supabase      │  │
│  │   Database               │  │   (Encrypted)            │  │   Auth          │  │
│  │                          │  │                          │  │                 │  │
│  │ - incident_reports       │  │ - AES-256 Encryption      │  │ - JWT Sessions  │  │
│  │ - JSONB Support          │  │ - Private Buckets         │  │ - Anon Support  │  │
│  │ - RLS Policies           │  │ - User Isolation         │  │ - Row Level     │  │
│  │ - Indexes & Triggers     │  │ - 50MB Limit             │  │   Security      │  │
│  └──────────────────────────┘  └──────────────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Component Architecture Diagram

```
src/
├── App.tsx                          # Main router & state management
├── main.tsx                         # React entry point (Vite)
│
├── components/                      # React Components
│   ├── ui/                          # Radix UI primitives (50+)
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── avatar.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── slider.tsx
│   │   ├── switch.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx (sonner)
│   │   ├── toggle-group.tsx
│   │   └── tooltip.tsx
│   │
│   ├── CamouflageHome.tsx           # Period tracking disguise
│   ├── SecureDashboard.tsx          # Main safety dashboard
│   ├── EvidenceVault.tsx            # Evidence management & analysis
│   ├── PhotoDefense.tsx             # Photo privacy & deepfake detection
│   ├── WalkWithMe.tsx               # Location sharing & AI companion
│   ├── ConversationTraining.tsx     # AI coaching with Hazim
│   ├── LifeCopilot.tsx              # AI assistant
│   ├── MyLayakEligibility.tsx       # Financial aid finder
│   ├── UserProfile.tsx              # Settings & profile
│   ├── IncidentReportView.tsx       # Report detail view
│   ├── SimulatedCall.tsx            # Fake call feature
│   └── FallbackMap.tsx              # Maps fallback component
│
├── lib/
│   └── supabase.ts                  # Database client & TypeScript types
│
├── utils/
│   ├── generateForensicPDF.ts       # PDF report generation (jsPDF)
│   ├── mapsHelper.ts                # Google Maps utilities
│   └── ttsService.ts                # Azure TTS service client
│
└── supabase/
    └── functions/
        ├── analyze-evidence/
        │   └── index.ts             # Forensic evidence analysis
        ├── make-server-7f9db486/
        │   ├── index.ts             # Main AI hub (Hono framework)
        │   ├── ai_service.tsx       # AI service integrations
        │   └── kv_store.tsx         # Key-value storage
        ├── chat-companion/
        │   └── index.ts             # Walk With Me chat (Hazim)
        └── generate-voice/
            └── index.ts             # Azure Neural TTS generation
```

---

## AI/ML Services Integration

### AI Models by Feature

| Feature | AI Model | Provider | API Endpoint | Purpose |
|---------|----------|----------|--------------|---------|
| **Evidence Analysis** | Gemini 1.5 Flash | Google (Native) | generativelanguage.googleapis.com | Forensic analysis of images/audio |
| **Photo Defense** | Gemini Vision | Google (Native) | generativelanguage.googleapis.com | Deepfake detection & image forensics |
| **Conversation Training** | Gemini 2.5 Flash | Google (via AI Gateway) | AI Gateway API | Boundary setting coaching with Hazim |
| **Walk With Me** | Gemini 1.5 Flash | Google (Native) | generativelanguage.googleapis.com | Real-time AI companion |
| **Voice Generation** | Azure Neural TTS | Microsoft | Azure Cognitive Services | en-MY-WilliamNeural voice synthesis |
| **Emergency Alerts** | Gemini 1.5 Flash | Google (Native) | generativelanguage.googleapis.com | Structured emergency alert generation |

### Google Gemini API Integration

#### 1. Gemini 1.5 Flash (Native API)

**Features Used:**
- Evidence analysis (incident_reports)
- Walk With Me companion (real-time chat)
- Emergency alert generation
- Image forensics (Gemini Vision)

**API Configuration:**
```typescript
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Request format
{
  contents: [{
    role: 'user',
    parts: [{ text: 'prompt' }]
  }],
  generationConfig: {
    temperature: 0.8,
    responseMimeType: 'application/json'
  }
}
```

#### 2. Gemini 2.5 Flash (via AI Gateway)

**Features Used:**
- Conversation training (Hazim persona)
- Safety scoring (1-10 scale)
- Boundary setting coaching

**Model Configuration:**
```typescript
model: 'google/gemini-2.5-flash'
temperature: 0.8
max_tokens: 500
response_format: { type: 'json_object' }
```

#### 3. Gemini Vision API

**Features Used:**
- Deepfake detection
- Image manipulation analysis
- Watermark identification
- Evidence authenticity verification

**Request Format:**
```typescript
{
  contents: [{
    role: 'user',
    parts: [
      { text: 'analysis prompt' },
      { inline_data: { mime_type: 'image/jpeg', data: 'base64' } }
    ]
  }]
}
```

### Azure Cognitive Services Integration

#### Azure Neural TTS

**Voice Profile:**
- **Name**: en-MY-WilliamNeural
- **Language**: Malaysian English (en-MY)
- **Gender**: Male
- **Style**: Warm, natural, Manglish-friendly

**API Configuration:**
```typescript
const AZURE_TTS_REGION = 'southeastasia'; // or your region
const VOICE_NAME = 'en-MY-WilliamNeural';

// SSML Format
<speak version='1.0' xml:lang='en-MY'>
  <voice name='en-MY-WilliamNeural'>
    <prosody rate='1.15' pitch='-2%'>text</prosody>
  </voice>
</speak>
```

**Audio Output:**
- Format: MP3
- Quality: 48kHz (Neural TTS)
- Playback: HTMLAudioElement

### AI Service Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      AI Service Orchestrator                    │
│                  (make-server-7f9db486/index.ts)                │
└─────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌────────────────┐   ┌────────────────┐   ┌────────────────┐
│ Conversation   │   │  Photo Defense │   │ Walk With Me   │
│ Training       │   │                │   │                │
│                │   │                │   │                │
│ - Gemini 2.5   │   │ - Gemini Vision│   │ - Gemini 1.5   │
│   Flash        │   │ - Deepfake     │   │   Flash        │
│ - Hazim Persona│   │   Detection    │   │ - Hazim Chat   │
└────────────────┘   └────────────────┘   └────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌────────────────┐   ┌────────────────┐   ┌────────────────┐
│ Evidence Vault │   │ Image Analysis │   │ Voice Gen      │
│                │   │                │   │                │
│ - Gemini 1.5   │   │ - Watermark    │   │ - Azure TTS    │
│   Flash        │   │   Check        │   │ - William      │
│ - Forensic     │   │ - Metadata     │   │   Neural       │
│   Reports      │   │   Analysis     │   │                │
└────────────────┘   └────────────────┘   └────────────────┘
```

---

## Deepfake Protection Architecture

LUNA employs a proactive defense mechanism against the rising threat of non-consensual deepfakes. Instead of merely detecting fakes, LUNA "immunizes" user photos to prevent AI manipulation before it happens.

### Core Concept: Photo Immunization
The system applies an **Adversarial Perturbation Layer** to uploaded images. This involves:
1.  **High-Frequency Pixel Modification**: Subtle changes to pixel data that are invisible to humans but disruptive to neural networks.
2.  **AI Disruption**: When a protected image is processed by generative models (e.g., Stable Diffusion, Midjourney), the perturbation causes the model to fail or produce incorrect outputs.
3.  **Visual Integrity**: The modifications ensure no visible distortion, maintaining the original photo's aesthetic quality.

### System Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                   DEEPFAKE PROTECTION WORKFLOW                  │
└─────────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐
│     PROTECT IMAGE     │       │    VERIFY IMAGE       │
│     (Immunization)    │       │    (Validation)       │
└───────────┬───────────┘       └───────────┬───────────┘
            │                               │
            ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐
│ 1. Image Preprocessing│       │ 1. Steganographic     │
│    (Resize/Normalize) │       │    Signature Scan     │
└───────────┬───────────┘       └───────────┬───────────┘
            │                               │
            ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐
│ 2. Adversarial        │       │ 2. Hash Comparison    │
│    Perturbation Engine│       │    (SHA-256)          │
└───────────┬───────────┘       └───────────┬───────────┘
            │                               │
            ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐
│ 3. Steganographic     │       │ 3. Device Key         │
│    Signature Embed    │       │    Authentication     │
└───────────┬───────────┘       └───────────┬───────────┘
            │                               │
            ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐
│ 4. SHA-256 Hash       │       │ 4. Display Result     │
│    Generation         │       │    (Protected/Unpro.) │
└───────────┬───────────┘       └───────────────────────┘
            │
            ▼
┌───────────────────────┐
│ 5. Output Protected   │
│    Image              │
└───────────────────────┘
```

### Technical Components

| Component | Function | Technology |
|-----------|----------|------------|
| **Perturbation Engine** | Adds noise to disrupt AI feature extraction | Adversarial ML Algorithms |
| **Steganography Module** | Embeds invisible verification signatures | LSB (Least Significant Bit) / DCT |
| **Hash Generator** | Creates unique fingerprint for integrity | SHA-256 Cryptographic Hash |
| **Verification Scanner** | Detects embedded signatures and validates keys | Custom Decoding Logic |

### Security Maintenance & Robustness
To ensure long-term effectiveness against evolving AI models:

*   **Security Maintenance**:
    *   **Encryption Library Updates**: Regular updates to cryptographic libraries to prevent signature forgery.
    *   **Key Rotation Policies**: Periodic rotation of device keys used in the verification process to prevent spoofing.
*   **AI Robustness**:
    *   **Adaptive Perturbation**: Continuously updating perturbation methods to counteract new generative models (e.g., Midjourney v6, Stable Diffusion 3).
    *   **Pipeline Testing**: Regular testing of editing pipelines to ensure the "immunization" remains effective against the latest AI editing tools.

### User Interface
The feature is accessible via the **Photo Privacy Care** module:
- **Protect a Photo**: Initiates the immunization pipeline.
- **Verify Protection**: Checks if an image is protected and authentic.
- **Scan Report**: Displays AI detection scores (e.g., "AI Detection: 45%") and protection status ("Privacy Shield: Protected/Unprotected").

---

## Data Flow Diagrams

### 1. Evidence Collection & Analysis Flow

```
┌──────────────┐
│ User Uploads │
│   Evidence   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ File Capture │ (React state)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  User Input  │ Optional context
└──────┬───────┘
       │
       ├─────[Skip AI]─────────────┐
       │                           │
       ▼                           ▼
┌──────────────┐          ┌──────────────┐
│ Upload to    │          │ Call AI      │
│ Supabase     │          │ Edge Function│
│ Storage      │          │              │
└──────┬───────┘          │ - analyze-   │
       │                  │   evidence   │
       │                  └──────┬───────┘
       │                         │
       │                         ▼
       │                  ┌──────────────┐
       │                  │ Gemini 1.5   │
       │                  │ Flash        │
       │                  │ Analysis     │
       │                  └──────┬───────┘
       │                         │
       │                         ▼
       │                  ┌──────────────┐
       │                  │ Generate     │
       │                  │ Forensic     │
       │                  │ Report       │
       │                  └──────┬───────┘
       │                         │
       │                         ▼
       │                  ┌──────────────┐
       │                  │ Store in     │
       │                  │ Database     │
       │                  │ + Risk Score │
       │                  └──────┬───────┘
       │                         │
       └─────────┬───────────────┘
                 │
                 ▼
         ┌──────────────┐
         │ Display in   │
         │ Evidence     │
         │ Vault        │
         └──────────────┘
```

### 2. Walk With Me Data Flow

```
┌──────────────┐
│ User Starts  │
│ Walk With Me │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Get Location │
│ (Geolocation │
│   API)       │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Monitor      │
│ Movement     │
│ (Watch       │
│  Position)   │
└──────┬───────┘
       │
       ├─────────┬─────────┬─────────┐
       ▼         ▼         ▼         ▼
┌──────────┐┌──────────┐┌──────────┐┌──────────┐
│ Speaking ││ User     ││ Generate ││ Display  │
│ Button   ││ Message  ││ Response ││ Map      │
└────┬─────┘└────┬─────┘└────┬─────┘└──────────┘
     │           │           │
     ▼           ▼           ▼
┌──────────────┐────────────┐──────────────┐
│ Call Chat    │ Call Gemini│ Call Azure  │
│ Companion    │ 1.5 Flash  │ TTS         │
│ Edge Fx      │            │             │
└──────┬───────┴────────┬───┴──────┬───────┘
       │               │           │
       ▼               ▼           ▼
┌──────────────┐┌────────────┐┌────────────┐
│ Text Response││ AI Message ││ MP3 Audio  │
│              ││            ││            │
└──────┬───────┘└─────┬──────┘└─────┬──────┘
       │               │            │
       ▼               ▼            ▼
┌──────────────┐────────────┐──────────────┐
│ Display      │ Update     │ Play Audio   │
│ Chat Bubble  │ Status     │ (Audio Obj)  │
└──────────────┴────────────┴──────────────┘
```

### 3. Conversation Training Flow

```
┌──────────────┐
│ User Selects │
│  Scenario    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Configure    │
│ Settings     │
│ - Scenario   │
│ - Intensity  │
│ - Personality│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Start Chat   │
│ Session      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ User Types   │
│ Response     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Call AI      │
│ Service      │
│ - Gemini 2.5 │
│   Flash      │
│ - Hazim      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Generate     │
│ Response     │
│ - Opponent   │
│   Reply      │
│ - Safety     │
│   Score      │
│ - Coach      │
│   Feedback   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Display      │
│ Results &    │
│ Continue     │
└──────────────┘
```

---

## Workflow & User Journey

### 1. Initial Access Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                       APP LAUNCH                                │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CAMOUFLAGE HOME SCREEN                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │         📅 Period Tracker Calendar View                 │    │
│  │         (Disguise - Looks like fertility app)           │    │
│  │                                                          │    │
│  │         [Triple-tap the "V" button 3x to unlock]        │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Triple-tap (3x)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       PIN ENTRY                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │         Enter PIN: [•] [•] [•] [•]                       │    │
│  │         (Default: 2-4-6-8)                               │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SECURE DASHBOARD                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ Evidence │ │   Photo  │ │   Walk   │ │ Conversa ││            │
│  │   Vault  │ │  Defense │ │ With Me  │ │  tion    ││            │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │  Life    │ │  MyLayak │ │   User   │ │          │            │
│  │ Copilot  │ │   Aid    │ │ Profile  │ │          │            │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Emergency Response Flow

```
┌──────────────────┐
│  THREAT DETECTED │
└─────────┬────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    USER ACTIVATES GUARDIAN MODE                 │
└─────────────────────────────────────────────────────────────────┘
          │
          ├───[SHARE LOCATION]──────────────────────────────┐
          │                                                  │
          ├───[SIMULATE CALL]─────────────────────┐          │
          │                                         │          │
          └───[PANIC RECORD]────────┐               │          │
                                    │               │          │
                                    ▼               ▼          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EMERGENCY ACTIONS                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Location     │  │ Fake Call    │  │ Audio        │          │
│  │ Shared with  │  │ Screen       │  │ Recording    │          │
│  │ Trusted      │  │ Activated    │  │ Started      │          │
│  │ Contacts     │  │              │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CONTACTS NOTIFIED                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  SMS/Notification: "LUNA needs help. Location: [MAP]"   │    │
│  │  - Live location link                                    │    │
│  │  - Emergency contacts                                    │    │
│  │  - Timestamp                                             │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Evidence Collection Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER UPLOADS EVIDENCE                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ 📷 Camera    │  │ 🎤 Audio     │  │ 📄 Document  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    USER ADDS CONTEXT (OPTIONAL)                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  "Describe the incident..."                              │    │
│  │  [Textarea for user's account]                           │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
        ┌───────────────┐      ┌───────────────┐
        │ UPLOAD ONLY   │      │ AI ANALYSIS   │
        │ (Skip AI)     │      │ ENABLED       │
        └───────┬───────┘      └───────┬───────┘
                │                       │
                │                       ▼
                │              ┌─────────────────────────────────┐
                │              │     SUPABASE EDGE FUNCTION      │
                │              │     analyze-evidence           │
                │              └─────────────┬───────────────────┘
                │                            │
                │          ┌─────────────────┴─────────────────┐
                │          ▼                                   ▼
                │  ┌───────────────────┐           ┌───────────────────┐
                │  │   Upload File     │           │   Google Gemini   │
                │  │   to Supabase     │           │   1.5 Flash       │
                │  │   Storage         │           │   Forensic AI     │
                │  └───────────────────┘           └─────────┬─────────┘
                │          │                               │
                │          │                               ▼
                │          │                  ┌─────────────────────────┐
                │          │                  │  Generate Forensic     │
                │          │                  │  Analysis Report       │
                │          │                  │  - Risk Score (0-100)  │
                │          │                  │  - Risk Level          │
                │          │                  │  - Abuse Categories     │
                │          │                  │  - Legal Findings      │
                │          │                  │  - Recommendations     │
                │          │                  └────────────┬───────────┘
                │          │                               │
                │          └───────────────┬───────────────┘
                │                          │
                ▼                          ▼
        ┌───────────────────────────────────────────────┐
        │          STORE IN DATABASE                    │
        │  ┌─────────────────────────────────────────┐  │
        │  │  incident_reports Table                 │  │
        │  │  - evidence_url                         │  │
        │  │  - evidence_type                        │  │
        │  │  - user_context                         │  │
        │  │  - ai_analysis (JSONB)                  │  │
        │  │  - risk_score                           │  │
        │  │  - risk_level                           │  │
        │  │  - status                               │  │
        │  │  - created_at                           │  │
        │  └─────────────────────────────────────────┘  │
        └───────────────────────┬───────────────────────┘
                                │
                                ▼
        ┌───────────────────────────────────────────────┐
        │          DISPLAY IN EVIDENCE VAULT            │
        │  ┌─────────────────────────────────────────┐  │
        │  │  - Evidence thumbnail                   │  │
        │  │  - Risk score badge                     │  │
        │  │  - AI summary                           │  │
        │  │  - "View Full Report" button            │  │
        │  │  - "Export PDF" button                  │  │
        │  └─────────────────────────────────────────┘  │
        └───────────────────────────────────────────────┘
```

---

## Implementation Details

### Prerequisites

| Tool | Minimum Version | Purpose |
|------|-----------------|---------|
| **Node.js** | 18.0.0+ | JavaScript runtime |
| **npm** | Latest | Package manager |
| **Git** | Latest | Version control |
| **Supabase CLI** | Latest | Edge Functions deployment |
| **Firebase CLI** | Latest | Hosting deployment |

### Step 1: Get Your API Keys

#### Google Gemini API Key (Required)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Save your API key for Step 5

#### Azure Cognitive Services Key (Required for Voice)
1. Go to [Azure Portal](https://portal.azure.com)
2. Create a Speech Services resource
3. Get your API key and region
4. Save for Step 5

#### Google Maps API Key (Required)
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create an API key
3. Enable these APIs:
   - Maps JavaScript API
   - Directions API
   - Geocoding API
4. Save for Step 4

#### Supabase Project (Required)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Save your Project URL and anon key from Settings → API

### Step 2: Clone Repository

```bash
git clone https://github.com/your-username/LUNA.git
cd LUNA
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Environment Configuration

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Note: AI API keys are set in Supabase Edge Function secrets
# Do NOT add them to .env
```

### Step 5: Database Setup


### Step 6: Deploy Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your_project_ref

# Set Google Gemini API Key
supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here

# Set Azure TTS API Key (if using voice features)
supabase secrets set AZURE_TTS_API_KEY=your_azure_tts_api_key_here
supabase secrets set AZURE_TTS_REGION=your_azure_region_here

# Set AI Gateway Key (for conversation training)
supabase secrets set API_KEY=your_ai_gateway_key_here

# Deploy Edge Functions
supabase functions deploy analyze-evidence --no-verify-jwt
supabase functions deploy make-server-7f9db486 --no-verify-jwt
supabase functions deploy chat-companion --no-verify-jwt
supabase functions deploy generate-voice --no-verify-jwt
```

### Step 7: Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

---

## Deployment Guide

### Firebase Hosting Deployment

#### Why Firebase Hosting?
- **Global CDN**: Fast content delivery worldwide
- **Automatic HTTPS**: SSL certificates included
- **Single-page App Support**: Client-side routing
- **Zero-downtime Deployments**: Rollback capabilities

#### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

#### Step 2: Login to Firebase

```bash
firebase login
```

#### Step 3: Build Your React App

```bash
npm run build
```

This creates the `dist/` folder with production-ready files.

#### Step 4: Deploy to Firebase Hosting

```bash
firebase deploy
```

Your app will be live at: `https://your-project-id.web.app`

#### Firebase Configuration (firebase.json)

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Cross-Origin-Embedder-Policy",
            "value": "require-corp"
          },
          {
            "key": "Cross-Origin-Opener-Policy",
            "value": "same-origin"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          }
        ]
      }
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## Project Structure

```
LUNA-main/
├── src/                                    # React/TypeScript source
│   ├── components/                         # React components
│   │   ├── ui/                            # Radix UI (50+ components)
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx (sonner)
│   │   │   ├── toggle-group.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   ├── CamouflageHome.tsx             # Period tracking disguise
│   │   ├── SecureDashboard.tsx            # Main safety dashboard
│   │   ├── EvidenceVault.tsx              # Evidence management
│   │   ├── PhotoDefense.tsx               # Photo privacy features
│   │   ├── WalkWithMe.tsx                 # Location sharing
│   │   ├── ConversationTraining.tsx       # AI coaching scenarios
│   │   ├── LifeCopilot.tsx                # AI assistant
│   │   ├── MyLayakEligibility.tsx         # Financial aid finder
│   │   ├── UserProfile.tsx                # Settings & profile
│   │   ├── IncidentReportView.tsx         # Report detail view
│   │   ├── SimulatedCall.tsx              # Fake call feature
│   │   └── FallbackMap.tsx                # Maps fallback component
│   │
│   ├── lib/
│   │   └── supabase.ts                    # Database client & types
│   │
│   ├── utils/
│   │   ├── generateForensicPDF.ts         # PDF report generator
│   │   ├── mapsHelper.ts                  # Google Maps utilities
│   │   └── ttsService.ts                  # Azure TTS service client
│   │
│   ├── App.tsx                            # Main app router
│   └── main.tsx                           # Entry point
│
├── supabase/                              # Backend services
│   └── functions/                         # Edge Functions (Deno)
│       ├── analyze-evidence/
│       │   └── index.ts                   # Forensic evidence analysis
│       ├── make-server-7f9db486/
│       │   ├── index.ts                   # AI hub (Hono)
│       │   ├── ai_service.tsx             # AI integrations
│       │   └── kv_store.tsx               # Key-value storage
│       ├── chat-companion/
│       │   └── index.ts                   # Walk With Me chat
│       └── generate-voice/
│           └── index.ts                   # Azure TTS generation
│
├── public/                                # Static assets
├── firebase.json                          # Firebase Hosting config
├── .firebaserc                            # Firebase project config
├── deploy.sh                              # Deployment script
├── .env.example                           # Environment template
├── vite.config.ts                         # Vite configuration
├── package.json                           # Dependencies
├── tsconfig.json                          # TypeScript config
└── README.md                              # This file
```

---

## API Documentation

### Edge Functions Endpoints

#### 1. Analyze Evidence

**Endpoint**: `POST /functions/v1/analyze-evidence`

**Description**: Analyzes evidence (images/audio) using Google Gemini 1.5 Flash for forensic analysis and risk assessment.

**Request Body**:
```json
{
  "evidenceUrl": "string (Supabase storage URL)",
  "userContext": "string (optional user description)",
  "evidenceType": "image" | "audio" | "document",
  "userId": "string (optional)",
  "reportId": "string (optional)"
}
```

**Response**:
```json
{
  "success": true,
  "analysis": {
    "incident_summary": "string",
    "abuse_categories": ["Physical", "Emotional", "Verbal"],
    "risk_assessment": {
      "level": "Low" | "Medium" | "High" | "Critical",
      "score": 75,
      "indicators": ["list of risk indicators"],
      "escalation_risk": "None" | "Low" | "Medium" | "High",
      "immediate_danger": false
    },
    "evidence_analysis": {
      "visible_damage": ["list of findings"],
      "environmental_context": ["context details"],
      "temporal_markers": ["time indicators"],
      "supporting_details": ["additional observations"]
    },
    "legal_findings": {
      "potential_charges": ["legal classifications"],
      "evidence_strength": "Weak" | "Moderate" | "Strong" | "Conclusive",
      "corroboration_needed": ["what additional evidence needed"],
      "documentation_adequate": true
    },
    "recommended_actions": {
      "immediate": ["immediate safety steps"],
      "legal": ["legal actions"],
      "documentation": ["additional documentation"],
      "support_resources": ["support services"]
    },
    "follow_up_questions": ["clarifying questions"],
    "disclaimer": "legal disclaimer text"
  },
  "riskScore": 75,
  "riskLevel": "High"
}
```

#### 2. Conversation Training (Hazim)

**Endpoint**: `POST /functions/v1/make-server-7f9db486/conversation/respond`

**Description**: Provides AI-powered boundary setting coaching using Google Gemini 2.5 Flash with Hazim persona.

**Request Body**:
```json
{
  "scenarioId": "workplace" | "public" | "social",
  "userMessage": "string",
  "conversationHistory": [
    { "sender": "user" | "ai", "text": "string" }
  ],
  "simulationSettings": {
    "intensity": "low" | "medium" | "high",
    "personality": "aggressive" | "passive_aggressive" | "gaslighting" | "flirty" | "subtle"
  }
}
```

**Response**:
```json
{
  "opponent_reply": "character's response",
  "safety_score": 7,
  "coach_feedback": "Hazim's Malaysian-style feedback"
}
```

#### 3. Photo Defense - Verify Image

**Endpoint**: `POST /functions/v1/make-server-7f9db486/photo/verify`

**Description**: Analyzes image for deepfake detection and manipulation using Google Gemini Vision.

**Request Body**:
```json
{
  "imageBase64": "string (base64 encoded image)"
}
```

**Response**:
```json
{
  "isProtected": true,
  "confidence": 85,
  "deepfakeScore": 90,
  "analysis": "detailed analysis text",
  "threats": ["potential threats list"]
}
```

#### 4. Photo Defense - Protect Image

**Endpoint**: `POST /functions/v1/make-server-7f9db486/photo/protect`

**Description**: Adds invisible watermark to image for authenticity verification.

**Request Body**:
```json
{
  "imageBase64": "string",
  "watermarkEnabled": true
}
```

**Response**:
```json
{
  "protectedImage": "string (base64)",
  "watermarkId": "WM-timestamp-random",
  "timestamp": "ISO-8601 timestamp"
}
```

#### 5. Walk With Me - Chat Companion

**Endpoint**: `POST /functions/v1/chat-companion`

**Description**: Real-time AI companion chat using Google Gemini 2.5 Flash with Hazim persona.

**Request Body**:
```json
{
  "message": "string (user's spoken words)",
  "location": {
    "latitude": 3.139,
    "longitude": 101.686
  },
  "isMoving": true,
  "mode": "OUTSIDE" | "AT_HOME"
}
```

**Response**:
```json
{
  "reply": "string (Hazim's response)",
  "isEmergency": false,
  "suggestedActions": ["optional actions"]
}
```

#### 6. Generate Voice (Azure TTS)

**Endpoint**: `POST /functions/v1/generate-voice`

**Description**: Converts text to speech using Azure Neural TTS with en-MY-WilliamNeural voice.

**Request Body**:
```json
{
  "text": "string (text to synthesize)"
}
```

**Response**: Audio blob (MP3 format)s

---

## Future Roadmap
## 🧱 Phase 1: Foundation & Core Security (Q1 - Q2 2026)**
**Focus:** Establishing the dual-interface mechanism and forensic-grade evidence collection.
- Dual-interface “Wellness” disguise (hidden triple-tap access)
- AES-256 encrypted local Evidence Vault
- Auto metadata capture (GPS, timestamp, device info)
- AI forensic analysis + risk scoring (0–100)
- Simulated Call voice deterrence

## 🛡️ Phase 2: Digital Defense & Monetization (Q3–Q4 2026)
**Focus:** Premium launch & identity protection
### 💎 Luna Premium (RM19–29/month)
- Deepfake protection (adversarial perturbation)
- Unlimited encrypted cloud backup
- Legal-ready PDF report generation
- AI support eligibility matching (NGO & gov aid)
- Enhanced AI companion (“Hazim”) with localized logic

## 🏢 Phase 3: Institutional & B2B Expansion (H1 2027)
**Focus:** Organizational partnerships
- Institutional licensing dashboard
- Aggregated, anonymized safety analytics
- Zero-Knowledge Proof (ZKP) eligibility verification
- Secure API integration with shelters & legal aid

## 🌏 Phase 4: Predictive Safety & ASEAN Scaling (H2 2027)
**Focus:** Regional expansion & proactive protection
- Localization for SG, ID, TH
- AI-powered Safe Route risk prediction
- Insurance partnerships (Digital Wellness bundling)
- National-level GBV reporting infrastructure

## 💰 Sustainability Model

| Tier | Pricing | Value |
|------|---------|-------|
| **Luna Free** | RM 0 | SOS, basic deterrence, local encryption |
| **Luna Premium** | RM 19–29/mo | Deepfake protection, legal reports, aid matching |
| **Institutional** | Custom | Risk dashboards & workflow management |

---

## Security Features

### 1. Privacy by Design
- **Camouflage Interface**: App appears as a period tracking app
- **Triple-tap Unlock**: Hidden PIN access (default: 2468)
- **Quick Exit**: Instantly return to camouflage screen
- **No App Icon**: Discreet launcher icon design

### 2. Data Protection
- **AES-256 Encryption**: All evidence encrypted at rest in Supabase Storage
- **Row Level Security**: Database access controls per user
- **Private Storage Buckets**: User-isolated folders
- **No Local Traces**: Evidence wiped from device after upload
- **Secure Transmission**: HTTPS/TLS for all API calls

### 3. Authentication
- **Anonymous Support**: Stable UUID for anonymous users
- **Supabase Auth**: Optional authenticated sessions
- **JWT Sessions**: Secure token handling
- **Auto-expiry**: Configurable session timeouts

### 4. Evidence Integrity
- **Timestamped Records**: All evidence logged with ISO timestamps
- **Chain of Custody**: Complete audit trail in database
- **Watermarking**: Invisible watermarking for authenticity
- **PDF Export**: Forensic-quality report generation with jsPDF
- **Hash Verification**: Content-based hashing for integrity

### 5. Emergency Safety
- **Panic Button**: Hold-to-record functionality
- **Silent Activation**: Discreet emergency triggers
- **Location Sharing**: Real-time GPS coordinates
- **Contact Notifications**: Automated alerts to trusted contacts
- **Fake Call**: Simulated incoming call for emergency exit

---

## Contributing

We welcome contributions to LUNA! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style (TypeScript, functional components)
- Use TypeScript for type safety
- Write meaningful commit messages
- Test thoroughly before submitting
- Ensure all AI API calls have proper error handling

### Code Style
```typescript
// Use functional components with hooks
export function MyComponent({ prop }: Props) {
  const [state, setState] = useState(initialState);

  return <div>{/* JSX */}</div>;
}

// Use TypeScript interfaces
interface Props {
  prop: string;
}

// Follow naming conventions
const camelCase = 'value';
const PascalCase = Component;
```

---

## Deepfake Protection

### How Does it Protect Images?

PhotoGuard works by applying adversarial perturbations to an image. In simple terms, it alters the pixel values of the image in microscopic ways that are completely invisible to the human eye, but highly disruptive to artificial intelligence.

When an AI model tries to process the protected image to edit it, these invisible changes confuse the system, causing the attempted edit to fail or produce a garbled, unusable result.

### PhotoGuard achieves this through two primary methods:

1. The Encoder Attack
Before an AI can edit an image, it must first "understand" it by compressing it into a mathematical format (a latent representation).

The Defense: The Encoder Attack adds invisible noise that tricks the AI into thinking the image is something completely different.

The Result: Because the AI fundamentally misunderstands what it is looking at, any text prompts used to edit the image will fail to apply correctly.

2. The Diffusion Attack
This is a more complex and robust defense that targets the actual image-generation phase (the diffusion process) of the AI model.

The Defense: It mathematically optimizes the hidden noise to actively sabotage the AI's ability to generate new pixels based on the original image.

The Result: If someone tries to alter a protected photo (e.g., trying to change the background or add a person), the AI will output a gray, pixelated, or entirely distorted mess instead of a realistic fake.

---

## License

This project is developed for women's safety and privacy protection.

**Important**: This application is for informational purposes only. AI-generated analysis should be reviewed by qualified legal counsel. The recommendations provided do not constitute legal advice.

---

## Acknowledgments

### Technology Providers
- **Google AI** - Google Gemini 1.5 Flash, 2.5 Flash, and Vision API
- **Microsoft Azure** - Azure Cognitive Services Neural TTS
- **Supabase** - Backend-as-a-Service platform
- **Firebase** - Google Cloud Hosting
- **Radix UI** - Accessible component primitives
- **Vite** - Next-generation build tool

### Special Thanks
- Google Developer Community
- Supabase Open Source
- Women's Safety Advocates

---

## Contact & Support

For issues, questions, or support:
- **GitHub Issues**: [Create an issue](../../issues)
- **Documentation**: [Full Documentation](https://docs.luna-safety.app)

---

**Built with ❤️ using Google Gemini AI, Azure Neural TTS, and Supabase for Women's Safety**

*"Your safety comes first. Take one step at a time."*

*Last Updated: February 2026*
```

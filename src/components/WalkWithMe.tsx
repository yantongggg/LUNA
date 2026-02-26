import { ArrowLeft, MapPin, Shuffle, Activity, Navigation, Home, Shield, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { SimulatedCall } from './SimulatedCall';
import { FallbackMap } from './FallbackMap';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { supabase } from '../lib/supabase';
import {
  walkWithMeManager,
  WalkWithMeState,
  Coordinates,
  getCurrentLocation,
  isWithinGeofence,
} from '../services/locationService';
import { ttsService, initTTS } from '../utils/ttsService';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

interface WalkWithMeProps {
  onNavigate: (screen: string) => void;
}

// Your Google Maps API Key should be in .env file as VITE_GOOGLE_MAPS_API_KEY
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export function WalkWithMe({ onNavigate }: WalkWithMeProps) {
  // UI States
  const [shareLocation, setShareLocation] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showSimulatedCall, setShowSimulatedCall] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [currentAiPhrase, setCurrentAiPhrase] = useState('');

  // LLM Chat History for companion (isolated from forensic analysis)
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Voice Input (Speech-to-Text) state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognizerRef = useRef<sdk.SpeechRecognizer | null>(null);
  const userStoppedRef = useRef(false); // true when user explicitly tapped Stop or we intentionally killed mic
  const sendChatMessageRef = useRef<((text: string, isUserInitiated: boolean) => void) | null>(null); // stable ref for event handlers
  const micRestartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null); // delayed mic restart after TTS

  // Location & Safety States
  const [locationState, setLocationState] = useState<WalkWithMeState | null>(null);
  const [homeLocation, setHomeLocation] = useState<Coordinates | null>(null);
  const [destinationInput, setDestinationInput] = useState('');
  const [safetyStatus, setSafetyStatus] = useState<'SAFE' | 'UNSAFE'>('SAFE');
  const [mode, setMode] = useState<'OUTSIDE' | 'AT_HOME'>('OUTSIDE');
  const [unsafeDuration, setUnsafeDuration] = useState(0);

  // Map States
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapError, setMapError] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Timers and intervals
  const aiResponseInterval = useRef<NodeJS.Timeout | null>(null);
  const unsafeTimer = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now()); // for auto-prompt silence guard

  // Safety Toolbox states
  const [showSOS, setShowSOS] = useState(false);
  const sosFlashRef = useRef<NodeJS.Timeout | null>(null);
  const sosAudioRef = useRef<HTMLAudioElement | null>(null);

  // TTS Ready state
  const [ttsReady, setTtsReady] = useState(false);

  // "William is typing / speaking" visual feedback
  const [isSpeaking, setIsSpeaking] = useState(false);

  // ─── Azure Speech SDK: cleanup on unmount ───────────────────────────────
  useEffect(() => {
    return () => {
      if (recognizerRef.current) {
        try { recognizerRef.current.stopContinuousRecognitionAsync(); } catch (_) {}
        try { recognizerRef.current.close(); } catch (_) {}
        recognizerRef.current = null;
      }
      if (micRestartTimerRef.current) {
        clearTimeout(micRestartTimerRef.current);
        micRestartTimerRef.current = null;
      }
    };
  }, []);

  // ─── TTS ↔ Mic Relay: pause mic when TTS starts, resume when TTS ends ───
  useEffect(() => {
    if (!isSimulating) return;

    if (isSpeaking) {
      // TTS just started — pause the mic to prevent echo
      const rec = recognizerRef.current;
      if (rec && isListening) {
        console.log('[WalkWithMe] 🔇 TTS started — pausing Azure recognizer');
        rec.stopContinuousRecognitionAsync(
          () => { setIsListening(false); },
          (err: string) => { console.error('[WalkWithMe] Stop recognizer error:', err); setIsListening(false); },
        );
      }
      if (micRestartTimerRef.current) {
        clearTimeout(micRestartTimerRef.current);
        micRestartTimerRef.current = null;
      }
    } else {
      // TTS just ended — resume mic after 1s cooldown
      if (!userStoppedRef.current) {
        micRestartTimerRef.current = setTimeout(() => {
          micRestartTimerRef.current = null;
          if (ttsService.isActive()) return;
          console.log('[WalkWithMe] 🔊 TTS ended — resuming Azure recognizer');
          startListeningAzure();
        }, 1000);
      }
    }
  }, [isSpeaking, isSimulating]);

  // Initialize home location (default to user's current location)
  useEffect(() => {
    const initializeHomeLocation = async () => {
      try {
        const position = await getCurrentLocation();
        const homeCoords: Coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setHomeLocation(homeCoords);
        walkWithMeManager.initialize(homeCoords, handleStateUpdate);

        setMapCenter({ lat: homeCoords.latitude, lng: homeCoords.longitude });
        setUserLocation({ lat: homeCoords.latitude, lng: homeCoords.longitude });
      } catch (error) {
        console.error('Failed to get initial location:', error);
        // Default to a central location if geolocation fails
        const defaultCoords: Coordinates = { latitude: 40.7128, longitude: -74.0060 }; // NYC
        setHomeLocation(defaultCoords);
        walkWithMeManager.initialize(defaultCoords, handleStateUpdate);
        setMapCenter({ lat: defaultCoords.latitude, lng: defaultCoords.longitude });
        setUserLocation({ lat: defaultCoords.latitude, lng: defaultCoords.longitude });
      }
    };

    initializeHomeLocation();

    // Pre-initialize TTS (don't require user interaction yet)
    initTTS(false).then((ready) => {
      console.log('[WalkWithMe] TTS initialized:', ready);
      setTtsReady(ready);
    });

    // Wire up TTS callbacks for isSpeaking state
    ttsService.onEnd(() => {
      setIsSpeaking(false);
      lastActivityRef.current = Date.now();
    });
    ttsService.onError(() => {
      setIsSpeaking(false);
      lastActivityRef.current = Date.now();
    });

    // Check if Google Maps will load properly
    if (typeof window !== 'undefined' && !GOOGLE_MAPS_API_KEY) {
      console.warn('[WalkWithMe] Google Maps API key not set. Using fallback map.');
      setMapError(true);
    }

    // Listen for Google Maps load errors
    const handleMapError = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('Google Maps')) {
        console.warn('[WalkWithMe] Google Maps failed to load. Using fallback map.');
        setMapError(true);
      }
    };

    window.addEventListener('unhandledrejection', handleMapError);

    return () => {
      if (aiResponseInterval.current) clearInterval(aiResponseInterval.current);
      if (unsafeTimer.current) clearInterval(unsafeTimer.current);
      walkWithMeManager.stopTracking();
      window.removeEventListener('unhandledrejection', handleMapError);
    };
  }, []);

  // Handle state updates from location manager
  const handleStateUpdate = useCallback((state: WalkWithMeState) => {
    setLocationState(state);
    setMode(state.mode);
    setSafetyStatus(state.safetyStatus);
    setUnsafeDuration(state.unsafeDuration);

    if (state.currentLocation) {
      setMapCenter({
        lat: state.currentLocation.latitude,
        lng: state.currentLocation.longitude,
      });
      setUserLocation({
        lat: state.currentLocation.latitude,
        lng: state.currentLocation.longitude,
      });
    }

    // Trigger simulated call if unsafe for too long
    if (state.safetyStatus === 'UNSAFE' && state.unsafeDuration > 30 && !showSimulatedCall) {
      handleEmergencyTrigger();
    }
  }, [showSimulatedCall]);

  // Handle emergency trigger
  const handleEmergencyTrigger = useCallback(async () => {
    try {
      console.log('[WalkWithMe] 🚨 EMERGENCY TRIGGERED');

      // Call emergency endpoint
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/make-server-7f9db486/walk-with-me/emergency`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            currentLocation: locationState?.currentLocation,
            mode: locationState?.mode,
            isMoving: locationState?.movementStatus.isMoving,
            isHome: locationState?.mode === 'AT_HOME',
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Emergency API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.message) {
        const alertMessage = data.message || 'Emergency alert sent to contacts!';
        setAiMessage(alertMessage);
        setShowSimulatedCall(true);
      }

      if (data.emergencyAlert) {
        console.log('[WalkWithMe] Emergency Alert:', data.emergencyAlert);
      }
    } catch (error) {
      console.error('[WalkWithMe] Failed to trigger emergency:', error);
      // Fallback message
      setAiMessage('Emergency! Your location has been shared with your emergency contacts.');
      setShowSimulatedCall(true);
    }
  }, [locationState]);

  // ─── SOS Handlers ───────────────────────────────────────────────────────
  const triggerSOS = useCallback(() => {
    setShowSOS(true);

    // Play siren sound using Web Audio API
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sawtooth';
      gainNode.gain.value = 0.3;

      // Siren effect: alternate between two frequencies
      const now = audioCtx.currentTime;
      for (let i = 0; i < 10; i++) {
        oscillator.frequency.setValueAtTime(800, now + i * 0.4);
        oscillator.frequency.setValueAtTime(1200, now + i * 0.4 + 0.2);
      }
      oscillator.start(now);
      oscillator.stop(now + 4);

      // Cleanup after siren
      setTimeout(() => {
        audioCtx.close();
      }, 5000);
    } catch (err) {
      console.error('[WalkWithMe] Siren audio failed:', err);
    }

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setShowSOS(false);
    }, 5000);
  }, []);

  // ─── Luna Companion Chat (ISOLATED from forensic analysis) ──────────────
  // Calls the standalone chat-companion Edge Function via OpenRouter.
  // The old generateAIResponse that hit make-server walk-with-me/generate is
  // kept as a fallback for emergency / location-aware alerts only.
  const sendChatMessage = useCallback(async (userText: string, isUserInitiated: boolean = false) => {
    if (!userText.trim()) return;

    // Block if TTS is still playing — don't cut off mid-sentence.
    // Only allow user-initiated messages to proceed (they can intentionally interrupt).
    if (ttsService.isActive() && !isUserInitiated) {
      console.log('[WalkWithMe] ⏳ TTS still playing, skipping auto-prompt');
      return;
    }

    // If user intentionally sends while TTS is active, cancel the current speech
    if (ttsService.isActive() && isUserInitiated) {
      console.log('[WalkWithMe] 🛑 User interrupted, cancelling TTS');
      ttsService.cancel();
    }

    // Also update lastActivity when sending
    setIsChatLoading(true);
    lastActivityRef.current = Date.now();
    const trimmed = userText.trim();

    // Append the user message to history immediately
    const updatedHistory = [...chatHistory, { role: 'user' as const, content: trimmed }];
    setChatHistory(updatedHistory);
    setChatInput('');

    try {
      console.log('[WalkWithMe] 💬 Sending to chat-companion:', trimmed);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-companion`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            userMessage: trimmed,
            conversationHistory: updatedHistory.slice(-20), // last 20 turns
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error('[WalkWithMe] chat-companion error:', response.status, errText);
        throw new Error(`chat-companion error: ${response.status}`);
      }

      const data = await response.json();
      const reply: string = data.reply;

      console.log('[WalkWithMe] 💬 Luna replied:', reply?.substring(0, 80));

      // Append assistant reply to history
      setChatHistory((prev: Array<{ role: 'user' | 'assistant'; content: string }>) => [...prev, { role: 'assistant', content: reply }]);

      // Display the reply and fire TTS in parallel — don't wait for React state updates
      setCurrentAiPhrase(reply);
      setAiMessage(reply);

      // Fire TTS immediately — no state dependency needed
      if (ttsReady) {
        const isHome = (locationState?.mode || 'OUTSIDE') === 'AT_HOME';
        setIsSpeaking(true);
        lastActivityRef.current = Date.now();
        ttsService.speak(reply, isHome).catch(err => {
          console.error('[WalkWithMe] TTS speak failed:', err);
          setIsSpeaking(false);
        });
      }
    } catch (error) {
      console.error('[WalkWithMe] Chat companion failed:', error);

      // Fallback: use canned companion phrases
      const fallbacks = [
        'Sorry, bad signal. You still there?',
        'Hey, I lost you for a sec. Stay safe okay?',
        'Connection dropped. Stick to the main road.',
        'Signal cut out. Dont worry, Im still here.',
      ];
      const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];

      setChatHistory((prev: Array<{ role: 'user' | 'assistant'; content: string }>) => [...prev, { role: 'assistant', content: fallback }]);
      setCurrentAiPhrase(fallback);
      setAiMessage(fallback);

      if (ttsReady) {
        const isHome = (locationState?.mode || 'OUTSIDE') === 'AT_HOME';
        setIsSpeaking(true);
        lastActivityRef.current = Date.now();
        ttsService.speak(fallback, isHome).catch(err => {
          console.error('[WalkWithMe] TTS fallback failed:', err);
          setIsSpeaking(false);
        });
      }
    } finally {
      setIsChatLoading(false);
      lastActivityRef.current = Date.now();
    }
  }, [chatHistory, locationState, ttsReady]);

  // Keep sendChatMessageRef in sync so event handlers always have latest
  useEffect(() => {
    sendChatMessageRef.current = sendChatMessage;
  }, [sendChatMessage]);

  // ─── Azure Speech SDK: startListening ──────────────────────────────────
  const startListeningAzure = useCallback(() => {
    if (isListening || isChatLoading || isSpeaking) return;
    if (!speechSupported) return;

    const azureKey = import.meta.env.VITE_AZURE_SPEECH_KEY as string;
    const azureRegion = import.meta.env.VITE_AZURE_SPEECH_REGION as string;
    if (!azureKey || !azureRegion) {
      console.error('[WalkWithMe] Azure Speech credentials missing (VITE_AZURE_SPEECH_KEY / VITE_AZURE_SPEECH_REGION)');
      setSpeechSupported(false);
      return;
    }

    userStoppedRef.current = false;

    // Dispose previous recognizer if any
    if (recognizerRef.current) {
      try { recognizerRef.current.close(); } catch (_) {}
      recognizerRef.current = null;
    }

    const speechConfig = sdk.SpeechConfig.fromSubscription(azureKey, azureRegion);
    speechConfig.speechRecognitionLanguage = 'en-SG';

    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    // ── recognized (final result) ──
    recognizer.recognized = (_sender, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
        const text = e.result.text.trim();
        console.log('[WalkWithMe] 🎙️ Azure recognized:', text);
        if (text && sendChatMessageRef.current) {
          lastActivityRef.current = Date.now();
          sendChatMessageRef.current(text, true);
        }
      } else if (e.result.reason === sdk.ResultReason.NoMatch) {
        console.log('[WalkWithMe] Azure: No speech recognized');
      }
    };

    // ── sessionStopped ──
    recognizer.sessionStopped = (_sender, _e) => {
      console.log('[WalkWithMe] Azure session stopped');
      setIsListening(false);
      if (!userStoppedRef.current && !ttsService.isActive()) {
        setTimeout(() => {
          if (!userStoppedRef.current && !ttsService.isActive()) {
            console.log('[WalkWithMe] 🔄 Auto-restarting Azure recognizer after session stop');
            startListeningAzure();
          }
        }, 1000);
      }
    };

    // ── canceled ──
    recognizer.canceled = (_sender, e) => {
      console.error('[WalkWithMe] Azure recognition canceled:', e.reason, e.errorDetails);
      setIsListening(false);
      if (!userStoppedRef.current && !ttsService.isActive()) {
        setTimeout(() => {
          if (!userStoppedRef.current && !ttsService.isActive()) {
            console.log('[WalkWithMe] 🔄 Auto-restarting Azure recognizer after cancel');
            startListeningAzure();
          }
        }, 2000);
      }
    };

    recognizerRef.current = recognizer;

    recognizer.startContinuousRecognitionAsync(
      () => {
        console.log('[WalkWithMe] ✅ Azure continuous recognition started');
        setIsListening(true);
      },
      (err: string) => {
        console.error('[WalkWithMe] Azure startContinuousRecognitionAsync error:', err);
        setIsListening(false);
      },
    );
  }, [isListening, isChatLoading, isSpeaking, speechSupported]);

  const startListening = startListeningAzure;

  // ─── Azure Speech SDK: stopListening ──────────────────────────────────
  const stopListening = useCallback(() => {
    userStoppedRef.current = true;
    if (micRestartTimerRef.current) {
      clearTimeout(micRestartTimerRef.current);
      micRestartTimerRef.current = null;
    }
    const recognizer = recognizerRef.current;
    if (recognizer) {
      recognizer.stopContinuousRecognitionAsync(
        () => {
          console.log('[WalkWithMe] 🛑 Azure recognizer stopped by user');
          setIsListening(false);
        },
        (err: string) => {
          console.error('[WalkWithMe] Azure stopContinuousRecognitionAsync error:', err);
          setIsListening(false);
        },
      );
    } else {
      setIsListening(false);
    }
  }, []);

  // Generate AI response based on context (location-aware alerts / emergency only)
  const generateAIResponse = useCallback(async () => {
    if (!locationState?.isTracking) return;

    const isHome = locationState.mode === 'AT_HOME';

    console.log('[WalkWithMe] 🔔 Generating location-aware AI response...', {
      mode: locationState.mode,
      safetyStatus: locationState.safetyStatus,
    });

    try {
      const requestBody = {
        mode: locationState.mode,
        safetyStatus: locationState.safetyStatus,
        currentLocation: locationState.currentLocation,
        destinationLocation: locationState.destination,
        homeLocation: locationState.homeLocation,
        isMoving: locationState.movementStatus.isMoving,
        timeSinceLastUpdate: Math.floor((Date.now() - (locationState.currentLocation?.timestamp || 0)) / 1000),
        unsafeDuration: locationState.unsafeDuration,
        isHome: isHome,
        conversationHistory: [],
      };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/make-server-7f9db486/walk-with-me/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (data.isEmergency) {
        setAiMessage(data.message);
        setShowSimulatedCall(true);
        if (data.emergencyAlert) {
          console.log('[WalkWithMe] Emergency Alert:', data.emergencyAlert);
        }
      } else {
        // For non-emergency location pings, feed it as a context nudge into chat companion instead
        const contextMsg = data.message as string;
        setCurrentAiPhrase(contextMsg);

        if (locationState.mode === 'OUTSIDE' && locationState.destination && locationState.movementStatus.isMoving) {
          setAiMessage(contextMsg);
          setShowSimulatedCall(true);
        }

        if (isHome) {
          setCurrentAiPhrase(contextMsg);
        }
      }
    } catch (error) {
      console.error('[WalkWithMe] Failed to generate AI response:', error);

      const fallbackPhrases = {
        OUTSIDE: [
          'Keep walking, dont stop.',
          'Hey, you still there? Stay safe.',
          'Almost there right? Keep going.',
        ],
        AT_HOME: [
          'Hey, make sure you lock your door.',
          'You good at home?',
          'Glad you made it. Get some rest.',
        ],
      };

      const currentMode = locationState?.mode || 'OUTSIDE';
      const phrases = fallbackPhrases[currentMode as keyof typeof fallbackPhrases];
      const fallbackMessage = phrases[Math.floor(Math.random() * phrases.length)];

      setCurrentAiPhrase(fallbackMessage);

      if (ttsReady) {
        ttsService.speak(fallbackMessage, isHome).catch(err => {
          console.error('[WalkWithMe] TTS fallback failed:', err);
        });
      }
    }
  }, [locationState, ttsReady]);

  // Start tracking handler
  const handleStartTracking = useCallback(async () => {
    if (!homeLocation) return;

    console.log('[WalkWithMe] Starting tracking...');

    try {
      setShareLocation(true);
      setIsSimulating(true);

      // Initialize TTS with user interaction to unlock audio
      console.log('[WalkWithMe] Initializing TTS with user interaction (Start button)');
      await initTTS(true);
      setTtsReady(true);

      // If destination input is provided, parse and set destination
      let destination = null;
      if (destinationInput.trim()) {
        // For demo purposes, we'll use a nearby location
        // In production, you would geocode the address
        const destCoords: Coordinates = {
          latitude: homeLocation.latitude + 0.01, // Slight offset for demo
          longitude: homeLocation.longitude + 0.01,
        };
        destination = {
          ...destCoords,
          address: destinationInput.trim(),
        };
        walkWithMeManager.setDestination(destination);
      }

      await walkWithMeManager.startTracking(destination);

      // Start generating AI responses — only fires after 30s of TOTAL silence
      // (no user speech, no AI speech, no loading)
      lastActivityRef.current = Date.now();
      aiResponseInterval.current = setInterval(() => {
        const silenceMs = Date.now() - lastActivityRef.current;
        const isBusy = ttsService.isActive() || isListening || isChatLoading;

        if (isBusy) {
          // Reset timer — activity is happening
          lastActivityRef.current = Date.now();
          return;
        }

        if (silenceMs < 30000) {
          // Not enough silence yet — skip
          return;
        }

        console.log('[WalkWithMe] ⏰ 30s silence, sending auto-prompt');
        lastActivityRef.current = Date.now(); // reset after sending

        const nudges = [
          'Hey, still walking. Talk to me.',
          'Im still here. Anything happening?',
          'Still on my way. Keep me company.',
          'Walking alone. Chat with me.',
          'Still outside. Say something.',
        ];
        const nudge = nudges[Math.floor(Math.random() * nudges.length)];
        sendChatMessage(nudge);
      }, 5000); // Check every 5s, but only fires after 30s of actual silence

      // Send first companion message immediately
      sendChatMessage('Hey, Im walking home now. Keep me company.');
    } catch (error) {
      console.error('[WalkWithMe] Failed to start tracking:', error);
      setIsSimulating(false);
      setShareLocation(false);
    }
  }, [homeLocation, destinationInput, generateAIResponse]);

  // Stop tracking handler
  const handleStopTracking = useCallback(() => {
    console.log('[WalkWithMe] Stopping tracking...');

    setShareLocation(false);
    setIsSimulating(false);
    walkWithMeManager.stopTracking();

    if (aiResponseInterval.current) {
      clearInterval(aiResponseInterval.current);
      aiResponseInterval.current = null;
    }

    // Stop TTS and speech recognition
    ttsService.cancel();
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync(
        () => { setIsListening(false); },
        (err: string) => { console.error('[WalkWithMe] Stop recognizer error on tracking stop:', err); setIsListening(false); },
      );
    }

    setShowSimulatedCall(false);
    setIsCallActive(false);
    setAiMessage('');
    setCurrentAiPhrase('');
    setChatHistory([]); // Reset chat history on stop
    setChatInput('');
  }, [isListening]);

  // Handle simulated call actions
  const handleAnswerCall = useCallback(() => {
    console.log('[WalkWithMe] Answering call - isHome:', mode === 'AT_HOME');
    setIsCallActive(true);
  }, [mode]);

  const handleDeclineCall = useCallback(() => {
    console.log('[WalkWithMe] Declining call');
    setShowSimulatedCall(false);
    setIsCallActive(false);
    ttsService.cancel();
  }, []);

  // Handle shuffle (get new companion response)
  const handleShuffle = useCallback(() => {
    console.log('[WalkWithMe] Shuffle button clicked');
    const prompts = [
      'Tell me something, im bored walking.',
      'Talk to me, its so quiet here.',
      'Hey, say something. Im alone out here.',
      'Distract me. This walk feels so long.',
    ];
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    sendChatMessage(prompt);
  }, [sendChatMessage]);

  // Get status display text
  const getStatusDisplay = useCallback(() => {
    if (!locationState) return { text: 'Ready to start', color: '#A5949A' };

    if (mode === 'AT_HOME') {
      return {
        text: '🏠 Home Presence Active',
        color: '#9FB7A4',
      };
    }

    if (locationState.safetyStatus === 'UNSAFE') {
      return {
        text: `⚠️ Alert: Unsafe for ${unsafeDuration}s`,
        color: '#E2C6C4',
      };
    }

    if (locationState.movementStatus.isMoving && locationState.eta) {
      const minutes = Math.floor(locationState.eta / 60);
      return {
        text: `🚶 Walking • ETA: ${minutes} min`,
        color: '#9FB7A4',
      };
    }

    return {
      text: locationState.isTracking ? '📍 Tracking Active' : 'Ready to start',
      color: '#9FB7A4',
    };
  }, [locationState, mode, unsafeDuration]);

  const statusDisplay = getStatusDisplay();

  // Current AI phrase display
  const displayPhrase = mode === 'AT_HOME' ? currentAiPhrase : aiMessage;

  // Check if user is at home for context-aware features
  const isUserAtHome = mode === 'AT_HOME';

  return (
    <div className="h-full relative flex flex-col overflow-hidden">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto relative">
      {/* Soft Pastel Gradient Background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(circle at 25% 20%, rgba(255, 220, 230, 0.6) 0%, transparent 50%),
            radial-gradient(circle at 75% 30%, rgba(230, 210, 240, 0.5) 0%, transparent 50%),
            radial-gradient(circle at 50% 70%, rgba(200, 240, 220, 0.4) 0%, transparent 50%),
            linear-gradient(135deg, #FFE8F0 0%, #F8F0FB 50%, #F0FAF5 100%)
          `,
        }}
      />

      {/* Header */}
      <div className="pt-16 px-6 pb-6 relative z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'rgba(194, 167, 184, 0.35)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 4px 12px rgba(194, 167, 184, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
              border: '1.5px solid rgba(194, 167, 184, 0.4)',
            }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: '#8B7A7F' }} />
          </button>
          <div className="flex-1">
            <h1 className="text-[28px] leading-[36px] tracking-[-0.4px] text-gray-900 font-bold">
              Walk With Me
            </h1>
            <p className="text-[15px] leading-[22px] mt-1 text-gray-700 font-semibold">
              Your safety companion
            </p>
          </div>

          {/* Status Badge */}
          <div
            className="px-3 py-1.5 rounded-full flex items-center gap-2"
            style={{
              background: `${statusDisplay.color}30`,
              border: `1px solid ${statusDisplay.color}50`,
            }}
          >
            {mode === 'AT_HOME' ? (
              <Home className="w-4 h-4" style={{ color: statusDisplay.color }} />
            ) : safetyStatus === 'UNSAFE' ? (
              <AlertTriangle className="w-4 h-4" style={{ color: statusDisplay.color }} />
            ) : (
              <Shield className="w-4 h-4" style={{ color: statusDisplay.color }} />
            )}
            <span
              className="text-xs font-medium"
              style={{ color: statusDisplay.color }}
            >
              {mode === 'AT_HOME' ? 'AT_HOME' : mode}
            </span>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="px-6 space-y-6 relative z-10">
        {/* Section 1: Walk With Me with Map */}
        <div
          className="rounded-[24px] overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 2px 20px rgba(139, 122, 143, 0.08)',
          }}
        >
          <div className="p-6 pb-4">
            <h2
              className="text-[22px] leading-[32px] mb-4"
              style={{
                color: '#8B7A7F',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
              }}
            >
              Walk With Me
            </h2>

            {/* Destination Input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Where are you going? (optional)"
                value={destinationInput}
                onChange={(e) => setDestinationInput(e.target.value)}
                disabled={isSimulating}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: isSimulating
                    ? 'rgba(165, 148, 154, 0.1)'
                    : 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(194, 167, 184, 0.3)',
                  color: '#8B7A7F',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
            </div>

            {/* Google Map or Fallback */}
            {userLocation && (
              <>
                {mapError || !GOOGLE_MAPS_API_KEY ? (
                  // Fallback Map when API fails or no key
                  <FallbackMap
                    latitude={userLocation.lat}
                    longitude={userLocation.lng}
                    eta={locationState?.eta || null}
                    destinationName={destinationInput || 'Your Location'}
                  />
                ) : (
                  // Google Maps with proper APIProvider
                  <div className="h-48 rounded-xl overflow-hidden mb-4 relative">
                    <APIProvider
                      apiKey={GOOGLE_MAPS_API_KEY}
                      libraries={['places', 'geometry', 'marker']}
                      version="weekly"
                    >
                      <Map
                        center={mapCenter || undefined}
                        zoom={15}
                        disableDefaultUI={true}
                        gestureHandling="greedy"
                        mapId="LUNA_SAFETY_MAP"
                      >
                        {userLocation && (
                          <AdvancedMarker position={userLocation}>
                            <div
                              style={{
                                width: '24px',
                                height: '24px',
                                background: '#9FB7A4',
                                border: '3px solid #8DA895',
                                borderRadius: '50%',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                              }}
                            />
                          </AdvancedMarker>
                        )}
                      </Map>
                    </APIProvider>

                    {/* Map Overlay Info */}
                    {locationState?.eta && (
                      <div
                        className="absolute top-3 left-3 px-3 py-1.5 rounded-lg"
                        style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Navigation className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            {Math.floor(locationState.eta / 60)} min
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Status Display */}
            <div
              className="px-4 py-2 rounded-lg text-center"
              style={{
                background: `${statusDisplay.color}20`,
              }}
            >
              <span
                className="text-sm font-medium"
                style={{ color: statusDisplay.color }}
              >
                {statusDisplay.text}
              </span>
            </div>
          </div>

          {/* Share Location Toggle */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <span
              className="text-[17px] leading-[24px]"
              style={{
                color: '#8B7A7F',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
              }}
            >
              Share Location
            </span>
            <button
              onClick={() => {
                if (shareLocation) {
                  handleStopTracking();
                } else {
                  handleStartTracking();
                }
              }}
              className="relative w-[56px] h-[34px] rounded-full transition-all duration-300"
              style={{
                background: shareLocation
                  ? 'linear-gradient(135deg, #9FB7A4 0%, #8DA895 100%)'
                  : 'rgba(165, 148, 154, 0.25)',
              }}
            >
              <div
                className="absolute top-[3px] w-[28px] h-[28px] rounded-full transition-all duration-300 shadow-md"
                style={{
                  left: shareLocation ? '25px' : '3px',
                  background: 'white',
                }}
              />
            </button>
          </div>
        </div>

        {/* Section 2: Home Presence */}
        <div
          className="rounded-[24px] p-8"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 2px 20px rgba(139, 122, 143, 0.08)',
          }}
        >
          <h2
            className="text-[22px] leading-[32px] mb-8"
            style={{
              color: '#8B7A7F',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
            }}
          >
            Home Presence
          </h2>

          {/* Current Phrase Display */}
          {displayPhrase && (
            <div
              className="mb-4 px-4 py-3 rounded-xl text-center"
              style={{
                background: 'rgba(194, 167, 184, 0.15)',
                border: '1px dashed rgba(194, 167, 184, 0.4)',
              }}
            >
              <p className="text-sm italic" style={{ color: '#8B7A7F' }}>
                "{displayPhrase}"
              </p>
            </div>
          )}

          {/* William is typing / speaking indicator */}
          {(isChatLoading || isSpeaking) && isSimulating && (
            <div
              className="mb-4 flex items-center justify-center gap-2 py-2"
              style={{ animation: 'williamPulse 1.5s ease-in-out infinite' }}
            >
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: '#C2A7B8', fontFamily: "'DM Sans', sans-serif" }}
              >
                {isSpeaking ? 'William is speaking...' : 'William is thinking...'}
              </span>
            </div>
          )}

          {/* Chat Input — voice-first with text fallback */}
          {isSimulating && (
            <div className="mb-6 flex flex-col gap-3">
              {/* Primary: Mic Button */}
              <div className="flex justify-center">
                {speechSupported ? (
                  <button
                    onClick={isListening ? stopListening : startListening}
                    disabled={isChatLoading || isSpeaking}
                    className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 disabled:opacity-40"
                    style={{
                      background: isListening
                        ? 'linear-gradient(135deg, #E25555 0%, #CC3333 100%)'
                        : isSpeaking
                          ? 'linear-gradient(135deg, #8B7A7F 0%, #A5949A 100%)'
                          : 'linear-gradient(135deg, #C2A7B8 0%, #D6B4B8 100%)',
                      boxShadow: isListening
                        ? '0 0 0 6px rgba(226, 85, 85, 0.25), 0 4px 16px rgba(226, 85, 85, 0.3)'
                        : '0 4px 16px rgba(194, 167, 184, 0.35)',
                    }}
                  >
                    {/* Pulse ring when TRULY listening */}
                    {isListening && !isSpeaking && (
                      <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ background: '#E25555' }} />
                    )}
                    {/* Mic Icon */}
                    <svg className="w-7 h-7 relative z-10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  </button>
                ) : (
                  <p className="text-xs text-center" style={{ color: '#A5949A' }}>
                    Voice input not supported in this browser
                  </p>
                )}
              </div>
              {/* Status label */}
              <p
                className="text-xs text-center font-medium"
                style={{ color: isListening ? '#E25555' : isSpeaking ? '#C2A7B8' : '#A5949A', fontFamily: "'DM Sans', sans-serif" }}
              >
                {isListening ? 'Listening...' : isSpeaking ? '🔊 William is speaking' : isChatLoading ? 'Thinking...' : 'Tap mic to talk'}
              </p>

              {/* Fallback: Text input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Or type here..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && chatInput.trim() && !isChatLoading) {
                      sendChatMessage(chatInput, true);
                    }
                  }}
                  disabled={isChatLoading || isListening}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all disabled:opacity-50"
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(194, 167, 184, 0.3)',
                    color: '#8B7A7F',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <button
                  onClick={() => chatInput.trim() && !isChatLoading && sendChatMessage(chatInput, true)}
                  disabled={!chatInput.trim() || isChatLoading || isListening}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40"
                  style={{
                    background: 'linear-gradient(135deg, #C2A7B8 0%, #D6B4B8 100%)',
                    color: 'white',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {isChatLoading ? '...' : 'Send'}
                </button>
              </div>
            </div>
          )}

          {/* Central Start Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => {
                if (isSimulating) {
                  handleStopTracking();
                } else {
                  handleStartTracking();
                }
              }}
              className="w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 relative"
              style={{
                background: isSimulating
                  ? 'linear-gradient(135deg, #E2C6C4 0%, #CAAAA6 100%)'
                  : 'linear-gradient(135deg, #C2A7B8 0%, #D6B4B8 100%)',
                boxShadow: '0 8px 32px rgba(194, 167, 184, 0.35)',
              }}
            >
              {/* Pulse Animation when active */}
              {isSimulating && (
                <div className="absolute inset-0 rounded-full animate-ping opacity-20" />
              )}

              <span
                className="text-[24px] leading-[32px]"
                style={{
                  color: 'white',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                }}
              >
                {isSimulating ? 'Stop' : 'Start'}
              </span>
            </button>
          </div>

          {/* Sound Wave and Shuffle Row */}
          <div className="flex items-center justify-center gap-6">
            {/* Sound Wave Visualization */}
            <div className="flex items-center gap-1">
              {isSimulating ? (
                <>
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full"
                      style={{
                        height: `${Math.random() * 32 + 16}px`,
                        background: 'linear-gradient(180deg, #C2A7B8 0%, #D6B4B8 100%)',
                        animation: `wave ${Math.random() * 0.5 + 0.6}s ease-in-out infinite alternate`,
                      }}
                    />
                  ))}
                </>
              ) : (
                <Activity className="w-8 h-8" style={{ color: '#C2A7B8' }} strokeWidth={2} />
              )}
            </div>

            {/* Shuffle/Dice Icon */}
            <button
              onClick={handleShuffle}
              disabled={!isSimulating}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'rgba(194, 167, 184, 0.15)',
              }}
            >
              <Shuffle className="w-6 h-6" style={{ color: '#C2A7B8' }} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Info Text */}
        <p
          className="text-[13px] leading-[20px] text-center px-4 pb-8"
          style={{
            color: '#A5949A',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
          }}
        >
          Your trusted contacts will be notified of your safe arrival
        </p>
      </div>

      </div>{/* END scrollable content */}

      {/* Simulated Call Overlay with context-aware voice */}
      {(showSimulatedCall || isCallActive) && (
        <SimulatedCall
          contactName={isUserAtHome ? 'Roommate' : 'Safety Companion'}
          isSimulated={true}
          isActive={isCallActive}
          message={aiMessage}
          isHome={isUserAtHome} // Context-aware: louder when at home
          onAnswer={handleAnswerCall}
          onDecline={handleDeclineCall}
        />
      )}

      {/* ─── SOS Alarm Overlay ─────────────────────────────────────────────── */}
      {showSOS && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center"
          style={{
            animation: 'sosFlash 0.3s ease-in-out infinite alternate',
          }}
        >
          <div className="text-center">
            <span className="text-6xl mb-4 block">🚨</span>
            <h2
              className="text-3xl font-black text-white mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif", textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              SOS ACTIVATED
            </h2>
            <div
              className="px-6 py-3 rounded-full inline-block"
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <p className="text-white text-sm font-medium animate-pulse">
                📍 Sending GPS Location...
              </p>
            </div>
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => setShowSOS(false)}
            className="mt-10 px-8 py-3 rounded-full text-sm font-bold transition-all active:scale-95"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.5)',
              color: 'white',
              backdropFilter: 'blur(10px)',
            }}
          >
            CANCEL
          </button>
        </div>
      )}

      {/* ─── Safety Action Bar (Bottom) ────────────────────────────────────── */}
      {isSimulating && !showSOS && (
        <div
          className="absolute bottom-0 left-0 right-0 z-40 px-6 pb-8 pt-4"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(26, 26, 46, 0.85) 30%, rgba(26, 26, 46, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center justify-center gap-6 max-w-sm mx-auto">
            {/* SOS Button */}
            <button
              onClick={triggerSOS}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, rgba(226, 85, 85, 0.25) 0%, rgba(204, 51, 51, 0.35) 100%)',
                border: '1.5px solid rgba(226, 85, 85, 0.6)',
                boxShadow: '0 4px 16px rgba(226, 85, 85, 0.2)',
              }}
            >
              <span className="text-lg">🚨</span>
              <span
                className="text-sm font-bold"
                style={{ color: '#E25555', fontFamily: "'DM Sans', sans-serif" }}
              >
                SOS
              </span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes sosFlash {
          0% { background: rgba(220, 38, 38, 0.95); }
          100% { background: rgba(255, 255, 255, 0.95); }
        }
        @keyframes williamPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

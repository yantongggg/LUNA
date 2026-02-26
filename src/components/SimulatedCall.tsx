import { Phone, PhoneOff, Volume2, User } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ttsService, initTTS } from '../utils/ttsService';

interface SimulatedCallProps {
  contactName?: string;
  isSimulated: boolean;
  onAnswer: () => void;
  onDecline: () => void;
  message: string;
  isActive?: boolean;
  isHome?: boolean; // Context-aware: louder when at home
}

export function SimulatedCall({
  contactName = 'Safety Companion',
  isSimulated,
  onAnswer,
  onDecline,
  message,
  isActive = false,
  isHome = false,
}: SimulatedCallProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [ttsReady, setTtsReady] = useState(false);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize TTS on component mount
  useEffect(() => {
    const initializeTTS = async () => {
      console.log('[SimulatedCall] Initializing TTS service...');
      const ready = await initTTS(false); // Don't require interaction yet
      setTtsReady(ready);

      if (!ready) {
        console.warn('[SimulatedCall] TTS not available, using fallback');
      }
    };

    initializeTTS();
  }, []);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Call duration timer
  useEffect(() => {
    if (isActive) {
      durationIntervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      setCallDuration(0);
    }

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [isActive]);

  // Text-to-speech when call is answered (user interaction!)
  useEffect(() => {
    if (isActive && message && ttsReady) {
      // Initialize TTS with user interaction flag to unlock audio
      initTTS(true).then(() => {
        speakMessage(message);
      });
    }

    return () => {
      if (ttsReady) {
        ttsService.cancel();
        setIsSpeaking(false);
      }
    };
  }, [isActive, message, ttsReady]);

  // Monitor speech state
  useEffect(() => {
    const checkInterval = setInterval(() => {
      setIsSpeaking(ttsService.isActive());
    }, 100);

    return () => clearInterval(checkInterval);
  }, []);

  // Animate text typing effect
  useEffect(() => {
    if (isActive && message) {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= message.length) {
          setDisplayedText(message.substring(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    } else {
      setDisplayedText('');
    }
  }, [isActive, message]);

  const speakMessage = useCallback((text: string) => {
    if (!ttsReady) {
      console.warn('[SimulatedCall] TTS not ready, cannot speak');
      return;
    }

    console.log('[SimulatedCall] 📢 Speaking message:', {
      text: text.substring(0, 50),
      isHome: isHome,
      volumeBoost: isHome ? '+20%' : 'normal',
      timestamp: new Date().toISOString(),
    });

    ttsService
      .speak(text, isHome) // Pass isHome for louder volume
      .then(() => {
        console.log('[SimulatedCall] ✅ Speech completed');
      })
      .catch((error) => {
        console.error('[SimulatedCall] ❌ Speech error:', error);
        setIsSpeaking(false);
      });
  }, [ttsReady, isHome]);

  const toggleSpeaker = useCallback(() => {
    if (isSpeaking) {
      ttsService.cancel();
      setIsSpeaking(false);
    } else {
      speakMessage(message);
    }
  }, [isSpeaking, speakMessage, message]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!isSimulated) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-[380px] rounded-[40px] overflow-hidden relative"
        style={{
          background: isActive
            ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)'
            : 'linear-gradient(180deg, #2d2d44 0%, #1a1a2e 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Status Bar */}
        <div className="flex justify-between items-center px-6 py-3 text-white text-sm">
          <span>{formatTime(currentTime)}</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-2 border border-white rounded-sm">
              <div className="w-3/4 h-full bg-white rounded-xs" />
            </div>
          </div>
        </div>

        {/* Incoming Call / Active Call Content */}
        <div className="flex flex-col items-center justify-center px-8 py-12 text-white">
          {/* Avatar */}
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center mb-6 relative"
            style={{
              background:
                'linear-gradient(135deg, #C2A7B8 0%, #D6B4B8 50%, #9FB7A4 100%)',
              animation: isActive ? 'pulse 2s ease-in-out infinite' : 'none',
            }}
          >
            <User className="w-16 h-16 text-white" strokeWidth={1.5} />
            {isSpeaking && (
              <>
                <div className="absolute inset-0 rounded-full animate-ping bg-white/20" />
                {isHome && (
                  <div className="absolute -inset-2 rounded-full border-2 border-white/30 animate-pulse" />
                )}
              </>
            )}
          </div>

          {/* Contact Name */}
          <h2 className="text-3xl font-semibold mb-2">{contactName}</h2>

          {/* Call Status */}
          <p className="text-lg text-white/70 mb-2">
            {isActive ? 'Connected' : 'Incoming call...'}
          </p>

          {/* Home Mode Indicator */}
          {isActive && isHome && (
            <div
              className="px-3 py-1 rounded-full mb-6 flex items-center gap-2"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Volume2 className="w-4 h-4 text-white" />
              <span className="text-xs font-medium text-white">Home Mode - Louder</span>
            </div>
          )}

          {/* Message Display (when active) */}
          {isActive && (
            <div
              className="w-full px-6 py-4 rounded-2xl mb-8"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="flex items-start gap-3">
                {isSpeaking && <Volume2 className="w-5 h-5 text-white/70 flex-shrink-0 mt-0.5" />}
                <p className="text-white/90 text-base leading-relaxed">
                  {displayedText}
                  {isActive && displayedText.length < message.length && (
                    <span className="inline-block w-1 h-4 bg-white/70 ml-1 animate-pulse" />
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Call Duration (when active) */}
          {isActive && (
            <div className="text-4xl font-light mb-8 tracking-wider">
              {formatDuration(callDuration)}
            </div>
          )}

          {/* Action Buttons */}
          {!isActive ? (
            <div className="flex items-center gap-12">
              {/* Decline Button */}
              <button
                onClick={onDecline}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #ff4757 0%, #ee3344 100%)',
                  boxShadow: '0 4px 20px rgba(255, 71, 87, 0.4)',
                }}
              >
                <PhoneOff className="w-7 h-7 text-white" strokeWidth={2} />
              </button>

              {/* Answer Button */}
              <button
                onClick={() => {
                  console.log('[SimulatedCall] 📞 Answer button clicked - initializing TTS with user interaction');
                  onAnswer();
                  // Initialize TTS on user interaction to unlock audio
                  initTTS(true).then((ready) => {
                    console.log('[SimulatedCall] TTS ready after answer:', ready);
                    setTtsReady(ready);
                  });
                }}
                className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse"
                style={{
                  background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
                  boxShadow: '0 4px 30px rgba(46, 204, 113, 0.5)',
                }}
              >
                <Phone className="w-9 h-9 text-white" strokeWidth={2} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-12">
              {/* End Call Button */}
              <button
                onClick={() => {
                  ttsService.cancel();
                  onDecline();
                }}
                className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #ff4757 0%, #ee3344 100%)',
                  boxShadow: '0 4px 30px rgba(255, 71, 87, 0.5)',
                }}
              >
                <PhoneOff className="w-9 h-9 text-white" strokeWidth={2} />
              </button>

              {/* Speaker Toggle */}
              <button
                onClick={toggleSpeaker}
                disabled={!ttsReady}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Volume2
                  className={`w-7 h-7 text-white ${isSpeaking ? 'animate-pulse' : ''}`}
                  strokeWidth={2}
                />
              </button>
            </div>
          )}
        </div>

        {/* Home Indicator */}
        <div className="flex justify-center pb-3">
          <div className="w-32 h-1 bg-white/30 rounded-full" />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}

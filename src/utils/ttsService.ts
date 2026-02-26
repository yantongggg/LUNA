// Text-to-Speech Service for Walk With Me Feature
// Uses Azure Cognitive Services Neural TTS via the generate-voice Supabase Edge Function.
// Replaces browser-native speechSynthesis with high-quality server-side voice generation.

// ─── Simplified Types ──────────────────────────────────────────────────────────

interface TTSConfig {
  volume: number;    // Volume (0 to 1)
}

interface TTSState {
  isInitialized: boolean;
  isSpeaking: boolean;
}

// ─── Service ───────────────────────────────────────────────────────────────────

class TTSService {
  private state: TTSState = {
    isInitialized: false,
    isSpeaking: false,
  };

  private config: TTSConfig = {
    volume: 1.0,
  };

  private currentAudio: HTMLAudioElement | null = null;
  private currentObjectURL: string | null = null;
  private previousObjectURL: string | null = null; // deferred revoke — only freed when replaced
  private onEndCallback?: () => void;
  private onErrorCallback?: (error: Error) => void;

  /**
   * Initialize the TTS service.
   * With Azure TTS there's no browser voice loading needed — just mark as ready.
   * The `onInteraction` param is kept for API compatibility (unlocks Audio on iOS/Safari).
   */
  async initialize(onInteraction: boolean = false): Promise<boolean> {
    if (typeof window === 'undefined') {
      console.warn('[TTS] Window not available');
      return false;
    }

    // On user interaction, play a silent audio to unlock the audio context (iOS/Safari)
    if (onInteraction) {
      try {
        const silence = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=');
        silence.volume = 0;
        await silence.play().catch(() => {});
        console.log('[TTS] 🔓 Audio context unlocked via user interaction');
      } catch {
        console.warn('[TTS] Could not unlock audio context');
      }
    }

    this.state.isInitialized = true;
    console.log('[TTS] ✅ Azure TTS service initialized');
    console.log('[TTS] 🎤 Voice: en-MY-WilliamNeural (Azure Neural)');
    return true;
  }

  /**
   * Speak text using Azure Neural TTS via the generate-voice Edge Function.
   * Fetches an MP3 blob from the backend and plays it via HTMLAudioElement.
   * Always cancels any currently playing audio first — no double-voice.
   */
  async speak(text: string, _isHome: boolean = false): Promise<void> {
    if (!this.state.isInitialized) {
      console.error('[TTS] Service not initialized. Call initialize() first.');
      throw new Error('TTS service not initialized');
    }

    const cleanText = text.trim();
    if (!cleanText) return;

    // ALWAYS cancel current audio before starting a new one — prevents double-voice.
    if (this.state.isSpeaking || this.currentAudio) {
      console.log('[TTS] 🛑 Cancelling previous audio before new speak()');
      this.cancel();
    }

    // Mark as speaking immediately so callers know we're busy (fetching counts as "speaking")
    this.state.isSpeaking = true;

    console.log('[TTS] 📡 Fetching Azure voice for:', cleanText.substring(0, 60) + (cleanText.length > 60 ? '...' : ''));

    try {
      const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
      const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/generate-voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ text: cleanText }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[TTS] ❌ generate-voice error:', response.status, errorText);
        throw new Error(`generate-voice error: ${response.status} - ${errorText}`);
      }

      const blob = await response.blob();
      console.log('[TTS] ✅ Audio received | Size:', blob.size, 'bytes');

      // Revoke any previous URL now that we're about to create a new one
      this.revokePrevious();

      // Create object URL and play
      const objectURL = URL.createObjectURL(blob);
      this.currentObjectURL = objectURL;

      const audio = new Audio(objectURL);
      audio.volume = this.config.volume;
      this.currentAudio = audio;

      // Event: playback started
      audio.onplay = () => {
        this.state.isSpeaking = true;
        console.log('[TTS] ▶️ Playing Azure voice:', cleanText.substring(0, 40));
      };

      // Event: playback ended
      audio.onended = () => {
        this.state.isSpeaking = false;
        console.log('[TTS] ⏹️ Finished playing');
        this.safeRevokeCurrentURL();
        this.currentAudio = null;
        if (this.onEndCallback) {
          this.onEndCallback();
        }
      };

      // Event: playback error
      audio.onerror = () => {
        this.state.isSpeaking = false;
        const error = new Error('Audio playback failed');
        console.error('[TTS] ❌ Playback error');
        this.safeRevokeCurrentURL();
        this.currentAudio = null;
        if (this.onErrorCallback) {
          this.onErrorCallback(error);
        }
      };

      // Play immediately — browser streams MP3 from blob URL, no need to wait for full buffer
      await audio.play();
    } catch (error) {
      this.state.isSpeaking = false;
      console.error('[TTS] ❌ speak() failed:', (error as Error).message);
      this.safeRevokeCurrentURL();

      if (this.onErrorCallback) {
        this.onErrorCallback(error as Error);
      }
    }
  }

  /**
   * Stop current audio playback and reset.
   * NOTE: We do NOT revoke the blob URL here — the browser may still reference
   * it internally after pause(). The URL will be revoked when the next speak()
   * creates a new blob, or when onended/onerror fires.
   */
  cancel(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio.onplay = null;
      this.currentAudio.onended = null;
      this.currentAudio.onerror = null;
      this.currentAudio = null;
      console.log('[TTS] 🛑 Playback cancelled');
    }
    // Move current URL to "previous" so it gets revoked on next speak()
    if (this.currentObjectURL) {
      this.previousObjectURL = this.currentObjectURL;
      this.currentObjectURL = null;
    }
    this.state.isSpeaking = false;
  }

  /**
   * Revoke the previous object URL (deferred cleanup — safe for browser).
   */
  private revokePrevious(): void {
    if (this.previousObjectURL) {
      URL.revokeObjectURL(this.previousObjectURL);
      this.previousObjectURL = null;
    }
  }

  /**
   * Safely revoke the current object URL (only when audio is truly done).
   */
  private safeRevokeCurrentURL(): void {
    if (this.currentObjectURL) {
      URL.revokeObjectURL(this.currentObjectURL);
      this.currentObjectURL = null;
    }
  }

  /**
   * Check if currently speaking/playing.
   */
  isActive(): boolean {
    return this.state.isSpeaking;
  }

  /**
   * Set end callback.
   */
  onEnd(callback: () => void): void {
    this.onEndCallback = callback;
  }

  /**
   * Set error callback.
   */
  onError(callback: (error: Error) => void): void {
    this.onErrorCallback = callback;
  }

  /**
   * Get current state.
   */
  getState(): TTSState {
    return { ...this.state };
  }
}

// ─── Exports ───────────────────────────────────────────────────────────────────

// Export singleton instance
export const ttsService = new TTSService();

// Export convenience function for quick usage
export async function speakText(text: string, isHome: boolean = false): Promise<void> {
  await ttsService.speak(text, isHome);
}

// Export initialization function
export async function initTTS(onUserInteraction: boolean = false): Promise<boolean> {
  return ttsService.initialize(onUserInteraction);
}

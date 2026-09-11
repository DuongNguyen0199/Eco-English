/**
 * Web Speech API Text-to-Speech Service
 */

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    if (this.synth) {
      this.loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  getBestEnglishVoice() {
    if (!this.voices.length) this.loadVoices();
    return (
      this.voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) ||
      this.voices.find(v => v.lang === 'en-US' || v.lang.startsWith('en')) ||
      this.voices[0]
    );
  }

  speak(text, onStart, onEnd, onError) {
    if (!this.synth) {
      console.warn('Speech Synthesis not supported in this browser environment.');
      if (onError) onError();
      return;
    }

    this.synth.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92; // Natural, clear speed
    utterance.pitch = 1.0;

    const voice = this.getBestEnglishVoice();
    if (voice) utterance.voice = voice;

    utterance.onstart = () => onStart && onStart();
    utterance.onend = () => onEnd && onEnd();
    utterance.onerror = (e) => {
      console.error('Speech error:', e);
      if (onError) onError(e);
    };

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechService = new SpeechService();

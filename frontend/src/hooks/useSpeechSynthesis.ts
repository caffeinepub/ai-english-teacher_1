import { useState, useRef, useCallback, useEffect } from 'react';

interface SpeechSynthesisHook {
  speak: (text: string) => Promise<void>;
  isSpeaking: boolean;
  cancel: () => void;
  isSupported: boolean;
}

const PREFERRED_VOICES = [
  'Microsoft Zira Desktop - English (United States)',
  'Microsoft Zira - English (United States)',
  'Google UK English Female',
  'Google US English',
  'Samantha',
  'Karen',
  'Moira',
  'Tessa',
];

function getPreferredVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  // Try preferred voices first
  for (const preferred of PREFERRED_VOICES) {
    const voice = voices.find((v) => v.name === preferred);
    if (voice) return voice;
  }

  // Fallback: any English female voice
  const englishFemale = voices.find(
    (v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')
  );
  if (englishFemale) return englishFemale;

  // Fallback: any English voice
  const english = voices.find((v) => v.lang.startsWith('en'));
  return english || voices[0] || null;
}

export function useSpeechSynthesis(): SpeechSynthesisHook {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback(
    (text: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!isSupported) {
          resolve();
          return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 1;

        // Set voice (may need to wait for voices to load)
        const setVoiceAndSpeak = () => {
          const voice = getPreferredVoice();
          if (voice) {
            utterance.voice = voice;
          }

          utterance.onstart = () => setIsSpeaking(true);
          utterance.onend = () => {
            setIsSpeaking(false);
            resolve();
          };
          utterance.onerror = (e) => {
            setIsSpeaking(false);
            if (e.error !== 'interrupted' && e.error !== 'canceled') {
              reject(new Error(`Speech synthesis error: ${e.error}`));
            } else {
              resolve();
            }
          };

          utteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        };

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setVoiceAndSpeak();
        } else {
          window.speechSynthesis.onvoiceschanged = () => {
            setVoiceAndSpeak();
          };
          // Fallback timeout
          setTimeout(setVoiceAndSpeak, 500);
        }
      });
    },
    [isSupported]
  );

  const cancel = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return { speak, isSpeaking, cancel, isSupported };
}

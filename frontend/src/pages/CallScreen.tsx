import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Phone, PhoneOff, Mic, MicOff, ArrowLeft, Volume2, CheckCircle, XCircle, Loader2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useCheckAndUpdateAchievements } from '../hooks/useQueries';
import Navbar from '../components/Navbar';
import XPCounter from '../components/XPCounter';
import BadgeUnlockNotification from '../components/BadgeUnlockNotification';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { analyzeSpeech, type SpeechAnalysisResult } from '../lib/speechAnalysis';

type CallStatus = 'idle' | 'calling' | 'connected' | 'ai-speaking' | 'listening' | 'processing';

const PRACTICE_MODES = [
  {
    value: 'daily',
    label: 'Daily Conversation',
    emoji: '💬',
    greeting: "Hello! I'm your AI English teacher. Let's have a friendly conversation today. How has your day been so far?",
  },
  {
    value: 'interview',
    label: 'Interview Mode',
    emoji: '💼',
    greeting:
      "Welcome to interview practice! I'll be your interviewer today. Let's start with a classic question: Tell me about yourself and your professional background.",
  },
  {
    value: 'group',
    label: 'Group Discussion',
    emoji: '👥',
    greeting:
      "Welcome to group discussion practice! Today's topic is: Should social media be regulated by governments? Please share your opening thoughts.",
  },
  {
    value: 'rrbssc',
    label: 'RRB/SSC Mode',
    emoji: '📋',
    greeting:
      "Namaste! Welcome to RRB/SSC English practice. Let's work on your spoken English for competitive exams. Please introduce yourself in English.",
  },
];

type TranscriptEntry = {
  speaker: 'user' | 'ai';
  text: string;
  timestamp: Date;
};

export default function CallScreen() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const checkAchievements = useCheckAndUpdateAchievements();

  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [selectedMode, setSelectedMode] = useState('daily');
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [analysis, setAnalysis] = useState<SpeechAnalysisResult | null>(null);
  const [showXP, setShowXP] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [newBadge, setNewBadge] = useState<{ name: string; icon: string; description: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const {
    transcript: speechTranscript,
    isListening,
    startListening,
    stopListening,
    error: speechError,
    clearTranscript,
  } = useSpeechRecognition();
  const { speak, isSpeaking, cancel: cancelSpeech } = useSpeechSynthesis();

  // Read mode from URL search params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    if (mode && PRACTICE_MODES.find((m) => m.value === mode)) {
      setSelectedMode(mode);
    }
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Update call status based on speech state
  useEffect(() => {
    if (
      callStatus === 'connected' ||
      callStatus === 'ai-speaking' ||
      callStatus === 'listening' ||
      callStatus === 'processing'
    ) {
      if (isSpeaking) {
        setCallStatus('ai-speaking');
      } else if (isListening) {
        setCallStatus('listening');
      } else if (!isProcessing) {
        setCallStatus('connected');
      }
    }
  }, [isSpeaking, isListening, isProcessing, callStatus]);

  // Handle speech error
  useEffect(() => {
    if (speechError) {
      toast.error(speechError);
    }
  }, [speechError]);

  const addToTranscript = useCallback((speaker: 'user' | 'ai', text: string) => {
    setTranscript((prev) => [...prev, { speaker, text, timestamp: new Date() }]);
  }, []);

  const handleStartCall = useCallback(async () => {
    setCallStatus('calling');
    setTranscript([]);
    setAnalysis(null);

    setTimeout(async () => {
      setCallStatus('ai-speaking');
      const mode = PRACTICE_MODES.find((m) => m.value === selectedMode);
      const greeting = mode?.greeting || PRACTICE_MODES[0].greeting;

      addToTranscript('ai', greeting);
      await speak(greeting);
      setCallStatus('listening');
      startListening();
    }, 1500);
  }, [selectedMode, speak, startListening, addToTranscript]);

  const handleEndCall = useCallback(() => {
    cancelSpeech();
    stopListening();
    setCallStatus('idle');
    clearTranscript();
  }, [cancelSpeech, stopListening, clearTranscript]);

  const handleStartListening = useCallback(() => {
    if (callStatus !== 'idle' && callStatus !== 'calling') {
      clearTranscript();
      startListening();
      setCallStatus('listening');
    }
  }, [callStatus, clearTranscript, startListening]);

  const processUserSpeech = useCallback(
    async (userText: string) => {
      if (!userText.trim()) return;

      addToTranscript('user', userText);
      setIsProcessing(true);
      setCallStatus('processing');

      try {
        const result = await analyzeSpeech(userText, selectedMode);
        setAnalysis(result);

        if (result.xpEarned > 0 && identity) {
          setXpAmount(result.xpEarned);
          setShowXP(true);
          setTimeout(() => setShowXP(false), 3000);

          try {
            const achievementResult = await checkAchievements.mutateAsync({
              userId: identity.getPrincipal().toString(),
              xp: BigInt(result.xpEarned),
            });
            if (achievementResult.newBadge && achievementResult.newBadge.name !== 'New Badge') {
              setNewBadge({
                name: achievementResult.newBadge.name,
                icon: achievementResult.newBadge.icon,
                description: achievementResult.newBadge.description,
              });
            }
          } catch {
            // Achievement update failed silently
          }
        }

        setIsProcessing(false);
        setCallStatus('ai-speaking');
        addToTranscript('ai', result.spokenResponse);
        await speak(result.spokenResponse);
        setCallStatus('listening');
        clearTranscript();
        startListening();
      } catch {
        setIsProcessing(false);
        setCallStatus('connected');
        toast.error('Failed to analyze speech. Please try again.');
      }
    },
    [selectedMode, identity, checkAchievements, speak, startListening, clearTranscript, addToTranscript]
  );

  const handleStopListening = useCallback(async () => {
    stopListening();
    if (speechTranscript.trim()) {
      await processUserSpeech(speechTranscript.trim());
    }
  }, [stopListening, speechTranscript, processUserSpeech]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && callStatus !== 'idle' && callStatus !== 'calling') {
        e.preventDefault();
        if (isListening) {
          handleStopListening();
        } else if (!isSpeaking && !isProcessing) {
          handleStartListening();
        }
      }
      if (e.code === 'Escape' && callStatus !== 'idle') {
        handleEndCall();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callStatus, isListening, isSpeaking, isProcessing, handleStopListening, handleStartListening, handleEndCall]);

  const currentMode = PRACTICE_MODES.find((m) => m.value === selectedMode);

  const statusConfig: Record<CallStatus, { label: string; color: string; pulse: boolean }> = {
    idle: { label: 'Ready to Call', color: 'text-white/60', pulse: false },
    calling: { label: 'Calling...', color: 'text-yellow-400', pulse: true },
    connected: { label: 'Connected', color: 'text-green-400', pulse: false },
    'ai-speaking': { label: 'AI Speaking...', color: 'text-violet-400', pulse: true },
    listening: { label: 'Listening...', color: 'text-cyan-400', pulse: true },
    processing: { label: 'Processing...', color: 'text-pink-400', pulse: true },
  };

  const status = statusConfig[callStatus];

  return (
    <div className="min-h-screen bg-deep-purple text-white">
      <Navbar />

      {/* XP Counter */}
      {showXP && <XPCounter amount={xpAmount} />}

      {/* Badge Notification */}
      {newBadge && <BadgeUnlockNotification badge={newBadge} onDismiss={() => setNewBadge(null)} />}

      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/dashboard' })}
            className="text-white/60 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">AI Voice Call</h1>
          <div className="text-sm text-white/40 ml-auto hidden sm:block">Space: toggle mic • Esc: end call</div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Main Call Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Avatar & Status */}
            <div className="glass-card rounded-3xl p-8 border border-white/10 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 to-transparent" />

              {/* Mode Selector */}
              <div className="relative z-10 mb-6">
                <Select value={selectedMode} onValueChange={setSelectedMode} disabled={callStatus !== 'idle'}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl w-full max-w-xs mx-auto">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-deep-purple border-white/20">
                    {PRACTICE_MODES.map((mode) => (
                      <SelectItem key={mode.value} value={mode.value} className="text-white hover:bg-white/10">
                        {mode.emoji} {mode.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Avatar */}
              <div className="relative z-10 flex justify-center mb-6">
                <div className="relative">
                  {(callStatus === 'ai-speaking' || callStatus === 'listening') && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-violet-500/30 blur-xl scale-125 animate-pulse-glow" />
                      <div
                        className="absolute inset-0 rounded-full border-2 border-violet-500/50 scale-110 animate-ping"
                        style={{ animationDuration: '2s' }}
                      />
                    </>
                  )}
                  <div
                    className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 transition-all duration-500 ${
                      callStatus === 'ai-speaking'
                        ? 'border-violet-500 shadow-2xl shadow-violet-500/50'
                        : callStatus === 'listening'
                          ? 'border-cyan-500 shadow-2xl shadow-cyan-500/50'
                          : 'border-white/20'
                    }`}
                  >
                    <img
                      src="/assets/generated/ai-avatar.dim_512x512.png"
                      alt="AI Teacher"
                      className="w-full h-full object-cover"
                    />
                    {callStatus === 'ai-speaking' && (
                      <div className="absolute inset-0 bg-violet-500/10 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div
                className={`relative z-10 text-lg font-semibold mb-2 ${status.color} ${status.pulse ? 'animate-pulse' : ''}`}
              >
                {status.label}
              </div>
              <div className="relative z-10 text-white/50 text-sm mb-6">
                {currentMode?.emoji} {currentMode?.label}
              </div>

              {/* Waveform */}
              {callStatus !== 'idle' && (
                <div className="relative z-10 flex items-center justify-center gap-1 h-12 mb-6">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-300 ${
                        callStatus === 'ai-speaking'
                          ? 'bg-violet-400'
                          : callStatus === 'listening'
                            ? 'bg-cyan-400'
                            : 'bg-white/30'
                      }`}
                      style={{
                        height:
                          callStatus === 'ai-speaking' || callStatus === 'listening'
                            ? `${Math.random() * 32 + 8}px`
                            : '8px',
                        animation:
                          callStatus === 'ai-speaking' || callStatus === 'listening'
                            ? `wave-bar ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate`
                            : 'none',
                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Call Controls */}
              <div className="relative z-10 flex items-center justify-center gap-4">
                {callStatus === 'idle' ? (
                  <Button
                    onClick={handleStartCall}
                    className="bg-green-600 hover:bg-green-500 text-white w-16 h-16 rounded-full shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-110"
                  >
                    <Phone className="w-6 h-6" />
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={isListening ? handleStopListening : handleStartListening}
                      disabled={isSpeaking || isProcessing || callStatus === 'calling'}
                      className={`w-14 h-14 rounded-full transition-all duration-300 hover:scale-110 ${
                        isListening ? 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-500/30' : 'bg-white/20 hover:bg-white/30'
                      } shadow-lg`}
                    >
                      {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </Button>
                    <Button
                      onClick={handleEndCall}
                      className="bg-red-600 hover:bg-red-500 text-white w-16 h-16 rounded-full shadow-lg shadow-red-500/30 transition-all duration-300 hover:scale-110"
                    >
                      <PhoneOff className="w-6 h-6" />
                    </Button>
                  </>
                )}
              </div>

              {/* Live transcript */}
              {isListening && speechTranscript && (
                <div className="relative z-10 mt-4 glass-card rounded-xl p-3 border border-cyan-500/30 text-sm text-cyan-300 italic">
                  "{speechTranscript}"
                </div>
              )}
            </div>

            {/* Transcript */}
            {transcript.length > 0 && (
              <div className="glass-card rounded-2xl p-6 border border-white/10">
                <h3 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider">Conversation</h3>
                <ScrollArea className="h-48">
                  <div className="space-y-3 pr-4">
                    {transcript.map((entry, i) => (
                      <div key={i} className={`flex gap-3 ${entry.speaker === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                            entry.speaker === 'ai' ? 'bg-violet-500/30' : 'bg-cyan-500/30'
                          }`}
                        >
                          {entry.speaker === 'ai' ? '👩‍🏫' : '🧑'}
                        </div>
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                            entry.speaker === 'ai' ? 'bg-violet-500/20 text-white/90' : 'bg-cyan-500/20 text-white/90'
                          }`}
                        >
                          {entry.text}
                        </div>
                      </div>
                    ))}
                    <div ref={transcriptEndRef} />
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          {/* Feedback Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h3 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Live Feedback
              </h3>

              {isProcessing && (
                <div className="flex items-center gap-3 text-pink-400 py-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Analyzing your speech...</span>
                </div>
              )}

              {!analysis && !isProcessing && (
                <div className="text-center py-8 text-white/30">
                  <Mic className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Start a call and speak to get feedback</p>
                </div>
              )}

              {analysis && !isProcessing && (
                <div className="space-y-4">
                  {/* Correctness indicator */}
                  <div
                    className={`flex items-center gap-2 text-sm font-medium ${analysis.isCorrect ? 'text-green-400' : 'text-yellow-400'}`}
                  >
                    {analysis.isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {analysis.encouragement}
                  </div>

                  {/* Original */}
                  <div>
                    <div className="text-xs text-white/40 mb-1 uppercase tracking-wider">You said</div>
                    <div className="glass-card rounded-xl p-3 border border-white/10 text-sm text-white/80">
                      {analysis.original}
                    </div>
                  </div>

                  {/* Corrected */}
                  {!analysis.isCorrect && (
                    <div>
                      <div className="text-xs text-white/40 mb-1 uppercase tracking-wider">Corrected</div>
                      <div className="glass-card rounded-xl p-3 border border-green-500/30 text-sm text-green-300">
                        {analysis.corrected}
                      </div>
                    </div>
                  )}

                  {/* Mistakes */}
                  {analysis.mistakes && analysis.mistakes.length > 0 && (
                    <div>
                      <div className="text-xs text-white/40 mb-2 uppercase tracking-wider">Corrections</div>
                      <div className="space-y-2">
                        {analysis.mistakes.map((mistake, i) => (
                          <div key={i} className="glass-card rounded-xl p-3 border border-yellow-500/20 text-xs">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 capitalize">
                                {mistake.type}
                              </span>
                              <span className="text-red-400 line-through">{mistake.error}</span>
                              <span className="text-white/40">→</span>
                              <span className="text-green-400">{mistake.correction}</span>
                            </div>
                            <p className="text-white/60">{mistake.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pronunciation Tips */}
                  {analysis.pronunciationTips && (
                    <div>
                      <div className="text-xs text-white/40 mb-1 uppercase tracking-wider">Pronunciation Tips</div>
                      <div className="glass-card rounded-xl p-3 border border-cyan-500/20 text-sm text-cyan-300">
                        🎤 {analysis.pronunciationTips}
                      </div>
                    </div>
                  )}

                  {/* XP Earned */}
                  {analysis.xpEarned > 0 && (
                    <div className="flex items-center gap-2 text-yellow-400 text-sm font-semibold">
                      <Trophy className="w-4 h-4" />
                      +{analysis.xpEarned} XP earned!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="glass-card rounded-2xl p-4 border border-white/10">
              <h3 className="text-xs font-semibold text-white/40 mb-3 uppercase tracking-wider">Tips</h3>
              <ul className="space-y-2 text-xs text-white/60">
                <li>• Speak clearly and at a natural pace</li>
                <li>• Use complete sentences for better feedback</li>
                <li>• Press Space to toggle microphone</li>
                <li>• Press Escape to end the call</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export interface SpeechMistake {
  type: 'grammar' | 'pronunciation' | 'fluency';
  error: string;
  correction: string;
  explanation: string;
}

export interface SpeechAnalysisResult {
  original: string;
  corrected: string;
  isCorrect: boolean;
  mistakes: SpeechMistake[];
  encouragement: string;
  pronunciationTips: string;
  xpEarned: number;
  spokenResponse: string;
}

const MOCK_RESPONSES: Record<string, SpeechAnalysisResult[]> = {
  daily: [
    {
      original: '',
      corrected: '',
      isCorrect: true,
      mistakes: [],
      encouragement: 'Excellent! Your English is very natural!',
      pronunciationTips: 'Great pronunciation! Keep practicing to maintain your fluency.',
      xpEarned: 15,
      spokenResponse: "That's wonderful! You expressed yourself very clearly. Let's continue our conversation. What do you enjoy doing in your free time?",
    },
    {
      original: '',
      corrected: '',
      isCorrect: false,
      mistakes: [
        {
          type: 'grammar',
          error: 'I am go to market',
          correction: 'I am going to the market',
          explanation: 'Use the present continuous tense "going" instead of the base form "go". Also, use the definite article "the" before "market".',
        },
      ],
      encouragement: 'Good effort! Just a small grammar correction needed.',
      pronunciationTips: 'Try to stress the word "going" more clearly. The "-ing" ending should be pronounced distinctly.',
      xpEarned: 10,
      spokenResponse: "Good try! Remember to use 'going' instead of 'go' in this context. Let's practice more. Can you tell me about your favorite food?",
    },
  ],
  interview: [
    {
      original: '',
      corrected: '',
      isCorrect: true,
      mistakes: [],
      encouragement: 'Impressive! That was a very professional response!',
      pronunciationTips: 'Your pace and clarity are excellent for an interview setting.',
      xpEarned: 20,
      spokenResponse: "Excellent answer! You demonstrated strong communication skills. Now, can you tell me about a challenging situation you faced at work and how you handled it?",
    },
  ],
  group: [
    {
      original: '',
      corrected: '',
      isCorrect: false,
      mistakes: [
        {
          type: 'fluency',
          error: 'I think that... um... social media is... uh... bad',
          correction: 'I believe that social media has significant negative impacts on society.',
          explanation: 'Avoid filler words like "um" and "uh". Use more formal vocabulary in group discussions.',
        },
      ],
      encouragement: 'Good point! Let\'s work on expressing it more fluently.',
      pronunciationTips: 'Speak at a steady pace. Pausing briefly to think is better than using filler words.',
      xpEarned: 10,
      spokenResponse: "That's an interesting perspective. Try to express your ideas more confidently without filler words. What specific negative impacts do you think social media has?",
    },
  ],
  rrbssc: [
    {
      original: '',
      corrected: '',
      isCorrect: true,
      mistakes: [],
      encouragement: 'Very good! Your formal English is improving!',
      pronunciationTips: 'Your pronunciation is clear. Focus on maintaining this consistency.',
      xpEarned: 15,
      spokenResponse: "Well done! Your introduction was clear and professional. For the exam, remember to speak confidently and maintain eye contact. Now, tell me about your educational background.",
    },
  ],
};

let mockResponseIndex = 0;

export async function analyzeSpeech(
  transcript: string,
  mode: string
): Promise<SpeechAnalysisResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const modeResponses = MOCK_RESPONSES[mode] || MOCK_RESPONSES.daily;
  const response = modeResponses[mockResponseIndex % modeResponses.length];
  mockResponseIndex++;

  // Customize with actual transcript
  const isShort = transcript.split(' ').length < 5;
  const hasGrammarIssue = /\b(i is|he are|they was|we was|i goes|she go|he go)\b/i.test(transcript);

  if (isShort) {
    return {
      original: transcript,
      corrected: transcript,
      isCorrect: false,
      mistakes: [
        {
          type: 'fluency',
          error: transcript,
          correction: `Please elaborate: "${transcript}" — try to speak in complete sentences.`,
          explanation: 'Try to use complete sentences with at least 8-10 words for better practice.',
        },
      ],
      encouragement: 'Good start! Try to speak in longer, complete sentences.',
      pronunciationTips: 'Speak clearly and at a natural pace. Complete sentences help with fluency.',
      xpEarned: 5,
      spokenResponse: `I heard you say "${transcript}". Could you please elaborate more? Try to speak in complete sentences for better practice.`,
    };
  }

  if (hasGrammarIssue) {
    return {
      original: transcript,
      corrected: transcript.replace(/\bi is\b/gi, 'I am').replace(/\bhe are\b/gi, 'he is').replace(/\bthey was\b/gi, 'they were'),
      isCorrect: false,
      mistakes: [
        {
          type: 'grammar',
          error: 'Subject-verb agreement error',
          correction: 'Check your subject-verb agreement',
          explanation: 'Make sure the verb agrees with the subject. "I am", "he is", "they are", "we were".',
        },
      ],
      encouragement: 'Almost there! Watch your subject-verb agreement.',
      pronunciationTips: 'Your pronunciation is good. Focus on grammar accuracy.',
      xpEarned: 8,
      spokenResponse: `Good effort! I noticed a small grammar issue. ${response.spokenResponse}`,
    };
  }

  return {
    ...response,
    original: transcript,
    corrected: response.isCorrect ? transcript : response.corrected || transcript,
  };
}

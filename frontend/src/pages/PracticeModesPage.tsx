import { useNavigate } from '@tanstack/react-router';
import { MessageCircle, Briefcase, Users, FileText, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MODES = [
  {
    value: 'daily',
    icon: <MessageCircle className="w-8 h-8" />,
    emoji: '💬',
    title: 'Daily Conversation',
    description: 'Practice everyday English topics like weather, food, travel, hobbies, and more. Perfect for building natural fluency.',
    topics: ['Weather & Seasons', 'Food & Restaurants', 'Travel & Tourism', 'Hobbies & Interests'],
    color: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/20',
    border: 'border-violet-500/30',
    difficulty: 'Beginner–Intermediate',
  },
  {
    value: 'interview',
    icon: <Briefcase className="w-8 h-8" />,
    emoji: '💼',
    title: 'Interview Mode',
    description: 'Prepare for job interviews with common HR and technical questions. Build confidence for campus placements.',
    topics: ['Tell me about yourself', 'Strengths & Weaknesses', 'Situational Questions', 'Career Goals'],
    color: 'from-blue-500 to-cyan-600',
    glow: 'shadow-blue-500/20',
    border: 'border-blue-500/30',
    difficulty: 'Intermediate–Advanced',
  },
  {
    value: 'group',
    icon: <Users className="w-8 h-8" />,
    emoji: '👥',
    title: 'Group Discussion',
    description: 'Practice GD topics for competitive exams and MBA admissions. Learn to express opinions clearly and confidently.',
    topics: ['Social Media Regulation', 'Climate Change', 'Technology & Society', 'Education Reform'],
    color: 'from-pink-500 to-rose-600',
    glow: 'shadow-pink-500/20',
    border: 'border-pink-500/30',
    difficulty: 'Intermediate–Advanced',
  },
  {
    value: 'rrbssc',
    icon: <FileText className="w-8 h-8" />,
    emoji: '📋',
    title: 'RRB/SSC Mode',
    description: 'Specialized practice for Railway and Staff Selection Commission exams. Focus on formal English and exam patterns.',
    topics: ['Self Introduction', 'Current Affairs', 'Formal Communication', 'Exam Vocabulary'],
    color: 'from-orange-500 to-amber-600',
    glow: 'shadow-orange-500/20',
    border: 'border-orange-500/30',
    difficulty: 'Beginner–Intermediate',
  },
];

export default function PracticeModesPage() {
  const navigate = useNavigate();

  const handleStartMode = (mode: string) => {
    navigate({ to: '/call', search: { mode } as Record<string, string> });
  };

  return (
    <div className="min-h-screen bg-deep-purple text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/dashboard' })}
            className="text-white/60 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Practice Modes</h1>
            <p className="text-white/60 mt-1">Choose your learning focus and start practicing</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {MODES.map((mode) => (
            <div
              key={mode.value}
              className={`glass-card rounded-3xl p-6 border ${mode.border} hover:shadow-xl ${mode.glow} transition-all duration-300 hover:-translate-y-1 group`}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {mode.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{mode.emoji}</span>
                    <h3 className="text-lg font-bold">{mode.title}</h3>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                    {mode.difficulty}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/70 text-sm mb-4 leading-relaxed">{mode.description}</p>

              {/* Topics */}
              <div className="mb-6">
                <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Sample Topics</div>
                <div className="flex flex-wrap gap-2">
                  {mode.topics.map((topic) => (
                    <span key={topic} className="text-xs px-2 py-1 rounded-lg bg-white/10 text-white/70">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Button
                onClick={() => handleStartMode(mode.value)}
                className={`w-full bg-gradient-to-r ${mode.color} text-white py-3 rounded-xl font-semibold h-auto transition-all duration-300 hover:opacity-90 hover:scale-[1.02]`}
              >
                Start Practice
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-8 glass-card rounded-2xl p-6 border border-white/10 max-w-4xl mx-auto text-center">
          <p className="text-white/60 text-sm">
            💡 <strong className="text-white/80">Pro tip:</strong> Each mode uses AI-powered conversation starters tailored to your chosen topic. Earn XP and badges as you practice!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

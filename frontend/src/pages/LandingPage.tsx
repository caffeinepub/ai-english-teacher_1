import { useNavigate } from '@tanstack/react-router';
import { Mic, BookOpen, Trophy, Users, Star, ChevronRight, Sparkles, Volume2, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const features = [
  {
    icon: <Mic className="w-7 h-7" />,
    title: 'Voice AI Coaching',
    description: 'Practice speaking with our AI teacher using real-time voice recognition and natural conversation.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    icon: <Brain className="w-7 h-7" />,
    title: 'Grammar Correction',
    description: 'Get instant feedback on grammar, pronunciation, and fluency with detailed explanations.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
  },
  {
    icon: <Trophy className="w-7 h-7" />,
    title: 'Rewards & XP',
    description: 'Earn XP points, unlock badges, and level up from Beginner to Expert as you improve.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: <Users className="w-7 h-7" />,
    title: 'Practice Modes',
    description: 'Choose from Daily Conversation, Interview, Group Discussion, or RRB/SSC exam prep.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer',
    text: 'My English improved dramatically in just 2 weeks! The AI feedback is incredibly accurate and helpful.',
    rating: 5,
    avatar: '👩‍💻',
  },
  {
    name: 'Rahul Verma',
    role: 'MBA Student',
    text: 'The interview practice mode helped me ace my campus placements. Highly recommended!',
    rating: 5,
    avatar: '👨‍🎓',
  },
  {
    name: 'Anita Patel',
    role: 'RRB Aspirant',
    text: 'The RRB/SSC mode is perfect for exam preparation. I feel so much more confident now.',
    rating: 5,
    avatar: '👩‍🏫',
  },
];

const stats = [
  { value: '50K+', label: 'Active Learners' },
  { value: '2M+', label: 'Practice Sessions' },
  { value: '95%', label: 'Satisfaction Rate' },
  { value: '40+', label: 'Countries' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-deep-purple text-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/assets/generated/hero-bg.dim_1920x1080.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-purple/60 via-transparent to-deep-purple" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-accent/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyan-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 py-20">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-sm text-violet-300 mb-6 border border-violet-500/30">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered English Learning</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
              Speak English
              <span className="block bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                With Confidence
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-xl mx-auto lg:mx-0">
              Practice with your AI English teacher. Get real-time grammar corrections, pronunciation tips, and earn rewards as you improve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={() => navigate({ to: '/dashboard' })}
                className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white px-8 py-4 text-lg rounded-2xl font-semibold shadow-lg shadow-violet-500/25 transition-all duration-300 hover:scale-105 hover:shadow-violet-500/40 h-auto"
              >
                Start Learning Free
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/call' })}
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-2xl font-semibold h-auto backdrop-blur-sm"
              >
                <Volume2 className="w-5 h-5 mr-2" />
                Try Voice Call
              </Button>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex-1 flex justify-center items-center">
            <div className="relative">
              {/* Glow rings */}
              <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-2xl scale-110 animate-pulse-glow" />
              <div className="absolute inset-0 rounded-full border-2 border-violet-500/30 scale-125 animate-spin-slow" />
              <div className="absolute inset-0 rounded-full border border-pink-500/20 scale-150 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '8s' }} />

              {/* Avatar container */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden glass-card border-2 border-violet-500/40 shadow-2xl shadow-violet-500/30">
                <img
                  src="/assets/generated/ai-avatar.dim_512x512.png"
                  alt="AI English Teacher"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 glass-card px-3 py-2 rounded-xl border border-white/20 text-sm font-medium animate-float">
                <span className="text-yellow-400">⭐</span> Expert Level
              </div>
              <div className="absolute -bottom-4 -left-4 glass-card px-3 py-2 rounded-xl border border-white/20 text-sm font-medium animate-float" style={{ animationDelay: '1s' }}>
                <span className="text-green-400">✓</span> AI Powered
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"> Master English</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with proven learning methods.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="glass-card p-6 rounded-2xl border border-white/10 hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/10 group">
                <div className={`w-14 h-14 ${feature.bg} rounded-xl flex items-center justify-center mb-4 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-white/60 text-lg">Start improving your English in 3 simple steps</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Sign In', desc: 'Create your account and set up your learning profile in seconds.', icon: '🔐' },
              { step: '02', title: 'Start a Call', desc: 'Choose your practice mode and start speaking with your AI teacher.', icon: '📞' },
              { step: '03', title: 'Improve & Earn', desc: 'Get instant feedback, earn XP, unlock badges, and track your progress.', icon: '🏆' },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="text-6xl mb-4">{item.icon}</div>
                <div className="text-violet-400 text-sm font-bold mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by
              <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent"> Thousands</span>
            </h2>
            <p className="text-white/60 text-lg">See what our learners say about their experience</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card p-6 rounded-2xl border border-white/10 hover:border-violet-500/30 transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/80 mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-xl">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-white/50 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-3xl p-12 text-center border border-violet-500/20 relative overflow-hidden max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-pink-600/10" />
            <div className="relative z-10">
              <div className="text-5xl mb-6">👩‍🏫</div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Speak with Confidence?</h2>
              <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of learners who have transformed their English skills with AI coaching.
              </p>
              <Button
                onClick={() => navigate({ to: '/dashboard' })}
                className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white px-10 py-4 text-lg rounded-2xl font-semibold shadow-lg shadow-violet-500/25 transition-all duration-300 hover:scale-105 h-auto"
              >
                Get Started Free
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

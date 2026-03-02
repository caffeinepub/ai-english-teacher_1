import { useNavigate } from '@tanstack/react-router';
import { Phone, BookOpen, Flame, Trophy, TrendingUp, Clock, Target, Zap, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetCallerUserProfile, useGetLeaderboard } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LEVELS = [
  { name: 'Beginner', min: 0, max: 500, color: 'from-gray-400 to-gray-500' },
  { name: 'Elementary', min: 500, max: 1500, color: 'from-green-400 to-emerald-500' },
  { name: 'Intermediate', min: 1500, max: 3500, color: 'from-blue-400 to-cyan-500' },
  { name: 'Advanced', min: 3500, max: 7000, color: 'from-violet-400 to-purple-500' },
  { name: 'Expert', min: 7000, max: Infinity, color: 'from-yellow-400 to-orange-500' },
];

function getLevel(xp: number) {
  return LEVELS.find((l) => xp >= l.min && xp < l.max) || LEVELS[LEVELS.length - 1];
}

function getLevelProgress(xp: number) {
  const level = getLevel(xp);
  if (level.max === Infinity) return 100;
  return Math.round(((xp - level.min) / (level.max - level.min)) * 100);
}

const BADGE_ICONS: Record<string, string> = {
  'Starter Badge': '🏅',
  'New Badge': '⭐',
  'First Lesson': '📚',
  '7-Day Streak': '🔥',
  'Grammar Pro': '✍️',
  '100 Sessions': '💯',
  'Pronunciation Pro': '🎤',
  'Grammar Guru': '🧠',
  'Streak Master': '⚡',
  'Fluency Star': '🌟',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const { data: leaderboard } = useGetLeaderboard();

  const xp = profile ? Number(profile.xp) : 0;
  const streak = profile ? Number(profile.streak) : 0;
  const level = getLevel(xp);
  const levelProgress = getLevelProgress(xp);
  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1];

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const stats = [
    { icon: <Trophy className="w-5 h-5" />, label: 'Total XP', value: xp.toLocaleString(), color: 'text-yellow-400' },
    { icon: <Flame className="w-5 h-5" />, label: 'Day Streak', value: `${streak} 🔥`, color: 'text-orange-400' },
    { icon: <Target className="w-5 h-5" />, label: 'Level', value: level.name, color: 'text-violet-400' },
    { icon: <Zap className="w-5 h-5" />, label: 'Badges', value: profile?.badges?.length || 0, color: 'text-cyan-400' },
  ];

  return (
    <div className="min-h-screen bg-deep-purple text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            {isLoading ? (
              <Skeleton className="h-8 w-48 bg-white/10 mb-2" />
            ) : (
              <h1 className="text-2xl sm:text-3xl font-bold">
                Welcome back, <span className="text-violet-400">{profile?.name || 'Learner'}</span>! 👋
              </h1>
            )}
            <p className="text-white/60 mt-1">Keep up the great work on your English journey</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-white/20 text-white/70 hover:bg-white/10 rounded-xl"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-4 border border-white/10">
              <div className={`${stat.color} mb-2`}>{stat.icon}</div>
              <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-7 w-16 bg-white/10" /> : stat.value}</div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* XP Progress */}
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-400" />
                  XP Progress
                </h2>
                <span className={`text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r ${level.color} text-white`}>
                  {level.name}
                </span>
              </div>
              {isLoading ? (
                <Skeleton className="h-4 w-full bg-white/10 rounded-full" />
              ) : (
                <>
                  <Progress value={levelProgress} className="h-3 mb-3 bg-white/10" />
                  <div className="flex justify-between text-sm text-white/60">
                    <span>{xp.toLocaleString()} XP</span>
                    {nextLevel && <span>Next: {nextLevel.name} ({nextLevel.min.toLocaleString()} XP)</span>}
                    {!nextLevel && <span>🏆 Maximum Level!</span>}
                  </div>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {LEVELS.map((l) => (
                      <div
                        key={l.name}
                        className={`text-xs px-2 py-1 rounded-full ${xp >= l.min ? `bg-gradient-to-r ${l.color} text-white` : 'bg-white/10 text-white/40'}`}
                      >
                        {l.name}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Quick Actions */}
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Quick Actions
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Button
                  onClick={() => navigate({ to: '/call' })}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-6 rounded-xl font-semibold text-base h-auto flex-col gap-2"
                >
                  <Phone className="w-6 h-6" />
                  Start AI Call
                </Button>
                <Button
                  onClick={() => navigate({ to: '/practice' })}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white py-6 rounded-xl font-semibold text-base h-auto flex-col gap-2"
                >
                  <BookOpen className="w-6 h-6" />
                  Practice Modes
                </Button>
              </div>
            </div>

            {/* Badges */}
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Your Badges
              </h2>
              {isLoading ? (
                <div className="grid grid-cols-4 gap-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 bg-white/10 rounded-xl" />
                  ))}
                </div>
              ) : profile?.badges && profile.badges.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {profile.badges.map((badge) => (
                    <div
                      key={badge.id.toString()}
                      className="glass-card rounded-xl p-3 border border-violet-500/20 text-center hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1"
                      title={badge.description}
                    >
                      <div className="text-2xl mb-1">{BADGE_ICONS[badge.name] || badge.icon || '🏅'}</div>
                      <div className="text-xs text-white/70 font-medium leading-tight">{badge.name}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-white/40">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Complete practice sessions to earn badges!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-violet-500/30">
                👩‍🏫
              </div>
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-32 bg-white/10 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 bg-white/10 mx-auto" />
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{profile?.name || 'Learner'}</h3>
                  <p className="text-white/50 text-sm">{profile?.email || 'No email set'}</p>
                  <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-sm">
                    <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${level.color}`} />
                    {level.name}
                  </div>
                </>
              )}
            </div>

            {/* Streak */}
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                Daily Streak
              </h2>
              <div className="text-center">
                <div className="text-5xl font-bold text-orange-400 mb-1 animate-pulse-slow">
                  {streak}
                </div>
                <div className="text-white/60 text-sm">days in a row 🔥</div>
                <div className="mt-4 grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-6 rounded-sm ${i < Math.min(streak, 7) ? 'bg-orange-500' : 'bg-white/10'}`}
                    />
                  ))}
                </div>
                <div className="text-white/40 text-xs mt-2">Last 7 days</div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Leaderboard
              </h2>
              <div className="space-y-3">
                {leaderboard?.slice(0, 5).map((entry, i) => (
                  <div key={entry.userId.toString()} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : i === 2 ? 'bg-amber-600 text-white' : 'bg-white/10 text-white/60'}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{entry.name}</div>
                      <div className="text-xs text-white/50">{Number(entry.xp).toLocaleString()} XP</div>
                    </div>
                    <div className="text-xs text-orange-400">{Number(entry.streak)}🔥</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

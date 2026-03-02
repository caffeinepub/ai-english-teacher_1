import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { UserProfileView } from '../backend';
import { UserRole } from '../backend';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity, isInitializing } = useInternetIdentity();
  const { actor } = useActor();
  const { data: profile, isFetched, isLoading: profileLoading } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [showSetup, setShowSetup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [setupLoading, setSetupLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // Show profile setup modal only when: authenticated, not loading, fetched, and no profile
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && profile === null;

  useEffect(() => {
    if (showProfileSetup) {
      setShowSetup(true);
    } else if (isAuthenticated && isFetched && profile !== null && profile !== undefined) {
      navigate({ to: '/dashboard' });
    }
  }, [isAuthenticated, isFetched, profile, showProfileSetup, navigate]);

  const handleGoogleLogin = async () => {
    setLoginError(null);
    try {
      await login();
    } catch (error: unknown) {
      const err = error as Error;
      if (err?.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      } else {
        const msg = 'Sign in failed. Please try again.';
        setLoginError(msg);
        toast.error(msg);
      }
    }
  };

  const handleSetup = async () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    setSetupLoading(true);
    try {
      const now = BigInt(Date.now()) * BigInt(1_000_000);
      const newProfile: UserProfileView = {
        name: name.trim(),
        email: email.trim(),
        role: UserRole.user,
        xp: BigInt(0),
        streak: BigInt(0),
        lastActive: now,
        badges: [],
        createdAt: now,
      };
      await saveProfile.mutateAsync(newProfile);
      toast.success('Profile created! Welcome to AI English Teacher!');
      navigate({ to: '/dashboard' });
    } catch {
      toast.error('Failed to create profile. Please try again.');
    } finally {
      setSetupLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-deep-purple flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-purple flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-violet-primary/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-pink-accent/15 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3 select-none">👩‍🏫</div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            AI English Teacher
          </h1>
          <p className="text-white/60 mt-2 text-sm sm:text-base">Your personal AI language coach</p>
        </div>

        {!showSetup ? (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-xl font-semibold mb-1 text-center">Welcome Back</h2>
            <p className="text-white/60 text-sm text-center mb-8">
              Sign in to continue your learning journey
            </p>

            {/* Error message */}
            {loginError && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-5 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Sign in with Google button (powered by Internet Identity) */}
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full min-h-[52px] bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-xl font-semibold text-sm sm:text-base h-auto transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoggingIn ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                  <span className="text-gray-600">Signing in...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  {/* Google "G" logo */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </span>
              )}
            </Button>

            {/* Security note */}
            <div className="flex items-center justify-center gap-2 mt-5 text-white/40 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Secured with Internet Identity — no passwords stored</span>
            </div>

            {/* Feature highlights */}
            <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-3 gap-3 text-center">
              {[
                { icon: '🔒', label: 'Secure Login' },
                { icon: '⚡', label: 'Instant Access' },
                { icon: '🌍', label: 'Any Device' },
              ].map((f) => (
                <div key={f.label} className="flex flex-col items-center gap-1">
                  <span className="text-xl">{f.icon}</span>
                  <span className="text-white/50 text-xs">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Profile Setup Modal */
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg shadow-violet-500/30">
                👤
              </div>
              <h2 className="text-xl font-semibold mb-1">Set Up Your Profile</h2>
              <p className="text-white/60 text-sm">
                Tell us a bit about yourself to get started
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-white/80 mb-2 block text-sm">
                  Your Name <span className="text-pink-400">*</span>
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl h-12 focus:border-violet-500/60 focus:ring-violet-500/20"
                  onKeyDown={(e) => e.key === 'Enter' && handleSetup()}
                />
              </div>
              <div>
                <Label className="text-white/80 mb-2 block text-sm">
                  Email <span className="text-white/40">(optional)</span>
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl h-12 focus:border-violet-500/60 focus:ring-violet-500/20"
                  onKeyDown={(e) => e.key === 'Enter' && handleSetup()}
                />
              </div>
              <Button
                onClick={handleSetup}
                disabled={setupLoading || !name.trim()}
                className="w-full min-h-[52px] bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white rounded-xl font-semibold text-sm sm:text-base h-auto mt-2 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:scale-100 shadow-lg shadow-violet-500/25"
              >
                {setupLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating profile...
                  </span>
                ) : (
                  'Start Learning! 🚀'
                )}
              </Button>
            </div>

            <p className="text-center text-white/30 text-xs mt-5">
              Your data is stored securely on the Internet Computer blockchain
            </p>
          </div>
        )}

        {/* Footer attribution */}
        <p className="text-center text-white/25 text-xs mt-6">
          Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/50 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}

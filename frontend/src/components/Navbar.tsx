import { useNavigate, useRouter } from '@tanstack/react-router';
import { BookOpen, Phone, LayoutDashboard, Shield, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';

export default function Navbar() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isAdmin = profile?.role === 'admin';

  const navLinks = isAuthenticated
    ? [
        { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: 'AI Call', path: '/call', icon: <Phone className="w-4 h-4" /> },
        { label: 'Practice', path: '/practice', icon: <BookOpen className="w-4 h-4" /> },
        ...(isAdmin ? [{ label: 'Admin', path: '/admin', icon: <Shield className="w-4 h-4" /> }] : []),
      ]
    : [];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl">👩‍🏫</span>
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent hidden sm:block">
            AI English Teacher
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Button
              key={link.path}
              variant="ghost"
              onClick={() => navigate({ to: link.path })}
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl gap-2"
            >
              {link.icon}
              {link.label}
            </Button>
          ))}
          {!isAuthenticated && (
            <Button
              onClick={() => navigate({ to: '/login' })}
              className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white rounded-xl ml-2"
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="md:hidden text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-deep-purple/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Button
                key={link.path}
                variant="ghost"
                onClick={() => { navigate({ to: link.path }); setMobileOpen(false); }}
                className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10 rounded-xl gap-2"
              >
                {link.icon}
                {link.label}
              </Button>
            ))}
            {!isAuthenticated && (
              <Button
                onClick={() => { navigate({ to: '/login' }); setMobileOpen(false); }}
                className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-xl mt-2"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

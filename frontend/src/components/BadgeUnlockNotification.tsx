import { useEffect, useState } from 'react';
import { X, Trophy } from 'lucide-react';

interface BadgeUnlockNotificationProps {
  badge: {
    name: string;
    icon: string;
    description: string;
  };
  onDismiss: () => void;
}

// Simple CSS confetti
function Confetti() {
  const pieces = Array.from({ length: 30 });
  const colors = ['#7c3aed', '#ec4899', '#06b6d4', '#f59e0b', '#10b981'];

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-sm animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default function BadgeUnlockNotification({ badge, onDismiss }: BadgeUnlockNotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!visible) return null;

  return (
    <>
      <Confetti />
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
        <div className="glass-card rounded-2xl p-5 border border-yellow-500/40 shadow-2xl shadow-yellow-500/20 flex items-center gap-4 min-w-72 max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
            {badge.icon || '🏅'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">Badge Unlocked!</span>
            </div>
            <div className="font-bold text-white">{badge.name}</div>
            <div className="text-white/60 text-xs">{badge.description}</div>
          </div>
          <button
            onClick={() => { setVisible(false); onDismiss(); }}
            className="text-white/40 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}

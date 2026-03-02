import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

interface XPCounterProps {
  amount: number;
}

export default function XPCounter({ amount }: XPCounterProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-24 right-6 z-50 pointer-events-none">
      <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg shadow-yellow-500/30 animate-xp-pop">
        <Trophy className="w-5 h-5" />
        +{amount} XP
      </div>
    </div>
  );
}

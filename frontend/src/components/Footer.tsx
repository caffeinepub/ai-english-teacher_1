export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'ai-english-teacher');

  return (
    <footer className="border-t border-white/10 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <span className="text-2xl">👩‍🏫</span>
            <span>AI English Teacher</span>
            <span>·</span>
            <span>© {year}</span>
          </div>
          <div className="text-white/40 text-sm">
            Built with{' '}
            <span className="text-pink-400">♥</span>
            {' '}using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

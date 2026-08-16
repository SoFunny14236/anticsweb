import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { EditableText } from '@/components/EditableText';
import { EDIT_MODE_PASSWORD, UNLOCK_CLICKS, UNLOCK_CLICK_TIMEOUT_MS, UNLOCK_MAX_ATTEMPTS, useEditMode } from '@/hooks/useEditMode';

const UNLOCK_STORAGE_KEY = 'antics-edit-unlocked';

function Nav() {
  const { editMode, setEditMode } = useEditMode();
  const [scrolled, setScrolled] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [authMessage, setAuthMessage] = useState<'granted' | 'denied' | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (localStorage.getItem(UNLOCK_STORAGE_KEY) === 'true') setEditMode(true);
  }, [setEditMode]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDotClick = () => {
    if (editMode || showPassword) return;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    setClickCount((prev) => {
      const next = prev + 1;
      if (next >= UNLOCK_CLICKS) { setShowPassword(true); setFailedAttempts(0); return 0; }
      return next;
    });
    clickTimerRef.current = setTimeout(() => setClickCount(0), UNLOCK_CLICK_TIMEOUT_MS);
  };

  const flashMessage = (msg: 'granted' | 'denied', duration: number, cb?: () => void) => {
    setAuthMessage(msg);
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    messageTimerRef.current = setTimeout(() => { setAuthMessage(null); cb?.(); }, duration);
  };

  const handlePasswordSubmit = () => {
    if (passwordValue === EDIT_MODE_PASSWORD) {
      flashMessage('granted', 1200, () => {
        setEditMode(true);
        localStorage.setItem(UNLOCK_STORAGE_KEY, 'true');
        setShowPassword(false); setPasswordValue(''); setFailedAttempts(0);
      });
    } else {
      flashMessage('denied', 1000);
      setPasswordValue('');
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      if (nextAttempts >= UNLOCK_MAX_ATTEMPTS) setTimeout(() => { setShowPassword(false); setFailedAttempts(0); }, 1200);
    }
  };

  const handlePasswordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handlePasswordSubmit(); }
  };

  const navLinks = [
    { contentId: 'nav_videos', href: '#videos' },
    { contentId: 'nav_about', href: '#about' },
    { contentId: 'nav_subscribe', href: '#subscribe' },
  ];

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled ? 'nav-solid py-3' : 'py-5'}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a href="#" className={`font-heading text-sm font-bold uppercase tracking-[0.3em] transition-colors ${scrolled ? 'text-accent-500' : 'text-transparent'}`}>ANTICS</a>

        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="font-heading text-xs uppercase tracking-[0.3em] text-neutral-500 transition-colors hover:text-accent-400">
              <EditableText contentId={link.contentId} as="span" />
            </a>
          ))}

          <div className="relative flex items-center">
            <span onClick={handleDotClick} className="live-dot hidden h-2 w-2 cursor-default rounded-full bg-accent-600 sm:block" />

            {showPassword && (
              <div className="absolute right-0 top-7 z-50 flex items-center gap-1 border border-accent-600/50 bg-ink-900/95 px-2 py-1.5 backdrop-blur-sm">
                {authMessage ? (
                  <span className={`font-heading text-xs uppercase tracking-[0.3em] ${authMessage === 'granted' ? 'text-accent-400 glitch-granted' : 'text-accent-600 glitch-denied'}`}>
                    {authMessage === 'granted' ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
                  </span>
                ) : (
                  <>
                    <input type="password" value={passwordValue} onChange={(e) => setPasswordValue(e.target.value)} onKeyDown={handlePasswordKeyDown} placeholder="ENTER ACCESS CODE" autoFocus
                      className="w-44 border-none bg-transparent font-heading text-xs uppercase tracking-[0.2em] text-accent-300 placeholder-accent-700/60 outline-none" />
                    <button onClick={handlePasswordSubmit} className="text-accent-500 transition-colors hover:text-accent-300"><ArrowRight className="h-3.5 w-3.5" /></button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;

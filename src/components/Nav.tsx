import { useEffect, useState } from 'react';

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.85);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled ? 'nav-solid py-3' : 'py-5'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a
          href="#"
          className={`font-heading text-sm font-bold uppercase tracking-[0.3em] transition-colors ${
            scrolled ? 'text-blood-500' : 'text-transparent'
          }`}
        >
          ANTICS
        </a>

        <div className="flex items-center gap-6">
          {[
            { label: 'Videos', href: '#videos' },
            { label: 'About', href: '#about' },
            { label: 'Subscribe', href: '#subscribe' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-heading text-xs uppercase tracking-[0.3em] text-neutral-500 transition-colors hover:text-blood-400"
            >
              {link.label}
            </a>
          ))}
          <span className="live-dot hidden h-2 w-2 rounded-full bg-blood-600 sm:block" />
        </div>
      </div>
    </nav>
  );
}

export default Nav;

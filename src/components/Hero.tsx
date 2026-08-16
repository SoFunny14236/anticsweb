import { useEffect, useRef } from 'react';

function Hero() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = glowRef.current?.parentElement;
    if (!section) return;

    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
      }
    };

    section.addEventListener('mousemove', handleMove);
    return () => section.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        ref={glowRef}
        className="pointer-events-none absolute h-[400px] w-[400px] rounded-full bg-blood-600/8 blur-[80px] transition-transform duration-300 ease-out"
        style={{ left: 0, top: 0 }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blood-700/25 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative">
        <span className="mb-8 inline-block font-heading text-xs uppercase tracking-[0.4em] text-blood-500 text-glow-soft">
          [ CASE FILE OPEN ]
        </span>

        <h1 className="antics-title font-heading text-6xl font-bold uppercase tracking-tight sm:text-8xl md:text-9xl">
          ANTICS
        </h1>

        <div className="mx-auto mt-10 h-px w-32 bg-gradient-to-r from-transparent via-blood-500 to-transparent shadow-glow" />
      </div>

      <a
        href="#videos"
        className="absolute bottom-10 font-heading text-xs uppercase tracking-[0.3em] text-neutral-500 transition-colors hover:text-blood-400"
      >
        Scroll ↓
      </a>
    </section>
  );
}

export default Hero;

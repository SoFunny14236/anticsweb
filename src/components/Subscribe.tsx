import { Youtube, ArrowUpRight } from 'lucide-react';

function Subscribe() {
  return (
    <section
      id="subscribe"
      className="relative border-t border-blood-700/20 px-6 py-32"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blood-700/15 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <span className="font-heading text-xs uppercase tracking-[0.4em] text-blood-500">
          [ AWAITING AUTHORIZATION ]
        </span>

        <h2 className="mt-4 font-heading text-5xl font-bold uppercase tracking-tight text-neutral-100 sm:text-6xl">
          Subscribe
        </h2>

        <p className="mx-auto mt-6 max-w-md font-body text-base leading-relaxed text-neutral-400">
          New files are added when they're added. The only way to know is to be
          on the list.
        </p>

        <a
          href="https://www.youtube.com/@AnticsFeed"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-10 inline-flex items-center gap-3 border border-blood-600 bg-blood-900/20 px-8 py-4 font-heading text-sm font-semibold uppercase tracking-[0.3em] text-blood-400 transition-all duration-300 hover:bg-blood-900/40 hover:text-blood-300 hover:shadow-glow-lg"
        >
          <Youtube className="h-5 w-5" />
          <span>Subscribe on YouTube</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </section>
  );
}

export default Subscribe;

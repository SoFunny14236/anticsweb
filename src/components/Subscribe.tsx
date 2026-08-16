import { Youtube, ArrowUpRight } from 'lucide-react';
import { EditableText } from '@/components/EditableText';

function Subscribe() {
  return (
    <section id="subscribe" className="relative border-t border-accent-700/20 px-6 py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-700/15 blur-[100px]" aria-hidden="true" />

      <div className="relative mx-auto max-w-2xl text-center">
        <EditableText contentId="subscribe_tagline" as="span" className="font-heading text-xs uppercase tracking-[0.4em] text-accent-500" />
        <EditableText contentId="subscribe_heading" as="h2" className="mt-4 block font-heading text-5xl font-bold uppercase tracking-tight text-neutral-100 sm:text-6xl" />
        <EditableText contentId="subscribe_para" as="p" className="mx-auto mt-6 block max-w-md font-body text-base leading-relaxed text-neutral-400" />

        <a href="https://www.youtube.com/@AnticsFeed" target="_blank" rel="noopener noreferrer"
          className="group mt-10 inline-flex items-center gap-3 border border-accent-600 bg-accent-900/20 px-8 py-4 font-heading text-sm font-semibold uppercase tracking-[0.3em] text-accent-400 transition-all duration-300 hover:bg-accent-900/40 hover:text-accent-300 hover:shadow-glow-lg">
          <Youtube className="h-5 w-5" />
          <EditableText contentId="subscribe_button" as="span" />
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </section>
  );
}

export default Subscribe;

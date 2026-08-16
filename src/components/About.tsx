import { EditableText } from '@/components/EditableText';

function About() {
  return (
    <section id="about" className="relative border-t border-accent-700/20 px-6 py-28">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <EditableText contentId="about_file" as="span" className="font-heading text-xs uppercase tracking-[0.4em] text-accent-500" />
          <EditableText contentId="about_heading" as="h2" className="mt-2 block font-heading text-4xl font-bold uppercase tracking-tight text-neutral-100 sm:text-5xl" />
          <div className="mt-4 h-px w-full bg-gradient-to-r from-accent-700/40 via-accent-700/15 to-transparent" />
        </div>

        <div className="space-y-4 font-body text-base leading-relaxed text-neutral-400">
          <EditableText contentId="about_para1" as="p" className="block" />
        </div>

        <div className="mt-10 flex items-center gap-4 font-heading text-xs uppercase tracking-[0.3em] text-neutral-700">
          <span className="h-px w-8 bg-accent-700/40" />
          <EditableText contentId="about_status" as="span" />
          <span className="h-px w-8 bg-accent-700/40" />
        </div>
      </div>
    </section>
  );
}

export default About;

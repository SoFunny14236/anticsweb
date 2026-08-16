function About() {
  return (
    <section id="about" className="relative border-t border-blood-700/20 px-6 py-28">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <span className="font-heading text-xs uppercase tracking-[0.4em] text-blood-500">
            File #0001
          </span>
          <h2 className="mt-2 font-heading text-4xl font-bold uppercase tracking-tight text-neutral-100 sm:text-5xl">
            About
          </h2>
          <div className="mt-4 h-px w-full bg-gradient-to-r from-blood-700/40 via-blood-700/15 to-transparent" />
        </div>

        <div className="space-y-4 font-body text-base leading-relaxed text-neutral-400">
          <p>
            Antics documents things that happened, more or less, in the order they
            occurred. Every episode is filed, timestamped and presented with
            commentary.
          </p>
          <p>
          </p>
        </div>

        <div className="mt-10 flex items-center gap-4 font-heading text-xs uppercase tracking-[0.3em] text-neutral-700">
          <span className="h-px w-8 bg-blood-700/40" />
          <span>Status: Ongoing</span>
          <span className="h-px w-8 bg-blood-700/40" />
        </div>
      </div>
    </section>
  );
}

export default About;

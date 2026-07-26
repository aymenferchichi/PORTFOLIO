import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchJourneyEntry } from "../data/journeyData";
import {
  Eyebrow,
  Reveal,
  SectionHeading,
  Surface,
  primaryButtonClassName,
  secondaryButtonClassName,
} from "../components/SitePrimitives";

function JourneyDetailPage() {
  const { slug } = useParams();
  const [entry, setEntry] = useState(null);
  const [isMissing, setIsMissing] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadJourneyEntry = async () => {
      const nextEntry = await fetchJourneyEntry(slug);

      if (!isActive) {
        return;
      }

      setEntry(nextEntry);
      setIsMissing(!nextEntry);
    };

    loadJourneyEntry();

    return () => {
      isActive = false;
    };
  }, [slug]);

  if (!entry && isMissing) {
    return (
      <section className="space-y-8 pt-6">
        <SectionHeading
          eyebrow="Journey"
          title="That detail page does not exist."
          description="The selected milestone could not be found in the backend journey data."
        />

        <Link className={secondaryButtonClassName} to="/">
          Return to the interactive road
        </Link>
      </section>
    );
  }

  if (!entry) {
    return (
      <section className="space-y-8 pt-6">
        <SectionHeading
          eyebrow="Journey"
          title="Loading the full milestone story."
          description="Pulling the selected journey from the backend and building the full detail view."
        />

        <Surface className="h-72 animate-pulse bg-white/[0.03]" />
      </section>
    );
  }

  const chapterLabel =
    entry.subcategory === "projects" ? "Project" : "Experience";

  return (
    <section className="space-y-10 pt-6 lg:space-y-14">
      <SectionHeading
        eyebrow={entry.eyebrow}
        title={entry.title}
        description={entry.summary}
        aside={
          <Link className={secondaryButtonClassName} to="/">
            Back to the interactive road
          </Link>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.12fr)_minmax(280px,0.88fr)]">
        <Reveal delay={0.05}>
          <Surface className="overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(241,211,160,0.15),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))]">
            <div className="space-y-4">
              <p className="m-0 text-[0.78rem] uppercase tracking-[0.18em] text-sand-100/48">
                {chapterLabel} overview
              </p>
              <span className="inline-flex min-h-9 items-center rounded-full border border-white/10 bg-ink-900/42 px-3 text-xs uppercase tracking-[0.18em] text-sand-100/72">
                {chapterLabel}{" "}
                {typeof entry.display_order === "number"
                  ? String(entry.display_order).padStart(2, "0")
                  : "Next"}
              </span>
              <h2 className="max-w-[10ch] font-display text-[clamp(2.8rem,5.2vw,4.8rem)] leading-[0.94] tracking-[-0.04em] text-sand-50">
                {entry.title}
              </h2>
              <p className="max-w-[34ch] text-base leading-8 text-sand-100/72">
                {entry.summary}
              </p>
            </div>
          </Surface>
        </Reveal>

        <Reveal
          delay={0.1}
          className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1"
        >
          <Surface className="bg-ink-900/44 p-5 sm:p-6">
            <span className="block text-[0.72rem] uppercase tracking-[0.18em] text-sand-100/46">
              Type
            </span>
            <strong className="mt-3 block text-3xl text-sand-50">
              {chapterLabel}
            </strong>
          </Surface>
          <Surface className="bg-ink-900/44 p-5 sm:p-6">
            <span className="block text-[0.72rem] uppercase tracking-[0.18em] text-sand-100/46">
              Year
            </span>
            <strong className="mt-3 block text-3xl text-sand-50">
              {entry.year}
            </strong>
          </Surface>
          <Surface className="bg-ink-900/44 p-5 sm:p-6">
            <span className="block text-[0.72rem] uppercase tracking-[0.18em] text-sand-100/46">
              Accent
            </span>
            <div className="mt-3 flex items-center gap-3">
              <span
                className="h-4 w-4 rounded-full shadow-[0_0_0_6px_rgba(244,236,224,0.06)]"
                aria-hidden="true"
                style={{ backgroundColor: entry.accent }}
              />
              <strong className="text-base text-sand-50">{entry.accent}</strong>
            </div>
          </Surface>
        </Reveal>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
        <Reveal delay={0.14}>
          <Surface>
            <Eyebrow>Milestone</Eyebrow>
            <h3 className="mt-4 font-display text-[clamp(2.2rem,4.2vw,3.8rem)] leading-[0.96] tracking-[-0.04em] text-sand-50">
              {entry.year}
            </h3>
            <p className="mt-5 max-w-[44ch] text-base leading-8 text-sand-100/70">
              {entry.detail}
            </p>
          </Surface>
        </Reveal>

        <Reveal delay={0.18}>
          <Surface>
            <Eyebrow>Why it mattered</Eyebrow>
            <ul className="mt-5 space-y-3 pl-5 text-base leading-8 text-sand-100/70">
              {entry.focus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Surface>
        </Reveal>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Reveal delay={0.2}>
          <Surface className="h-full">
            <Eyebrow>Narrative</Eyebrow>
            <h3 className="mt-4 font-display text-3xl leading-tight tracking-[-0.03em] text-sand-50">
              What happened in this stage
            </h3>
            <p className="mt-4 text-base leading-8 text-sand-100/70">
              {entry.detail}
            </p>
          </Surface>
        </Reveal>

        <Reveal delay={0.24}>
          <Surface className="h-full">
            <Eyebrow>Why it counts</Eyebrow>
            <h3 className="mt-4 font-display text-3xl leading-tight tracking-[-0.03em] text-sand-50">
              How it shaped the direction
            </h3>
            <p className="mt-4 text-base leading-8 text-sand-100/70">
              {entry.summary}
            </p>
          </Surface>
        </Reveal>

        <Reveal delay={0.28}>
          <Surface className="h-full">
            <Eyebrow>Reference</Eyebrow>
            <h3 className="mt-4 font-display text-3xl leading-tight tracking-[-0.03em] text-sand-50">
              Milestone identity
            </h3>
            <div className="mt-5 flex items-center gap-4 rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
              <span
                className="h-[18px] w-[18px] rounded-full shadow-[0_0_0_6px_rgba(244,236,224,0.06)]"
                aria-hidden="true"
                style={{ backgroundColor: entry.accent }}
              />
              <div>
                <strong className="block text-base text-sand-50">
                  {entry.slug}
                </strong>
                <p className="m-0 text-sm text-sand-100/60">{entry.eyebrow}</p>
              </div>
            </div>
            <p className="mt-5 text-base leading-8 text-sand-100/70">
              This stage ties the broader direction to one recognizable signal
              in the timeline: tone, timing, and the kind of work it unlocked
              next.
            </p>
          </Surface>
        </Reveal>
      </div>

      <Reveal delay={0.32}>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link className={primaryButtonClassName} to="/portfolio">
            Explore the portfolio
          </Link>
          <Link className={secondaryButtonClassName} to="/contact">
            Book a project conversation
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

export default JourneyDetailPage;

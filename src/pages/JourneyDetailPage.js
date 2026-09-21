import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchJourneyEntry } from "../data/journeyData";
import {
  Eyebrow,
  Pill,
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

        <Surface className="h-72 animate-pulse bg-white/70" />
      </section>
    );
  }

  const chapterLabel =
    entry.subcategory === "projects" ? "Project" : "Experience";
  const chapterMetrics = [
    {
      label: "Deliverables",
      value: String(entry.deliverables.length || entry.focus.length).padStart(
        2,
        "0",
      ),
    },
    {
      label: "Focus areas",
      value: String(entry.focus.length).padStart(2, "0"),
    },
    {
      label: "Year",
      value: String(entry.year),
    },
  ];

  return (
    <section className="space-y-10 pt-6 lg:space-y-14">
      <SectionHeading
        eyebrow={entry.eyebrow}
        title={entry.title}
        description={entry.summary}
        aside={
          <div className="flex flex-wrap justify-start gap-3 lg:justify-end">
            <Link className={secondaryButtonClassName} to="/">
              Back to the interactive road
            </Link>
            <Link className={primaryButtonClassName} to="/contact">
              Ask about a similar project
            </Link>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.12fr)_minmax(280px,0.88fr)]">
        <Reveal delay={0.05}>
          <Surface className="overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,255,255,0.74))]">
            <div className="space-y-4">
              <p className="m-0 text-[0.78rem] uppercase tracking-[0.18em] text-sand-100/60">
                Case study overview
              </p>
              <span className="inline-flex min-h-9 items-center rounded-full border border-sand-200/24 bg-brand-300/14 px-3 text-xs uppercase tracking-[0.18em] text-sand-100">
                {entry.client_label || chapterLabel}
              </span>
              <h2 className="max-w-[10ch] font-display text-[clamp(2.9rem,5.2vw,5rem)] leading-[0.9] tracking-[-0.05em] text-sand-50">
                {entry.title}
              </h2>
              <p className="max-w-[38ch] text-base leading-8 text-sand-100">
                {entry.summary}
              </p>
              <div className="grid grid-cols-3 gap-2 pt-2">
                {chapterMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[18px] border border-sand-200/24 bg-white/80 px-3 py-3"
                  >
                    <span className="block text-[0.65rem] uppercase tracking-[0.16em] text-sand-100/60">
                      {metric.label}
                    </span>
                    <strong className="mt-1.5 block text-sm leading-5 text-sand-50">
                      {metric.value}
                    </strong>
                  </div>
                ))}
              </div>
              {entry.focus.length > 0 ? (
                <div className="flex flex-wrap gap-3 pt-2">
                  {entry.focus.map((item) => (
                    <Pill key={item}>{item}</Pill>
                  ))}
                </div>
              ) : null}
            </div>
          </Surface>
        </Reveal>

        <Reveal
          delay={0.1}
          className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1"
        >
          <Surface className="bg-white/82 p-5 sm:p-6">
            <span className="block text-[0.72rem] uppercase tracking-[0.18em] text-sand-100/60">
              Project type
            </span>
            <strong className="mt-3 block text-3xl text-sand-50">
              {chapterLabel}
            </strong>
          </Surface>
          <Surface className="bg-white/82 p-5 sm:p-6">
            <span className="block text-[0.72rem] uppercase tracking-[0.18em] text-sand-100/60">
              Scope
            </span>
            <strong className="mt-3 block text-3xl text-sand-50">
              {entry.project_scope || String(entry.year)}
            </strong>
          </Surface>
          <Surface className="bg-white/82 p-5 sm:p-6">
            <span className="block text-[0.72rem] uppercase tracking-[0.18em] text-sand-100/60">
              Outcome highlight
            </span>
            <strong className="mt-3 block text-xl leading-8 text-sand-50">
              {entry.outcome_highlight || entry.summary}
            </strong>
          </Surface>
        </Reveal>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
        <Reveal delay={0.14}>
          <Surface>
            <Eyebrow>Milestone</Eyebrow>
            <h3 className="mt-4 font-display text-[clamp(2.2rem,4.2vw,3.8rem)] leading-[0.94] tracking-[-0.05em] text-sand-50">
              {entry.year}
            </h3>
            <p className="mt-5 max-w-[44ch] text-base leading-8 text-sand-100">
              {entry.detail}
            </p>
          </Surface>
        </Reveal>

        <Reveal delay={0.18}>
          <Surface>
            <Eyebrow>Deliverables and focus</Eyebrow>
            {entry.deliverables.length > 0 || entry.focus.length > 0 ? (
              <ul className="mt-5 space-y-3 pl-5 text-base leading-8 text-sand-100">
                {[...entry.deliverables, ...entry.focus].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-base leading-8 text-sand-100">
                This milestone matters because it sharpened delivery judgment,
                improved presentation quality, and clarified what kind of work
                should come next.
              </p>
            )}
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
            <p className="mt-4 text-base leading-8 text-sand-100">
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
            <p className="mt-4 text-base leading-8 text-sand-100">
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
            <div className="mt-5 flex items-center gap-4 rounded-[22px] border border-sand-200/24 bg-white/80 p-4">
              <span
                className="h-[18px] w-[18px] rounded-full shadow-[0_0_0_6px_rgba(244,236,224,0.06)]"
                aria-hidden="true"
                style={{ backgroundColor: entry.accent }}
              />
              <div>
                <strong className="block text-base text-sand-50">
                  {entry.slug}
                </strong>
                <p className="m-0 text-sm text-sand-100">{entry.eyebrow}</p>
              </div>
            </div>
            <p className="mt-5 text-base leading-8 text-sand-100">
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
            Start a project conversation
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

export default JourneyDetailPage;

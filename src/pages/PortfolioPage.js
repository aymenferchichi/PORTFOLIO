import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eyebrow,
  Pill,
  Reveal,
  SectionHeading,
  Surface,
  primaryButtonClassName,
} from "../components/SitePrimitives";
import { fetchJourneyEntries } from "../data/journeyData";

const capabilities = [
  "Creative direction",
  "Visual systems",
  "Responsive development",
  "Motion editing",
];

const engagementModes = [
  {
    title: "Premium portfolio builds",
    text: "For founders and creatives who need a site that positions them more clearly and more confidently.",
  },
  {
    title: "Product interface refreshes",
    text: "For teams that need navigation, hierarchy, and system design to feel more intentional.",
  },
  {
    title: "Campaign visual systems",
    text: "For launches that need web, social, and motion assets to feel like one authored release.",
  },
];

function formatJourneyOutcome(entry) {
  if (entry.focus.length > 0) {
    return entry.focus[0];
  }

  return entry.summary;
}

function PortfolioPage() {
  const [journeys, setJourneys] = useState([]);

  useEffect(() => {
    let isActive = true;

    const loadJourneys = async () => {
      const nextJourneys = await fetchJourneyEntries();

      if (isActive) {
        setJourneys(nextJourneys);
      }
    };

    loadJourneys();

    return () => {
      isActive = false;
    };
  }, []);

  const featuredProjects = useMemo(
    () =>
      journeys.slice(0, 3).map((entry) => ({
        slug: entry.slug,
        name: entry.title,
        discipline: entry.eyebrow,
        outcome: formatJourneyOutcome(entry),
        detail: entry.detail,
        accent: entry.accent,
        year: entry.year,
      })),
    [journeys],
  );

  return (
    <section className="space-y-10 pt-6 lg:space-y-14">
      <SectionHeading
        eyebrow="Portfolio"
        title="Selected work across products, premium websites, brand systems, and motion."
        description="Each case-study block is now driven by the same journey data powering the interactive road, so the portfolio story stays consistent across the site instead of drifting into placeholder copy."
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
        <Reveal delay={0.05}>
          <Surface className="space-y-6 overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(241,211,160,0.14),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))]">
            <div className="space-y-4">
              <Eyebrow>Positioning</Eyebrow>
              <h2 className="max-w-[15ch] font-display text-[clamp(2.4rem,4.8vw,4.6rem)] leading-[0.96] tracking-[-0.04em] text-sand-50">
                Work that stays visually disciplined even when the medium
                changes.
              </h2>
              <p className="max-w-[40ch] text-base leading-8 text-sand-100/72">
                Each project block now points back to a real journey milestone,
                showing how product thinking, interface craft, and visual
                direction evolved into the current premium portfolio approach.
              </p>
            </div>

            <Link className={primaryButtonClassName} to="/contact">
              Request a tailored proposal
            </Link>
          </Surface>
        </Reveal>

        <Reveal delay={0.1}>
          <Surface className="space-y-5">
            <Eyebrow>Capabilities</Eyebrow>
            <div className="flex flex-wrap gap-3">
              {capabilities.map((capability) => (
                <Pill key={capability}>{capability}</Pill>
              ))}
            </div>
            <p className="text-base leading-8 text-sand-100/68">
              The same system can cover landing pages, portfolio positioning,
              product marketing surfaces, and lightweight motion storytelling.
            </p>
          </Surface>
        </Reveal>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {featuredProjects.map((project, index) => (
          <Reveal key={project.name} delay={0.06 + index * 0.05}>
            <Surface className="relative h-full overflow-hidden">
              <div
                className="pointer-events-none absolute right-[-2rem] top-[-1rem] h-36 w-36 rounded-full blur-3xl"
                style={{ backgroundColor: `${project.accent}24` }}
              />
              <Eyebrow>{project.discipline}</Eyebrow>
              <h3 className="mt-4 font-display text-3xl leading-tight tracking-[-0.03em] text-sand-50">
                {project.name}
              </h3>
              <span className="mt-3 inline-flex min-h-8 items-center rounded-full border border-white/10 px-3 text-xs uppercase tracking-[0.16em] text-sand-100/56">
                {project.year}
              </span>
              <strong className="mt-4 block text-base font-semibold leading-7 text-sand-50">
                {project.outcome}
              </strong>
              <p className="mt-4 text-base leading-8 text-sand-100/70">
                {project.detail}
              </p>
              <Link
                className="mt-6 inline-flex text-sm uppercase tracking-[0.16em] text-brand-100 transition hover:text-sand-50"
                to={`/journey/${project.slug}`}
              >
                Read the full chapter
              </Link>
            </Surface>
          </Reveal>
        ))}
      </div>

      {journeys.length > 3 ? (
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {journeys.slice(3).map((entry, index) => (
            <Reveal key={entry.slug} delay={0.16 + index * 0.04}>
              <Surface className="h-full bg-ink-900/44">
                <div className="flex items-center justify-between gap-3">
                  <Eyebrow>{entry.eyebrow}</Eyebrow>
                  <span className="text-xs uppercase tracking-[0.16em] text-sand-100/42">
                    {entry.year}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-[1.95rem] leading-tight tracking-[-0.03em] text-sand-50">
                  {entry.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-sand-100/70">
                  {entry.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {entry.focus.slice(0, 2).map((item) => (
                    <Pill
                      key={item}
                      className="min-h-8 px-3 text-xs text-sand-100/68"
                    >
                      {item}
                    </Pill>
                  ))}
                </div>
                <Link
                  className="mt-6 inline-flex text-sm uppercase tracking-[0.16em] text-brand-100 transition hover:text-sand-50"
                  to={`/journey/${entry.slug}`}
                >
                  Open chapter
                </Link>
              </Surface>
            </Reveal>
          ))}
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-3">
        {engagementModes.map((mode, index) => (
          <Reveal key={mode.title} delay={0.18 + index * 0.05}>
            <Surface className="h-full bg-ink-900/52">
              <Eyebrow>Engagement {String(index + 1).padStart(2, "0")}</Eyebrow>
              <h3 className="mt-4 font-display text-[1.85rem] leading-tight tracking-[-0.03em] text-sand-50">
                {mode.title}
              </h3>
              <p className="mt-4 text-base leading-8 text-sand-100/70">
                {mode.text}
              </p>
            </Surface>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default PortfolioPage;

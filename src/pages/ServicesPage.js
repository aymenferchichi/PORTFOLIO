import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eyebrow,
  Pill,
  Reveal,
  SectionHeading,
  Surface,
  primaryButtonClassName,
  secondaryButtonClassName,
} from "../components/SitePrimitives";
import { fetchJourneyEntries } from "../data/journeyData";

const audienceSegments = [
  "Freelancers and founders improving first impressions",
  "Businesses refreshing a dated website or landing page",
  "Clients who need design and front-end delivery in one place",
];

const serviceTiers = [
  {
    name: "Focused page refresh",
    price: "Starting at $1.5k",
    fit: "Best for one important page that needs a cleaner structure and stronger visual confidence.",
    timeline: "1 week",
    deliverables: [
      "Layout and hierarchy refresh",
      "One key page redesign",
      "Implementation guidance or direct front-end updates",
    ],
  },
  {
    name: "Website refinement",
    price: "Starting at $3.8k",
    fit: "Best for websites that need clearer structure across multiple pages and a more cohesive feel.",
    timeline: "2 to 3 weeks",
    deliverables: [
      "Multi-section landing page or website refresh",
      "Reusable UI direction for sections, proof, and calls to action",
      "Responsive production-ready front-end execution",
    ],
  },
  {
    name: "Full project partner",
    price: "Starting at $6.5k",
    fit: "Best for broader redesigns where the website, supporting visuals, and implementation need to feel aligned.",
    timeline: "4+ weeks",
    deliverables: [
      "End-to-end website direction and delivery",
      "Supporting visuals and presentation assets",
      "Ongoing iteration for clarity and finish",
    ],
  },
];

const proofBlocks = [
  {
    label: "Who this is for",
    value:
      "Clients who want their work presented with more polish, more clarity, and more confidence.",
  },
  {
    label: "What changes",
    value:
      "Page structure, case-study framing, service presentation, and the overall feeling of quality across the site.",
  },
  {
    label: "Why it works",
    value:
      "The experience becomes easier to understand, easier to trust, and more memorable after a short visit.",
  },
];

function buildProofHighlights(entries) {
  return entries.slice(0, 3).map((entry) => ({
    id: entry.slug,
    eyebrow: entry.eyebrow,
    title: entry.title,
    outcome: entry.outcome_highlight || entry.focus[0] || entry.summary,
  }));
}

function ServicesPage() {
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

  const proofHighlights = useMemo(
    () => buildProofHighlights(journeys),
    [journeys],
  );

  return (
    <section className="space-y-10 pt-6 lg:space-y-14">
      <SectionHeading
        eyebrow="Services"
        title="A freelance service stack built for polished websites, stronger case studies, and cleaner client presentation."
        description="The work is shaped for clients who need thoughtful design direction, calm visual quality, and front-end execution that matches the concept closely."
        aside={
          <div className="flex flex-wrap justify-start gap-3 lg:justify-end">
            {audienceSegments.map((segment) => (
              <Pill key={segment}>{segment}</Pill>
            ))}
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <Reveal delay={0.06}>
          <Surface className="grid gap-4 sm:grid-cols-3">
            {serviceTiers.map((tier) => (
              <div
                key={tier.name}
                className="rounded-[24px] border border-sand-200/24 bg-brand-300/10 p-5"
              >
                <Eyebrow>{tier.name}</Eyebrow>
                <h3 className="mt-4 font-display text-[1.65rem] leading-tight tracking-[-0.03em] text-sand-50">
                  {tier.price}
                </h3>
                <p className="mt-3 text-sm leading-7 text-sand-100">
                  {tier.fit}
                </p>
                <div className="mt-4 rounded-[20px] border border-sand-200/24 bg-white/70 px-4 py-3 text-sm text-sand-100">
                  Typical timeline: {tier.timeline}
                </div>
                <div className="mt-4 grid gap-2">
                  {tier.deliverables.map((deliverable) => (
                    <div
                      key={deliverable}
                      className="rounded-[18px] border border-sand-200/24 bg-white/76 px-3 py-2.5 text-sm leading-6 text-sand-100"
                    >
                      {deliverable}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Surface>
        </Reveal>

        <Reveal delay={0.1}>
          <Surface className="space-y-5">
            <Eyebrow>Why this offer works</Eyebrow>
            <h2 className="max-w-[14ch] font-display text-[clamp(2rem,4vw,3.2rem)] leading-[0.98] tracking-[-0.035em] text-sand-50">
              Cleaner presentation makes it easier for future clients to trust the work.
            </h2>
            <div className="grid gap-3">
              {proofBlocks.map((block) => (
                <div
                  key={block.label}
                  className="rounded-[22px] border border-sand-200/24 bg-brand-300/10 p-4"
                >
                  <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-brand-100/84">
                    {block.label}
                  </p>
                  <p className="mb-0 mt-2 text-sm leading-7 text-sand-100">
                    {block.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link className={primaryButtonClassName} to="/contact">
                Get pricing guidance
              </Link>
              <Link className={secondaryButtonClassName} to="/portfolio">
                Review recent work
              </Link>
            </div>
          </Surface>
        </Reveal>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <Reveal delay={0.14}>
          <Surface className="space-y-5">
            <Eyebrow>Proof</Eyebrow>
            <h2 className="max-w-[15ch] font-display text-[clamp(2rem,4vw,3.2rem)] leading-[0.98] tracking-[-0.035em] text-sand-50">
              Real chapters, sharper outcomes, and clearer reasons to trust the work.
            </h2>
            <p className="max-w-[44ch] text-[0.98rem] leading-7 text-sand-100">
              There are no placeholder logos or invented testimonials here. The proof is grounded in the actual journey data that powers the portfolio.
            </p>
            <div className="grid gap-3">
              {proofHighlights.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[22px] border border-sand-200/24 bg-white/78 p-4"
                >
                  <Eyebrow>{item.eyebrow}</Eyebrow>
                  <h3 className="mt-3 font-display text-[1.45rem] leading-tight tracking-[-0.03em] text-sand-50">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-brand-100/84">
                    Outcome signal
                  </p>
                  <p className="mb-0 mt-2 text-sm leading-7 text-sand-100">
                    {item.outcome}
                  </p>
                </div>
              ))}
            </div>
          </Surface>
        </Reveal>

        <Reveal delay={0.18}>
          <Surface className="space-y-5">
            <Eyebrow>Why clients move forward</Eyebrow>
            <div className="grid gap-3">
              {proofBlocks.map((block) => (
                <div
                  key={block.label}
                  className="rounded-[22px] border border-sand-200/24 bg-brand-300/10 p-4"
                >
                  <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-brand-100/84">
                    {block.label}
                  </p>
                  <p className="mb-0 mt-2 text-sm leading-7 text-sand-100">
                    {block.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link className={primaryButtonClassName} to="/portfolio">
                Review proof in case studies
              </Link>
              <Link className={secondaryButtonClassName} to="/contact">
                Start with your project details
              </Link>
            </div>
          </Surface>
        </Reveal>
      </div>
    </section>
  );
}

export default ServicesPage;
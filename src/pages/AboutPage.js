import { ArrowUpRight } from "lucide-react";
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

const strengths = [
  "Client-ready UI direction with stronger hierarchy, clearer pacing, and a more premium visual finish.",
  "Front-end implementation that protects typography, motion, and responsive behavior instead of flattening the design.",
  "Operational awareness shaped by delivery leadership, client escalation handling, and team coordination.",
  "Brand and motion work that supports positioning across websites, campaigns, and supporting assets.",
];

const process = [
  {
    title: "Discover",
    text: "Clarify the client goal, audience, and conversion pressure before any layout, motion, or visual direction is locked in.",
  },
  {
    title: "Design",
    text: "Shape a direction with stronger hierarchy, tighter pacing, and a web presence that feels authored rather than assembled.",
  },
  {
    title: "Deliver",
    text: "Turn the concept into production-ready interfaces, visuals, and edits with the discipline needed for real delivery.",
  },
];

const profileFacts = [
  {
    label: "Primary edge",
    value: "Design direction grounded in hands-on delivery",
  },
  {
    label: "Best fit",
    value: "Founders, brands, and teams that need a sharper premium presence",
  },
  {
    label: "Working style",
    value: "Structured, client-aware, and visually exact",
  },
];

function AboutPage() {
  return (
    <section className="space-y-10 pt-6 lg:space-y-14">
      <SectionHeading
        eyebrow="About"
        title="A freelance practice built around design direction, delivery discipline, and cleaner digital presentation."
        description="I work across UI/UX direction, front-end systems, brand visuals, and delivery operations. That range matters because clients do not experience those pieces separately; they experience one surface, one story, and one level of finish."
        aside={
          <div className="flex flex-wrap justify-start gap-3 lg:justify-end">
            <Pill>UI direction</Pill>
            <Pill>React execution</Pill>
            <Pill>Brand coherence</Pill>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <Reveal delay={0.05}>
          <Surface className="overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(241,211,160,0.15),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))]">
            <div className="space-y-6">
              <div className="space-y-4">
                <Eyebrow>Profile</Eyebrow>
                <h2 className="max-w-[14ch] font-display text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.95] tracking-[-0.04em] text-sand-50">
                  I help client work feel more directed, more refined, and more commercially credible.
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {profileFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-[24px] border border-white/8 bg-ink-900/45 p-5"
                  >
                    <p className="m-0 text-xs uppercase tracking-[0.18em] text-sand-100/45">
                      {fact.label}
                    </p>
                    <strong className="mt-3 block text-base leading-7 text-sand-50">
                      {fact.value}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link className={primaryButtonClassName} to="/portfolio">
                  View selected work
                </Link>
                <Link className={secondaryButtonClassName} to="/contact">
                  Discuss a project
                </Link>
              </div>
            </div>
          </Surface>
        </Reveal>

        <div className="grid gap-5">
          <Reveal delay={0.1}>
            <Surface>
              <Eyebrow>What I bring</Eyebrow>
              <ul className="mt-5 space-y-4 pl-5 text-base leading-8 text-sand-100/72">
                {strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Surface>
          </Reveal>

          <Reveal delay={0.15}>
            <Surface>
              <Eyebrow>How I think</Eyebrow>
              <p className="mt-5 text-base leading-8 text-sand-100/72">
                I treat projects like connected systems. Interface, typography,
                motion, layout, messaging, and delivery expectations should all
                push in the same direction. When they do, the work feels
                calmer, sharper, and more trustworthy to the client as well as
                the user.
              </p>
            </Surface>
          </Reveal>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {process.map((step, index) => (
          <Reveal key={step.title} delay={0.08 + index * 0.06}>
            <Surface className="h-full">
              <Eyebrow>{step.title}</Eyebrow>
              <h3 className="mt-4 font-display text-3xl leading-tight tracking-[-0.03em] text-sand-50">
                {step.title}
              </h3>
              <p className="mt-4 text-base leading-8 text-sand-100/70">
                {step.text}
              </p>
            </Surface>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.18}>
        <Surface className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <Eyebrow>Approach</Eyebrow>
            <p className="max-w-[44ch] text-xl leading-9 text-sand-100/75">
              The goal is not a louder interface. It is a more exact one, where
              hierarchy, restraint, motion, and implementation quality all
              reinforce the same client story.
            </p>
          </div>

          <Link
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-brand-100 transition hover:text-sand-50"
            to="/contact"
          >
            Start a conversation
            <ArrowUpRight size={16} />
          </Link>
        </Surface>
      </Reveal>
    </section>
  );
}

export default AboutPage;

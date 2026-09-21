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
  "Website and landing-page direction that makes the work feel clearer and more trustworthy at first glance.",
  "Front-end implementation that protects hierarchy, responsiveness, and the details clients notice immediately.",
  "Project judgment shaped by delivery leadership, client communication, and real execution constraints.",
  "Brand and visual support that keeps websites and supporting assets feeling aligned.",
];

const process = [
  {
    title: "Discover",
    text: "Clarify the client goal, audience, and decision pressure before any layout, motion, or visual direction is locked in.",
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
    value: "Design direction backed by hands-on front-end delivery",
  },
  {
    label: "Best fit",
    value: "Clients who need a more polished and credible online presence",
  },
  {
    label: "Working style",
    value: "Structured, fast-moving, and detail-conscious",
  },
];

const principles = [
  "Position the work around what the client needs to trust in the first 10 seconds.",
  "Use motion and contrast to guide attention, not to compete with the message.",
  "Build the final interface closely enough to the concept that quality survives implementation.",
];

function AboutPage() {
  return (
    <section className="space-y-10 pt-6 lg:space-y-14">
      <SectionHeading
        eyebrow="About"
        title="A freelance design practice built to present work clearly and make future clients feel confident hiring."
        description="I work across UI/UX direction, front-end systems, brand visuals, and delivery operations. Clients do not experience those pieces separately. They experience one website, one level of finish, and one standard of care."
        aside={
          <div className="flex flex-wrap justify-start gap-3 lg:justify-end">
            <Pill>UI direction</Pill>
            <Pill>React execution</Pill>
            <Pill>Brand coherence</Pill>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Reveal delay={0.05}>
          <Surface className="overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.72))]">
            <div className="space-y-7">
              <div className="space-y-4">
                <Eyebrow>Profile</Eyebrow>
                <h2 className="max-w-[15ch] font-display text-[clamp(2.2rem,4.2vw,3.8rem)] leading-[0.98] tracking-[-0.035em] text-sand-50">
                  I help freelance clients, founders, and growing businesses
                  look sharper where trust is decided fastest.
                </h2>
                <p className="max-w-[46ch] text-[0.98rem] leading-7 text-sand-100">
                  The best redesigns remove friction, sharpen presentation, and
                  make the work feel easier to understand and easier to trust at
                  a glance.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] border border-sand-200/24 bg-brand-300/12 p-5">
                  <p className="m-0 text-xs uppercase tracking-[0.18em] text-sand-100/60">
                    What clients buy
                  </p>
                  <strong className="mt-3 block text-lg leading-7 text-sand-50">
                    Better presentation and a cleaner path from first impression
                    to inquiry.
                  </strong>
                </div>
                <div className="rounded-[24px] border border-sand-200/24 bg-brand-300/12 p-5">
                  <p className="m-0 text-xs uppercase tracking-[0.18em] text-sand-100/60">
                    Core blend
                  </p>
                  <strong className="mt-3 block text-lg leading-7 text-sand-50">
                    Interface craft, presentation judgment, and front-end
                    realism.
                  </strong>
                </div>
                <div className="rounded-[24px] border border-sand-200/24 bg-brand-300/12 p-5">
                  <p className="m-0 text-xs uppercase tracking-[0.18em] text-sand-100/60">
                    Outcome
                  </p>
                  <strong className="mt-3 block text-lg leading-7 text-sand-50">
                    Clearer client-facing work without losing delivery
                    discipline.
                  </strong>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link className={primaryButtonClassName} to="/portfolio">
                  Review selected work
                </Link>
                <Link className={secondaryButtonClassName} to="/contact">
                  Talk through your project
                </Link>
              </div>
            </div>
          </Surface>
        </Reveal>

        <div className="grid gap-5">
          <Reveal delay={0.1}>
            <Surface>
              <Eyebrow>Offer snapshot</Eyebrow>
              <div className="mt-5 grid gap-4">
                {profileFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-[22px] border border-sand-200/24 bg-white/80 p-4"
                  >
                    <p className="m-0 text-xs uppercase tracking-[0.18em] text-sand-100/46">
                      {fact.label}
                    </p>
                    <strong className="mt-2 block text-base leading-7 text-sand-50">
                      {fact.value}
                    </strong>
                  </div>
                ))}
              </div>
            </Surface>
          </Reveal>

          <Reveal delay={0.15}>
            <Surface>
              <Eyebrow>Design principle</Eyebrow>
              <p className="mt-5 text-base leading-8 text-sand-100">
                I treat projects like connected systems. Typography, layout,
                motion, interface behavior, and copy should all reinforce the
                same level of quality. When that alignment is missing, even
                polished visuals feel less credible than they should.
              </p>
            </Surface>
          </Reveal>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {strengths.map((item, index) => (
          <Reveal key={item} delay={0.08 + index * 0.04}>
            <Surface className="h-full">
              <Eyebrow>Strength {String(index + 1).padStart(2, "0")}</Eyebrow>
              <h3 className="mt-4 font-display text-[1.6rem] leading-tight tracking-[-0.03em] text-sand-50">
                {item}
              </h3>
            </Surface>
          </Reveal>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {process.map((step, index) => (
          <Reveal key={step.title} delay={0.18 + index * 0.06}>
            <Surface className="h-full">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-300/28 to-brand-100/18 font-display text-xl text-brand-100">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 font-display text-[1.75rem] leading-tight tracking-[-0.03em] text-sand-50">
                {step.title}
              </h3>
              <p className="mt-4 text-base leading-8 text-sand-100">
                {step.text}
              </p>
            </Surface>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.24}>
        <Surface className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <div className="space-y-4">
            <Eyebrow>What guides the work</Eyebrow>
            <h2 className="max-w-[15ch] font-display text-[clamp(2rem,4vw,3.6rem)] leading-[0.94] tracking-[-0.05em] text-sand-50">
              Stronger interfaces come from sharper choices, not from adding
              more surface noise.
            </h2>
          </div>
          <div className="grid gap-3">
            {principles.map((principle) => (
              <div
                key={principle}
                className="rounded-[22px] border border-sand-200/24 bg-white/80 p-4 text-base leading-7 text-sand-100"
              >
                {principle}
              </div>
            ))}
          </div>
        </Surface>
      </Reveal>

      <Reveal delay={0.18}>
        <Surface className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <Eyebrow>Approach</Eyebrow>
            <p className="max-w-[44ch] text-xl leading-9 text-sand-100">
              The goal is a clearer, more exact interface where hierarchy,
              restraint, motion, and implementation quality all reinforce the
              same sense of professionalism.
            </p>
          </div>

          <Link
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-brand-100 transition hover:text-sand-50"
            to="/contact"
          >
            Start a project conversation
            <ArrowUpRight size={16} />
          </Link>
        </Surface>
      </Reveal>
    </section>
  );
}

export default AboutPage;

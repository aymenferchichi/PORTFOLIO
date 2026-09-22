import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Eyebrow,
  Reveal,
  SectionHeading,
  Surface,
  primaryButtonClassName,
  secondaryButtonClassName,
} from "../components/SitePrimitives";

const process = [
  {
    title: "Discover",
    text: "Clarify the business goal, users, constraints, and delivery risks before solutions are defined.",
  },
  {
    title: "Plan",
    text: "Define structure, interface direction, and handoff decisions that make execution faster and cleaner.",
  },
  {
    title: "Deliver",
    text: "Ship with clear ownership, tighter coordination, and production-ready quality across the work.",
  },
];

function AboutPage() {
  return (
    <section className="space-y-10 pt-6 lg:space-y-14">
      <SectionHeading
        eyebrow="About"
        title="Technical delivery, UI/UX direction, and web execution shaped by real operations."
        description="I work across product design, front-end systems, delivery planning, and client communication. The value is in making those pieces move together."
      />

      <Reveal delay={0.05}>
        <Surface className="overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.72))]">
          <div className="space-y-7">
            <div className="space-y-4">
              <Eyebrow>Profile</Eyebrow>
              <h2 className="max-w-[15ch] font-display text-[clamp(2.2rem,4.2vw,3.8rem)] leading-[0.98] tracking-[-0.035em] text-sand-50">
                I lead digital work across interface design,
                implementation, and delivery operations.
              </h2>
              <p className="max-w-[46ch] text-[0.98rem] leading-7 text-sand-100">
                Over five years, I have worked across full-stack
                development, team leadership, client coordination, and
                technical execution.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-sand-200/24 bg-brand-300/12 p-5">
                <p className="m-0 text-xs uppercase tracking-[0.18em] text-sand-100/60">
                  What teams hire for
                </p>
                <strong className="mt-3 block text-lg leading-7 text-sand-50">
                  Clearer delivery, stronger interfaces, and better
                  coordination from brief to release.
                </strong>
              </div>
              <div className="rounded-[24px] border border-sand-200/24 bg-brand-300/12 p-5">
                <p className="m-0 text-xs uppercase tracking-[0.18em] text-sand-100/60">
                  Core blend
                </p>
                <strong className="mt-3 block text-lg leading-7 text-sand-50">
                  Product thinking, web execution, and operational
                  discipline.
                </strong>
              </div>
              <div className="rounded-[24px] border border-sand-200/24 bg-brand-300/12 p-5">
                <p className="m-0 text-xs uppercase tracking-[0.18em] text-sand-100/60">
                  Outcome
                </p>
                <strong className="mt-3 block text-lg leading-7 text-sand-50">
                  Projects that move faster without losing quality.
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

      <div className="grid gap-5 lg:grid-cols-3">
        {process.map((step, index) => (
          <Reveal key={step.title} delay={0.08 + index * 0.06}>
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

      <Reveal delay={0.18}>
        <Surface className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <Eyebrow>Approach</Eyebrow>
            <p className="max-w-[44ch] text-xl leading-9 text-sand-100">
              The goal is simple: clearer decisions, tighter execution, and a
              calmer final product.
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

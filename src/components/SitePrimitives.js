import clsx from "clsx";
import { motion } from "framer-motion";

const revealTransition = {
  duration: 0.7,
  ease: [0.22, 1, 0.36, 1],
};

export function Reveal({ children, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ ...revealTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Surface({ children, className }) {
  return (
    <div
      className={clsx(
        "rounded-[24px] border border-white/10 bg-white/[0.045] p-5 shadow-panel backdrop-blur-[22px] sm:rounded-[28px] sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children, className }) {
  return (
    <p
      className={clsx(
        "m-0 text-[0.72rem] uppercase tracking-[0.22em] text-brand-200/80",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function Pill({ children, className }) {
  return (
    <span
      className={clsx(
        "inline-flex min-h-10 items-center rounded-full border border-white/10 bg-white/[0.03] px-4 text-sm text-sand-100/82",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  aside,
  className,
  titleClassName,
  delay = 0,
}) {
  return (
    <Reveal
      delay={delay}
      className={clsx(
        "grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.42fr)] lg:items-end",
        className,
      )}
    >
      <div className="space-y-4">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1
          className={clsx(
            "max-w-[11.5ch] font-display text-[clamp(2.35rem,10vw,5.75rem)] leading-[0.94] tracking-[-0.04em] text-sand-50",
            titleClassName,
          )}
        >
          {title}
        </h1>
      </div>

      <div className="space-y-4 lg:justify-self-end lg:text-right">
        {description ? (
          <p className="max-w-[36ch] text-base leading-8 text-sand-100/70 lg:ml-auto">
            {description}
          </p>
        ) : null}
        {aside}
      </div>
    </Reveal>
  );
}

export const primaryButtonClassName =
  "inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-brand-300 px-6 text-sm font-semibold text-ink-900 transition duration-200 hover:-translate-y-0.5 sm:w-auto";

export const secondaryButtonClassName =
  "inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 text-sm text-sand-50 transition duration-200 hover:-translate-y-0.5 hover:border-brand-200/30 hover:text-brand-100 sm:w-auto";

export const fieldClassName =
  "w-full rounded-[20px] border border-white/10 bg-ink-900/80 px-4 py-3.5 text-sand-50 outline-none transition placeholder:text-sand-100/30 focus:border-brand-200/60 focus:ring-1 focus:ring-brand-200/60";

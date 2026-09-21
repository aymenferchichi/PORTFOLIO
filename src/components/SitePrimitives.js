import clsx from "clsx";
import { motion } from "framer-motion";

const revealTransition = {
  duration: 0.75,
  ease: [0.22, 1, 0.36, 1],
};

export function Reveal({ children, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
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
        "rounded-[26px] border border-sand-200/28 bg-white/82 p-6 shadow-panel backdrop-blur-[10px] sm:rounded-[30px] sm:p-8",
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
        "m-0 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-brand-100",
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
        "inline-flex min-h-10 items-center rounded-full border border-sand-200/28 bg-white/86 px-4 text-sm font-medium text-sand-100 shadow-[0_8px_24px_rgba(28,36,52,0.06)]",
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
        "grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.38fr)] lg:items-center",
        className,
      )}
    >
      <div className="space-y-4">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1
          className={clsx(
            "max-w-[14ch] font-display text-[clamp(1.95rem,5.2vw,4rem)] leading-[1.02] tracking-[-0.035em] text-sand-50",
            titleClassName,
          )}
        >
          {title}
        </h1>
      </div>

      <div className="space-y-4 lg:justify-self-end lg:text-left xl:text-right">
        {description ? (
          <p className="max-w-[42ch] text-[0.98rem] leading-7 text-sand-100/72 lg:ml-0 xl:ml-auto">
            {description}
          </p>
        ) : null}
        {aside}
      </div>
    </Reveal>
  );
}

export const primaryButtonClassName =
  "inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-brand-300 via-brand-200 to-brand-100 px-6 text-sm font-semibold text-sand-50 shadow-glow transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(201,138,53,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-100 sm:w-auto";

export const secondaryButtonClassName =
  "inline-flex min-h-12 w-full items-center justify-center rounded-full border border-sand-200/30 bg-white/80 px-6 text-sm font-medium text-sand-50 transition duration-300 hover:-translate-y-0.5 hover:border-brand-100/40 hover:bg-brand-300/22 hover:text-brand-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-100 sm:w-auto";

export const fieldClassName =
  "w-full rounded-[22px] border border-sand-200/30 bg-white px-4 py-3.5 text-sand-50 outline-none transition placeholder:text-sand-100/50 focus:border-brand-100/55 focus:bg-white focus:ring-2 focus:ring-brand-100/18";

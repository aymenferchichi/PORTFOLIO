import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CodeXml,
  Mail,
  PenTool,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchJourneyEntries } from "../data/journeyData";

const stackItems = [
  "React",
  "Node.js",
  "Express",
  "Django",
  "Figma",
  "HTML",
  "CSS",
  "JavaScript",
];

const serviceCards = [
  {
    title: "UI / UX direction",
    subtitle: "Structure, hierarchy, and decision-making for clearer web experiences.",
    icon: PenTool,
    actionLabel: "See project thinking",
    to: "/about",
  },
  {
    title: "Web development",
    subtitle: "React, Django, Shopify, and implementation shaped by delivery realities.",
    icon: CodeXml,
    actionLabel: "Review selected work",
    to: "/portfolio",
  },
  {
    title: "Delivery leadership",
    subtitle: "Planning, coordination, and execution across moving parts.",
    icon: Sparkles,
    actionLabel: "View selected work",
    to: "/portfolio",
  },
  {
    title: "Client communication",
    subtitle: "Direct, structured handling of scope, priorities, and next steps.",
    icon: BriefcaseBusiness,
    actionLabel: "Start a conversation",
    to: "/contact",
  },
];

const quickLinks = [
  {
    label: "Email",
    value: "aymenferchichi1305@gmail.com",
    href: "mailto:aymenferchichi1305@gmail.com",
    icon: Mail,
  },
  {
    label: "Work with me",
    value: "Technical delivery, UI/UX, and web execution",
    href: "/contact",
    icon: BriefcaseBusiness,
    isInternal: true,
  },
  {
    label: "About",
    value: "Background across operations, design, and development",
    href: "/about",
    icon: ArrowUpRight,
    isInternal: true,
  },
];

const profileSignals = [
  "Delivery systems",
  "UI direction",
  "Web execution",
];

function buildFeaturedProjects(entries) {
  return entries.slice(0, 3).map((entry, index) => ({
    id: entry.slug,
    title: entry.title,
    eyebrow: entry.eyebrow,
    summary: entry.summary,
    highlight: entry.outcome_highlight || entry.focus[0] || entry.summary,
    year: entry.year,
    accent: entry.accent || "#c9a87b",
    index,
  }));
}

function buildExperienceSteps(entries) {
  return entries.slice(0, 4).map((entry, index) => ({
    id: entry.slug,
    number: String(index + 1).padStart(2, "0"),
    title: entry.title,
    eyebrow: entry.eyebrow,
    detail: entry.detail,
  }));
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
    () => buildFeaturedProjects(journeys),
    [journeys],
  );

  const experienceSteps = useMemo(
    () =>
      buildExperienceSteps(
        journeys.filter((entry) => entry.subcategory !== "projects"),
      ),
    [journeys],
  );

  const leadProject = featuredProjects[0] ?? null;
  const secondaryProjects = featuredProjects.slice(1);

  return (
    <section className="space-y-12 pt-5 lg:space-y-16">
      <div className="overflow-hidden rounded-[34px] border border-sand-200/40 bg-[#f5ede1] shadow-[0_28px_80px_rgba(42,34,24,0.08)]">
        <div className="relative px-5 pb-8 pt-7 sm:px-8 lg:px-12 lg:pb-10 lg:pt-8">
          <div className="flex items-center justify-between gap-4 border-b border-[#dfcfbc] pb-4 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#9f8463]">
            <span>Selected works</span>
            <span>2026 edition</span>
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-12 flex justify-center">
            <h1 className="text-center font-display text-[clamp(4.7rem,15vw,11rem)] leading-[0.82] tracking-[-0.095em] text-[#b19b81] opacity-88">
              PORTFOLIO
            </h1>
          </div>

          <div className="relative z-10 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)_220px] lg:items-end">
            <div className="space-y-5 pt-20 lg:flex lg:min-h-[460px] lg:flex-col lg:justify-center lg:pt-20">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9f8463]">
                Selected work
              </p>
              <div className="space-y-4 text-[#6f5b45]">
                <p className="m-0 font-display text-[clamp(2.1rem,6vw,3.55rem)] leading-[0.86] tracking-[-0.06em]">
                  Technical delivery
                </p>
                <p className="m-0 max-w-[20ch] text-[0.98rem] leading-8 text-[#8a755e]">
                  Web platforms, interfaces, and delivery systems built around clarity.
                </p>
              </div>
              <div className="space-y-2 border-l border-[#d3c1ab] pl-4 text-[0.92rem] leading-7 text-[#7d6851]">
                <p className="m-0">Five years across design, development, operations, and client delivery.</p>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[700px] pt-8 sm:pt-12 lg:-mt-6 lg:pt-14">
              <div className="absolute left-1/2 top-8 h-48 w-48 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,168,123,0.34),transparent_68%)] blur-3xl sm:h-64 sm:w-64" />
              <div className="relative z-10 flex justify-center overflow-hidden pt-1">
                <img
                  className="-mt-6 mx-auto block h-auto w-full max-w-[520px] object-contain sm:-mt-8 lg:-mt-10 lg:max-w-[570px]"
                  src={process.env.PUBLIC_URL + "/photo.png"}
                  alt="Aymen Ferchichi portrait"
                />
              </div>
            </div>

            <div className="space-y-5 pt-6 text-left lg:flex lg:min-h-[460px] lg:flex-col lg:justify-center lg:pt-20 lg:text-right">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9f8463]">
                Aymen Ferchichi
              </p>
              <div className="space-y-4 text-[#6f5b45]">
                <p className="m-0 font-display text-[clamp(2.1rem,6vw,3.55rem)] leading-[0.86] tracking-[-0.06em]">
                  UI/UX lead
                </p>
                <p className="m-0 ml-auto max-w-[22ch] text-[0.98rem] leading-8 text-[#8a755e]">
                  Technical delivery manager with hands-on full-stack and interface experience.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                {profileSignals.map((signal) => (
                  <span
                    key={signal}
                    className="rounded-full border border-[#d3c1ab] px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[#876d51]"
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6 grid gap-5 border-t border-[#dfcfbc] pt-5 md:grid-cols-[1.1fr_0.9fr]">
            <p className="m-0 max-w-[50ch] text-[0.96rem] leading-8 text-[#7d6851]">
              A minimal portfolio built around selected work, delivery thinking, and the systems behind execution.
            </p>
            <div className="flex items-center gap-3 md:justify-end">
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-[#cdb79d] bg-white/55 px-5 py-2.5 text-[0.92rem] font-medium text-[#6a543f] transition hover:bg-white/75"
                to="/contact"
              >
                Start a conversation
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[#e4d7c7] bg-white/38 px-5 py-10 sm:px-8 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[100px_minmax(0,1fr)_280px] lg:items-start">
            <div className="hidden lg:flex justify-center pt-4">
              <span className="font-display text-[4.6rem] leading-none tracking-[-0.08em] text-[#d7c8b7] [writing-mode:vertical-rl] [transform:rotate(180deg)]">
                PROJECTS
              </span>
            </div>

            <div className="space-y-5">
              <div className="rounded-[30px] border border-[#d7c6b3] bg-[#f6eee2] p-5 shadow-[0_18px_48px_rgba(61,46,32,0.12)] sm:p-7">
                <div className="flex items-center justify-between gap-4 border-b border-[#dfcfbc] pb-3">
                  <div className="flex gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#cdb298]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#b69471]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#8e7356]" />
                  </div>
                  <span className="rounded-full border border-[#d7c6b3] px-3 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-[#95795a]">
                    Selected project
                  </span>
                </div>

                {leadProject ? (
                  <div className="grid gap-6 pt-7 lg:grid-cols-[minmax(0,1.15fr)_220px] lg:items-end">
                    <div className="space-y-6">
                      <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#9f8463]">
                        {leadProject.eyebrow} • {leadProject.year}
                      </p>
                      <h2 className="m-0 max-w-[11ch] font-display text-[clamp(2.5rem,5.6vw,4.2rem)] leading-[0.88] tracking-[-0.065em] text-[#6a543f]">
                        {leadProject.title}
                      </h2>
                      <p className="m-0 max-w-[52ch] text-[0.98rem] leading-8 text-[#8a755e]">
                        {leadProject.summary}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="rounded-full border border-[#d3c1ab] px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[#876d51]">
                          Selected work
                        </span>
                        <span className="rounded-full border border-[#d3c1ab] px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[#876d51]">
                          Interface direction
                        </span>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-[#d7c6b3] bg-white/56 p-5">
                      <p className="m-0 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#9f8463]">
                        Outcome highlight
                      </p>
                      <p className="m-0 mt-4 text-[0.95rem] leading-8 text-[#6f5b45]">
                        {leadProject.highlight}
                      </p>
                      <Link
                        className="mt-5 inline-flex items-center gap-2 text-[0.92rem] font-medium text-[#6a543f] transition hover:text-[#8f6f4d]"
                        to={`/journey/${leadProject.id}`}
                      >
                        Open case study
                        <ArrowUpRight size={16} />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="pt-5">
                    <p className="m-0 text-base leading-8 text-[#8a755e]">
                      Journey entries will appear here once the portfolio data loads.
                    </p>
                  </div>
                )}
              </div>

              {secondaryProjects.length > 0 ? (
                <div className="grid gap-5 md:grid-cols-2">
                  {secondaryProjects.map((project) => (
                    <Link
                      key={project.id}
                      className="rounded-[24px] border border-[#d7c6b3] bg-[#efe2d2] p-6 shadow-[0_14px_34px_rgba(61,46,32,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(61,46,32,0.11)]"
                      to={`/journey/${project.id}`}
                    >
                      <p className="m-0 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#9f8463]">
                        {project.eyebrow} • {project.year}
                      </p>
                      <h3 className="m-0 mt-4 font-display text-[1.7rem] leading-[0.95] tracking-[-0.05em] text-[#6a543f]">
                        {project.title}
                      </h3>
                      <p className="m-0 mt-4 text-[0.94rem] leading-8 text-[#7f6a53]">
                        {project.highlight}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="grid gap-5">
              <div className="rounded-[24px] border border-[#d7c6b3] bg-[linear-gradient(180deg,rgba(233,218,199,0.95),rgba(223,205,184,0.92))] p-6 shadow-[0_14px_34px_rgba(61,46,32,0.08)]">
                <p className="m-0 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#9f8463]">
                  Approach
                </p>
                <h3 className="m-0 mt-4 font-display text-[2rem] leading-[0.94] tracking-[-0.06em] text-[#6a543f]">
                  Calm layouts with strong hierarchy.
                </h3>
                <p className="m-0 mt-4 text-[0.94rem] leading-8 text-[#7f6a53]">
                  The page language stays light and minimal so the work, typography, and image carry most of the character.
                </p>
              </div>
              <div className="rounded-[24px] border border-[#d7c6b3] bg-[#f8f1e7] p-6">
                <p className="m-0 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#9f8463]">
                  Notes
                </p>
                <div className="mt-4 space-y-4 text-[0.94rem] leading-8 text-[#7f6a53]">
                  <p className="m-0">Centered portrait anchor.</p>
                  <p className="m-0">Editorial spacing over dense UI blocks.</p>
                  <p className="m-0">Muted beige palette with darker accents.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-y border-[#e4d7c7] bg-white/58 px-5 py-7 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="m-0 font-display text-[clamp(3.2rem,10vw,6.2rem)] leading-none tracking-[-0.08em] text-[#d0beaa]">
              SKILLS
            </h2>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[1.02rem] font-medium tracking-[-0.02em] text-[#6f5b45] sm:text-[1.12rem]">
              {stackItems.map((item) => (
                <span key={item} className="inline-flex items-center gap-3">
                  <span>{item}</span>
                  <span className="text-[#c4ad91]">/</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 py-10 sm:px-8 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_100px] lg:items-start">
            <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
              <div className="grid gap-4">
                {serviceCards.slice(0, 2).map((card, index) => {
                  const Icon = card.icon;

                  return (
                    <Link
                      key={card.title}
                      className={`group rounded-[28px] border border-[#d7c6b3] bg-[#ead8c4] p-6 text-[#6a543f] shadow-[0_18px_40px_rgba(61,46,32,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(61,46,32,0.12)] ${
                        index === 0 ? "min-h-[280px]" : "min-h-[190px]"
                      }`}
                      to={card.to}
                    >
                      <div className="flex h-full flex-col justify-between gap-6">
                        <div className="space-y-4">
                          <Icon size={30} className="text-[#8b6f50]" />
                          <p className="m-0 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#9f8463]">
                            Focus
                          </p>
                          <h3 className={`m-0 font-display tracking-[-0.06em] ${index === 0 ? "text-[clamp(3.2rem,8vw,5.2rem)] leading-[0.82]" : "text-[clamp(2.15rem,5vw,3.1rem)] leading-[0.9]"}`}>
                            {card.title}
                          </h3>
                          <p className="m-0 max-w-[29ch] text-[0.96rem] leading-8 text-[#7f6a53]">
                            {card.subtitle}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-2 text-[0.96rem] font-medium text-[#6a543f]">
                          {card.actionLabel}
                          <ArrowUpRight size={18} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="grid gap-4">
                {serviceCards.slice(2).map((card) => {
                  const Icon = card.icon;

                  return (
                    <Link
                      key={card.title}
                      className="group rounded-[28px] border border-[#d7c6b3] bg-[#ead8c4] p-6 text-[#6a543f] shadow-[0_18px_40px_rgba(61,46,32,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(61,46,32,0.12)]"
                      to={card.to}
                    >
                      <div className="flex h-full flex-col justify-between gap-5">
                        <div className="space-y-4">
                          <Icon size={28} className="text-[#8b6f50]" />
                          <p className="m-0 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#9f8463]">
                            Focus
                          </p>
                          <h3 className="m-0 font-display text-[clamp(2.15rem,4vw,3.1rem)] leading-[0.9] tracking-[-0.06em]">
                            {card.title}
                          </h3>
                          <p className="m-0 text-[0.96rem] leading-8 text-[#7f6a53]">
                            {card.subtitle}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-2 text-[0.96rem] font-medium text-[#6a543f]">
                          {card.actionLabel}
                          <ArrowUpRight size={18} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <span className="font-display text-[4.6rem] leading-none tracking-[-0.08em] text-[#d7c8b7] [writing-mode:vertical-rl]">
                CAPABILITIES
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#e4d7c7] bg-white/48 px-5 py-10 sm:px-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
            <div className="space-y-5">
              <h2 className="m-0 font-display text-[clamp(3.2rem,10vw,6.2rem)] leading-none tracking-[-0.08em] text-[#d0beaa]">
                EXPERIENCE
              </h2>
              <p className="m-0 max-w-[24ch] text-[0.96rem] leading-8 text-[#7d6851]">
                Background chapters that shaped the way projects are structured, designed, and built today.
              </p>
            </div>

            <div className="grid gap-5">
              {experienceSteps.map((step) => (
                <div
                  key={step.id}
                  className="grid gap-5 rounded-[26px] border border-[#dcccb8] bg-[#f8f1e7] p-6 md:grid-cols-[90px_220px_minmax(0,1fr)] md:items-start"
                >
                  <div className="font-display text-[3rem] leading-none tracking-[-0.07em] text-[#6a543f]">
                    {step.number}
                  </div>
                  <div className="space-y-3">
                    <p className="m-0 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#9f8463]">
                      {step.eyebrow}
                    </p>
                    <h3 className="m-0 font-display text-[1.75rem] leading-[0.94] tracking-[-0.05em] text-[#6a543f]">
                      {step.title}
                    </h3>
                  </div>
                  <p className="m-0 max-w-[58ch] text-[0.96rem] leading-8 text-[#7f6a53]">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#e4d7c7] bg-white/65 px-5 py-10 sm:px-8 lg:px-12">
          <div className="space-y-7">
            <h2 className="m-0 text-center font-display text-[clamp(3rem,8vw,5.2rem)] leading-none tracking-[-0.07em] text-[#d0beaa]">
              QUICK LINKS
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                const content = (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d7c6b3] bg-[#f2e5d4] text-[#8a6d4f]">
                      <Icon size={22} />
                    </div>
                    <div className="space-y-2">
                      <p className="m-0 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#9f8463]">
                        {item.label}
                      </p>
                      <p className="m-0 text-[0.96rem] leading-8 text-[#6f5b45]">
                        {item.value}
                      </p>
                    </div>
                  </>
                );

                if (item.isInternal) {
                  return (
                    <Link
                      key={item.label}
                      className="flex gap-4 rounded-[24px] border border-[#dcccb8] bg-[#f8f1e7] p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(61,46,32,0.08)]"
                      to={item.href}
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <a
                    key={item.label}
                    className="flex gap-4 rounded-[24px] border border-[#dcccb8] bg-[#f8f1e7] p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(61,46,32,0.08)]"
                    href={item.href}
                  >
                    {content}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PortfolioPage;

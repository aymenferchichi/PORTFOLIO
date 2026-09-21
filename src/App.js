import "./styles/scene.css";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import clsx from "clsx";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import JourneyDetailPage from "./pages/JourneyDetailPage";
import PortfolioPage from "./pages/PortfolioPage";
import ServicesPage from "./pages/ServicesPage";

const navigationItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Contact", to: "/contact" },
];

const footerPillars = [
  "Clean portfolio and business websites",
  "Clear case studies and project presentation",
  "Front-end execution that keeps the design intact",
];

function getNavLinkClassName(isActive) {
  return clsx(
    "inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-medium transition duration-300",
    isActive
      ? "bg-brand-300/45 text-sand-50 shadow-[0_10px_26px_rgba(40,52,74,0.12)]"
      : "text-sand-50 hover:bg-white/80 hover:text-sand-50",
  );
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return null;
}

function AppLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-shell-gradient text-sand-50">
      <ScrollToTop />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.5),transparent_24%),radial-gradient(circle_at_78%_18%,rgba(141,183,177,0.16),transparent_24%),linear-gradient(180deg,transparent,rgba(255,253,248,0.08))]" />
      {!isHomePage ? (
        <>
          <div
            className="pointer-events-none absolute left-[-10rem] top-32 h-80 w-80 rounded-full bg-[rgba(242,211,162,0.42)] blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-[-9rem] top-[26rem] h-80 w-80 rounded-full bg-[rgba(141,183,177,0.18)] blur-3xl"
            aria-hidden="true"
          />
        </>
      ) : null}

      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="rounded-[22px] border border-sand-200/26 bg-white/78 px-3 py-2.5 shadow-panel backdrop-blur-[16px] sm:rounded-[28px] sm:px-5 sm:py-3">
            <nav
              className="flex flex-wrap items-center gap-4"
              aria-label="Primary"
            >
              <NavLink className="flex min-w-0 items-center gap-4" to="/">
                <div className="relative">
                  <div className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-brand-200/55 to-brand-300/55 blur-lg" />
                  <img
                    className="relative h-11 w-11 rounded-[16px] border border-sand-200/24 object-cover sm:h-14 sm:w-14 sm:rounded-[20px]"
                    src={process.env.PUBLIC_URL + "/logo.png"}
                    alt="Aymen Ferchichi logo"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-sand-50 sm:text-sm">
                    Aymen Ferchichi
                  </p>
                  <p className="hidden truncate text-sm text-sand-100 sm:block">
                    UI/UX designer and front-end builder creating polished
                    client-facing websites and interfaces
                  </p>
                </div>
              </NavLink>

              <div className="ml-auto hidden items-center gap-1.5 rounded-full border border-sand-200/26 bg-white/86 p-1 md:flex">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => getNavLinkClassName(isActive)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>

              <a
                className="ml-2 hidden min-h-10 items-center justify-center rounded-full bg-gradient-to-r from-brand-300 via-brand-200 to-brand-100 px-4.5 text-sm font-semibold text-sand-50 shadow-glow transition duration-300 hover:-translate-y-0.5 md:inline-flex"
                href="mailto:aymenferchichi1305@gmail.com"
              >
                Start a project conversation
              </a>

              <button
                type="button"
                className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-sand-200/26 bg-white/86 text-sand-50 md:hidden"
                aria-expanded={isMenuOpen}
                aria-label={
                  isMenuOpen ? "Close navigation menu" : "Open navigation menu"
                }
                onClick={() => setIsMenuOpen((current) => !current)}
              >
                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>

              <AnimatePresence>
                {isMenuOpen ? (
                  <motion.div
                    key="mobile-nav"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    className="basis-full overflow-hidden md:hidden"
                  >
                    <div className="mt-4 grid gap-3 border-t border-sand-200/24 pt-4">
                      {navigationItems.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) =>
                            clsx(
                              "rounded-[22px] border px-4 py-3 text-sm font-medium transition",
                              isActive
                                ? "border-brand-100/35 bg-brand-300/36 text-sand-50"
                                : "border-sand-200/24 bg-white/78 text-sand-50",
                            )
                          }
                        >
                          {item.label}
                        </NavLink>
                      ))}

                      <a
                        className="inline-flex min-h-12 items-center justify-center rounded-[22px] bg-gradient-to-r from-brand-300 via-brand-200 to-brand-100 px-4 text-sm font-semibold uppercase tracking-[0.16em] text-sand-50"
                        href="mailto:aymenferchichi1305@gmail.com"
                      >
                        Start a project conversation
                      </a>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </nav>
          </div>
        </div>
      </header>

      <main
        className={clsx(
          "relative z-10",
          isHomePage
            ? ""
            : "px-4 pb-20 pt-22 sm:px-6 sm:pb-24 sm:pt-24 lg:px-10 lg:pt-28",
        )}
      >
        <div className={clsx(isHomePage ? "" : "mx-auto max-w-[1380px]")}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/journey/:slug" element={<JourneyDetailPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </div>
      </main>

      {!isHomePage ? (
        <footer className="relative z-10">
          <div className="w-full border border-b-0 border-white/10 bg-[linear-gradient(180deg,rgba(11,20,36,0.98),rgba(7,16,28,0.98))] px-4 py-8 shadow-[0_26px_80px_rgba(8,12,22,0.42)] backdrop-blur-[14px] sm:px-6 sm:py-10 lg:px-10">
            <div className="mx-auto grid max-w-[1380px] gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div className="space-y-6">
                <div className="inline-flex min-h-10 items-center rounded-full border border-white/12 bg-white/[0.06] px-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-brand-200">
                  Available for selected freelance work
                </div>
                <h2 className="max-w-[13ch] font-display text-[clamp(2rem,7vw,4.4rem)] leading-[0.94] tracking-[-0.05em] text-white">
                  Clear presentation, careful execution, and client-facing work that feels dependable.
                </h2>
                <p className="max-w-[50ch] text-[1rem] leading-8 text-white">
                  The goal is simple: make the work easier to trust through stronger structure, polished detail, and front-end delivery that holds up in the final build.
                </p>
                <div className="flex flex-wrap gap-3">
                  {footerPillars.map((pillar) => (
                    <span
                      key={pillar}
                      className="inline-flex min-h-10 items-center rounded-full border border-white/10 bg-white/[0.05] px-4 text-sm text-white"
                    >
                      {pillar}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 lg:content-between">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_16px_44px_rgba(4,8,18,0.24)]">
                  <p className="m-0 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-brand-200">
                    Primary contact
                  </p>
                  <a
                    className="mt-3 inline-flex items-center gap-2 break-all text-lg font-semibold text-white transition hover:text-brand-200"
                    href="mailto:aymenferchichi1305@gmail.com"
                  >
                    aymenferchichi1305@gmail.com
                    <ArrowUpRight size={16} />
                  </a>
                  <p className="mt-3 text-sm leading-7 text-white">
                    Best suited for portfolio websites, landing pages, redesigns, and client-facing interfaces that need a cleaner and more professional presentation.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {navigationItems.map((item) => (
                    <NavLink
                      key={item.to}
                      className="rounded-[18px] border border-white/10 bg-white/[0.05] px-4 py-3 text-center text-sm font-medium text-white transition hover:border-brand-200/36 hover:bg-white/[0.08] hover:text-white"
                      to={item.to}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>

                <div className="flex flex-col gap-2 border-t border-white/10 pt-5 text-sm text-white sm:flex-row sm:items-center sm:justify-between">
                  <p className="m-0">Independent UI/UX design and front-end delivery.</p>
                  <p className="m-0">Based on careful scope, clear communication, and polished execution.</p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;

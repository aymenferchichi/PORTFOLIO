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

const navigationItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Contact", to: "/contact" },
];

function getNavLinkClassName(isActive) {
  return clsx(
    "relative pb-1 text-sm uppercase tracking-[0.18em] transition",
    isActive ? "text-brand-100" : "text-sand-100/68 hover:text-sand-50",
  );
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.07),transparent_25%),radial-gradient(circle_at_80%_20%,rgba(109,143,132,0.14),transparent_22%)]" />
      {!isHomePage ? (
        <>
          <div
            className="pointer-events-none absolute left-[-10rem] top-32 h-80 w-80 rounded-full bg-[rgba(198,133,68,0.18)] blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-[-9rem] top-[26rem] h-80 w-80 rounded-full bg-[rgba(72,102,97,0.18)] blur-3xl"
            aria-hidden="true"
          />
        </>
      ) : null}

      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="rounded-[24px] border border-white/10 bg-ink-900/72 px-3 py-3 shadow-panel backdrop-blur-[24px] sm:rounded-[30px] sm:px-6 sm:py-4">
            <nav
              className="flex flex-wrap items-center gap-4"
              aria-label="Primary"
            >
              <NavLink className="flex min-w-0 items-center gap-4" to="/">
                <img
                  className="h-11 w-11 rounded-[16px] object-cover sm:h-14 sm:w-14 sm:rounded-[20px]"
                  src={process.env.PUBLIC_URL + "/logo.png"}
                  alt="Aymen Ferchichi logo"
                />
                <div className="min-w-0">
                  <p className="truncate text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-sand-50 sm:text-sm">
                    Aymen Ferchichi
                  </p>
                  <p className="hidden truncate text-sm text-sand-100/60 sm:block">
                    Digital designer, front-end builder, and motion-focused
                    storyteller
                  </p>
                </div>
              </NavLink>

              <div className="ml-auto hidden items-center gap-8 md:flex">
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
                className="ml-auto hidden min-h-12 items-center justify-center rounded-full border border-brand-200/20 bg-brand-200/10 px-5 text-sm text-sand-50 transition hover:-translate-y-0.5 hover:border-brand-200/35 hover:text-brand-100 md:inline-flex"
                href="mailto:aymenferchichi1305@gmail.com"
              >
                Start a project
              </a>

              <button
                type="button"
                className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-sand-50 md:hidden"
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
                    <div className="mt-4 grid gap-3 border-t border-white/10 pt-4">
                      {navigationItems.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) =>
                            clsx(
                              "rounded-2xl border px-4 py-3 text-sm uppercase tracking-[0.18em] transition",
                              isActive
                                ? "border-brand-200/30 bg-brand-200/12 text-brand-100"
                                : "border-white/8 bg-white/[0.02] text-sand-100/70",
                            )
                          }
                        >
                          {item.label}
                        </NavLink>
                      ))}

                      <a
                        className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-300 px-4 text-sm font-semibold uppercase tracking-[0.16em] text-ink-900"
                        href="mailto:aymenferchichi1305@gmail.com"
                      >
                        Start a project
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
            : "px-4 pb-20 pt-24 sm:px-6 sm:pb-24 sm:pt-28 lg:px-10 lg:pt-32",
        )}
      >
        <div className={clsx(isHomePage ? "" : "mx-auto max-w-[1380px]")}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/journey/:slug" element={<JourneyDetailPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </div>
      </main>

      {!isHomePage ? (
        <footer className="relative z-10 px-4 pb-10 sm:px-6 sm:pb-12 lg:px-10">
          <div className="mx-auto grid max-w-[1380px] gap-6 rounded-[24px] border border-white/10 bg-white/[0.045] p-5 shadow-panel backdrop-blur-[20px] sm:gap-8 sm:rounded-[36px] sm:p-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)] lg:p-10">
            <div className="space-y-4 sm:space-y-5">
              <p className="m-0 text-[0.72rem] uppercase tracking-[0.22em] text-brand-200/80">
                Available for selected freelance work
              </p>
              <h2 className="max-w-[12ch] font-display text-[clamp(2rem,9vw,5rem)] leading-[0.96] tracking-[-0.04em] text-sand-50">
                Design systems, premium web experiences, and visuals that feel
                directed.
              </h2>
            </div>

            <div className="grid content-end gap-3 text-sm leading-6 text-sand-100/68 sm:gap-4 sm:text-base">
              <a
                className="inline-flex items-center gap-2 break-all text-sm text-brand-100 transition hover:text-sand-50 sm:text-base"
                href="mailto:aymenferchichi1305@gmail.com"
              >
                aymenferchichi1305@gmail.com
                <ArrowUpRight size={16} />
              </a>
              <p className="m-0 max-w-[28ch] leading-7">
                Built around clarity, craft, and a stronger visual point of view
                from first impression to final delivery.
              </p>
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

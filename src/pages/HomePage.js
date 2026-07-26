import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Link } from "react-router-dom";
import DriveExperience from "../components/DriveExperience";
import { Eyebrow } from "../components/SitePrimitives";
import {
  buildJourneyScene,
  calculateScrollRunway,
  fetchJourneyEntries,
} from "../data/journeyData";

const stopDurationMs = 2000;
const stopReadableFrontZ = -5;

const shakeKeyframes = {
  x: [0, -7, 6, -5, 4, -2, 0],
  y: [0, 3, -2, 2, -1, 0, 0],
  rotate: [0, -0.35, 0.28, -0.22, 0.12, -0.08, 0],
};
const shakeTransition = {
  duration: 0.46,
  ease: [0.22, 1, 0.36, 1],
  times: [0, 0.16, 0.34, 0.5, 0.68, 0.84, 1],
};

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  return prefersReducedMotion;
}

function HomePage() {
  const heroRef = useRef(null);
  const scrollLockRef = useRef({
    active: false,
    id: null,
    progress: 0,
    targetY: 0,
    timeoutId: null,
  });
  const previousScrollYRef = useRef(
    typeof window !== "undefined" ? window.scrollY : 0,
  );
  const releasedStopIdsRef = useRef(new Set());
  const [progress, setProgress] = useState(0);
  const [journeys, setJourneys] = useState([]);
  const [isSkipVisible, setIsSkipVisible] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false,
  );
  const [activeStopId, setActiveStopId] = useState(null);
  const [releasedStopIds, setReleasedStopIds] = useState([]);
  const prefersReducedMotion = usePrefersReducedMotion();
  const shakeControls = useAnimationControls();
  const sceneData = useMemo(() => buildJourneyScene(journeys), [journeys]);
  const firstMilestoneId = sceneData.allMilestones[0]?.id ?? null;
  const lastMilestoneId = sceneData.allMilestones.at(-1)?.id ?? null;
  const releasedStopIdSet = useMemo(
    () => new Set(releasedStopIds),
    [releasedStopIds],
  );
  const signalStateById = useMemo(
    () =>
      sceneData.allMilestones.reduce((states, milestone) => {
        states[milestone.id] =
          milestone.id === firstMilestoneId ||
          releasedStopIdSet.has(milestone.id)
            ? "green"
            : "red";

        if (activeStopId === milestone.id) {
          states[milestone.id] = "red";
        }

        return states;
      }, {}),
    [
      activeStopId,
      firstMilestoneId,
      releasedStopIdSet,
      sceneData.allMilestones,
    ],
  );

  const handleImpact = () => {
    if (prefersReducedMotion) {
      return;
    }

    shakeControls.set({ x: 0, y: 0, rotate: 0 });
    shakeControls.start(shakeKeyframes, shakeTransition);
  };

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

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsSkipVisible(true);
    }, 1200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    releasedStopIdsRef.current = new Set(releasedStopIds);
  }, [releasedStopIds]);

  useEffect(() => {
    if (scrollLockRef.current.timeoutId) {
      window.clearTimeout(scrollLockRef.current.timeoutId);
    }

    scrollLockRef.current = {
      active: false,
      id: null,
      progress: 0,
      targetY: 0,
      timeoutId: null,
    };

    previousScrollYRef.current =
      typeof window !== "undefined" ? window.scrollY : 0;
    releasedStopIdsRef.current = new Set(
      firstMilestoneId ? [firstMilestoneId] : [],
    );
    setActiveStopId(null);
    setReleasedStopIds(firstMilestoneId ? [firstMilestoneId] : []);
  }, [firstMilestoneId, sceneData]);

  useEffect(
    () => () => {
      if (scrollLockRef.current.timeoutId) {
        window.clearTimeout(scrollLockRef.current.timeoutId);
      }
    },
    [],
  );

  useEffect(() => {
    if (!activeStopId) {
      return undefined;
    }

    const preventLockedScroll = (event) => {
      event.preventDefault();
      window.scrollTo({ top: scrollLockRef.current.targetY, behavior: "auto" });
    };

    const preventLockedKeys = (event) => {
      if (
        [
          "ArrowDown",
          "ArrowUp",
          "PageDown",
          "PageUp",
          "Home",
          "End",
          " ",
        ].includes(event.key)
      ) {
        event.preventDefault();
        window.scrollTo({
          top: scrollLockRef.current.targetY,
          behavior: "auto",
        });
      }
    };

    window.addEventListener("wheel", preventLockedScroll, { passive: false });
    window.addEventListener("touchmove", preventLockedScroll, {
      passive: false,
    });
    window.addEventListener("keydown", preventLockedKeys);

    return () => {
      window.removeEventListener("wheel", preventLockedScroll);
      window.removeEventListener("touchmove", preventLockedScroll);
      window.removeEventListener("keydown", preventLockedKeys);
    };
  }, [activeStopId]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileViewport(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    let frameId = null;

    const updateScrollProgress = () => {
      if (!heroRef.current) {
        return;
      }

      const rect = heroRef.current.getBoundingClientRect();
      const heroStart = window.scrollY + rect.top;
      const maxScrollable = heroRef.current.offsetHeight - window.innerHeight;

      if (maxScrollable <= 0 || sceneData.roadTravelDistance <= 0) {
        setProgress(0);
        return;
      }

      if (scrollLockRef.current.active) {
        if (Math.abs(window.scrollY - scrollLockRef.current.targetY) > 1) {
          window.scrollTo({
            top: scrollLockRef.current.targetY,
            behavior: "auto",
          });
        }

        setProgress(scrollLockRef.current.progress);
        previousScrollYRef.current = scrollLockRef.current.targetY;
        return;
      }

      const travelled = Math.min(Math.max(-rect.top, 0), maxScrollable);
      const nextProgress = travelled / maxScrollable;
      const travelOffset = nextProgress * sceneData.roadTravelDistance;
      const isAdvancing = window.scrollY > previousScrollYRef.current;

      previousScrollYRef.current = window.scrollY;

      if (isAdvancing) {
        const nextStop = sceneData.allMilestones.find((milestone) => {
          if (
            milestone.id === firstMilestoneId ||
            milestone.id === lastMilestoneId
          ) {
            return false;
          }

          if (releasedStopIdsRef.current.has(milestone.id)) {
            return false;
          }

          const stopTravelOffset = stopReadableFrontZ - milestone.position[2];
          return travelOffset >= stopTravelOffset;
        });

        if (nextStop) {
          const stopTravelOffset = Math.min(
            Math.max(stopReadableFrontZ - nextStop.position[2], 0),
            sceneData.roadTravelDistance,
          );
          const lockedProgress =
            stopTravelOffset / sceneData.roadTravelDistance;
          const targetY = heroStart + lockedProgress * maxScrollable;

          if (scrollLockRef.current.timeoutId) {
            window.clearTimeout(scrollLockRef.current.timeoutId);
          }

          scrollLockRef.current = {
            active: true,
            id: nextStop.id,
            progress: lockedProgress,
            targetY,
            timeoutId: window.setTimeout(() => {
              scrollLockRef.current = {
                ...scrollLockRef.current,
                active: false,
                id: null,
                timeoutId: null,
              };
              releasedStopIdsRef.current.add(nextStop.id);
              setReleasedStopIds((current) =>
                current.includes(nextStop.id)
                  ? current
                  : [...current, nextStop.id],
              );
              setActiveStopId(null);
            }, stopDurationMs),
          };

          setActiveStopId(nextStop.id);
          setProgress(lockedProgress);
          window.scrollTo({ top: targetY, behavior: "auto" });
          return;
        }
      }

      setProgress(nextProgress);
    };

    const scheduleScrollUpdate = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateScrollProgress();
      });
    };

    scheduleScrollUpdate();
    window.addEventListener("scroll", scheduleScrollUpdate, {
      passive: true,
    });
    window.addEventListener("resize", scheduleScrollUpdate);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", scheduleScrollUpdate);
      window.removeEventListener("resize", scheduleScrollUpdate);
    };
  }, [firstMilestoneId, lastMilestoneId, sceneData]);

  return (
    <section
      ref={heroRef}
      className="drive-hero-fullscreen"
      style={{
        minHeight: `calc(100vh + ${calculateScrollRunway(
          sceneData.roadTravelDistance,
          {
            isMobile: isMobileViewport,
          },
        )}px)`,
      }}
    >
      <motion.div
        className="drive-hero-stage relative"
        animate={prefersReducedMotion ? undefined : shakeControls}
      >
        <DriveExperience
          progress={progress}
          sceneData={sceneData}
          reducedMotion={prefersReducedMotion}
          onImpact={handleImpact}
          activeStopId={activeStopId}
          signalStateById={signalStateById}
        />

        <div className="pointer-events-none absolute inset-0 z-[3] flex flex-col justify-between p-3 pt-24 sm:p-6 sm:pt-24 lg:p-9 lg:pt-28">
          <motion.div
            initial={{ opacity: 0, y: -22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto max-w-[15rem] rounded-[20px] border border-white/10 bg-ink-950/54 p-4 shadow-panel backdrop-blur-[20px] sm:max-w-sm sm:rounded-[24px] sm:p-5"
          >
            <Eyebrow>Interactive portfolio</Eyebrow>
            <strong className="mt-2 block text-[0.72rem] uppercase tracking-[0.14em] text-sand-50/92 sm:mt-3 sm:text-sm">
              Design-led freelance work, selected client chapters, and the
              thinking behind them.
            </strong>
            <p className="mt-3 mb-0 text-[0.68rem] leading-5 text-sand-100/72 sm:hidden">
              Use a PC for the smoothest and most complete experience.
            </p>
          </motion.div>

          <div className="mt-auto hidden justify-start pb-16 sm:flex sm:pb-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.75,
                delay: 0.14,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="pointer-events-auto w-full max-w-[19rem] rounded-[22px] border border-white/10 bg-ink-950/58 p-4 shadow-panel backdrop-blur-[24px] sm:max-w-[420px] sm:rounded-[28px] sm:p-7"
            >
              <div>
                <span className="block text-[0.7rem] uppercase tracking-[0.18em] text-sand-50/84 sm:text-[0.78rem]">
                  Road progress
                </span>
                <div
                  className="mt-3 h-2 overflow-hidden rounded-full bg-white/10 sm:mt-4 sm:h-2.5"
                  role="progressbar"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={Math.round(progress * 100)}
                >
                  <div
                    className="h-full origin-left rounded-full bg-gradient-to-r from-brand-100 to-brand-300"
                    style={{ transform: `scaleX(${Math.max(progress, 0.03)})` }}
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:mt-6 sm:gap-4 sm:pt-5">
                <p className="m-0 text-sm leading-6 text-sand-100/68 sm:text-base sm:leading-8">
                  Each stop shows how delivery, interface craft, and
                  client-facing design decisions evolved into a more premium
                  freelance offer.
                </p>
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="rounded-[18px] border border-white/8 bg-white/[0.03] p-3 sm:rounded-[22px] sm:p-4">
                    <span className="block text-[0.68rem] uppercase tracking-[0.18em] text-sand-100/46 sm:text-[0.72rem]">
                      Journey stops
                    </span>
                    <strong className="mt-1.5 block text-xl text-sand-50 sm:mt-2 sm:text-2xl">
                      {sceneData.allMilestones.length}
                    </strong>
                  </div>
                  <div className="rounded-[18px] border border-white/8 bg-white/[0.03] p-3 sm:rounded-[22px] sm:p-4">
                    <span className="block text-[0.68rem] uppercase tracking-[0.18em] text-sand-100/46 sm:text-[0.72rem]">
                      Focus
                    </span>
                    <strong className="mt-1.5 block text-sm leading-5 text-sand-50 sm:mt-2 sm:text-lg sm:leading-7">
                      Freelance positioning, UI direction, and premium delivery
                    </strong>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-4 inset-x-3 z-[2] flex justify-center sm:bottom-8 sm:right-8 sm:left-auto sm:justify-end">
          <Link
            className={`pointer-events-auto inline-flex min-h-11 w-full max-w-[15rem] items-center justify-center rounded-full border border-white/12 bg-ink-950/62 px-4 text-sm text-sand-50 shadow-panel backdrop-blur-[18px] transition duration-300 hover:-translate-y-0.5 hover:text-brand-100 sm:min-h-12 sm:w-auto sm:max-w-none sm:px-5 ${
              isSkipVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
            }`}
            to="/portfolio"
          >
            Skip to portfolio
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

export default HomePage;

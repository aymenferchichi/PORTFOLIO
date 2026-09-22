import { buildApiUrl } from "../config/api";

const defaultRepeatCount = 1;
const journeyXPositions = [-4.8, 4.8];
const journeyHeights = [2.55, 2.7, 2.8, 2.8, 2.95];
const journeyStartDepth = 12;
const journeyDepthStep = 40;
const journeySetGap = 18;

export const finalJourneyEntry = {
  slug: "next-chapter",
  year: "Next",
  title: "The next chapter is more selective",
  eyebrow: "Technical delivery",
  subcategory: "experience",
  client_label: "Selected teams and clients",
  project_scope: "Web delivery, UI/UX direction, and technical coordination",
  outcome_highlight:
    "The next step is more focused work across product, delivery, and interface quality.",
  detail:
    "The next step is a more selective body of work built around technical delivery leadership, stronger case studies, and clearer proof across design and execution.",
  accent: "#f3d9a2",
  summary:
    "The final card points toward a more focused portfolio: better case studies, stronger delivery proof, and selected work that shows how design and execution connect.",
  focus: [
    "Detailed case studies with clearer problem, process, and outcome framing.",
    "Selective work across product interfaces, web delivery, and operational support.",
    "A portfolio that presents trust, clarity, and execution reliability more clearly.",
  ],
  deliverables: [
    "Case studies",
    "Delivery leadership",
    "Web execution",
  ],
};

function normalizeJourneyEntry(entry, index) {
  return {
    slug: entry.slug,
    year: entry.year,
    title: entry.title,
    eyebrow: entry.eyebrow,
    subcategory: entry.subcategory || "experience",
    detail: entry.detail,
    summary: entry.summary,
    client_label: entry.client_label || "Selected client work",
    project_scope:
      entry.project_scope || "Interface design and front-end delivery",
    outcome_highlight: entry.outcome_highlight || entry.summary,
    focus: Array.isArray(entry.focus) ? entry.focus : [],
    deliverables: Array.isArray(entry.deliverables) ? entry.deliverables : [],
    accent: entry.accent || "#f0d6a4",
    display_order: entry.display_order ?? index + 1,
  };
}

function getSafeJourneyEntries(entries) {
  if (entries && entries.length > 0) {
    return entries.map(normalizeJourneyEntry);
  }

  return [];
}

export async function fetchJourneyEntries() {
  if (typeof fetch !== "function") {
    return [];
  }

  try {
    const response = await fetch(buildApiUrl("/journeys/"));

    if (!response.ok) {
      throw new Error("Unable to load journeys.");
    }

    const data = await response.json();
    return getSafeJourneyEntries(data);
  } catch {
    return [];
  }
}

export async function fetchJourneyEntry(slug) {
  if (slug === finalJourneyEntry.slug) {
    return finalJourneyEntry;
  }

  if (typeof fetch !== "function") {
    return null;
  }

  try {
    const response = await fetch(buildApiUrl(`/journeys/${slug}/`));

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Unable to load journey detail.");
    }

    const data = await response.json();
    return normalizeJourneyEntry(data, 0);
  } catch {
    return null;
  }
}

export function buildJourneyMilestones(
  entries,
  repeatCount = defaultRepeatCount,
) {
  const safeEntries = getSafeJourneyEntries(entries);
  const setOffset = safeEntries.length * journeyDepthStep + journeySetGap;

  return Array.from({ length: repeatCount }, (_, setIndex) =>
    safeEntries.map((entry, entryIndex) => ({
      ...entry,
      id: `${setIndex}-${entry.slug}`,
      position: [
        journeyXPositions[entryIndex % journeyXPositions.length],
        journeyHeights[Math.min(entryIndex, journeyHeights.length - 1)],
        -(
          journeyStartDepth +
          entryIndex * journeyDepthStep +
          setIndex * setOffset
        ),
      ],
    })),
  ).flat();
}

export function buildFinalJourneyMilestone(milestones) {
  const furthestMilestoneDepth = milestones.length
    ? Math.max(
        ...milestones.map((milestone) => Math.abs(milestone.position[2])),
      )
    : journeyStartDepth;

  return {
    ...finalJourneyEntry,
    id: "final-destination",
    position: [0, 3.15, -(furthestMilestoneDepth + 58)],
  };
}

export function buildJourneyScene(entries, finalCardStopOffset = 1) {
  const safeEntries = getSafeJourneyEntries(entries);
  const milestones = buildJourneyMilestones(safeEntries);
  const finalMilestone = buildFinalJourneyMilestone(milestones);
  const allMilestones = [...milestones, finalMilestone];
  const furthestDepth = Math.max(
    ...allMilestones.map((milestone) => Math.abs(milestone.position[2])),
  );

  return {
    journeys: safeEntries,
    milestones,
    finalMilestone,
    allMilestones,
    roadTravelDistance: Math.max(furthestDepth - finalCardStopOffset, 0),
  };
}

export function calculateScrollRunway(
  roadTravelDistance,
  { isMobile = false } = {},
) {
  if (isMobile) {
    return Math.max(2400, Math.round(roadTravelDistance * 9.5));
  }

  return Math.max(3200, Math.round(roadTravelDistance * 14));
}

export function findJourneyEntry(slug, entries = []) {
  if (slug === finalJourneyEntry.slug) {
    return finalJourneyEntry;
  }

  const safeEntries = getSafeJourneyEntries(entries);
  return safeEntries.find((entry) => entry.slug === slug) ?? null;
}

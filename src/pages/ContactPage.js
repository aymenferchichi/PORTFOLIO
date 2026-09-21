import { useState } from "react";
import {
  Eyebrow,
  Pill,
  Reveal,
  SectionHeading,
  Surface,
  fieldClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
} from "../components/SitePrimitives";
import { buildApiUrl } from "../config/api";

const contactOptions = [
  {
    title: "Email",
    text: "Use this when you want a direct reply about a portfolio site, landing page, redesign, or another client-facing web project.",
    action: "mailto:aymenferchichi1305@gmail.com",
    label: "aymenferchichi1305@gmail.com",
  },
  {
    title: "Availability",
    text: "Best suited for freelance clients, founders, and businesses that need design direction backed by dependable front-end delivery.",
    action: "mailto:aymenferchichi1305@gmail.com?subject=New%20Project",
    label: "Open to freelance and focused collaborations",
  },
];

const responseDetails = [
  "Best for portfolio websites, landing pages, and design-led refreshes",
  "Useful when the work needs both design direction and production-ready front-end execution",
  "Replies focus on scope, timing, priorities, and the clearest next step",
];

const contactSteps = [
  {
    title: "Share the brief",
    text: "Describe the audience, current friction, timeline, and what this project needs to improve.",
  },
  {
    title: "Get direction",
    text: "I reply with the clearest structure for the work, including what should change first and why.",
  },
  {
    title: "Move into scope",
    text: "If the fit is right, the conversation moves into scope, pacing, and the most useful deliverables.",
  },
];

const faqItems = [
  {
    question: "What kinds of teams are the best fit?",
    answer:
      "The strongest fit is freelance clients, founders, and businesses that already do good work but need a clearer, more polished online presence.",
  },
  {
    question: "Can you handle both design and front-end execution?",
    answer:
      "Yes. The work is designed to carry through from direction and page structure into responsive front-end implementation so quality does not get diluted in handoff.",
  },
  {
    question: "How quickly do projects usually start?",
    answer:
      "Smaller sprint work can often start faster. Larger engagements usually begin after a short discovery call, scope alignment, and delivery plan.",
  },
];

const initialFormData = {
  name: "",
  email: "",
  subject: "",
  phone: "",
  message: "",
};

const initialEstimatorState = {
  projectType: "homepage-redesign",
  pageScope: "3-5",
  timeline: "3-4-weeks",
  supportLevel: "design-build",
};

const estimatorOptions = {
  projectType: [
    { value: "homepage-redesign", label: "Homepage redesign" },
    { value: "website-refresh", label: "Website refresh" },
    { value: "pricing-page", label: "Pricing page optimization" },
    { value: "launch-page", label: "Launch page and rollout" },
  ],
  pageScope: [
    { value: "1-2", label: "1 to 2 pages" },
    { value: "3-5", label: "3 to 5 pages" },
    { value: "6+", label: "6+ pages" },
  ],
  timeline: [
    { value: "1-2-weeks", label: "1 to 2 weeks" },
    { value: "3-4-weeks", label: "3 to 4 weeks" },
    { value: "5+-weeks", label: "5+ weeks" },
  ],
  supportLevel: [
    { value: "strategy-only", label: "Strategy and direction" },
    { value: "design-build", label: "Design and front-end build" },
    { value: "launch-support", label: "Design, build, and launch support" },
  ],
};

const estimateMatrix = {
  "homepage-redesign": { base: 1800, label: "Focused page refresh" },
  "website-refresh": { base: 3600, label: "Website refinement" },
  "pricing-page": { base: 2200, label: "Pricing page refresh" },
  "launch-page": { base: 5200, label: "Full project partner" },
};

const scopeMultipliers = {
  "1-2": 1,
  "3-5": 1.35,
  "6+": 1.75,
};

const timelineMultipliers = {
  "1-2-weeks": 1.2,
  "3-4-weeks": 1,
  "5+-weeks": 0.95,
};

const supportMultipliers = {
  "strategy-only": 0.78,
  "design-build": 1,
  "launch-support": 1.32,
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildEstimate(estimatorState) {
  const baseConfig = estimateMatrix[estimatorState.projectType];
  const scopeMultiplier = scopeMultipliers[estimatorState.pageScope];
  const timelineMultiplier = timelineMultipliers[estimatorState.timeline];
  const supportMultiplier = supportMultipliers[estimatorState.supportLevel];
  const estimatedBase = Math.round(
    baseConfig.base * scopeMultiplier * timelineMultiplier * supportMultiplier,
  );
  const minimum = Math.round(estimatedBase * 0.9);
  const maximum = Math.round(estimatedBase * 1.18);

  return {
    label: baseConfig.label,
    minimum,
    maximum,
    summary: `${baseConfig.label} estimated at ${formatCurrency(minimum)} to ${formatCurrency(maximum)}`,
  };
}

function buildEstimatorNotes(estimatorState, estimate) {
  return [
    "",
    "Scope estimator:",
    `- Project type: ${estimatorOptions.projectType.find((item) => item.value === estimatorState.projectType)?.label}`,
    `- Page scope: ${estimatorOptions.pageScope.find((item) => item.value === estimatorState.pageScope)?.label}`,
    `- Timeline: ${estimatorOptions.timeline.find((item) => item.value === estimatorState.timeline)?.label}`,
    `- Support level: ${estimatorOptions.supportLevel.find((item) => item.value === estimatorState.supportLevel)?.label}`,
    `- Estimated range: ${formatCurrency(estimate.minimum)} to ${formatCurrency(estimate.maximum)}`,
  ].join("\n");
}

function EstimatorField({ label, name, value, onChange, options }) {
  return (
    <label className="grid gap-2 text-sm text-sand-50">
      <span>{label}</span>
      <select
        className={fieldClassName}
        name={name}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ContactPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [estimatorState, setEstimatorState] = useState(initialEstimatorState);
  const [submitState, setSubmitState] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const estimate = buildEstimate(estimatorState);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleEstimatorChange = (event) => {
    const { name, value } = event.target;

    setEstimatorState((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });

    const submissionData = {
      ...formData,
      message: `${formData.message}${buildEstimatorNotes(estimatorState, estimate)}`,
      subject: `${formData.subject} | ${estimate.label}`,
      estimator_project_type:
        estimatorOptions.projectType.find(
          (item) => item.value === estimatorState.projectType,
        )?.label || "",
      estimator_page_scope:
        estimatorOptions.pageScope.find(
          (item) => item.value === estimatorState.pageScope,
        )?.label || "",
      estimator_timeline:
        estimatorOptions.timeline.find(
          (item) => item.value === estimatorState.timeline,
        )?.label || "",
      estimator_support_level:
        estimatorOptions.supportLevel.find(
          (item) => item.value === estimatorState.supportLevel,
        )?.label || "",
      estimator_budget_min: estimate.minimum,
      estimator_budget_max: estimate.maximum,
    };

    try {
      const response = await fetch(buildApiUrl("/contacts/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || "Unable to send your message right now.",
        );
      }

      const responseData = await response.json();

      setFormData(initialFormData);
      if (responseData.delivery_warning) {
        setSubmitState({
          type: "warning",
          message: `${responseData.delivery_warning} Your project inquiry is still saved in the system.`,
        });
      } else {
        setSubmitState({
          type: "success",
          message: "Your message has been sent. I will get back to you soon.",
        });
      }
    } catch (error) {
      setSubmitState({
        type: "error",
        message:
          error.message || "Something went wrong while sending the message.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-10 pt-6 lg:space-y-14">
      <SectionHeading
        eyebrow="Contact"
        title="Start the conversation if your portfolio, website, or client-facing pages need a more polished presentation."
        description="Use the form for redesigns, landing pages, portfolio improvements, or broader website work. The message is stored by the backend and delivered directly through the Django API."
        aside={
          <div className="flex flex-wrap justify-start gap-3 lg:justify-end">
            <Pill>Portfolio redesigns</Pill>
            <Pill>Landing pages</Pill>
            <Pill>UI refresh work</Pill>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.12fr)_minmax(300px,0.88fr)]">
        <Reveal delay={0.05}>
          <Surface className="space-y-6 overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,255,255,0.74))]">
            <div className="space-y-3">
              <Eyebrow>Send a message</Eyebrow>
              <h2 className="font-display text-[clamp(2rem,3.8vw,3.2rem)] leading-[0.98] tracking-[-0.035em] text-sand-50">
                Project inquiry form
              </h2>
              <p className="max-w-[42ch] text-[0.98rem] leading-7 text-sand-100">
                Share the goal, timeline, audience, and what needs to improve so
                the response can move quickly into the right solution.
              </p>
            </div>

            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 rounded-[24px] border border-sand-200/24 bg-brand-300/10 p-4 sm:grid-cols-2">
                <EstimatorField
                  label="Project type"
                  name="projectType"
                  value={estimatorState.projectType}
                  onChange={handleEstimatorChange}
                  options={estimatorOptions.projectType}
                />
                <EstimatorField
                  label="Page scope"
                  name="pageScope"
                  value={estimatorState.pageScope}
                  onChange={handleEstimatorChange}
                  options={estimatorOptions.pageScope}
                />
                <EstimatorField
                  label="Desired timeline"
                  name="timeline"
                  value={estimatorState.timeline}
                  onChange={handleEstimatorChange}
                  options={estimatorOptions.timeline}
                />
                <EstimatorField
                  label="Support level"
                  name="supportLevel"
                  value={estimatorState.supportLevel}
                  onChange={handleEstimatorChange}
                  options={estimatorOptions.supportLevel}
                />
              </div>

              <div className="rounded-[24px] border border-brand-100/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(242,211,162,0.34))] p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <Eyebrow>Estimated scope</Eyebrow>
                    <h3 className="mt-3 font-display text-[1.7rem] leading-tight tracking-[-0.03em] text-sand-50">
                      {estimate.label}
                    </h3>
                  </div>
                  <div className="sm:text-right">
                    <p className="m-0 text-xs uppercase tracking-[0.16em] text-sand-100/60">
                      Estimated investment
                    </p>
                    <strong className="mt-2 block font-display text-[1.9rem] tracking-[-0.04em] text-brand-100">
                      {formatCurrency(estimate.minimum)} -{" "}
                      {formatCurrency(estimate.maximum)}
                    </strong>
                  </div>
                </div>
                <p className="mb-0 mt-4 text-sm leading-7 text-sand-100">
                  This is a directional range, not a final quote. It is
                  calculated from scope, timeline, and support level, then
                  attached to your inquiry so the reply can start from a
                  realistic bracket.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-sand-50">
                  <span>Name</span>
                  <input
                    className={fieldClassName}
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </label>

                <label className="grid gap-2 text-sm text-sand-50">
                  <span>Email</span>
                  <input
                    className={fieldClassName}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <label className="grid gap-2 text-sm text-sand-50">
                  <span>Subject</span>
                  <input
                    className={fieldClassName}
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Portfolio redesign, landing page, business site..."
                    required
                  />
                </label>

                <label className="grid gap-2 text-sm text-sand-50">
                  <span>Phone</span>
                  <input
                    className={fieldClassName}
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Optional"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm text-sand-50">
                <span>Message</span>
                <textarea
                  className={`${fieldClassName} min-h-[180px] resize-y`}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="What are you building, what feels weak right now, and what outcome do you need?"
                  rows="6"
                  required
                />
              </label>

              <button
                className={`${primaryButtonClassName} w-full border-0 sm:w-auto`}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Request project details"}
              </button>

              {submitState.message ? (
                <p
                  className={`m-0 rounded-[22px] px-4 py-3.5 leading-7 ${
                    submitState.type === "success"
                      ? "bg-emerald-100 text-emerald-700"
                      : submitState.type === "warning"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {submitState.message}
                </p>
              ) : null}
            </form>
          </Surface>
        </Reveal>

        <div className="grid gap-5">
          <Reveal delay={0.1}>
            <Surface className="bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,255,255,0.74))]">
              <Eyebrow>What happens next</Eyebrow>
              <h3 className="mt-4 font-display text-[1.7rem] leading-tight tracking-[-0.03em] text-sand-50">
                Clear, direct, and built to get to scope quickly.
              </h3>
              <div className="mt-5 grid gap-3">
                {contactSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-[22px] border border-sand-200/24 bg-white/80 p-4"
                  >
                    <p className="m-0 text-xs uppercase tracking-[0.18em] text-brand-100/80">
                      Step {String(index + 1).padStart(2, "0")}
                    </p>
                    <h4 className="mb-0 mt-2 font-display text-xl tracking-[-0.03em] text-sand-50">
                      {step.title}
                    </h4>
                    <p className="mb-0 mt-2 text-sm leading-7 text-sand-100">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </Surface>
          </Reveal>

          <Reveal delay={0.12}>
            <Surface>
              <Eyebrow>Best fit</Eyebrow>
              <div className="mt-5 flex flex-wrap gap-3">
                {responseDetails.map((detail) => (
                  <Pill key={detail} className="min-h-11 px-4 text-sm">
                    {detail}
                  </Pill>
                ))}
              </div>
              <div className="mt-6">
                <a
                  className={secondaryButtonClassName}
                  href="mailto:aymenferchichi1305@gmail.com"
                >
                  Email directly instead
                </a>
              </div>
            </Surface>
          </Reveal>

          {contactOptions.map((option, index) => (
            <Reveal key={option.title} delay={0.14 + index * 0.05}>
              <Surface>
                <Eyebrow>{option.title}</Eyebrow>
                <h3 className="mt-4 font-display text-[1.9rem] leading-tight tracking-[-0.04em] text-sand-50">
                  {option.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-sand-100">
                  {option.text}
                </p>
                <a
                  className="mt-4 inline-flex text-brand-100 transition hover:text-sand-50"
                  href={option.action}
                >
                  {option.label}
                </a>
              </Surface>
            </Reveal>
          ))}

          <Reveal delay={0.24}>
            <Surface>
              <Eyebrow>Backend note</Eyebrow>
              <h3 className="mt-4 font-display text-[1.9rem] leading-tight tracking-[-0.04em] text-sand-50">
                Email delivery
              </h3>
              <p className="mt-4 text-base leading-8 text-sand-100">
                The backend stores each submission, including the estimator
                details, and forwards it to your inbox through the Django API so
                this works like a real project intake instead of a front-end
                mock.
              </p>
            </Surface>
          </Reveal>

          <Reveal delay={0.28}>
            <Surface>
              <Eyebrow>FAQ</Eyebrow>
              <h3 className="mt-4 font-display text-[1.7rem] leading-tight tracking-[-0.03em] text-sand-50">
                Common questions before booking
              </h3>
              <div className="mt-5 grid gap-3">
                {faqItems.map((item) => (
                  <div
                    key={item.question}
                    className="rounded-[22px] border border-sand-200/24 bg-white/80 p-4"
                  >
                    <p className="m-0 text-sm font-semibold text-sand-50">
                      {item.question}
                    </p>
                    <p className="mb-0 mt-2 text-sm leading-7 text-sand-100">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </Surface>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;

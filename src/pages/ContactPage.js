import { useState } from "react";
import {
  Eyebrow,
  Reveal,
  SectionHeading,
  Surface,
  fieldClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
} from "../components/SitePrimitives";
import { buildApiUrl } from "../config/api";

const contactSteps = [
  {
    title: "Share the brief",
    text: "Describe the goal, current friction, timeline, and what needs to improve.",
  },
  {
    title: "Review the direction",
    text: "I reply with the clearest structure for the work, including priorities, risks, and next steps.",
  },
  {
    title: "Align on delivery",
    text: "If the fit is right, the conversation moves into scope, pacing, ownership, and delivery support.",
  },
];

const initialFormData = {
  name: "",
  email: "",
  subject: "",
  phone: "",
  message: "",
};

function ContactPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [submitState, setSubmitState] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });

    try {
      const response = await fetch(buildApiUrl("/contacts/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
        title="Start the conversation if your website, product flow, or delivery process needs clearer execution."
        description="Use the form for web projects, UI/UX support, or broader delivery conversations. The message is stored by the backend and delivered through the Django API."
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.12fr)_minmax(300px,0.88fr)]">
        <Reveal delay={0.05}>
          <Surface className="space-y-6 overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,255,255,0.74))]">
            <div className="space-y-3">
              <Eyebrow>Send a message</Eyebrow>
              <h2 className="font-display text-[clamp(2rem,3.8vw,3.2rem)] leading-[0.98] tracking-[-0.035em] text-sand-50">
                Project inquiry
              </h2>
              <p className="max-w-[42ch] text-[0.98rem] leading-7 text-sand-100">
                Share the goal, timeline, current friction, and what needs to
                move.
              </p>
            </div>

            <form className="grid gap-5" onSubmit={handleSubmit}>
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
                {isSubmitting ? "Sending..." : "Send inquiry"}
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
                Simple, direct, and built around clear next steps.
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
              <Eyebrow>Direct contact</Eyebrow>
              <h3 className="mt-4 font-display text-[1.9rem] leading-tight tracking-[-0.04em] text-sand-50">
                Email
              </h3>
              <p className="mt-4 text-base leading-8 text-sand-100">
                For direct questions or project context, email works just as
                well.
              </p>
              <div className="mt-6">
                <a
                  className={secondaryButtonClassName}
                  href="mailto:aymenferchichi1305@gmail.com"
                >
                  aymenferchichi1305@gmail.com
                </a>
              </div>
            </Surface>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;

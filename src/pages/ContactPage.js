import { useState } from "react";
import {
  Eyebrow,
  Reveal,
  SectionHeading,
  Surface,
  fieldClassName,
  primaryButtonClassName,
} from "../components/SitePrimitives";
import { buildApiUrl } from "../config/api";

const contactOptions = [
  {
    title: "Email",
    text: "Use this for project inquiries, freelance requests, or collaborations when you want a direct reply.",
    action: "mailto:aymenferchichi1305@gmail.com",
    label: "aymenferchichi1305@gmail.com",
  },
  {
    title: "Availability",
    text: "Best suited for brands, founders, and teams who want both design direction and execution.",
    action: "mailto:aymenferchichi1305@gmail.com?subject=New%20Project",
    label: "Freelance and collaboration friendly",
  },
];

const responseDetails = [
  "Best for portfolio websites, landing pages, and visual refresh work",
  "Useful if you need both design direction and front-end execution",
  "Typical replies can include scope, timing, and the most effective format for the project",
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
        title="Ready when the project needs polish, direction, and a more premium surface."
        description="Use the form for portfolio sites, product interfaces, brand visuals, or campaign edits. The message is stored by the backend and delivered directly through the Django API."
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.12fr)_minmax(300px,0.88fr)]">
        <Reveal delay={0.05}>
          <Surface className="space-y-6">
            <div className="space-y-3">
              <Eyebrow>Send a message</Eyebrow>
              <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[0.96] tracking-[-0.04em] text-sand-50">
                Project inquiry form
              </h2>
              <p className="max-w-[34ch] text-base leading-8 text-sand-100/70">
                Share the goal, timeline, and the level of polish you are aiming
                for.
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
                    placeholder="What do you need help with?"
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
                  placeholder="Tell me about your project, timeline, and goals."
                  rows="6"
                  required
                />
              </label>

              <button
                className={`${primaryButtonClassName} w-full border-0 sm:w-auto`}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send message"}
              </button>

              {submitState.message ? (
                <p
                  className={`m-0 rounded-[20px] px-4 py-3.5 leading-7 ${
                    submitState.type === "success"
                      ? "bg-emerald-500/14 text-emerald-100"
                      : submitState.type === "warning"
                        ? "bg-amber-300/14 text-amber-100"
                        : "bg-rose-500/14 text-rose-100"
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
            <Surface className="bg-[linear-gradient(145deg,rgba(241,211,160,0.1),rgba(255,255,255,0.03))]">
              <Eyebrow>Response style</Eyebrow>
              <h3 className="mt-4 font-display text-3xl leading-tight tracking-[-0.03em] text-sand-50">
                Clear, direct, and project-first.
              </h3>
              <ul className="mt-5 space-y-3 pl-5 text-base leading-8 text-sand-100/70">
                {responseDetails.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </Surface>
          </Reveal>

          {contactOptions.map((option, index) => (
            <Reveal key={option.title} delay={0.14 + index * 0.05}>
              <Surface>
                <Eyebrow>{option.title}</Eyebrow>
                <h3 className="mt-4 font-display text-[1.9rem] leading-tight tracking-[-0.03em] text-sand-50">
                  {option.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-sand-100/70">
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
              <h3 className="mt-4 font-display text-[1.9rem] leading-tight tracking-[-0.03em] text-sand-50">
                Email delivery
              </h3>
              <p className="mt-4 text-base leading-8 text-sand-100/70">
                The backend already stores submissions and forwards them to your
                inbox through the Django API, so this page functions like a real
                project entry point instead of a front-end mock.
              </p>
            </Surface>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;

"use client";

/**
 * The "Request a Quote" form. What each box accepts and what gets sent
 * live in lib/formRules.ts; where it goes, in lib/submitContact.ts. This
 * file collects, runs the anti-spam checks, and tells the visitor what
 * happened — truthfully, inline, with a loading state while it sends
 * (the old TODO list's items 6 and 7).
 *
 * Markup kept from the old form: every <label for>/id pair, maxlength on
 * every box, the honeypot checkbox with aria-hidden, tabindex="-1" and
 * autocomplete="off", and a live region for the result.
 */
import { useEffect, useRef, useState, type FormEvent } from "react";
import { client } from "@/client.config";
import { serviceOptions } from "@/content/services";
import { timelines } from "@/content/timelines";
import { filter, LIMITS, serializeContact, validateContact, type ContactFields } from "@/lib/formRules";
import { fill } from "@/lib/phone";
import { canSend, recordSend } from "@/lib/rateLimit";
import { submitContact } from "@/lib/submitContact";

const f = client.form;

const EMPTY: ContactFields = { name: "", email: "", phone: "", service: "", timeline: "", location: "", message: "" };
type Key = keyof ContactFields;

/**
 * A person needs longer than this between the page loading and pressing
 * Submit; a script filling every field at once doesn't. Told to try
 * again rather than silently dropped, so a fast human loses nothing.
 */
const MIN_FILL_MS = 3_000;

const FILTERED: Partial<Record<Key, (v: string) => string>> = {
  name: filter.name,
  email: filter.email,
  phone: filter.phone,
  location: filter.location,
  message: filter.message,
};

type State = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [form, setForm] = useState<ContactFields>(EMPTY);
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const honeypot = useRef<HTMLInputElement>(null);
  const status = useRef<HTMLDivElement>(null);
  const shownAt = useRef(0);
  // Until the page's JavaScript runs, Submit is disabled: a click before
  // then would be a plain browser POST that skips every check.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    shownAt.current = Date.now();
    setReady(true);
  }, []);

  // Bring the result into view: the old form scrolled to it after reset.
  useEffect(() => {
    if (state === "success" || state === "error") status.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [state]);

  const set = (k: Key) => (e: { target: { value: string } }) => {
    const raw = e.target.value;
    const value = FILTERED[k] ? FILTERED[k]!(raw) : raw;
    setForm((prev) => ({ ...prev, [k]: value }));
    // The confirmation stays until the visitor starts another request.
    setState((s) => (s === "success" ? "idle" : s));
  };

  const fail = (msg: string) => {
    setState("error");
    setError(fill(msg));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    const now = Date.now();

    // Native `required` stops an empty submit in any real browser; this
    // is the same check for anything that bypasses it.
    if (!(form.name && form.email && form.phone && form.service && form.timeline)) return;

    const problem = validateContact(form);
    if (problem) return fail(problem);

    // Anti-spam, cheapest first.
    if (now - shownAt.current < MIN_FILL_MS) return fail(f.errors.tooFast);
    if (!canSend(now)) return fail(f.errors.rateLimited);

    recordSend(now);
    setState("sending");
    setError("");

    const result = await submitContact({
      fields: serializeContact(form),
      botcheck: honeypot.current?.checked ?? false,
    });

    if (result.ok) {
      setState("success");
      setForm(EMPTY);
    } else {
      fail(result.error);
    }
  }

  const field = (k: "name" | "email" | "phone" | "location", type: string, extra: Record<string, unknown> = {}) => (
    <input
      type={type}
      id={IDS[k]}
      name={IDS[k]}
      maxLength={LIMITS[k]}
      placeholder={f.placeholders[k]}
      value={form[k]}
      onChange={set(k)}
      {...extra}
    />
  );

  return (
    <form id="contactForm" className="contact-form" method="post" onSubmit={onSubmit}>
      {/* Honeypot: hidden from people, catches bots (Web3Forms' own field name). */}
      <input
        ref={honeypot}
        type="checkbox"
        name="botcheck"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="form-row">
        <div className="form-group">
          <label htmlFor={IDS.name}>{f.labels.name}</label>
          {field("name", "text", { required: true, autoComplete: "name" })}
        </div>
        <div className="form-group">
          <label htmlFor={IDS.email}>{f.labels.email}</label>
          {field("email", "email", { required: true, autoComplete: "email", inputMode: "email", spellCheck: false })}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor={IDS.phone}>{f.labels.phone}</label>
          {field("phone", "tel", { required: true, autoComplete: "tel", inputMode: "tel" })}
        </div>
        <div className="form-group">
          <label htmlFor={IDS.service}>{f.labels.service}</label>
          <select id={IDS.service} name={IDS.service} required value={form.service} onChange={set("service")}>
            <option value="">{f.placeholders.service}</option>
            {serviceOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor={IDS.timeline}>{f.labels.timeline}</label>
          <select id={IDS.timeline} name={IDS.timeline} required value={form.timeline} onChange={set("timeline")}>
            <option value="">{f.placeholders.timeline}</option>
            {timelines.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor={IDS.location}>{f.labels.location}</label>
          {field("location", "text", { autoComplete: "address-level2" })}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor={IDS.message}>{f.labels.message}</label>
        <textarea
          id={IDS.message}
          name={IDS.message}
          rows={5}
          maxLength={LIMITS.message}
          placeholder={f.placeholders.message}
          value={form.message}
          onChange={set("message")}
        />
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="submit-button"
          disabled={!ready || state === "sending"}
          aria-busy={state === "sending"}
        >
          {state === "sending" && (
            <span aria-hidden="true" className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {state === "sending" ? f.sending : f.submit}
        </button>
        <p className="form-disclaimer">{f.disclaimer}</p>

        {/* Inline result. aria-live announces it to screen readers. */}
        <div ref={status} role="status" aria-live="polite">
          {state === "sending" && <div className="form-status form-status--sending">{f.sendingStatus}</div>}
          {state === "success" && <div className="form-status form-status--success">✓ {fill(f.success)}</div>}
          {state === "error" && (
            <div className="form-status form-status--error" role="alert">
              {error}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

/** The old form's ids and field names, kept so label pairings are unchanged. */
const IDS = {
  name: "fullName",
  email: "email",
  phone: "phone",
  service: "service",
  timeline: "timeline",
  location: "location",
  message: "projectDescription",
} as const;

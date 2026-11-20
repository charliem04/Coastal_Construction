/**
 * ════════════════════════════════════════════════════════════════════
 *  CONTACT SUBMIT — where a quote request actually goes.
 *
 *  Today: Web3Forms. Later: Haptic Forms, when it is finished.
 *  Swapping providers is the one PROVIDER line below plus an env var.
 *  Nothing in components/ knows which provider is in use — the form
 *  calls submitContact() and renders what comes back.
 *
 *  Straight to the provider from the browser: no server, no Worker, no
 *  relay (Web3Forms' free plan refuses server-side calls). What is sent
 *  is decided in lib/formRules.ts — validated, scrubbed of control
 *  characters, and serialized from a fixed list of keys.
 *
 *  ── ABOUT THE ACCESS KEY ────────────────────────────────────────────
 *
 *  It used to sit in contact.html. Now it is NEXT_PUBLIC_WEB3FORMS_KEY
 *  in .env.local (see .env.example) and is compiled into the page's
 *  JavaScript at build time. That is by design on Web3Forms' side — the
 *  key names a destination inbox and grants no account access, so it
 *  is public and is not rotated. It lives in the environment (and in
 *  Cloudflare's build variables) so that each build says where it sends.
 *
 *  ── FAILURE IS LOUD ─────────────────────────────────────────────────
 *
 *  A quote form that silently drops a submission behind a success
 *  message is the worst bug this site can have. Unconfigured, rejected,
 *  or offline: every one of those returns ok:false with a message that
 *  tells the visitor to call. The ONLY path that reports success
 *  without sending is the honeypot, and that is the point of one.
 * ════════════════════════════════════════════════════════════════════
 */
import { client } from "@/client.config";
import type { SerializedContact } from "@/lib/formRules";
import { fill } from "@/lib/phone";

export type FormProvider = "web3forms" | "hapticforms";

/** ← The one line to change when Haptic Forms is ready. */
const PROVIDER: FormProvider = "web3forms";

export type ContactPayload = {
  /** Validated and built by serializeContact() in lib/formRules.ts. */
  fields: SerializedContact;
  /** The honeypot checkbox — checked only by bots. */
  botcheck: boolean;
};

export type SubmitResult = { ok: true } | { ok: false; error: string };

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

const f = client.form;
const NOT_SENT = () => fill(f.errors.notSent);
const NETWORK = () => fill(f.errors.network);

/** Whether this build has anywhere to send a lead. */
export function contactConfigured(): boolean {
  switch (PROVIDER) {
    case "web3forms":
      return WEB3FORMS_KEY.length > 0;
    case "hapticforms":
      return false;
  }
}

export async function submitContact({ fields, botcheck }: ContactPayload): Promise<SubmitResult> {
  /*
   * Honeypot: report success so bots don't learn they were caught, but
   * send nothing. A false positive here — a real lead thrown away
   * behind a green tick — is the most expensive bug on the site, so it
   * says so in development, where somebody is watching.
   */
  if (botcheck) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[contact] honeypot is checked — this submission was DISCARDED.");
    }
    return { ok: true };
  }

  switch (PROVIDER) {
    case "web3forms":
      return sendWeb3Forms(fields);
    case "hapticforms":
      console.error("[contact] PROVIDER is hapticforms, which is not implemented yet.");
      return { ok: false, error: NOT_SENT() };
  }
}

/** The plain-text email body the office reads — the old form's layout. */
function emailBody(v: SerializedContact): string {
  return [
    f.emailIntro,
    "",
    "CONTACT",
    "-------",
    "Name:    " + v.name,
    "Phone:   " + v.phone,
    "Email:   " + v.email,
    "",
    "PROJECT",
    "-------",
    "Service:  " + v.service,
    "Timeline: " + v.timeline,
    "Location: " + (v.location || f.locationFallback),
    "",
    "Details:",
    v.message || f.messageFallback,
  ].join("\n");
}

async function sendWeb3Forms(v: SerializedContact): Promise<SubmitResult> {
  if (!WEB3FORMS_KEY) {
    // Unconfigured is a deploy bug. Say so, and send the visitor to the phone.
    console.error("[contact] NEXT_PUBLIC_WEB3FORMS_KEY is not set — this submission was NOT delivered.");
    return { ok: false, error: NOT_SENT() };
  }

  // Every key spelled out: the request carries these and nothing else.
  // The field names are the old form's, so the notification email reads
  // exactly as it did.
  const body = {
    access_key: WEB3FORMS_KEY,
    subject: f.emailSubject,
    from_name: f.emailFromName,
    botcheck: false,
    fullName: v.name,
    // Web3Forms uses `email` as the reply-to: replying reaches the customer.
    email: v.email,
    phone: v.phone,
    service: v.service,
    timeline: v.timeline,
    location: v.location,
    projectDescription: v.message,
    message: emailBody(v),
  };

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      credentials: "omit",
      redirect: "error",
    });
    // Web3Forms answers 200 with {success:false} for its own rejections
    // (bad key, spam heuristics), so the status alone is not the answer.
    const data = await res.json().catch(() => null);
    if (!res.ok || !data || data.success !== true) {
      console.error("[contact] Web3Forms rejected the submission:", data?.message ?? res.status);
      return { ok: false, error: NOT_SENT() };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: NETWORK() };
  }
}

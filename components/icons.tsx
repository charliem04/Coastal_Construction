/**
 * The site's icons: red line art with a white detail and a small survey
 * tick, on one 48px grid. Decorative, because each sits beside a label.
 */
import type { ReactNode } from "react";

function Icon({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      className={`site-icon ${className ?? ""}`}
      viewBox="0 0 48 48"
      fill="none"
      strokeWidth="2.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const Tick = () => <path className="icon-white" d="M38 4v8M34 8h8" />;

export function PhoneIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path className="icon-red" d="M13 6h7l3 10-5 4c2 5 5 8 10 10l4-5 10 3v7c0 3-2 5-5 5C20 40 8 28 8 11c0-3 2-5 5-5Z" />
      <Tick />
    </Icon>
  );
}

export function MailIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path className="icon-red" d="M6 13h36v25H6z" />
      <path className="icon-white" d="m7 15 17 13 17-13" />
    </Icon>
  );
}

export function CalendarIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path className="icon-red" d="M7 10h34v30H7zM7 19h34" />
      <path className="icon-white" d="M15 6v8M33 6v8M15 27h5M28 27h5M15 34h5" />
    </Icon>
  );
}

export function PinIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path className="icon-red" d="M24 44S39 29 39 19a15 15 0 0 0-30 0c0 10 15 25 15 25Z" />
      <path className="icon-white" d="M24 12v14M17 19h14" />
    </Icon>
  );
}

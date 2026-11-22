/** On the contact page the quote button jumps to the form already there. */
export function quoteHref(pathname: string): "/contact" | "#contact-form" {
  return pathname === "/contact" ? "#contact-form" : "/contact";
}

const NON_TEXT_INPUTS = new Set(["button", "checkbox", "color", "file", "hidden", "image", "radio", "range", "reset", "submit"]);

/** True for a control that opens the on-screen keyboard or picker. */
export function isTextEntry(tagName: string | undefined, type?: string): boolean {
  if (tagName === "TEXTAREA" || tagName === "SELECT") return true;
  return tagName === "INPUT" && !NON_TEXT_INPUTS.has((type ?? "text").toLowerCase());
}

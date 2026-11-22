export type TransitionInput = {
  href: string;
  origin: string;
  currentPath: string;
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  target?: string;
  download: boolean;
  reducedMotion: boolean;
};

const normalise = (path: string) => path.replace(/\/+$/, "") || "/";

/** Only a plain click to a different page on this site gets the blade. */
export function shouldRunTransition(input: TransitionInput): boolean {
  if (input.reducedMotion || input.download || input.button !== 0) return false;
  if (input.metaKey || input.ctrlKey || input.shiftKey || input.altKey) return false;
  if (input.target && input.target !== "_self") return false;
  let url: URL;
  try {
    url = new URL(input.href, input.origin);
  } catch {
    return false;
  }
  if (url.origin !== input.origin) return false;
  return normalise(url.pathname) !== normalise(input.currentPath);
}

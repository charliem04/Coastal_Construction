/**
 * Motion tokens: one vocabulary for every animated component, so nothing
 * in components/ invents a duration of its own. The CSS side of the same
 * curve is --ease-punch in app/globals.css.
 *
 * Reduced motion keeps the fade and drops the travel (app/globals.css).
 */
export const motionEase = [0.2, 0.8, 0.2, 1] as const;

export const motionTiming = {
  /** Seconds between siblings in a staggered entrance. */
  stagger: 0.09,
  /** Hover and focus responses. */
  hover: 0.3,
} as const;

export const reveal = {
  rise: 26,
  duration: 0.7,
  ease: motionEase,
  viewport: { once: true, amount: 0.1, margin: "0px 0px -15% 0px" },
} as const;

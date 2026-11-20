/**
 * Motion tokens. The old site had one scroll animation, used twice:
 * a block fades in and rises 30px over 0.7s, ease-out, once, as it
 * enters the viewport. Reduced motion keeps the fade and drops the rise
 * (app/globals.css), as the old reduced-motion block effectively did.
 */
export const reveal = {
  rise: 30,
  duration: 0.7,
  ease: "easeOut",
  viewport: { once: true, amount: 0.1, margin: "0px 0px -15% 0px" },
} as const;

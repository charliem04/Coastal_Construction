/**
 * The review ribbon under "Why choose Coastal?" on the home page.
 *
 * Moved verbatim from index.html, where the six were written out twice
 * so the ribbon could loop (components/Reviews renders the list twice
 * instead). The hand-copied second set had drifted in one place —
 * Robert L.'s "Professional work" became "Professional team" — the first
 * spelling is kept.
 *
 * TODO(charlie): these need confirming as real customer reviews before
 * launch — the TODO list still has "reviews from previous customers"
 * open, which suggests these are placeholders. Published testimonials
 * that aren't real are an FTC problem (16 CFR Part 465, in force since
 * Oct 2024), not just a style one. They are deliberately NOT in the
 * structured data. If they aren't real, delete the records and the
 * ribbon disappears on its own (Reviews renders nothing for an empty
 * list).
 */
import type { Review } from "./types";

export const reviews: Review[] = [
  {
    quote: "Excellent work on our pond construction. Professional, on-time, and exceeded our expectations!",
    author: "Mike T., Lafayette",
  },
  {
    quote: "Best dirt work company in Acadiana. They leveled our property perfectly for our new home.",
    author: "Sarah M., New Iberia",
  },
  {
    quote: "Great service! They cleared 5 acres for us and the price was very fair. Highly recommend!",
    author: "John D., Abbeville",
  },
  {
    quote: "Professional work, quality equipment, and excellent results. Will definitely use them again.",
    author: "Robert L., Youngsville",
  },
  {
    quote: "They installed our culvert perfectly. Great communication throughout the entire project.",
    author: "Lisa K., Broussard",
  },
  {
    quote: "Outstanding work on our site pad. These guys know what they're doing!",
    author: "David P., Scott",
  },
];

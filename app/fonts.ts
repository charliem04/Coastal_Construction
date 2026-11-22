import localFont from "next/font/local";

/** Anton: the big type. Headlines, section headings, stats. */
export const anton = localFont({
  src: "./fonts/anton-latin-400-normal.woff2",
  weight: "400",
  display: "swap",
  adjustFontFallback: "Arial",
  variable: "--font-anton",
});

/** Barlow Condensed: the small type. Buttons, nav, labels. */
export const barlowCondensed = localFont({
  src: "./fonts/barlow-condensed-latin-700-normal.woff2",
  weight: "700",
  display: "swap",
  adjustFontFallback: "Arial",
  variable: "--font-barlow",
});

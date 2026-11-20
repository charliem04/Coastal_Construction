/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: `npm run build` emits ./out, which wrangler.jsonc
  // serves as Workers static assets. No server runtime, no adapter.
  output: "export",

  // /services, /about, /contact — the URLs the live site serves today.
  // The export writes services.html etc., and Workers static assets
  // serves them extensionless (html_handling "auto-trailing-slash").
  // public/_redirects 301s the old /services.html-style links.
  trailingSlash: false,

  images: {
    // No image server on a static export. Instead every photo is
    // pre-cut by scripts/images.mjs into the widths listed here, and
    // lib/imageLoader.ts points each srcset entry at the matching file.
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
    deviceSizes: [640, 960, 1600],
    imageSizes: [320],
  },

  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;

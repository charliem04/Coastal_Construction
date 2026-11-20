import Link from "next/link";
import { client } from "@/client.config";

/**
 * The year is the build year, rendered into the HTML — the old site
 * set it with an inline script after load. Every deploy is a build, so
 * it can only be stale if nothing has shipped all year.
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <p>
        &copy; {year} {client.footer.line}
      </p>
      <p className="mt-2 text-sm">
        <Link href="/privacy">{client.footer.privacy}</Link>
      </p>
    </footer>
  );
}

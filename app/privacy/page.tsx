import type { Metadata } from "next";
import { client } from "@/client.config";
import { PageHeader } from "@/components/PageHeader";
import { phoneDisplay, phoneHref } from "@/lib/phone";

/*
 * New page: the quote form collects personal data, so the site needs a
 * notice. It describes what the site actually does — one form, posted to
 * Web3Forms and emailed to the office; Cal.com for booking; a Google Maps
 * embed; Cloudflare Web Analytics (cookieless); no cookies of our own.
 *
 * Approved by the client, Nov 2026. Update it whenever the site starts
 * collecting anything new. (Google reviews, when added, are fetched at
 * build time and collect nothing from visitors.)
 */

export const metadata: Metadata = {
  title: "Privacy Policy | Coastal Construction Services",
  description: `How ${client.businessName} handles the information you send through this website.`,
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

const h2 = "mb-3 mt-10 text-2xl uppercase text-brand";
const p = "mt-3 font-body text-[1.1rem] leading-[1.8] text-gray-300";
const link = "text-brand underline hover:text-brand-light";

export default function Privacy() {
  return (
    <>
      <PageHeader heading="PRIVACY [POLICY]" subtitle={`How ${client.shortName} handles what you send us`} />
      <section className="bg-surface-900 px-8 py-16">
        <div className="mx-auto max-w-[800px]">
          <p className={p}>
            This notice explains what happens to information you send through this website, run by{" "}
            {client.businessName}.
          </p>

          <h2 className={h2}>What we collect</h2>
          <p className={p}>
            Only what you type into the &ldquo;Request a Quote&rdquo; form: your name, email address, phone number,
            the service you need, your timeline, your project location and any details you add. Nothing is
            collected unless you submit the form.
          </p>

          <h2 className={h2}>How it reaches us</h2>
          <p className={p}>
            When you submit the form, your details are sent to Web3Forms, a form-delivery service, which emails them
            to our office. We use them to reply to you and to quote and carry out the work you asked about. We do not
            sell them or add them to marketing lists.
          </p>

          <h2 className={h2}>Booking a call or meeting</h2>
          <p className={p}>
            The &ldquo;Book Now&rdquo; and &ldquo;Schedule Meeting&rdquo; buttons open a scheduler run by Cal.com.
            What you enter there is handled by Cal.com under its own privacy policy and shared with us so we can
            keep the appointment.
          </p>

          <h2 className={h2}>Cookies and third parties</h2>
          <p className={p}>
            This website sets no cookies of its own and runs no advertising trackers. We use Cloudflare Web
            Analytics to count visits and measure how quickly pages load; it sets no cookies, does not track you
            across other websites, and gives us only totals, not information about individual visitors. The
            service-area map on the home page is embedded from Google Maps, and the scheduler from Cal.com; each may
            set its own cookies when it loads. Our hosting provider, Cloudflare, keeps standard server logs (such as
            IP addresses) to deliver and protect the site.
          </p>

          <h2 className={h2}>Your choices</h2>
          <p className={p}>
            To ask what we hold about you, or to have it corrected or deleted, email{" "}
            <a className={link} href={`mailto:${client.email}`}>
              {client.email}
            </a>{" "}
            or call{" "}
            <a className={link} href={phoneHref}>
              {phoneDisplay}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}

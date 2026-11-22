import { client } from "@/client.config";
import { coverageCard } from "@/content/serviceAreas";
import { faqs } from "@/content/faqs";
import { BookingButton } from "@/components/BookingButton";
import { ContactForm } from "@/components/ContactForm";
import { Highlight } from "@/components/Highlight";
import { CalendarIcon, MailIcon, PhoneIcon } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { phoneDisplay, phoneHref } from "@/lib/phone";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("contact", "/contact");

const c = client.contactPage;
const info = c.info;

/**
 * Contact: the three ways to reach us (two of them Cal.com bookings) →
 * the quote form → contact details, hours, coverage → FAQ.
 */
export default function ContactPage() {
  const events = client.booking.provider === "none" ? [] : client.booking.events;
  return (
    <>
      <JsonLd page="contact" />
      <PageHeader heading={c.heading} subtitle={c.subtitle} />

      <section className="contact-methods">
        <div className="contact-methods-grid">
          <div className="contact-method-card">
            <PhoneIcon className="contact-method-icon" />
            <h2>{c.methods.call.title}</h2>
            <p>{c.methods.call.body}</p>
            <BookingButton event={events[0]?.id ?? ""} />
          </div>

          <div className="contact-method-card">
            <MailIcon className="contact-method-icon" />
            <h2>{c.methods.message.title}</h2>
            <p>{c.methods.message.body}</p>
            <a href="#contact-form" className="method-button">
              {c.methods.message.cta}
            </a>
          </div>

          <div className="contact-method-card">
            <CalendarIcon className="contact-method-icon" />
            <h2>{c.methods.meeting.title}</h2>
            <p>{c.methods.meeting.body}</p>
            <BookingButton event={events[1]?.id ?? ""} />
          </div>
        </div>
      </section>

      <section className="contact-form-section" id="contact-form">
        <div className="form-container">
          <div className="form-header">
            <h2>
              <Highlight text={client.form.heading} />
            </h2>
            <p>{client.form.lede}</p>
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="contact-info-section">
        <div className="info-container">
          <div className="info-card">
            <h3>{info.contact.title}</h3>
            <p className="info-detail">
              <strong>{info.contact.phone}</strong> <a href={phoneHref}>{phoneDisplay}</a>
            </p>
            <p className="info-detail">
              <strong>{info.contact.email}</strong> <a href={`mailto:${client.email}`}>{client.email}</a>
            </p>
            <p className="info-detail">
              <strong>{info.contact.address}</strong> {client.address.street}, {client.address.city},{" "}
              {client.address.region} {client.address.postalCode}
            </p>
            <p className="info-detail">
              <strong>{info.contact.area}</strong> {info.contact.areaValue}
            </p>
          </div>
          <InfoCard title={info.hours.title} lines={info.hours.lines} />
          <InfoCard title={info.response.title} lines={info.response.lines} />
        </div>

        <div className="info-container mt-8">
          <InfoCard title={info.coverage.title} lines={coverageCard} />
          <InfoCard title={info.expect.title} lines={info.expect.lines} />
          <InfoCard title={info.equipment.title} lines={info.equipment.lines} />
        </div>
      </section>

      <section className="contact-info-section bg-surface-900">
        <div className="form-container">
          <div className="form-header">
            <h2>
              <Highlight text={c.faq.heading} />
            </h2>
            <p>{c.faq.lede}</p>
          </div>
          {faqs.map((f) => (
            <div key={f.q} className="info-card mb-6 text-left">
              <h3>{f.q}</h3>
              <p className="info-detail">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function InfoCard({ title, lines }: { title: string; lines: readonly string[] }) {
  return (
    <Reveal className="h-full">
      <div className="info-card h-full">
        <h3>{title}</h3>
      {lines.map((l) => (
        <p key={l} className="info-detail">
          {l}
        </p>
      ))}
    </div>
    </Reveal>
  );
}

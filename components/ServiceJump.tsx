import { client } from "@/client.config";
import { services } from "@/content/services";

/** Quick links to each service, so nobody has to scroll the whole page. */
export function ServiceJump() {
  return (
    <nav className="service-jump" aria-label={client.servicesPage.jumpLabel}>
      <p>{client.servicesPage.jumpLabel}</p>
      <ul>
        {services.map((s) => (
          <li key={s.slug}>
            <a href={`#${s.slug}`}>{s.name}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

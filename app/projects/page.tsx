import { Breadcrumbs, ContentSchema, DraftNotice, LinkGrid } from "@/components/content/ContentParts";
import { PageHeader } from "@/components/PageHeader";
import { projectStudies } from "@/content/projects";
import { contentMetadata } from "@/lib/seo";

const title = "Dirt Work Projects in Acadiana | Coastal Construction";
const description = "Before-and-after dirt work projects across Acadiana, including the location, problem, work completed, equipment used, and final result.";
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
];
const live = projectStudies.filter((p) => p.published);
const draft = live.length === 0;
const shown = draft ? projectStudies : live;

export const metadata = contentMetadata({ title, description, path: "/projects", draft });

export default function ProjectsPage() {
  return (
    <>
      <ContentSchema path="/projects" name={title} description={description} crumbs={crumbs} type="CollectionPage" />
      {draft && <DraftNotice>add real job photos and details in content/projects.ts.</DraftNotice>}
      <PageHeader heading="Our [Projects]" subtitle="Real work from job sites across Acadiana" />
      <Breadcrumbs crumbs={crumbs} />
      <div className="content-page">
        <div className="content-wrap">
          <LinkGrid links={shown.map((p) => ({ href: `/projects/${p.slug}`, label: p.title, note: p.location }))} />
        </div>
      </div>
    </>
  );
}

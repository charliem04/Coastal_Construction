/**
 * Real project content.
 *
 * `projectPairs` feeds the home page's before-and-after slider and stays
 * empty until matching job photos exist.
 *
 * `projectStudies` feeds /projects. The entry below is a layout sample:
 * it is unpublished, so the public build removes its page. Replace it
 * with a real job before setting `published` to true. Real, matching job
 * photos only: no staged, AI-generated or mismatched images.
 */
import type { ProjectPair, ProjectStudy } from "./types";

export const projectPairs: ProjectPair[] = [];

export const projectStudies: ProjectStudy[] = [
  {
    slug: "sample-project-layout",
    published: false,
    title: "Sample Project Layout",
    seoTitle: "Sample Project Layout | Coastal Construction",
    seoDescription: "An unpublished layout sample for a real Coastal Construction project with its location, problem, work completed, equipment, and result.",
    service: "site-pads",
    location: "Project location",
    problem: "Describe the problem the customer needed solved.",
    work: "Describe what was done on the site.",
    equipment: ["Equipment used"],
    result: "Describe the finished result.",
    before: "site-pad-construction",
    after: "site-pad-construction",
    beforeAlt: "Before photo placeholder",
    afterAlt: "After photo placeholder",
  },
];

export const projectStudy = (slug: string) => projectStudies.find((p) => p.slug === slug);

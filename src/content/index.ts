// Single source of truth for all editable site content.
// site.json is what the desktop CMS app edits and pushes to GitHub;
// nothing user-facing should be hardcoded in components.
import raw from './site.json';

export interface Project {
  name: string;
  details: string;
  image: string;
}

export interface TextSection {
  heading: string;
  paragraphs: string[];
}

// The CMS stores repo-hosted images as site-relative paths ("/images/x.webp").
// When the site is deployed under a sub-path (GitHub Pages project page),
// those must be prefixed with Vite's base URL — bundler rewriting only covers
// imported assets, not strings coming from JSON at runtime.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const asset = (path: string) => (path.startsWith('/') ? BASE + path : path);

export const content = {
  ...raw,
  projects: raw.projects.map((p) => ({ ...p, image: asset(p.image) })),
  caseStudy: {
    ...raw.caseStudy,
    hero: asset(raw.caseStudy.hero),
    gridA: raw.caseStudy.gridA.map(asset),
    fullA: asset(raw.caseStudy.fullA),
    gridB: raw.caseStudy.gridB.map(asset),
    fullB: asset(raw.caseStudy.fullB),
  },
  story: { ...raw.story, portrait: asset(raw.story.portrait) },
  playbook: { ...raw.playbook, pages: raw.playbook.pages.map(asset) },
};

export const projectsList: Project[] = content.projects;

// Single source of truth for all editable site content.
// site.json is what the desktop CMS app edits and pushes to GitHub;
// nothing user-facing should be hardcoded in components.
import site from './site.json';

export interface Project {
  name: string;
  details: string;
  image: string;
}

export interface TextSection {
  heading: string;
  paragraphs: string[];
}

export const content = site;
export const projectsList: Project[] = site.projects;

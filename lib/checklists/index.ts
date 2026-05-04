import { donrussRoadToWorldCup } from './donruss-road-to-world-cup';

export type ChecklistCard = {
  num: number | string;
  name: string;
  nation?: string;
  team?: string;
  isRookie?: boolean;
};

export type Checklist = {
  setSlug: string;
  setName: string;
  setBadge?: string;
  setSubtitle: string;
  ebaySearchSuffix: string;
  filterDimension: {
    field: 'nation' | 'team';
    label: string;
    placeholder: string;
  };
  sections: Record<string, ChecklistCard[]>;
  sectionColors?: Record<string, string>;
};

const checklists: Record<string, Checklist> = {
  'donruss-road-to-world-cup': donrussRoadToWorldCup,
};

export function getChecklistBySlug(slug: string): Checklist | undefined {
  return checklists[slug];
}

export function getAllChecklistSlugs(): string[] {
  return Object.keys(checklists);
}
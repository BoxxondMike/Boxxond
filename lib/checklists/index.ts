import { donrussRoadToWorldCup } from './donruss-road-to-world-cup';
import { toppsFinestPremierLeague2026 } from './topps-finest-premier-league-2026';
import { merlinPremierLeague2026 } from './merlin-premier-league-2026';

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
  'topps-finest-premier-league-2026': toppsFinestPremierLeague2026,
  'merlin-premier-league': merlinPremierLeague2026,
};

export function getChecklistBySlug(slug: string): Checklist | undefined {
  return checklists[slug];
}

export function getAllChecklistSlugs(): string[] {
  return Object.keys(checklists);
}
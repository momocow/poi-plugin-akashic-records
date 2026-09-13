// Quest categories, as poi shows them beside a quest in its task panel.
//
// The game's `api_category` is the source of truth, and the grouping below is
// poi's own (see `getCategory` in views/components/main/parts/task-panel.tsx):
// 8/9/10 are sortie types and 11 an arsenal type, which is why they share a
// colour with 2 and 6 respectively.
const CATEGORY_NAMES: Record<number, string | undefined> = {
  1: 'Composition',
  2: 'Sortie',
  3: 'Exercise',
  4: 'Expedition',
  5: 'Supply',
  6: 'Arsenal',
  7: 'Modernization',
  8: 'Sortie',
  9: 'Sortie',
  10: 'Sortie',
  11: 'Arsenal',
}

const CATEGORY_COLORS: Record<string, string | undefined> = {
  Composition: '#19BB2E',
  Sortie: '#e73939',
  Exercise: '#87da61',
  Expedition: '#16C2A3',
  Supply: '#E2C609',
  Arsenal: '#805444',
  Modernization: '#c792e8',
}

// Only used when the game never told us the category -- the wiki id's leading
// letter is the category for the regular series, but not for everything: the
// limited-time quests (L...) carry a category that no letter implies, which is
// exactly why `api_category` is preferred over parsing the id.
const CATEGORY_BY_LETTER: Record<string, string | undefined> = {
  A: 'Composition',
  B: 'Sortie',
  C: 'Exercise',
  D: 'Expedition',
  E: 'Supply',
  F: 'Arsenal',
  G: 'Modernization',
}

/** Stored in the log, so a stable english token rather than translated text. */
export const questCategoryName = (apiCategory?: number): string =>
  (apiCategory == null ? undefined : CATEGORY_NAMES[apiCategory]) || ''

export const questCategoryColor = (categoryName: string, wikiId = ''): string =>
  CATEGORY_COLORS[categoryName] ||
  CATEGORY_COLORS[CATEGORY_BY_LETTER[wikiId.trim().charAt(0).toUpperCase()] || ''] ||
  '#fff'

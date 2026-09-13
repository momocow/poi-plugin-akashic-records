// Quest completion rewards, stored as `Name xCount` entries joined by ' / '.
//
// Commas are avoided deliberately: rows are persisted as csv, and the reader
// only unescapes `%2C`, so a literal comma in a value would split the row.
//
// Resource names are stable english tokens, which keeps the stored value
// language independent and lets the table translate them for display. Item
// names are whatever the game called them: poi has no translation for game
// entity names of its own -- `window.i18n.resources` is a passthrough stub that
// poi-plugin-translator replaces when installed -- and the rest of this plugin
// likewise stores the game's own ship and equipment names.
// The game's material order, indexed by material id. `api_material` carries only
// the first four; the consumables reach a quest reward as bonus entries naming a
// material by its id, so all eight are needed to resolve those.
export const REWARD_MATERIAL_TOKENS = [
  'Fuel',
  'Ammo',
  'Steel',
  'Bauxite',
  'InstantBuild',
  'InstantRepair',
  'DevMaterial',
  'ImproveMaterial',
]

const SEPARATOR = ' / '
const ENTRY = /^(.*) x(-?\d+)$/

export type RewardEntry = [name: string, count: number]

export const formatQuestRewards = (entries: RewardEntry[]): string =>
  entries
    .filter(([name, count]) => name && count !== 0)
    .map(([name, count]) => `${name} x${count}`)
    .join(SEPARATOR)

export const translateQuestRewards = (
  value: string,
  translateName: (name: string) => string,
): string =>
  value
    .split(SEPARATOR)
    .map((entry) => {
      const parsed = ENTRY.exec(entry)
      return parsed ? `${translateName(parsed[1])} x${parsed[2]}` : entry
    })
    .join(SEPARATOR)

export const windowMode = true

export { reactClass } from './views'

export { settingsClass } from './views/setting'

export { reducer } from './views/reducers'

import { store } from 'views/create-store'
import { apiResolver } from './views/api-resolver'
import { isOriginalPluginActive } from './views/utils/original-plugin'

let unsubscribe: (() => void) | undefined
let listening = false

// The original plugin appends to the same data files, so only one of the two may
// listen at a time. It keeps ownership while it runs; this reacts to it being
// installed, uninstalled, enabled or disabled without needing a poi restart.
const syncApiResolver = () => {
  const shouldListen = !isOriginalPluginActive(store.getState())
  if (shouldListen === listening) {
    return
  }
  listening = shouldListen
  if (shouldListen) {
    apiResolver.start()
  } else {
    apiResolver.stop()
  }
}

export function pluginDidLoad() {
  syncApiResolver()
  unsubscribe = store.subscribe(syncApiResolver)
}

export function pluginWillUnload() {
  unsubscribe?.()
  unsubscribe = undefined
  if (listening) {
    apiResolver.stop()
    listening = false
  }
}

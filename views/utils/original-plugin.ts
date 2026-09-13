import { IState } from 'views/utils/selectors'

// The plugin this one is forked from. Both share the same data folder and the
// same `plugin.Akashic.*` config keys, so nothing has to be migrated -- but if
// both log at once every record is written twice to the same file. The original
// keeps ownership whenever it is running: this plugin stays dormant and shows a
// migration notice instead of the logbook.
export const ORIGINAL_PACKAGE_NAME = 'poi-plugin-akashic-records'

// poi keeps every installed plugin in `state.plugins`, dispatching as they are
// installed, enabled, disabled and uninstalled, so reading it here reacts to all
// four without polling. Window-mode plugins are react portals rendered from the
// main window's tree (see poi's plugin-window-wrapper), so this store is reachable
// whichever way the plugin is displayed.
// `enabled` matters as well as presence: a disabled original writes nothing, so
// there is no conflict and no reason to hide the logbook.
export const isOriginalPluginActive = (state: IState): boolean =>
  (state.plugins || []).some(
    (plugin) => plugin.packageName === ORIGINAL_PACKAGE_NAME && plugin.enabled,
  )

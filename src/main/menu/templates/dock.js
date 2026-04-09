import { app, Menu } from 'electron'
import * as actions from '../actions/file'
import { t } from '../../i18n'

const dockMenu = Menu.buildFromTemplate([{
  label: t('menu.dock.open'),
  click (menuItem, browserWindow) {
    if (browserWindow) {
      actions.openFile(browserWindow)
    } else {
      actions.newEditorWindow()
    }
  }
}, {
  label: t('menu.dock.clearRecent'),
  click () {
    app.clearRecentDocuments()
  }
}])

export default dockMenu

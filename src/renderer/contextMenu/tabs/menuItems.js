import * as contextMenu from './actions'
import { t } from '@/i18n'

// NOTE: This are mutable fields that may change at runtime.

export const SEPARATOR = {
  type: 'separator'
}

export const CLOSE_THIS = {
  label: t('contextMenu.close'),
  id: 'closeThisTab',
  click (menuItem, browserWindow) {
    contextMenu.closeThis(menuItem._tabId)
  }
}

export const CLOSE_OTHERS = {
  label: t('contextMenu.closeOthers'),
  id: 'closeOtherTabs',
  click (menuItem, browserWindow) {
    contextMenu.closeOthers(menuItem._tabId)
  }
}

export const CLOSE_SAVED = {
  label: t('contextMenu.closeSaved'),
  id: 'closeSavedTabs',
  click (menuItem, browserWindow) {
    contextMenu.closeSaved()
  }
}

export const CLOSE_ALL = {
  label: t('contextMenu.closeAllTabs'),
  id: 'closeAllTabs',
  click (menuItem, browserWindow) {
    contextMenu.closeAll()
  }
}

export const RENAME = {
  label: t('contextMenu.rename'),
  id: 'renameFile',
  click (menuItem, browserWindow) {
    contextMenu.rename(menuItem._tabId)
  }
}

export const COPY_PATH = {
  label: t('contextMenu.copyPath'),
  id: 'copyPath',
  click (menuItem, browserWindow) {
    contextMenu.copyPath(menuItem._tabId)
  }
}

export const SHOW_IN_FOLDER = {
  label: t('contextMenu.showInFolder'),
  id: 'showInFolder',
  click (menuItem, browserWindow) {
    contextMenu.showInFolder(menuItem._tabId)
  }
}

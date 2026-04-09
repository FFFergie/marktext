import * as contextMenu from './actions'
import { t } from '@/i18n'

// NOTE: This are mutable fields that may change at runtime.

export const SEPARATOR = {
  type: 'separator'
}

export const NEW_FILE = {
  label: t('common.newFile'),
  id: 'newFileMenuItem',
  click (menuItem, browserWindow) {
    contextMenu.newFile()
  }
}

export const NEW_DIRECTORY = {
  label: t('contextMenu.newDirectory'),
  id: 'newDirectoryMenuItem',
  click (menuItem, browserWindow) {
    contextMenu.newDirectory()
  }
}

export const COPY = {
  label: t('contextMenu.copy'),
  id: 'copyMenuItem',
  click (menuItem, browserWindow) {
    contextMenu.copy()
  }
}

export const CUT = {
  label: t('contextMenu.cut'),
  id: 'cutMenuItem',
  click (menuItem, browserWindow) {
    contextMenu.cut()
  }
}

export const PASTE = {
  label: t('contextMenu.paste'),
  id: 'pasteMenuItem',
  click (menuItem, browserWindow) {
    contextMenu.paste()
  }
}

export const RENAME = {
  label: t('contextMenu.rename'),
  id: 'renameMenuItem',
  click (menuItem, browserWindow) {
    contextMenu.rename()
  }
}

export const DELETE = {
  label: t('contextMenu.moveToTrash'),
  id: 'deleteMenuItem',
  click (menuItem, browserWindow) {
    contextMenu.remove()
  }
}

export const SHOW_IN_FOLDER = {
  label: t('contextMenu.showInFolder'),
  id: 'showInFolderMenuItem',
  click (menuItem, browserWindow) {
    contextMenu.showInFolder()
  }
}

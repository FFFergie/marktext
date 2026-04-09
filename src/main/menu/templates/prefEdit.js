import { t } from '../../i18n'

export default function (keybindings) {
  return {
    label: t('menu.prefEdit.label'),
    submenu: [{
      label: t('menu.prefEdit.cut'),
      accelerator: keybindings.getAccelerator('edit.cut'),
      role: 'cut'
    }, {
      label: t('menu.prefEdit.copy'),
      accelerator: keybindings.getAccelerator('edit.copy'),
      role: 'copy'
    }, {
      label: t('menu.prefEdit.paste'),
      accelerator: keybindings.getAccelerator('edit.paste'),
      role: 'paste'
    }, {
      type: 'separator'
    }, {
      label: t('menu.prefEdit.selectAll'),
      accelerator: keybindings.getAccelerator('edit.select-all'),
      role: 'selectAll'
    }]
  }
}

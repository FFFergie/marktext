import { t } from '@/i18n'

export const themes = [
  {
    name: 'light'
  },
  {
    name: 'dark'
  },
  {
    name: 'graphite'
  },
  {
    name: 'material-dark'
  },
  {
    name: 'ulysses'
  },
  {
    name: 'one-dark'
  }
]

export const autoSwitchThemeOptions = [{
  label: t('pref.theme.option.adjustAtStartup'), // Always
  value: 0
}, /* {
  label: 'Only at runtime',
  value: 1
}, */ {
  label: t('common.never'),
  value: 2
}]

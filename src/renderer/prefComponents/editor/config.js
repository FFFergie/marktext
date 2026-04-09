import { ENCODING_NAME_MAP } from 'common/encoding'
import { t } from '@/i18n'

export const tabSizeOptions = [{
  label: '1',
  value: 1
}, {
  label: '2',
  value: 2
}, {
  label: '3',
  value: 3
}, {
  label: '4',
  value: 4
}]

export const endOfLineOptions = [{
  label: t('common.default'),
  value: 'default'
}, {
  label: t('pref.editor.option.crlf'),
  value: 'crlf'
}, {
  label: t('pref.editor.option.lf'),
  value: 'lf'
}]

export const trimTrailingNewlineOptions = [{
  label: t('pref.editor.option.trimAllTrailing'),
  value: 0
}, {
  label: t('pref.editor.option.ensureOneTrailing'),
  value: 1
}, {
  label: t('pref.editor.option.preserveOriginalStyle'),
  value: 2
}, {
  label: t('pref.editor.option.doNothing'),
  value: 3
}]

export const textDirectionOptions = [{
  label: t('pref.editor.option.leftToRight'),
  value: 'ltr'
}, {
  label: t('pref.editor.option.rightToLeft'),
  value: 'rtl'
}]

let defaultEncodingOptions = null
export const getDefaultEncodingOptions = () => {
  if (defaultEncodingOptions) {
    return defaultEncodingOptions
  }

  defaultEncodingOptions = []
  for (const [value, label] of Object.entries(ENCODING_NAME_MAP)) {
    defaultEncodingOptions.push({ label, value })
  }
  return defaultEncodingOptions
}

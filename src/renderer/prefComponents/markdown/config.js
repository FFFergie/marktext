import { t } from '@/i18n'

export const bulletListMarkerOptions = [{
  label: '*',
  value: '*'
}, {
  label: '-',
  value: '-'
}, {
  label: '+',
  value: '+'
}]

export const orderListDelimiterOptions = [{
  label: '.',
  value: '.'
}, {
  label: ')',
  value: ')'
}]

export const preferHeadingStyleOptions = [{
  label: t('pref.markdown.option.atxHeading'),
  value: 'atx'
}, {
  label: t('pref.markdown.option.setextHeading'),
  value: 'setext'
}]

export const listIndentationOptions = [{
  label: t('pref.markdown.option.docfxStyle'),
  value: 'dfm'
}, {
  label: t('pref.markdown.option.trueTabCharacter'),
  value: 'tab'
}, {
  label: t('pref.markdown.option.singleSpaceCharacter'),
  value: 1
}, {
  label: t('pref.markdown.option.twoSpaceCharacters'),
  value: 2
}, {
  label: t('pref.markdown.option.threeSpaceCharacters'),
  value: 3
}, {
  label: t('pref.markdown.option.fourSpaceCharacters'),
  value: 4
}]

export const frontmatterTypeOptions = [{
  label: 'YAML',
  value: '-'
}, {
  label: 'TOML',
  value: '+'
}, {
  label: 'JSON (;;;)',
  value: ';'
}, {
  label: 'JSON ({})',
  value: '{'
}]

export const sequenceThemeOptions = [{
  label: t('pref.markdown.option.handDrawn'),
  value: 'hand'
}, {
  label: t('pref.markdown.option.simple'),
  value: 'simple'
}]

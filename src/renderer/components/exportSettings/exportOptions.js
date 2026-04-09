import { t } from '@/i18n'

export const pageSizeList = [
  {
    label: 'A3 (297mm x 420mm)',
    value: 'A3'
  }, {
    label: 'A4 (210mm x 297mm)',
    value: 'A4'
  }, {
    label: 'A5 (148mm x 210mm)',
    value: 'A5'
  }, {
    label: 'US Legal (8.5" x 13")',
    value: 'Legal'
  }, {
    label: 'US Letter (8.5" x 11")',
    value: 'Letter'
  }, {
    label: 'Tabloid (17" x 11")',
    value: 'Tabloid'
  }, {
    label: t('common.custom'),
    value: 'custom'
  }
]

export const headerFooterTypes = [
  {
    label: t('common.none'),
    value: 0
  }, {
    label: t('export.option.singleCell'),
    value: 1
  }, {
    label: t('export.option.threeCells'),
    value: 2
  }
]

export const headerFooterStyles = [
  {
    label: t('common.default'),
    value: 0
  }, {
    label: t('export.option.simple'),
    value: 1
  }, {
    label: t('export.option.styled'),
    value: 2
  }
]

export const exportThemeList = [{
  label: t('export.theme.academic'),
  value: 'academic'
}, {
  label: t('export.theme.githubDefault'),
  value: 'default'
}, {
  label: t('export.theme.liber'),
  value: 'liber'
}]

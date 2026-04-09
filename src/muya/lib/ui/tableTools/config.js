import { t } from '../../../../renderer/i18n'

export const toolList = {
  left: [{
    label: t('muya.tableTools.insertRowAbove'),
    action: 'insert',
    location: 'previous',
    target: 'row'
  }, {
    label: t('muya.tableTools.insertRowBelow'),
    action: 'insert',
    location: 'next',
    target: 'row'
  }, {
    label: t('muya.tableTools.removeRow'),
    action: 'remove',
    location: 'current',
    target: 'row'
  }],
  bottom: [{
    label: t('muya.tableTools.insertColumnLeft'),
    action: 'insert',
    location: 'left',
    target: 'column'
  }, {
    label: t('muya.tableTools.insertColumnRight'),
    action: 'insert',
    location: 'right',
    target: 'column'
  }, {
    label: t('muya.tableTools.removeColumn'),
    action: 'remove',
    location: 'current',
    target: 'column'
  }]
}

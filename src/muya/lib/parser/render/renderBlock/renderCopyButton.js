import { h } from '../snabbdom'
import copyIcon from '../../../assets/pngicon/copy/2.png'
import { t } from '../../../../../renderer/i18n'

const renderCopyButton = () => {
  const selector = 'a.ag-code-copy'
  const iconVnode = h('i.icon', h('i.icon-inner', {
    style: {
      background: `url(${copyIcon}) no-repeat`,
      'background-size': '100%'
    }
  }, ''))

  return h(selector, {
    attrs: {
      title: t('muya.copyButton.copyContent'),
      contenteditable: 'false'
    }
  }, iconVnode)
}

export default renderCopyButton

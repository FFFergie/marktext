import editIcon from '../../assets/pngicon/imageEdit/2.png'
import inlineIcon from '../../assets/pngicon/inline_image/2.png'
import leftIcon from '../../assets/pngicon/algin_left/2.png'
import middleIcon from '../../assets/pngicon/algin_center/2.png'
import rightIcon from '../../assets/pngicon/algin_right/2.png'
import deleteIcon from '../../assets/pngicon/image_delete/2.png'
import { t } from '../../../../renderer/i18n'

const icons = [
  {
    type: 'edit',
    tooltip: t('muya.imageToolbar.editImage'),
    icon: editIcon
  },
  {
    type: 'inline',
    tooltip: t('muya.imageToolbar.inlineImage'),
    icon: inlineIcon
  },
  {
    type: 'left',
    tooltip: t('muya.imageToolbar.alignLeft'),
    icon: leftIcon
  },
  {
    type: 'center',
    tooltip: t('muya.imageToolbar.alignMiddle'),
    icon: middleIcon
  },
  {
    type: 'right',
    tooltip: t('muya.imageToolbar.alignRight'),
    icon: rightIcon
  },
  {
    type: 'delete',
    tooltip: t('muya.imageToolbar.removeImage'),
    icon: deleteIcon
  }
]

export default icons

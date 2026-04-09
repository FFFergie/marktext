import { t } from '../i18n'

export default id => {
  const translation = t(`command.${id}`)
  return translation !== `command.${id}` ? translation : id
}

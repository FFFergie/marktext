const zhCN = require('../locales/zh-CN.json')

export function t (key, params = {}) {
  const keys = key.split('.')
  let value = zhCN
  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) break
  }
  if (typeof value !== 'string') return key

  return value.replace(/\{(\w+)\}/g, (_, name) => params[name] ?? `{${name}}`)
}

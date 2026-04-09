# MarkText 中文本地化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 MarkText 的全部 UI 字符串从硬编码英文改为基于 vue-i18n 的中文本地化架构，第一版发布纯中文版。

**Architecture:** 引入 vue-i18n@8 作为 renderer 进程的 i18n 框架，main 进程使用自定义 `t()` 函数直接读取共享 locale JSON 文件。所有用户可见字符串提取到 `src/locales/zh-CN.json`，原文提取到 `src/locales/en.json`。语言选择器保持禁用，默认中文。

**Tech Stack:** vue-i18n@8, Electron 18, Vue 2, Element UI

**Spec:** `docs/superpowers/specs/2026-04-09-chinese-localization-design.md`

---

## Task 1: 安装 vue-i18n 并创建 locale 基础设施

**Files:**
- Create: `src/locales/zh-CN.json`
- Create: `src/locales/en.json`
- Create: `src/locales/index.js`
- Create: `src/main/i18n.js`
- Create: `src/renderer/i18n.js`

- [ ] **Step 1: 安装 vue-i18n@8**

```bash
cd /Users/fergie/Developer/Luxe/marktext && yarn add vue-i18n@8
```

Expected: 安装成功，package.json 中出现 `"vue-i18n": "^8.x.x"`

- [ ] **Step 2: 创建 src/locales/ 目录和初始 zh-CN.json**

```json
{
  "menu": {},
  "pref": {},
  "contextMenu": {},
  "command": {},
  "about": {},
  "search": {},
  "commandPalette": {},
  "export": {},
  "notification": {},
  "common": {}
}
```

- [ ] **Step 3: 创建 src/locales/en.json**

与 zh-CN.json 相同的空结构。

- [ ] **Step 4: 创建 src/locales/index.js**

```js
import zhCN from './zh-CN.json'

export default zhCN
```

- [ ] **Step 5: 创建 src/main/i18n.js**

```js
const zhCN = require('../locales/zh-CN.json')

/**
 * 根据 key 获取翻译文本
 * 支持点号路径，如 t('menu.file.newTab')
 * @param {string} key - 点号分隔的 locale key
 * @param {Object} params - 插值参数，如 { name: 'value' }
 * @returns {string} 翻译文本，找不到时返回 key 本身
 */
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
```

- [ ] **Step 6: 创建 src/renderer/i18n.js**

```js
import zhCN from '../locales/zh-CN.json'

/**
 * Renderer 进程共享翻译函数（用于纯 JS 文件）
 * .vue 文件应使用 vue-i18n 的 $t() 方法
 */
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
```

- [ ] **Step 7: 提交**

```bash
git add src/locales/ src/main/i18n.js src/renderer/i18n.js package.json yarn.lock
git commit -m "feat: add i18n infrastructure with locale files and t() functions"
```

---

## Task 2: 初始化 vue-i18n 并切换 Element UI 为中文

**Files:**
- Modify: `src/renderer/main.js`
- Modify: `src/renderer/store/preferences.js`
- Modify: `src/renderer/prefComponents/general/config.js`

- [ ] **Step 1: 修改 src/renderer/main.js 初始化 vue-i18n + Element UI 中文**

在现有 `import lang from 'element-ui/lib/locale/lang/en'` 和 `import locale from 'element-ui/lib/locale'` 附近，替换为：

```js
// 删除: import lang from 'element-ui/lib/locale/lang/en'
// 删除: import locale from 'element-ui/lib/locale'

// 新增:
import VueI18n from 'vue-i18n'
import zhCN from '../locales/zh-CN.json'
import elementLocale from 'element-ui/lib/locale/lang/zh-CN'
import elementLocaleInstaller from 'element-ui/lib/locale'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN
  }
})

// Element UI 中文
elementLocaleInstaller.use(elementLocale)
```

然后在 `new Vue({` 中添加 `i18n`：

```js
new Vue({
  i18n,
  // ... 其余不变
})
```

删除原来的 `locale.use(lang)` 调用。

- [ ] **Step 2: 修改 src/renderer/store/preferences.js 默认语言**

```js
// 将 language: 'en' 改为:
language: 'zh-CN',
```

- [ ] **Step 3: 修改 src/renderer/prefComponents/general/config.js 语言选项**

```js
export const languageOptions = [{
  label: '简体中文',
  value: 'zh-CN'
}, {
  label: 'English',
  value: 'en'
}]
```

- [ ] **Step 4: 验证开发环境能启动**

```bash
cd /Users/fergie/Developer/Luxe/marktext && yarn run dev
```

Expected: 应用正常启动，Element UI 组件（如日期选择器）显示中文。

- [ ] **Step 5: 提交**

```bash
git add src/renderer/main.js src/renderer/store/preferences.js src/renderer/prefComponents/general/config.js
git commit -m "feat: initialize vue-i18n with zh-CN locale and Element UI Chinese"
```

---

## Task 3: 主进程菜单汉化 — File/Edit/Paragraph/Format 菜单

**Files:**
- Modify: `src/main/menu/templates/file.js`
- Modify: `src/main/menu/templates/edit.js`
- Modify: `src/main/menu/templates/paragraph.js`
- Modify: `src/main/menu/templates/format.js`
- Modify: `src/locales/zh-CN.json`
- Modify: `src/locales/en.json`

> 这是工作量最大的 task。每个菜单文件需要：添加 `import { t } from '../../i18n'`，将所有 `label: '英文'` 改为 `label: t('menu.xxx')`，同时在 zh-CN.json 中添加翻译、en.json 中添加原文。

- [ ] **Step 1: 在 zh-CN.json 和 en.json 中添加 file/edit/paragraph/format 菜单的所有 key**

在 `zh-CN.json` 的 `"menu"` 对象内添加：

```json
{
  "menu": {
    "file": {
      "label": "文件",
      "newTab": "新建标签页",
      "newWindow": "新建窗口",
      "openFile": "打开文件...",
      "openFolder": "打开文件夹...",
      "openRecent": "最近打开",
      "clearRecentlyUsed": "清除最近使用",
      "save": "保存",
      "saveAs": "另存为...",
      "autoSave": "自动保存",
      "moveTo": "移动到...",
      "rename": "重命名...",
      "import": "导入...",
      "export": "导出",
      "exportHTML": "HTML",
      "exportPDF": "PDF",
      "print": "打印",
      "preferences": "偏好设置...",
      "closeTab": "关闭标签页",
      "closeWindow": "关闭窗口",
      "quit": "退出"
    },
    "edit": {
      "label": "编辑",
      "undo": "撤销",
      "redo": "重做",
      "cut": "剪切",
      "copy": "复制",
      "paste": "粘贴",
      "copyAsMarkdown": "复制为 Markdown",
      "copyAsHTML": "复制为 HTML",
      "pasteAsPlainText": "粘贴为纯文本",
      "selectAll": "全选",
      "duplicate": "复制行",
      "createParagraph": "创建段落",
      "deleteParagraph": "删除段落",
      "find": "查找",
      "findNext": "查找下一个",
      "findPrevious": "查找上一个",
      "replace": "替换",
      "findInFolder": "在文件夹中查找",
      "screenshot": "截图",
      "lineEnding": "行尾符",
      "crlf": "回车换行 (CRLF)",
      "lf": "换行 (LF)"
    },
    "paragraph": {
      "label": "段落",
      "heading1": "标题 1",
      "heading2": "标题 2",
      "heading3": "标题 3",
      "heading4": "标题 4",
      "heading5": "标题 5",
      "heading6": "标题 6",
      "upgradeHeading": "提升标题级别",
      "degradeHeading": "降低标题级别",
      "table": "表格",
      "codeFence": "代码块",
      "quoteBlock": "引用块",
      "mathFormula": "数学公式",
      "htmlBlock": "HTML 块",
      "orderList": "有序列表",
      "bulletList": "无序列表",
      "taskList": "任务列表",
      "looseListItem": "松散列表项",
      "paragraph": "段落",
      "horizontalLine": "分隔线",
      "frontMatter": "前置元数据"
    },
    "format": {
      "label": "格式",
      "strong": "加粗",
      "emphasis": "斜体",
      "underline": "下划线",
      "superscript": "上标",
      "subscript": "下标",
      "highlight": "高亮",
      "inlineCode": "行内代码",
      "inlineMath": "行内数学公式",
      "strike": "删除线",
      "hyperlink": "超链接",
      "image": "图片",
      "clearFormat": "清除格式"
    }
  }
}
```

在 `en.json` 的 `"menu"` 对象内添加同样的 key，值为英文原文（从源码提取）。

- [ ] **Step 2: 修改 src/main/menu/templates/file.js**

添加 import：`import { t } from '../../i18n'`

将所有 `label: 'xxx'` 替换为 `label: t('menu.file.xxx')`。参考映射：
- `'&File'` → `t('menu.file.label')`
- `'New Tab'` → `t('menu.file.newTab')`
- `'New Window'` → `t('menu.file.newWindow')`
- `'Open File...'` → `t('menu.file.openFile')`
- `'Open Folder...'` → `t('menu.file.openFolder')`
- `'Open Recent'` → `t('menu.file.openRecent')`
- `'Clear Recently Used'` → `t('menu.file.clearRecentlyUsed')`
- `'Save'` → `t('menu.file.save')`
- `'Save As...'` → `t('menu.file.saveAs')`
- `'Auto Save'` → `t('menu.file.autoSave')`
- `'Move To...'` → `t('menu.file.moveTo')`
- `'Rename...'` → `t('menu.file.rename')`
- `'Import...'` → `t('menu.file.import')`
- `'Export'` → `t('menu.file.export')`
- `'HTML'` → `t('menu.file.exportHTML')`
- `'PDF'` → `t('menu.file.exportPDF')`
- `'Print'` → `t('menu.file.print')`
- `'Preferences...'` → `t('menu.file.preferences')`
- `'Close Tab'` → `t('menu.file.closeTab')`
- `'Close Window'` → `t('menu.file.closeWindow')`
- `'Quit'` → `t('menu.file.quit')`

- [ ] **Step 3: 修改 src/main/menu/templates/edit.js**

添加 import：`import { t } from '../../i18n'`

替换所有 label。注意 `label: '&Edit'` 是菜单名，映射到 `t('menu.edit.label')`。

- [ ] **Step 4: 修改 src/main/menu/templates/paragraph.js**

添加 import：`import { t } from '../../i18n'`

替换所有 label。

- [ ] **Step 5: 修改 src/main/menu/templates/format.js**

添加 import：`import { t } from '../../i18n'`

替换所有 label。

- [ ] **Step 6: 提交**

```bash
git add src/main/menu/templates/file.js src/main/menu/templates/edit.js src/main/menu/templates/paragraph.js src/main/menu/templates/format.js src/locales/
git commit -m "feat: localize File/Edit/Paragraph/Format menus to Chinese"
```

---

## Task 4: 主进程菜单汉化 — View/Help/MarkText/Window/Theme 菜单 + 右键菜单

**Files:**
- Modify: `src/main/menu/templates/view.js`
- Modify: `src/main/menu/templates/help.js`
- Modify: `src/main/menu/templates/marktext.js`
- Modify: `src/main/menu/templates/window.js`
- Modify: `src/main/menu/templates/theme.js`
- Modify: `src/main/menu/templates/prefEdit.js`
- Modify: `src/main/menu/templates/dock.js`
- Modify: `src/main/contextMenu/editor/menuItems.js`
- Modify: `src/locales/zh-CN.json`
- Modify: `src/locales/en.json`

- [ ] **Step 1: 在 zh-CN.json 的 menu 对象中补充 view/help/marktext/window/theme 命名空间**

读取每个模板文件，提取所有 label 值，添加到 zh-CN.json 的对应命名空间下并翻译。同时将英文原文添加到 en.json。

需要提取的文件和主要 label：
- `view.js`: Source Code Mode, Typewriter Mode, Focus Mode, Toggle Sidebar, Toggle TOC, Toggle Tabs, Command Palette, Dev Tools, Reload
- `help.js`: Documentation, Markdown Syntax Guide, changelog, Check for Updates, About
- `marktext.js`: About, Preferences, Hide, Hide Others, Quit
- `window.js`: Minimize, Close, Zoom, Always on Top
- `theme.js`: Cadmium Light, Graphite Light, Ulysses Light, Dark, Material Dark, One Dark
- `prefEdit.js`: Undo, Redo, Cut, Copy, Paste, Select All
- `dock.js`: New Window, Open File

- [ ] **Step 2: 修改每个菜单模板文件**

对每个文件：添加 `import { t } from '../../i18n'`，将所有 `label: '英文'` 改为 `label: t('menu.xxx.yyy')`。

- [ ] **Step 3: 提取并汉化 main 进程右键菜单**

修改 `src/main/contextMenu/editor/menuItems.js`，添加 `import { t } from '../../i18n'`，将 label 替换。

在 zh-CN.json 中添加 `contextMenu` 命名空间：
```json
{
  "contextMenu": {
    "cut": "剪切",
    "copy": "复制",
    "paste": "粘贴",
    "copyAsMarkdown": "复制为 Markdown",
    "copyAsHtml": "复制为 HTML",
    "pasteAsPlainText": "粘贴为纯文本",
    "selectAll": "全选"
  }
}
```

- [ ] **Step 4: 提交**

```bash
git add src/main/menu/templates/ src/main/contextMenu/ src/locales/
git commit -m "feat: localize remaining menus and context menu to Chinese"
```

---

## Task 5: Renderer 进程汉化 — 偏好设置页面

**Files:**
- Modify: `src/renderer/prefComponents/general/index.vue`
- Modify: `src/renderer/prefComponents/editor/index.vue`
- Modify: `src/renderer/prefComponents/theme/index.vue`
- Modify: `src/renderer/prefComponents/markdown/index.vue`
- Modify: `src/renderer/prefComponents/spellchecker/index.vue`
- Modify: `src/renderer/prefComponents/image/index.vue`
- Modify: `src/renderer/prefComponents/sideBar/index.vue`
- Modify: `src/renderer/prefComponents/keybindings/index.vue`
- Modify: `src/renderer/prefComponents/keybindings/key-input-dialog.vue`
- Modify: `src/renderer/prefComponents/general/config.js`
- Modify: `src/locales/zh-CN.json`
- Modify: `src/locales/en.json`

- [ ] **Step 1: 逐个读取偏好设置组件，提取所有用户可见字符串**

需要提取的字符串类型：title、label、description、placeholder、按钮文本、备注文本。

- [ ] **Step 2: 在 zh-CN.json 的 pref 命名空间下添加翻译**

以 general 为例：
```json
{
  "pref": {
    "sideBar": {
      "title": "偏好设置",
      "searchPlaceholder": "搜索偏好设置"
    },
    "general": {
      "title": "通用",
      "autoSave": "自动保存",
      "autoSaveDesc": "自动保存文档更改",
      "autoSaveDelay": "文档编辑后自动保存的延迟时间",
      "window": "窗口",
      "titleBarStyle": "标题栏样式",
      "hideScrollbar": "隐藏滚动条",
      "openFilesInNewWindow": "在新窗口中打开文件",
      "openFoldersInNewWindow": "在新窗口中打开文件夹",
      "zoom": "缩放",
      "sidebar": "侧边栏",
      "wordWrapInToc": "在目录中自动换行",
      "fileSortBy": "打开文件夹中文件的排序方式",
      "actionOnStartup": "启动时执行的操作",
      "openDefaultDirectory": "打开默认目录",
      "selectFolder": "选择文件夹",
      "openBlankPage": "打开空白页",
      "misc": "杂项",
      "userInterfaceLanguage": "用户界面语言"
    }
  }
}
```

对 editor、theme、markdown、spellchecker、image、keybindings 各节做同样处理。

- [ ] **Step 3: 在 en.json 中添加英文原文**

- [ ] **Step 4: 修改每个 .vue 文件**

将硬编码字符串替换为 `$t()` 调用。示例：

```vue
<!-- Before -->
<h6 class="title">Auto Save:</h6>
<bool description="Automatically save document changes" :bool="autoSave" />

<!-- After -->
<h6 class="title">{{ $t('pref.general.autoSave') }}:</h6>
<bool :description="$t('pref.general.autoSaveDesc')" :bool="autoSave" />
```

注意 `description` 属性从字符串改为绑定（加 `:`）。

- [ ] **Step 5: 修改 config.js 中的选项 label**

`titleBarStyleOptions`、`zoomOptions`、`fileSortByOptions` 中的 label 也要改为 `$t()` 或使用 `t()` 函数。由于 config.js 不是 Vue 组件，使用 `import { t } from '@/i18n'`。

- [ ] **Step 6: 提交**

```bash
git add src/renderer/prefComponents/ src/locales/
git commit -m "feat: localize preference pages to Chinese"
```

---

## Task 6: Renderer 进程汉化 — 其他组件和命令描述

**Files:**
- Modify: `src/renderer/components/commandPalette/index.vue`
- Modify: `src/renderer/components/about/index.vue`
- Modify: `src/renderer/components/search/index.vue`
- Modify: `src/renderer/components/exportSettings/index.vue`
- Modify: `src/renderer/components/editorWithTabs/editor.vue`
- Modify: `src/renderer/components/editorWithTabs/tabs.vue`
- Modify: `src/renderer/components/editorWithTabs/notifications.vue`
- Modify: `src/renderer/components/sideBar/index.vue`
- Modify: `src/renderer/components/sideBar/toc.vue`
- Modify: `src/renderer/components/sideBar/tree.vue`
- Modify: `src/renderer/components/sideBar/search.vue`
- Modify: `src/renderer/components/recent/index.vue`
- Modify: `src/renderer/components/import/index.vue`
- Modify: `src/renderer/contextMenu/tabs/menuItems.js`
- Modify: `src/renderer/contextMenu/sideBar/menuItems.js`
- Modify: `src/renderer/commands/descriptions.js`
- Modify: `src/locales/zh-CN.json`
- Modify: `src/locales/en.json`

- [ ] **Step 1: 在 zh-CN.json 中添加各组件命名空间的翻译**

```json
{
  "about": {
    "title": "MarkText",
    "copyright": "Copyright © 2017-{year} Luo Ran",
    "description": "一个简洁优雅的 Markdown 编辑器"
  },
  "commandPalette": {
    "placeholder": "输入命令以执行"
  },
  "search": {
    "placeholder": "搜索...",
    "replace": "替换",
    "replaceWith": "替换为",
    "findNext": "查找下一个",
    "findPrevious": "查找上一个",
    "replaceNext": "替换下一个",
    "replaceAll": "全部替换",
    "close": "关闭",
    "regex": "正则表达式",
    "caseSensitive": "区分大小写",
    "matchWholeWord": "匹配全词"
  },
  "export": {
    "title": "导出",
    "cancel": "取消",
    "export": "导出"
  },
  "contextMenu": {
    "close": "关闭",
    "closeOthers": "关闭其他",
    "closeSaved": "关闭已保存的标签页",
    "closeAll": "关闭所有标签页",
    "rename": "重命名",
    "copyPath": "复制路径",
    "showInFolder": "在文件夹中显示",
    "newFile": "新建文件",
    "newFolder": "新建文件夹",
    "openInNewWindow": "在新窗口中打开",
    "remove": "删除",
    "copy": "复制",
    "cut": "剪切",
    "paste": "粘贴"
  }
}
```

- [ ] **Step 2: 修改 .vue 组件文件**

对每个组件：将硬编码字符串替换为 `$t()` 调用。

- [ ] **Step 3: 修改 renderer 右键菜单**

`src/renderer/contextMenu/tabs/menuItems.js` 和 `sideBar/menuItems.js`：添加 `import { t } from '@/i18n'`，将 `label: '英文'` 改为 `label: t('contextMenu.xxx')`。

- [ ] **Step 4: 修改命令描述**

`src/renderer/commands/descriptions.js`：替换为使用 `t()` 函数。

```js
import { t } from '../i18n'

export default id => {
  const translation = t(`command.${id}`)
  return translation !== `command.${id}` ? translation : id
}
```

在 zh-CN.json 中添加 `command` 命名空间，将所有 120 个命令描述翻译为中文。key 使用原始 commandId（如 `file.new-tab`）。

- [ ] **Step 5: 在 en.json 中同步添加英文原文**

- [ ] **Step 6: 提交**

```bash
git add src/renderer/components/ src/renderer/contextMenu/ src/renderer/commands/ src/locales/
git commit -m "feat: localize renderer components, context menus and command descriptions"
```

---

## Task 7: muya 编辑器内核字符串评估

**Files:**
- Read-only scan: `src/muya/lib/` 目录

- [ ] **Step 1: 扫描 muya 中的用户可见字符串**

```bash
cd /Users/fergie/Developer/Luxe/marktext && grep -rn "placeholder\|label\|'Click\|'Press\|'Enter\|'Type\|'Drag" src/muya/lib/ --include="*.js" | head -50
```

- [ ] **Step 2: 评估影响**

如果 muya 中的硬编码字符串是用户可见的（如编辑器内的 placeholder 提示），需要在 zh-CN.json 中添加翻译并修改 muya 代码。如果很少或不可见，标记为 OUT OF SCOPE。

- [ ] **Step 3: 根据评估结果决定是否添加 muya 翻译 task**

如果 muya 有大量字符串需要翻译，创建单独的 task。如果少于 10 个，合并到 Task 6 的提交中。

---

## Task 8: 构建验证

**Files:**
- Verify: macOS 构建流程
- Verify: GitHub Actions 配置

- [ ] **Step 1: 确认开发环境正常**

```bash
cd /Users/fergie/Developer/Luxe/marktext && yarn run dev
```

逐项检查：
- 主菜单全部显示中文
- 偏好设置页面全部显示中文
- 右键菜单显示中文
- 命令面板显示中文
- About 页面显示中文
- 搜索框显示中文
- Element UI 组件（如对话框、选择器）显示中文

- [ ] **Step 2: macOS 本地构建**

```bash
cd /Users/fergie/Developer/Luxe/marktext && yarn run build:bin
```

Expected: 构建成功，生成 macOS 应用。

- [ ] **Step 3: 运行构建的应用验证**

运行构建产物，检查所有汉化是否生效。

- [ ] **Step 4: 检查遗漏字符串**

如果发现遗漏的英文文本，补充到 zh-CN.json 并修改对应文件。

- [ ] **Step 5: 提交所有遗漏修复**

```bash
git add -A
git commit -m "fix: patch missing localization strings"
```

- [ ] **Step 6: 配置 GitHub Actions Windows 构建（可选，可后续做）**

如需立即配置，修改 `.github/workflows/build.yml` 中的 Node 版本为 16，确认 Windows 构建步骤。

---

## 任务依赖关系

```
Task 1 (基础设施) ──→ Task 2 (vue-i18n 初始化) ──→ Task 3 (主进程菜单 1/2)
                                                       │
                                                       ├──→ Task 4 (主进程菜单 2/2)
                                                       │
                                                       ├──→ Task 5 (偏好设置)
                                                       │
                                                       ├──→ Task 6 (其他组件)
                                                       │
                                                       └──→ Task 7 (muya 评估)

Task 3-7 全部完成后 → Task 8 (构建验证)
```

Task 3、4、5、6 之间无依赖，可并行执行。

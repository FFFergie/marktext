# MarkText 中文本地化设计方案

## 背景

MarkText 是一个基于 Electron + Vue 2 的 Markdown 编辑器，官方停留在 v0.17.1（2022-03-07），不维护也不接受 PR。本项目目标是从 fork 出发做一个中文优先的公开发行版本。

### 现状

- **i18n 覆盖率 = 0%**：项目未使用任何 i18n 框架，所有 UI 字符串硬编码英文
- 语言选择器存在但 `:disable="true"`，只有一个选项 `English`
- `language: 'en'` 存在于 preference 但从未用于 UI 翻译
- Element UI 仅加载了英文 locale
- `docs/i18n/zh_cn.md` 只是 README 中文翻译文档，与 UI 国际化无关

### 硬编码字符串分布

| 区域 | 文件数 | 字符串数 | 位置 |
|------|--------|----------|------|
| 主进程菜单 | 11 | ~132 | `src/main/menu/templates/*.js` |
| 偏好设置页面 | ~10 | ~40 | `src/renderer/prefComponents/**/*.vue` |
| 其他 renderer 组件 | ~17 | ~24 | `src/renderer/components/**/*.vue` |
| 右键菜单 (main) | 1 | ~9 | `src/main/contextMenu/editor/menuItems.js` |
| 右键菜单 (renderer) | 2 | ~13 | `src/renderer/contextMenu/*/menuItems.js` |
| 命令描述 | 1 | ~120 | `src/renderer/commands/descriptions.js` |
| 偏好设置 config | 1 | ~15 | `src/renderer/prefComponents/general/config.js` |
| **合计** | **~43** | **~350+** | |

## 决策

### 选定方案：分阶段 i18n（方案 C）

- 引入 vue-i18n，用正确的 i18n 架构替换硬编码字符串
- 第一版只发布中文，语言选择器保持禁用
- `en.json` 从源码提取原文，不做翻译质量验证
- 后续启用中英切换只需：开放选择器 + 动态加载 locale + main 进程菜单重建

### 未选方案及原因

- **方案 A（硬替换中文）**：后期加切换需全部返工
- **方案 B（完整 i18n 含切换）**：main 进程菜单动态重建是技术坑，现阶段不必要

## 技术设计

### 1. Locale 文件结构

```
src/
  locales/
    zh-CN.json          # 中文翻译（主要维护对象）
    en.json             # 英文原文（从源码提取，不做翻译验证）
    index.js            # locale 加载逻辑
```

放在 `src/locales/` 而非 `src/renderer/locales/`，因为 main 进程也需要读取这些文件。

### 2. Key 命名规范

按功能域组织，点号分隔：

```
menu.{menuName}.{itemName}       # 主进程菜单
pref.{section}.{key}             # 偏好设置
contextMenu.{itemName}           # 右键菜单
command.{commandId}              # 命令描述
about.{key}                      # 关于页面
search.{key}                     # 搜索相关
commandPalette.{key}             # 命令面板
export.{key}                     # 导出设置
notification.{key}               # 通知消息
common.{key}                     # 通用复用文本
```

示例：
```json
{
  "menu.file.newTab": "新建标签页",
  "menu.file.openFile": "打开文件...",
  "menu.edit.undo": "撤销",
  "pref.general.title": "通用",
  "pref.general.autoSave": "自动保存",
  "contextMenu.close": "关闭",
  "command.fileNewTab": "文件: 新建标签页",
  "about.copyright": "Copyright © 2017-{year} Luo Ran",
  "commandPalette.placeholder": "输入命令以执行"
}
```

### 3. Renderer 进程 i18n 集成

Renderer 进程有**两种 i18n 访问方式**：

- `.vue` 文件：使用 vue-i18n 提供的 `$t()` 方法（响应式，未来切换语言可自动更新）
- 纯 `.js` 文件（contextMenu、commands 等）：使用自定义 `t()` 函数（非响应式，但当前不需要切换所以无影响）

两种方式访问同一份 `zh-CN.json`，key 命名完全一致。

#### 3.1 安装 vue-i18n

```bash
yarn add vue-i18n@8
```

使用 v8 版本，因为项目是 Vue 2。vue-i18n v9+ 只支持 Vue 3。

#### 3.2 初始化（修改 `src/renderer/main.js`）

```js
import VueI18n from 'vue-i18n'
import zhCN from '../locales/zh-CN.json'

// Element UI 中文 locale
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

// Element UI 使用中文
elementLocaleInstaller.use(elementLocale)

new Vue({
  i18n,
  // ... 其他配置不变
})
```

#### 3.3 组件字符串替换

将硬编码字符串替换为 `$t()` 调用：

**Before:**
```vue
<h6 class="title">Auto Save:</h6>
<bool description="Automatically save document changes" ... />
```

**After:**
```vue
<h6 class="title">{{ $t('pref.general.autoSave') }}:</h6>
<bool :description="$t('pref.general.autoSaveDesc')" ... />
```

**Before (纯 JS 文件，无 Vue 实例):**
```js
// src/renderer/contextMenu/tabs/menuItems.js
export const CLOSE_THIS = {
  label: 'Close',
  ...
}
```

**After (纯 JS 文件):**
```js
import { t } from '@/i18n'
export const CLOSE_THIS = {
  label: t('contextMenu.close'),
  ...
}
```

对于 renderer 进程中**没有 Vue 实例**的纯 JS 文件（如 contextMenu/menuItems.js、commands/descriptions.js），创建一个共享的翻译函数：

```js
// src/renderer/i18n.js
import zhCN from '../locales/zh-CN.json'

// 与 main/i18n.js 相同的 t() 实现，但 renderer 进程用 ESM import
export function t(key, params = {}) {
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

这样 renderer 进程中的 `.vue` 文件用 `$t()`，纯 `.js` 文件用 `t()`，两者访问同一份 `zh-CN.json`。

### 4. Main 进程 i18n 集成

Main 进程没有 Vue 实例，不能直接用 vue-i18n。方案：

#### 4.1 共享 locale 文件

Main 进程直接 `require('../locales/zh-CN.json')`，不依赖 vue-i18n。

#### 4.2 创建 main 进程翻译函数

```js
// src/main/i18n.js
const zhCN = require('../locales/zh-CN.json')

/**
 * 根据 key 获取翻译文本
 * 支持点号路径，如 t('menu.file.newTab')
 */
export function t(key, params = {}) {
  const keys = key.split('.')
  let value = zhCN
  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) break
  }
  if (typeof value !== 'string') return key // fallback to key

  // 简单的插值替换 {name}
  return value.replace(/\{(\w+)\}/g, (_, name) => params[name] ?? `{${name}}`)
}
```

#### 4.3 菜单模板改造

**Before:**
```js
export default function (keybindings) {
  return {
    label: '&Edit',
    submenu: [{
      label: 'Undo',
      accelerator: keybindings.getAccelerator(COMMANDS.EDIT_UNDO),
      click (menuItem, browserWindow) {
        actions.editorUndo(browserWindow)
      }
    }]
  }
}
```

**After:**
```js
import { t } from '../../i18n'

export default function (keybindings) {
  return {
    label: t('menu.edit.label'),
    submenu: [{
      label: t('menu.edit.undo'),
      accelerator: keybindings.getAccelerator(COMMANDS.EDIT_UNDO),
      click (menuItem, browserWindow) {
        actions.editorUndo(browserWindow)
      }
    }]
  }
}
```

#### 4.4 菜单加载时机

Main 进程在 `app.on('ready')` 时读取 preference 中的语言设置（当前硬编码为 `zh-CN`），加载对应 locale 文件后构建菜单。语言选择器未启用前，不需要运行时重建菜单。

### 5. 命令描述改造

`src/renderer/commands/descriptions.js` 当前是 JS 对象，使用 renderer 的共享 `t()` 函数改造：

**Before:**
```js
const commandDescriptions = Object.freeze({
  'file.new-tab': 'File: New Tab',
  'edit.undo': 'Edit: Undo',
  ...
})
export default id => commandDescriptions[id]
```

**After:**
```js
import { t } from '../i18n'

// key 映射：commandId -> i18n key
// 例如 'file.new-tab' -> 'command.file.new-tab'
export default id => t(`command.${id}`) || id
```

`zh-CN.json` 中的 `command.*` 命名空间直接用原始 commandId 作为子 key，如 `command.file.new-tab`，这样映射零转换成本。

### 6. 语言选择器状态

当前阶段不启用切换，保持 `:disable="true"`，但更新选项列表：

```js
// src/renderer/prefComponents/general/config.js
export const languageOptions = [{
  label: '简体中文',
  value: 'zh-CN'
}, {
  label: 'English',
  value: 'en'
}]
```

默认值改为 `'zh-CN'`：
```js
// src/renderer/store/preferences.js
language: 'zh-CN',
```

后续启用切换时只需：
1. 去掉 `:disable="true"`
2. 实现切换逻辑（加载新 locale + main 进程菜单重建）

### 7. Element UI 组件内置文本

Element UI 的日期选择器、分页等组件有内置文本。切换为 `element-ui/lib/locale/lang/zh-CN` 后这些会自动中文化。

### 8. 构建与发布

#### 8.1 开发环境

```bash
nvm use 16          # Node >=16 <17
yarn install        # 安装依赖（会自动 electron-rebuild）
yarn run dev        # 开发模式运行
```

#### 8.2 macOS 构建

```bash
yarn run release:mac   # 输出 dmg + zip (x64 + arm64)
```

本地 macOS 构建无障碍。

#### 8.3 Windows 构建

优先方案：**GitHub Actions Windows runner**（public repo 免费）。

备选方案：
- 本地 Windows 笔记本构建
- 将 Windows 笔记本注册为 self-hosted runner

不需要 Windows 签名证书（unsigned 包用户可安装，只是有 SmartScreen 警告）。

#### 8.4 GitHub Actions 配置

复用现有 `.github/workflows/build.yml` 和 `release.yml`，调整 Node 版本为 16。

## 工作分解

### 阶段 1：基础设施（~0.5 天）

1. 安装 vue-i18n@8
2. 创建 `src/locales/` 目录和文件结构
3. 创建 `src/main/i18n.js` 翻译函数
4. 修改 `src/renderer/main.js` 初始化 vue-i18n + Element UI 中文 locale
5. 修改默认语言为 `zh-CN`
6. 验证开发环境能正常启动

### 阶段 2：主进程菜单汉化（~1 天）

1. 提取 11 个菜单模板文件中 ~132 个 label 到 `zh-CN.json` 的 `menu.*` 命名空间
2. 同时生成 `en.json`（从源码提取原文）
3. 修改每个菜单模板文件，将 `label: '英文'` 改为 `label: t('menu.xxx')`
4. 提取 main 进程右键菜单的 ~9 个 label
5. 启动验证菜单显示中文

### 阶段 3：Renderer 组件汉化（~1.5 天）

1. 提取 `prefComponents/` 下 ~10 个文件 ~40 个字符串
2. 提取 `components/` 下 ~17 个文件 ~24 个字符串
3. 提取 `contextMenu/` 下 ~13 个 label
4. 提取 `commands/descriptions.js` ~120 个命令描述
5. 将所有 `.vue` 文件中的硬编码字符串替换为 `$t()` 调用
6. 修改 `prefComponents/general/config.js` 中的选项 label
7. 验证所有页面显示中文

### 阶段 4：构建与验证（~1 天）

1. macOS 本地构建验证
2. 配置 GitHub Actions Windows 构建
3. Windows 包测试（可在 Windows 笔记本上验证）
4. 检查遗漏字符串并补齐
5. 术语一致性审查

**预估总工时：4-5 天**

## 约束与边界

### IN SCOPE

- 引入 vue-i18n 架构
- 提取并翻译所有用户可见字符串
- 主进程菜单中文
- 偏好设置页面中文
- 右键菜单中文
- 命令面板中文
- Element UI 组件中文化
- macOS + Windows 构建流程

### OUT OF SCOPE（本阶段不做）

- 语言切换功能（选择器保持禁用）
- en.json 翻译质量验证
- Linux 构建
- 代码签名
- 自动更新服务器
- 功能性 bug 修复（仅做汉化，不修原有 bug）
- muya 编辑器内核的文本（如 placeholder 提示等，需单独评估）

### 风险

1. **muya 子模块**：`src/muya/` 是一个内嵌的编辑器库，可能有自己的硬编码字符串。需在实施阶段 3 开始前扫描一次，评估影响范围。如果 muya 内部也有大量硬编码字符串，需要决定是翻译 muya 还是标记为 OUT OF SCOPE。
2. **Native 依赖**：`yarn install` 可能因 node-gyp 版本问题失败，需要 Node 16 环境。
3. **字符串遗漏**：某些字符串可能在条件分支或动态生成的代码中，难以通过 grep 发现。需要运行时人工验证。
4. **术语一致性**：需要维护一份术语表，确保同一概念在不同位置使用相同翻译。

### 术语表（核心术语预定义）

| 英文 | 中文 | 备注 |
|------|------|------|
| Tab | 标签页 | 不用"选项卡" |
| Window | 窗口 | |
| Preferences | 偏好设置 | 不用"首选项" |
| Sidebar | 侧边栏 | |
| Command Palette | 命令面板 | |
| Source Code Mode | 源代码模式 | |
| Typewriter Mode | 打字机模式 | |
| Focus Mode | 专注模式 | |
| Quick Open | 快速打开 | |
| Auto Save | 自动保存 | |
| Export | 导出 | |
| Import | 导入 | |
| Theme | 主题 | |
| Paragraph | 段落 | |
| Format | 格式 | |
| Line Ending | 行尾符 | |
| Encoding | 编码 | |
| Spellchecker | 拼写检查 | |
| Front Matter | 前置元数据 | |
| Code Fence | 代码块 | |
| Quote Block | 引用块 | |
| Horizontal Line | 分隔线 | |

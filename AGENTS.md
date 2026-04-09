# AGENTS.md

## Project

MarkText — Electron + Vue 2 Markdown editor. Fork from marktext/marktext, now with Chinese (zh-CN) localization via vue-i18n.

## Stack

- Electron ^18.0.4, Vue ^2.6.14, Vuex ^3.6.2, Vue Router ^3.5.3
- vue-i18n **v8** (NOT v9+ — v9 is Vue 3 only)
- Element UI ^2.15.8 (locale set to zh-CN)
- Webpack 5 via `.electron-vue/` build system
- Yarn 1.x (NOT npm)

## Environment

- **Node.js >=16 <17** — other versions will fail. No `.nvmrc` exists; pin manually.
- **Python >=3.6** with `setuptools` installed — node-gyp requires `distutils` (removed in Python 3.12+; `pip3 install setuptools` fixes it)
- `yarn install` triggers `electron-rebuild -f` via postinstall — native modules (ced, fontmanager-redux, keytar, native-keymap) must compile

## Commands

```bash
yarn run dev              # Dev mode with hot reload
yarn run pack:main        # Build main process only (webpack production)
yarn run pack:renderer    # Build renderer process only
yarn run build:bin        # Build binary (no installer)
yarn run release:mac      # Build macOS .dmg + .zip (x64 + arm64)
yarn run release:win      # Build Windows installer
yarn run lint             # ESLint for src/ and test/
yarn run lint:fix         # ESLint with auto-fix
yarn run unit             # Karma unit tests
yarn run e2e              # Playwright e2e tests (requires pack first)
yarn run rebuild          # electron-rebuild -f (rebuild native modules)
```

## Architecture

```
src/
  main/           # Electron main process (Node.js)
    menu/         # Application menu templates
    i18n.js       # Main process t() — require()s zh-CN.json directly
  renderer/       # Electron renderer process (Vue 2)
    components/   # Vue UI components
    prefComponents/ # Settings/preference pages
    commands/     # Command palette descriptions
    contextMenu/  # Renderer-side context menus
    i18n.js       # Renderer t() for pure JS files (ESM import of zh-CN.json)
    main.js       # Vue entry — initializes vue-i18n + Element UI zh-CN locale
  muya/           # Embedded editor library (NOT a Vue component — plain DOM)
    lib/ui/       # UI widgets (imageSelector, formatPicker, quickInsert, etc.)
    lib/parser/   # Markdown parser and renderers
  locales/        # Shared translation files (used by both main and renderer)
    zh-CN.json    # Primary locale (Chinese)
    en.json       # English originals (extracted from source, not validated)
    index.js
  common/         # Shared utilities between processes
```

## i18n Conventions

- **Vue files**: use `$t('key')` — reactive, works with vue-i18n
- **Pure JS files** (renderer): use `import { t } from '@/i18n'` — non-reactive but same key space
- **Main process files**: use `import { t } from '../../i18n'` (adjust relative path) — reads JSON directly via require()
- **Key naming**: `menu.file.newTab`, `pref.general.autoSave`, `muya.formatPicker.bold`, `command.edit.undo`
- **Language selector** in Preferences is **disabled** (`:disable="true"`) — first release is Chinese-only
- Default language is `zh-CN` (set in `src/renderer/store/preferences.js`)

## ESLint Import Aliases

```
@       → src/renderer/
common  → src/common/
muya    → src/muya/
```

## Style Rules

- 2-space indent, no semicolons (`semi: [2, 'never']`)
- `prefer-const` is OFF — `let` is acceptable everywhere
- `arrow-parens` is OFF
- `no-console` is OFF

## Gotchas

- `yarn add <pkg>` runs postinstall which triggers `electron-rebuild` AND `lint:fix` — can be slow or fail on native modules
- Webpack-bundle-analyzer "Error parsing bundle asset" warnings on first dev build are harmless
- `src/muya/` has its own webpack config (`src/muya/webpack.config.js`) but is typically built as part of the main renderer bundle
- The `dist/electron/` output is gitignored — always run `yarn run pack:*` or `yarn run dev` before testing
- Element UI locale must be set separately from vue-i18n: `elementLocaleInstaller.use(elementLocale)` in `src/renderer/main.js`

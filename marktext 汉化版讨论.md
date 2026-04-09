

-----

> marktext 没有中文怎么办？

我先确认一下 MarkText 现在的语言支持和官方说法，再给你最稳妥的解决办法。

有两种情况。

**第一种：你这版其实能切。**
到 `File -> Preferences -> General -> Misc` 里看 **User interface language**。如果这里能选，就切到中文后重启。MarkText 仓库里确实有中文文档/翻译资源。

**第二种：语言选项是灰的，切不了。**
这不是你不会用，官方仓库里早就有人报过“语言选项灰掉、不能改”的问题；而且到 **2026 年 1 月** 还有用户在 **0.17.1** 上继续报告同样现象。与此同时，官方最新 stable release 还是 **v0.17.1，发布时间是 2022-03-07**。也就是说，MarkText 的中文界面在官方 Windows 版上目前并不稳定，别在这上面花太多时间。turn318514view0

我更建议你这样处理：

1. **先试一次设置里能不能切中文。**
   能切就重启应用。

2. **如果是灰色不可选，直接换。**
   想要开箱就有中文、还比较接近 MarkText 这类 Markdown 体验，我会优先看 **Joplin、Logseq、VNote、Zettlr**。其中 Joplin 和 Logseq 的中文生态通常更省心。这个建议也和 MarkText 近几年更新停滞的现状有关。turn318514view0

3. **不太建议装来路不明的“汉化版”。**
   GitHub 上确实有第三方中文包/汉化版仓库，但它们是**非官方**方案，版本可能落后，也有安全和兼容风险。

你要是愿意，我可以直接按你的需求给你换成一款：
**“最像 MarkText 的”**、**“中文最省心的”**、或者 **“适合写技术文档的”**。

-----

> 我如果自己给 marktext 做一个 ui 汉化，难度有多大？

我先看一下 MarkText 现在仓库里的国际化实现和最近维护状态，再给你一个尽量实在的难度评估。

我已经确认到两点：MarkText 不是“完全没做国际化”，仓库 README 里就列了多种翻译，且有 `zh_cn` 文档；但官方 stable 版停在 2022-03-07，而且 2026 年还有人反馈 Windows 里语言项是灰的。也就是说，做“私有汉化版”比做“等官方修好”靠谱得多。 turn262191view1

不算特别难，但也不是“改几个词”那么轻。

我的判断是：

**如果你只是想做一个自己能用的中文私有版：中等偏低，约 4/10。**
**如果你想做一个可长期维护、能发给别人装的 Windows 汉化版：中等，约 6/10。**
**如果你想把它修成官方可合并、可持续发布的方案：中等偏高，约 7/10。**

原因是 MarkText 本身已经不是从零开始做国际化了。仓库 README 直接列出了多语言翻译，项目里也有 `docs/i18n/zh_cn.md`，而且它的技术栈是 **Electron + Vue/Vuex**，说明 UI 文本本来就有一定的可本地化基础。真正麻烦的地方，更可能在于 **现成 Windows 包里的语言切换/打包流程**，而不是“先发明一套 i18n 系统”。turn262191view1turn770145view1

更直白一点分三档看：

**1. 你自己 fork 一份，强制中文显示**
这是最容易的路线。你不一定要把“语言切换器”修漂亮，只要把默认 locale 固定成中文，补齐少量漏翻字符串，然后自己打包一个 exe 就行。对会一点前端、能看懂 Vue/Electron 项目的人，这通常是“能做出来”的级别。turn770145view0

**2. 你想做一个正常可切换的中文界面版**
这会多一层工作：你要确认哪些 UI 文本已经走了翻译键，哪些还是写死字符串；再把漏掉的菜单、设置页、弹窗、右键菜单、错误提示补进去；最后还要验证 Windows 下语言选择和持久化设置是否正常。这里的难点不是翻译本身，而是“扫尾”和“找漏网之鱼”。turn262191view3

**3. 你想把官方那种‘语言选项灰掉’的问题一起修掉**
这才是偏难的部分。GitHub 上这个问题 2019 年就有人报，2026 年还有用户在 0.17.1 上继续反馈，说明它不是单纯缺中文文本，而更像是 **语言切换逻辑、平台判断、设置页可用性、或打包后的行为** 一类问题。这个就需要你读代码、复现、定位，再测 Windows 包。

你实际会碰到的工作大概是这些：

- 找到语言资源和调用点，确认哪些字符串已经可翻译，哪些写死了。项目架构里 `src/main`、`src/renderer` 分得很清楚，UI 相关主要会在 renderer 侧。
- 补中文文案，统一术语。像菜单、偏好设置、导出、拼写、图片上传这些地方最容易漏。仓库文档本身已经有中文页面，能帮你统一部分术语。
- 在本地跑开发环境并重新打包。官方构建说明要求 **Node.js >=16 且 <17、yarn、Python >=3.6、C++ 开发工具**；Windows 下还偏向 **Visual Studio 2019**，旧系统可能还要 Windows 10 SDK。
- 最后打 Windows 包验证。官方 `build` 脚本会生成二进制和安装包，Windows 直接跑 installer。

我会这样给你估时：

**会前端但没碰过 Electron/Vue 项目**：
做出“自己能用的汉化版”通常是 **半天到两天** 的量级。turn770145view1

**会 Electron/Vue，也接受先 hardcode 中文**：
大概率 **几个小时到一天** 能看到成果。难点主要是装构建环境和补漏翻。turn770145view1

**想做成完整、可分发、可长期跟进的 fork**：
成本会明显上升，因为官方最近公开 stable release 还停在 **2022-03-07 的 v0.17.1**，后续你基本要自己承担维护。

所以结论是：

**“自己做个能用的 MarkText 中文 UI 版”——可做，难度中等偏低。**
**“把它做成靠谱成品并把语言切换问题也修顺”——难度中等。**
**“指望上游很快接收并发布”——不太乐观。**

你真要动手，我建议走这条最省力路线：

**fork -> 强制 zh-CN -> 补漏翻 -> 本地打包 Windows 版。**
先别碰“通用语言切换器修复”，先拿到一个你自己能稳定用的版本，性价比最高。这个项目的构建入口已经很明确：`yarn install`，开发模式 `yarn run dev`，打包 `yarn run build`。

要的话，我下一条可以直接给你一份 **“MarkText 私有汉化 fork 的最短实施清单”**，按“先找文件、再改哪几处、最后怎么打包”写给你。

-----

> 我用的 macOS 开发，能打包 Windows 版吗？要不要什么开发者账号、证书之类的?

我先核对一下 MarkText 的官方构建说明，以及 Electron 在 macOS 上打 Windows 包和签名的要求，再给你一个能直接落地的答案。

我已经确认：原则上 macOS 能本地打 Windows 包，但有一个实际坑——MarkText 这类 Electron 项目带原生依赖时，跨平台构建不一定一次成功，这会影响你是“直接在 Mac 打”还是“最后放到 Windows/CI 打”。

可以。**从 macOS 给 MarkText 打 Windows 版，原则上是可行的**。MarkText 仓库里本身就在用 `electron-builder`，而 `electron-builder` 官方明确说：**在 macOS/Linux 上可以本地构建 Windows 包**，只是 **Windows Store 的 AppX 目标除外**。MarkText 自己的构建文档也写了它支持在 macOS/Windows/Linux 上构建。turn670302view1turn670302view0

但有个现实坑：**跨平台打包不一定一次成功**。`electron-builder` 官方说明，如果项目里有 **native dependency**，那它通常只能在目标平台编译，除非这些依赖提供了可直接用的预编译二进制。MarkText 的构建问题里能看到它会重建 `keytar`、`keyboard-layout`、`fontmanager-redux`、`cld`、`spellchecker` 这类原生依赖，所以你在 Mac 上直接出 Windows 包，可能能成，也可能会卡在原生模块上。真遇到这类问题，最稳的做法通常是最后改用 **Windows VM** 或 **Windows CI** 来出正式包。turn573387view0turn573387view1

**开发者账号 / 证书这块分开看：**

- **只是打出一个自己测试用的 Windows 安装包**：一般**不需要开发者账号**，也**不需要证书**；签名是额外配置的步骤，不配就走 unsigned 包。`electron-builder` 把签名写成“如果配置了签名值就自动执行”的流程，本身说明签名不是构建的前置硬要求。
- **想发给别人装，尽量减少“未知发布者”警告**：你就需要 **Windows 代码签名证书**。Electron 官方写得很直白：给 Windows 应用签名，需要先拿到 code signing certificate，而且这类证书是微软生态里在公开市场购买的，不是 Apple Developer 那套。turn117250view2
- **如果你问的是 Apple 开发者账号**：做 **Windows 包** 不需要；Apple Developer Program 是给 **macOS 签名/公证** 用的。turn117250view1

还有一个现在要注意的点：Electron 官方文档写到，**自 2023 年 6 月起**，要想让 Windows 端签名真正带来效果，基本要走 **EV code signing certificate**；旧的普通 OV/软件证书已经不再带来有效收益，Windows 仍会把应用当成接近未签名来警告。官方也提到一种替代路线是 **Azure Trusted Signing**。turn332206view0

你在 macOS 上如果只是要把 Windows 版做出来，我建议你这样判断：

1. **先在 Mac 本地做 unsigned Windows 包**，验证你的 UI 汉化是否正常。
2. **如果卡在 native dependency**，直接切到 **Windows 虚拟机 / GitHub Actions Windows runner**。
3. **等确定要公开发给别人**，再决定要不要买 **Windows 签名证书**。turn573387view0turn117250view1

结合 MarkText 这个项目，我给你的实际建议是：

**能先用 Mac 做开发和本地验证；正式出 Windows 可分发安装包，最好准备一个 Windows 构建环境。** 这样省时间，也更少踩原生依赖和签名的坑。turn573387view0

要的话，我可以下一条直接给你一份 **“macOS 开发 + Windows 打包”的最短落地方案**，包括：
`Node/Yarn/Python 版本、先改哪几个文件、在 Mac 先怎么试、失败后怎么切 Windows CI`。

-----

> 好的，github 或者 cloudflare 之类的有没有提供 Windows ci构建环境？我有一台 Windows 笔记本，是不是也能自己做这个环境？Windows 签名证书怎么买？这些 github 开源软件的开发者，他们打的包都是有证书的吗？

我在核对三块：现成的 Windows CI、你自己搭 Windows 构建机的可行性、以及 Windows 签名证书现在怎么购买和实际有多少开源项目会签。

我这边已经把关键点对上了：GitHub 有现成的 Windows runner；Cloudflare 的 Pages 构建环境是 Ubuntu 容器，不是 Windows；你自己的 Windows 笔记本也完全能当自托管 runner。接下来我把“什么时候该用哪一种”和“签名证书到底值不值得买”一起给你捋顺。

有。

**GitHub Actions：有现成的 Windows CI。** GitHub 官方提供 **GitHub-hosted Windows runners**，跑在 Azure 的虚拟机上；对 **public repo**，标准 runner 是 **free and unlimited**。这对开源项目很合适。turn489998view1

**Cloudflare：不适合拿来做 Windows 安装包构建。** Cloudflare Pages 的构建环境是 **gVisor container**，当前文档写的是 **Ubuntu 22.04.2 / x86_64**，本质上是 Linux build image，不是 Windows runner。拿它跑前端站点构建没问题，但不适合做你这种 Windows 桌面安装包产物。

你也不一定非得用 GitHub。**Azure Pipelines** 有微软托管的 Windows agent，**CircleCI** 也有 Windows execution environment。要是你已经把代码托管在 GitHub，上手成本最低的通常还是 GitHub Actions。turn910990view3

**你那台 Windows 笔记本当然也能自己做环境。** 最直接的两种方式是：一是本地手工构建；二是把它挂成 **GitHub self-hosted runner**。GitHub 官方明确说 self-hosted runner 可以是 **physical、virtual、on-prem、cloud**，你可以完全自定义软件环境，但操作系统和依赖更新也要你自己管。

结合你前面这个 MarkText 私有汉化场景，我会更偏向这条路：**日常开发在 macOS，正式 Windows 构建放 GitHub Actions 或你的 Windows 笔记本**。尤其如果后面碰到原生依赖、Windows 特有行为，或者签名流程，Windows 本机通常更省事。electron-builder 也说明过：在 macOS/Linux 给 Windows 应用签名是支持的，但如果涉及 **EV 证书**，在 Unix 上往往要额外折腾 **PKCS#11 / JSign / osslsigncode**。

**Windows 签名证书怎么买？** 现在主流有两条路：

第一条是买传统证书。Electron 官方文档写得很清楚：Windows 代码签名证书可以在公开市场购买，常见卖家包括 **DigiCert、Sectigo、SSL.com** 等。它同时提醒，从 **2023 年 6 月** 起，Windows 侧真正有用的做法基本要走 **EV code signing certificate**；以前那种更便宜的普通软件签名证书，Windows 会基本按“没签”对待并继续弹强警告。turn489998view5

第二条是用微软的托管签名服务。Azure 的 **Artifact Signing** 官方定价页现在写的是 **Basic $9.99/月，含 5,000 次签名；超出部分$0.005/次**。如果你不想自己折腾 USB token / HSM，这条路很有吸引力。

传统证书购买后，密钥存放方式现在也更偏硬件或托管。比如 **Sectigo** 官方页写到证书可以装在 **Sectigo token** 上寄给你，或者装到你自己的合规 HSM 上；它的官方起步价页面写的是 **$536.25/年起**。**DigiCert** 官方页则写了几种存储方式：**KeyLocker cloud、DigiCert 提供的硬件 token、你自有 token、你自有 HSM**，并且明确提到与 Microsoft 要求兼容的 EV 方案。turn489998view7

所以“怎么买”落到实操上，通常是这四步：**选方案（传统 EV 证书或 Azure Artifact Signing）→ 做主体身份验证 → 拿到 token/HSM/托管签名权限 → 接到 CI 里**。如果你走 electron-builder，官方文档写了：只有在你提供了像 `CSC_LINK`、`WIN_CSC_LINK` 这类签名配置时，构建时才会自动签名。

**GitHub 上那些开源软件，发布包是不是都签了？不是。** 我没法给你一个全平台精确比例，但从工具链和成本看，**签名并不是打包的硬前提**：electron-builder 的文档就是“提供正确签名配置时自动签名”，不是“没有证书就不能出包”；而签名这件事现在又要么买 EV 证书，要么长期付托管签名费用。基于这些约束，很多个人或小团队的 GitHub 开源项目发布 **unsigned zip/exe** 一点也不奇怪；相反，**体量较大、面向普通终端用户的软件** 更可能会签。这个判断属于基于官方工具链和官方价格的推断。turn489998view4turn489998view8turn489998view6

还有个例外：如果走 **Windows Store / AppX** 分发，electron-builder 文档说 **不需要你自己签**，商店提交流程里会由 **Microsoft certificate** 来签。

按你这个项目，我会这样选：

- **先做汉化验证版**：直接用 **GitHub Actions Windows runner** 或你的 **Windows 笔记本** 出 unsigned 包。turn489998view2
- **准备给少量人内测**：仍然可以先 unsigned，只是用户会看到更明显的安全提示。这个结论和 Electron 对 EV 的说明一致。
- **准备长期公开发布**：再认真考虑 **EV 证书** 或 **Azure Artifact Signing**。turn489998view6

你要的话，我下一条直接给你一份 **“最省钱方案”** 和 **“最省心方案”**：
一个是 `GitHub Actions + unsigned`，一个是 `GitHub Actions + Azure Artifact Signing`。

-----

> 就是说 Windows 软件安装包不签名，用户安装起来影响也没那么大？不会像 macOS 那样不签名就很难让普通用户装上？

我去把 Windows 的 SmartScreen 和 macOS 的 Gatekeeper 现行行为对一下，给你一个别踩坑的判断。
---
title: monorepo项目的搭建(husky+eslint+prettier+git hooks)
date: 2023-3-25 11:29:00
updated: 2023-3-29 18:34:00
tags:
  - monorepo
categories:
  - FE
---

项目文件：[Plumbiu/monorepo](https://github.com/Plumbiu/monorepo)

# turborepo 的安装

安装 `turborepo`：

```bash
npx create-turbo@latest
```

最终项目结构：

![](https://plumbiu.github.io/blogImg/Snipaste_2023-03-25_11-30-25.png)

删除最开始的 `packages`、`apps` 目录和 `.eslintrc.js` 文件。新建 `server` 目录。同时，还需要修改根目录中的 `package.json` 配置：

```json
"workspace": [
    "client/",
    "server/"
]
"script": {
-  "lint": "turbo run lint"
-  "format": "prettier --write \"**/*.{ts,tsx,md}\"",
}
"devDependencies": {
-    "eslint-config-custom": "*",
-  "prettier": "latest",
}
```

在 `server` 目录下运行：

```bash
yarn init -y
```

运行之后在**根目录**执行执行：

```bash
yarn create vite # 根据命令选择框架，项目名记得改为 client
```

假设我们的后端项目是基于 `express` 框架构建，需要在 `server` 目录中安装 `express` 依赖，需要在根目录下运行(需要先配置根目录中的 `package.json`，见下面)：

```bash
yarn workspace server add express
```

另外，在 `server` 目录下新建 `index.js`，然后配置 `server` 中的 `package.json` 文件

```json
"script": {
    "dev": "nodemon ./index.js"
}
```

在根目录下运行以下代码，就可以同时启动前端和后端服务了：

```bash
yarn dev
```

>   注意：如果想要安装依赖，请在根目录下运行 `yarn` 或者 `yarn workspace ${workspace} add ${package}`。不要进工作目录安装！

# 加入 `eslint` 校验与自动格式化

>   本项目开发的 IDE 为 VSCode，请事先安装 `prettier` 和 `eslint` 插件

`eslint` 在运行代买前就可以发现一些语法错误和潜在 bug，保证项目成员的代码一致性和表面错误

`prettier` 是代码格式化工具，检测代码中的格式问题，保证项目成员的代码风格

>   区别和联系：`ESlint` 偏向把控项目的代码质量，而 `Prettier` 更偏向于统一的代码风格，虽然 `ESlint` 有一部分的代码格式化功能，但不如 `Prettier` 丰富，一般和 `Prettier` 结合使用

1.   **安装依赖：**

```bash
yarn add eslint eslint-plugin-vue eslint-config-prettier prettier eslint-plugin-import eslint-plugin-prettier eslint-config-airbnb-base @eslint/create-config -D -W
```

>   各个依赖解释：
>
>   -   eslint：ESlint 核心代码
>   -   prettier：prettier 格式化代码核心库
>   -   eslint-config-airbnb-base：airbnb 的代码规范(依赖 plugin-import)
>   -   eslint-config-prettier：eslint 结合 prettier 的格式化
>   -   eslint-plugin-vue：eslint 在 vue 里的代码规范
>   -   eslint-plugin-import：项目里面支持 eslint
>   -   eslint-plugin-prettier：将 prettier 结合进入 eslint 的插件
>   -   @eslint/create-config：创建 .eslintrc.cjs 的依赖

2.   配置并执行 `package.json` 中的脚本

```json
"script": {
    "lint:create": "eslint --init"
}
```

配置好后，运行 `yarn lint:create`，会出现可视化的选择工具：

![](https://plumbiu.github.io/blogImg/Snipaste_2023-03-24_21-50-59.png)

-   To check syntax only：只检查代码
-   To check syntax and find problems：检查代码并找出错误
-   To check synctax, find problems, and enforce code style：检查代码、找出错误并强行更改代码风格

选项：

![](https://plumbiu.github.io/blogImg/Snipaste_2023-03-24_21-54-46.png)

选择完毕之后便会自动创建一个 `.eslintrc.js` 文件

3.   额外依赖

```bash
yarn add typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-import-resolver-alias @types/eslint @types/node -D -W
```

>   各个依赖解释：
>
>   -   @typescript-eslint/parser：ESLint 的解析器，用于解析 typescript，从而检查和规范 Typescript 代码
>   -   @typescript-eslint/eslint-plugin：Eslint 插件，包含了各类定义好的检查 TypeScript 代码的规范
>   -   eslint-import-resolver-alias：让我们可以 import 的时候使用 @ 别名

4.   修改 `.eslintrc.js` 文件

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  plugins: ['vue', '@typescript-eslint'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 13,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      tsx: true
    }
  },
  settings: {
    'import/resolver': {
      // 项目里的别名
      alias: {
        map: [['@', './client/src']]
      }
    },
    // 运行的扩展名
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx', '.mjs']
  },
  extends: [
    'airbnb-base',
    'plugin:vue/vue3-strongly-recommended',
    // 解决 prettier 冲突
    'prettier'
  ],
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly'
  },
  // 自定义规则，根据组内成员灵活定义，可以覆盖上面 extends 继承的第三方库的规则
  rules: {
    // 禁止使用多余的包
    'import/no-extraneous-dependencies': 0,
    'no-param-reassign': 0,
    'vue/multi-word-component-names': 0,
    'vue/attribute-hyphenation': 0,
    'vue/v-on-event-hyphenation': 0,
    'import/newline-after-import': 1,
    'vue/comment-directive': 0,
    "no-console": 1,
  }
}
```

最后修改根目录 `package.json` 文件，添加一个脚本命令：

```json
"script": {
    "lint": "eslint \"client/src/**/*.{js,ts,vue,jsx,tsx}\" --fix"
}
```

5.   vite 集成 eslint

此依赖可以方便的得到 eslint 支持，完成 eslint 配置后，可以快速地将其继承进  vite 之中，便于在代码不符合 eslint 规范的第一时间提示

```
yarn workspace client add vite-plugin-eslint -D
```

修改 **vite.config.ts**

```typescript
import eslintPlugin from 'vite-plugin-eslint'
export default defineConfig({
    plugins: [vue(), eslintPlugin()],
})
```

6.   新建 `eslintrcignore`、`.prettierignore`、`prettierrc.cjs` 三个文件

内容分别为：

```
.eslintrcignore

*.sh
node_modules
*.module
*.woff
*.ttf
.vscode
.idea
dist
/public
/docs
.husky
/bin
.eslintrc.js
prettier.config.js
/src/mock/*

logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

.DS_Store
dist-ssr
*.local

/cypress/videos/
/cypress/screenshots.

.vscode
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

components.d.ts
.prettierignore

/dist/*
.local
.output.js
/node_modules/**
src/.DS_Store

**/*.svg
**/*.sh

/public/*
components.d.ts
module.exports = {
    // 一行最多 80 个字符
    printWidth: 80,
    // 使用 2 个空格缩进
    tabWidth: 2,
    // 不是用缩进符，而使用空格
    useTabs: false,
    // 行尾无分号
    semi: false,
    // 使用单引号
    singleQuote: true,
    // 对象的 key 仅在必要时使用引号
    quoteProps: 'as-needed',
    // jsx 使用单引号
    jsxSingleQuote: false,
    // 尾随逗号
    trailingComma: 'es5',
    // 大括号内的首尾需要空格
    bracketSpacing: true,
    // 箭头函数，只有一个参数的时候，也需要括号
    arrowParens: 'always',
    // 每个文件格式化的范围是文件的全部内容
    rangeStart: 0,
    rangeEnd: Infinity,
    // 不需要写文件开头的 @prettier
    requirePragma: false,
    // 不需要自动在文件开头插入 @prettier
    insertPragma: false,
    // 使用默认的折行标准
    proseWrap: 'always',
    // 根据显示样式决定 html 要不要拆行
    htmlWhitespaceSensitivity: 'css',
    // 换行符使用 lf
    endOfLine: 'lf'
}
```

>   注意：由于本项目是 `monorepo`，所以最好在每个 `workspace` 都加上 `.eslintrcignore` 和 `.prettierignore`

配置好后，我们就可以 `ctrl + s` 保存代码的时候自动格式化了，当然我们不希望每次敲完代码都要 `ctrl s` 一下，这时候配置一下根目录中的 `pageage.json` 脚本，执行后就可以将规定目录所有代码格式化：

```json
"script": {
    "prettier-format": "prettier --config .prettierrc.cjs \"client/src/**/*.{vue,js,ts}\" --write"
}
```

# Husky、lint-staged、commitlint 集成

这些工具主要是规范 git 操作

-   **husky** 是一个 git hooks，能够在 git 操作前自动触发一些函数

-   **lint-staged** 过滤出 Git 代码暂存区文件的工具，将所有暂存文件的列表传递给任务

-   **commitlint** 可以自校验 git commit 规范

操作步骤：

1.   **安装：**在项目根目录安装需要 `-W` 参数

```bash
yarn add lint-staged husky -D -W
```

2.   **配置根目录 `package.json` 文件**

```json
"script": {
    "prepare": "husky install"
}
```

3.   **安装 husky hooks**

```
yarn prepare
```

4.   添加 git hooks

`pre-commit` 钩子一般添加的是 `lint-stage` 去对 git 暂存区的代码做一些格式化的操作

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

**参数说明**

-   add：添加
-   set：直接覆盖

执行命令成功之后，`.husky` 目录中会多一个 `pre-commit` 文件，内容如下：

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

当然，需要安装 `lint-staged` 依赖：

```bash
yarn add lint-staged -D -W
```

5.   **配置 client 目录 `package.json` 文件**

如果希望能够自动在 commit 前修复错误，可以这样配置：

```json
"lint-staged": {
    "*.{js,ts,vue,jsx,tsx}": [
      "yarn lint",
      "yarn prettier-format"
    ]
},
```

如果希望只是抛出错误，可以这样配置，表示没有 warnings 警告：

6.   `git commit` 注释格式化

**安装：**

```bash
yarn add @commitlint/config-conventional @commitlint/cli -D -W
```

**添加到 git 钩子：**

```
npx husky add .husky/commit-msg "npx --no -- commitlint --edit ${1}"
```

7.   **添加 commitlint 配置文件:**

在项目根目录中新建 `commitlint.config.js` 文件， 内容如下(感谢 xy 大佬 [camera-2018 (github.com)](https://github.com/camera-2018))

```javascript
// @see: https://cz-git.qbenben.com/zh/guide
/** @type {import('cz-git').UserConfig} */

module.exports = {
  ignores: [commit => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'subject-case': [0],
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能(feature)
        'fix',      // 修复 bug 
        'docs',     // 文档
        'style',    // 格式(不影响代码运行的变动)
        'refactor', // 重构
        'perf',   // 性能优化
        'test',   // 测试(单元、集成测试)
        'build',  // 编译相关的修改，例如发布版本、对项目构建或者以来的改
        'ci',   // CI 的修改
        'chore',  // 构建过程或辅助工具的变动，比如增加依赖库等
        'revert', // 撤销 commit，回滚到上一个版本
        'wip',
        'workflow',
        'types',
        'release',
      ],
    ],
  },
  prompt: {
    messages: {
      // type: 'Select the type of change that you're committing:',
      // scope: 'Denote the SCOPE of this change (optional):',
      // customScope: 'Denote the SCOPE of this change:',
      // subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
      // body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
      // breaking: 'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
      // footerPrefixsSelect: 'Select the ISSUES type of changeList by this change (optional):',
      // customFooterPrefixs: 'Input ISSUES prefix:',
      // footer: 'List any ISSUES by this change. E.g.: #31, #34:\n',
      // confirmCommit: 'Are you sure you want to proceed with the commit above?',
      // 中文版
      type: '选择你要提交的类型 :',
      scope: '选择一个提交范围（可选）:',
      customScope: '请输入自定义的提交范围 :',
      subject: '填写简短精炼的变更描述 :\n',
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
      footerPrefixsSelect: '选择关联issue前缀（可选）:',
      customFooterPrefixs: '输入自定义issue前缀 :',
      footer: '列举关联issue (可选) 例如: #31, #I3244 :\n',
      confirmCommit: '是否提交或修改commit ?',
    },
    types: [
      // 英文
      // { value: 'feat', name: 'feat:     🚀  A new feature', emoji: '🚀' },
      // { value: 'fix', name: 'fix:      🧩  A bug fix', emoji: '🧩' },
      // { value: 'docs', name: 'docs:     📚  Documentation only changes', emoji: '📚' },
      // { value: 'style', name: 'style:    🎨  Changes that do not affect the meaning of the code', emoji: '🎨' },
      // { value: 'refactor', name: 'refactor: ♻️   A code change that neither fixes a bug nor adds a feature', emoji: '♻️' },
      // { value: 'perf', name: 'perf:     ⚡️  A code change that improves performance', emoji: '⚡️' },
      // { value: 'test', name: 'test:     ✅  Adding missing tests or correcting existing tests', emoji: '✅' },
      // { value: 'build', name: 'build:    📦️   Changes that affect the build system or external dependencies', emoji: '📦️' },
      // { value: 'ci', name: 'ci:       🎡  Changes to our CI configuration files and scripts', emoji: '🎡' },
      // { value: 'chore', name: 'chore:    🔨  Other changes that don't modify src or test files', emoji: '🔨' },
      // { value: 'revert', name: 'revert:   ⏪️  Reverts a previous commit', emoji: '⏪️' },
      // 中文版
      // { value: '特性', name: '特性:   🚀  新增功能', emoji: '🚀' },
      // { value: '修复', name: '修复:   🧩  修复缺陷', emoji: '🧩' },
      // { value: '文档', name: '文档:   📚  文档变更', emoji: '📚' },
      // { value: '格式', name: '格式:   🎨  代码格式（不影响功能，例如空格、分号等格式修正）', emoji: '🎨' },
      // { value: '重构', name: '重构:   ♻️  代码重构（不包括 bug 修复、功能新增）', emoji: '♻️' },
      // { value: '性能', name: '性能:   ⚡️  性能优化', emoji: '⚡️' },
      // { value: '测试', name: '测试:   ✅  添加疏漏测试或已有测试改动', emoji: '✅' },
      // { value: '构建', name: '构建:   📦️  构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）', emoji: '📦️' },
      // { value: '集成', name: '集成:   🎡  修改 CI 配置、脚本', emoji: '🎡' },
      // { value: '回退', name: '回退:   ⏪️  回滚 commit', emoji: '⏪️' },
      // { value: '其他', name: '其他:   🔨  对构建过程或辅助工具和库的更改（不影响源文件、测试用例）', emoji: '🔨' },
      // 中英混合版
      { value: 'feat', name: 'feat:       🚀  新增功能', emoji: '🚀' },
      { value: 'fix', name: 'fix:        🧩  修复缺陷', emoji: '🧩' },
      { value: 'docs', name: 'docs:       📚  文档变更', emoji: '📚' },
      { value: 'style', name: 'style:      🎨  代码格式（不影响功能，例如空格、分号等格式修正）', emoji: '🎨' },
      { value: 'refactor', name: 'refactor:   ♻️  代码重构（不包括 bug 修复、功能新增）', emoji: '♻️' },
      { value: 'perf', name: 'perf:      ⚡️  性能优化', emoji: '⚡️' },
      { value: 'test', name: 'test:       ✅  添加疏漏测试或已有测试改动', emoji: '✅' },
      { value: 'build', name: 'build:      📦️  构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）', emoji: '📦️' },
      { value: 'ci', name: 'ci:         🎡  修改 CI 配置、脚本', emoji: '🎡' },
      { value: 'revert', name: 'revert:     ⏪️  回滚 commit', emoji: '⏪️' },
      { value: 'chore', name: 'chore:      🔨  对构建过程或辅助工具和库的更改（不影响源文件、测试用例）', emoji: '🔨' },
    ],
    useEmoji: true,
    themeColorCode: '',
    scopes: [],
    allowCustomScopes: true,
    allowEmptyScopes: true,
    customScopesAlign: 'bottom',
    customScopesAlias: 'custom',
    emptyScopesAlias: 'empty',
    upperCaseSubject: false,
    allowBreakingChanges: ['feat', 'fix'],
    breaklineNumber: 100,
    breaklineChar: '|',
    skipQuestions: [],
    issuePrefixs: [{ value: 'closed', name: 'closed:   ISSUES has been processed' }],
    customIssuePrefixsAlign: 'top',
    emptyIssuePrefixsAlias: 'skip',
    customIssuePrefixsAlias: 'custom',
    allowCustomIssuePrefixs: true,
    allowEmptyIssuePrefixs: true,
    confirmColorize: true,
    maxHeaderLength: Infinity,
    maxSubjectLength: Infinity,
    minSubjectLength: 0,
    scopeOverrides: undefined,
    defaultBody: '',
    defaultIssues: '',
    defaultScope: '',
    defaultSubject: '',
  },
}
```

创建的 git hooks

| 钩子             | 执行时机                                           |
| ---------------- | -------------------------------------------------- |
| pre-commit       | 由 git commit 调用，在 commit 之前执行             |
| commit-msg       | 由 git commit 或 git merge 调用，或者 --amend xxx  |
| pre-merge-commit | 由 git merge 调用，在 merge 之前执行               |
| pre-push         | 被 git push 调用，在 git push 前执行，防止进行推送 |

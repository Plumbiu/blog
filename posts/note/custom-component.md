---
title: Markdown Extensions.
date: 2025-04-27
order: 1
desc: 1
emoji: { num: 🔢 }
definitions: { plumbiu: 'https://github.com/Plumbiu' }
variable: { var_text: 'var_text' }
abbr: { WWW: 'What When Why' }
---

本博客 Markdown 拓展基于 [remark]() 和 [rehype]() 生态构建。

# Markdown 中使用 React 组件

组件需要放置在 [markdown/components](https://github.com/Plumbiu/blog/blob/main/markdown/components) 中，例如 [markdown/components/ExtensionTest.tsx](https://github.com/Plumbiu/blog/blob/main/markdown/components/ExtensionTest.tsx) 内容为：

```tsx path="ExtensionTest"

```

再通过配置 [markdown/custom-components.tsx](https://github.com/Plumbiu/blog/blob/main/markdown/components/custom-components.tsx) 导入该组件：

```tsx
import { lazy } from 'react'
const ExtensionTest = lazy(() => import('./ExtensionTest'))
export const customComponentMap: Record<string, any> = {
  // ...
  ExtensionTest,
}
```

输入：

```markdown
<ExtensionTest />
```

输出：

<ExtensionTest />

# 树

## 文件树

文件夹默认处于全关闭状态，通过在 meta 中加入 open 字符设置为全打开。

规则：

- `+` 字符：文件夹表示默认打开，文件默认选中。
- `-` 字符：文件表示默认关闭，对文件没有影响

输入：

````markdown
```Tree open
- +markdown
  - -plugins
    - remark.ts
    - rehype.ts
  - utils.ts
- +utils.ts
- +package.json
- .gitignore
```
````

```Tree open
- +markdown
  - -plugins
    - remark.ts
    - rehype.ts
  - utils.ts
- +utils.ts
- +package.json
- .gitignore
```

## 代码树

三种方式配置

1. `id` 配置：配置文件 [markdown/config/file-tree.ts](https://github.com/Plumbiu/blog/blob/main/markdown/config/file-tree.ts) 。
2. `dir` 配置：指定项目中的文件夹。
3. `//@tab` 分隔符配置：手写代码

输入：

````markdown
```Tree id="demo" title="Demo App" open
- +markdown
  - -plugins
    - remark.ts
    - rehype.ts
  - utils.ts
- +utils.ts
- +package.json
- .gitignore
```

```Tree dir="markdown/plugins"

```

```ts Tree
//@tab index.ts
export * from './src/utils'
//@tab +src/+utils.ts line
export const isString = (x: unkown): x is string {
  return typeof x === 'string'
}
//@tab types.ts
export type TestString = string
```
````

输出：

```Tree id="demo" title="Demo App" open
- +markdown
  - -plugins
    - remark.ts
    - rehype.ts
  - utils.ts
- +utils.ts
- +package.json
- .gitignore
```

```Tree dir="markdown/plugins"

```

```ts Tree
//@tab index.ts
export * from './src/utils'
//@tab +src/+utils.ts line
export const isString = (x: unkown): x is string {
  return typeof x === 'string'
}
//@tab types.ts
export type TestString = string
```

# Playground

用于展示代码和组件，包括打印栏等。不同 Tab 通过 `//@tab` 表达式分隔，后续可以加上 meta 信息（例如 `line` 显示行数）。其中样式基于 ShadowRoot，不会影响到全局。

> [!NOTE]
>
> `Playground` 为动态运行，有风险，请谨慎使用

## React 组件

支持 `tsx`。

输入：

````markdown
```tsx Playground
//@tab App.jsx
import Random from './Random'

export default function App() {
  console.log('App')
  return <Random />
}
//@tab Random.tsx
export default function Random() {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        console.log('random')
      }}
      className="random"
    >
      {Math.random()}
    </div>
  )
}

//@tab App.css line
.random {
  font-size: 24px;
  color: blue;
}
```
````

输出：

```tsx Playground
//@tab App.jsx
import Random from './Random'
export default function App() {
  console.log('App')
  return <Random onClick={() => console.log('random')} />
}
//@tab Random.tsx
export default function Random(props: any) {
  return <div {...props} className="random">{Math.random()}</div>
}
//@tab App.css line
.random {
  font-size: 24px;
  color: blue;
}
```

## HTML

HTML 暂不支持打印

输入：

````markdown
```html Playground
//@tab index.html
<div class="test">hello</div>
//@tab color.css .test { color: red; font-weight: 600; }
```
````

输出：

```txt Playground
//@tab index.html
<div class="test" onclick="console.log(111)">hello</div>
//@tab color.css
.test {
  color: red;
  font-weight: 600;
}
```

## 用户配置

例如之前的 `ExtensionTest` 组件，可以通过 meta 信息控制：

输入：

````markdown
```tsx Playground path="ExtensionTest" component="ExtensionTest"

```
````

输出：

```tsx Playground path="ExtensionTest" component="ExtensionTest"

```

# 打印

在 `Web Worker` 中运行，主线程不会卡死。

## 基本

输入：

````markdown
```js Log
const start = Date.now()
console.log('start')
while (Date.now() - start < 3000) {}
console.log('end')
```
````

输出：

```js Log
const start = Date.now()
console.log('start')
while (Date.now() - start < 3000) {}
console.log('end')
```

## import

导入其他库需要额外配置文件，具体为 [markdown/config/logger-module-map.ts](https://github.com/Plumbiu/blog/blob/main/markdown/config/logger-module-map.ts) 中的 `getCodeRunnerModuleMap` 函数。

> [!NOTE]
> 由于构建工具无法实现 `dynamic import`，所以这里需要自己手动判断条件引入，可参考上述文件注释导入其他模块。

输入：

````markdown
```ts Log
import { Subject } from 'rxjs'

const subject = new Subject<number>()

subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
})
subject.subscribe({
  next: (v) => console.log(`observerB: ${v}`),
})

subject.next(1)
subject.next(2)
```
````

输出：

```ts Log
import { Subject } from 'rxjs'

const subject = new Subject<number>()

subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
})
subject.subscribe({
  next: (v) => console.log(`observerB: ${v}`),
})

subject.next(1)
subject.next(2)
```

# 代码行数显示

通过配置 meta 信息，展示代码行数。

输入：

````markdown
```tsx line
console.log('1')
console.log('2')
console.log('3')
```
````

输出：

```ts line
console.log('1')
console.log('2')
console.log('3')
```

# 代码高亮

代码高亮分为行高亮和单词高亮，通过 shiki 实现。

这里 `!code` 之后只有一个空格，加了两个防止渲染。

## 行高亮

输入：

````markdown
```ts line {1,3-4}
console.log('1')
console.log('2')
console.log('3')
console.log('4')
console.log('5') // [!code  highlight]
```
````

输出：

```ts line {1,3-4}
console.log('1')
console.log('2')
console.log('3')
console.log('4')
console.log('5') // [!code highlight]
```

## 单词高亮

输入：

````markdown
```ts /log/
// [!code  word:console]
console.log('1')
console.log('2')
console.log('3')
console.log('4')
console.log('5')
```
````

输出：

```ts /log/
// [!code word:console]
console.log('1')
console.log('2')
console.log('3')
console.log('4')
console.log('5')
```

## 增删高亮

这里 `!code` 之后也是只有一个空格，加了两个防止渲染。

输入：

````markdown
```diff-js
-console.log('----')
+console.log('+++')
```

```js
console.log('----') // [!code  --]
console.log('+++') // [!code  ++]
```
````

输出：

```diff-js
-console.log('----')
+console.log('+++')
```

```js
console.log('----') // [!code --]
console.log('+++') // [!code ++]
```

# 代码折叠

输入：

````markdown
```js line collapse="1-3,6-7,10"
console.log('1')
console.log('2')
console.log('3')
console.log('4')
console.log('5')
console.log('6')
console.log('7')
console.log('8')
console.log('9')
console.log('10')
```
````

输出：

```js line collapse="1-3,6-7,10"
console.log('1')
console.log('2')
console.log('3')
console.log('4')
console.log('5')
console.log('6')
console.log('7')
console.log('8')
console.log('9')
console.log('10')
```

# 本地远程代码

用户本地文件和远程文件代码通过配置 meta 中的 `path` 属性

输入：

````markdown
```jsx path="ExtensionTest"

```

```js path="https://gist.githubusercontent.com/Plumbiu/7fc950397d9913b6f9558f7fc2c541ed/raw/4a3c95548679087f4ccd6ac032ed7aa1b1ca7e87/blog-remote-test.js"

```
````

输出：

```jsx path="ExtensionTest"

```

```js path="https://gist.githubusercontent.com/Plumbiu/7fc950397d9913b6f9558f7fc2c541ed/raw/4a3c95548679087f4ccd6ac032ed7aa1b1ca7e87/blog-remote-test.js"

```

# 代码分组

meta 添加 Switcher 字符，并通过 `//@tab` 语法划分。

输入：

````markdown
```bash Switcher
//@tab npm
npm install @plumbiu/react-store
//@tab yarn
yarn add @plumbiu/react-store
//@tab pnpm
pnpm add @plumbiu/react-store
//@tab bun
bun add @plumbiu/react-store
//@tab deno
deno add @plumbiu/react-store
```
````

输出：

```bash Switcher
//@tab npm
npm install @plumbiu/react-store
//@tab yarn
yarn add @plumbiu/react-store
//@tab pnpm
pnpm add @plumbiu/react-store
//@tab bun
bun add @plumbiu/react-store
//@tab deno
deno add @plumbiu/react-store
```

# 自定义标题

输入：

````markdown
```jsx title="src/custom-title.ts"
console.log('custom-title')
```
````

输出：

```jsx title="src/custom-title.ts"
console.log('custom-title')
```

# 表情、变量、链接转换、缩写词

## 全局配置

- **emoji**：转换 emoji，全局配置文件 [markdown/config/emoji.ts](https://github.com/Plumbiu/blog/blob/main/markdown/config/emoji.ts)。
- **变量**：通过定义变量显示文字，全局配置文件 [markdown/config/variables.ts](https://github.com/Plumbiu/blog/blob/main/markdown/config/variables.ts)。
- **definitions**：类似 `<!-- Definitions -->`，可将空链接或者对应语法转换为合法链接，全局配置文件 [markdown/config/definitions.ts](https://github.com/Plumbiu/blog/blob/main/markdown/config/definitions.ts)

输入：

```markdown
- 表情：:smile:
- 变量：{{bar['test'].a}}
- 连接转换：[Next.js][]
- 缩写词：
  - 全局配置：HTML
  - 文章内部配置：Plumbiu

*[Plumbiu]: A front-end developer
```

输出：

- 表情：:smile:
- 变量：{{bar['test'].a}}
- 连接转换：[Next.js][]
- 缩写词：
  - 全局配置：HTML
  - 文章内部配置：Plumbiu

*[Plumbiu]: A front-end developer

## front-matter

输入：

```markdown
---
emoji: { num: 🔢 }
variable: { var_text: 'var_text' }
definitions: { plumbiu: 'https://github.com/Plumbiu' }
abbr: { WWW: 'What When Why' }
---

- 表情：:num:
- 变量：{{var_text}}
- 连接转换：[plumbiu][]
- 缩写词：WWW
```

输出：

- 表情：:num:
- 变量：{{var_text}}
- 连接转换：[plumbiu][]
- 缩写词：WWW

# Blockquote

输入：

```markdown
> [!NOTE] MY CUSTOM TITLE
> `Useful information` that users should know, even when skimming content.

> [!TIP] MY CUSTOM TITLE
> `Helpful advice` for doing things better or more easily.

> [!IMPORTANT] MY CUSTOM TITLE
> `Key information` users need to know to achieve their goal.

> [!WARNING] MY CUSTOM TITLE
> `Urgent info` that needs immediate user attention to avoid problems.

> [!CAUTION] MY CUSTOM TITLE
> `Advises` about risks or negative outcomes of certain actions.
```

输出：

> [!NOTE] MY CUSTOM TITLE
> `Useful information` that users should know, even when skimming content.

> [!TIP] MY CUSTOM TITLE
> `Helpful advice` for doing things better or more easily.

> [!IMPORTANT] MY CUSTOM TITLE
> `Key information` users need to know to achieve their goal.

> [!WARNING] MY CUSTOM TITLE
> `Urgent info` that needs immediate user attention to avoid problems.

> [!CAUTION] MY CUSTOM TITLE
> `Advises` about risks or negative outcomes of certain actions.

# Details

输入：

```markdown
:::Details[Detail 测试]
Hello World
`console.log('details')`
:::
```

输出：

:::Details[Detail 测试]
Hello World
`console.log('details')`
:::

# 画廊

首行通过 `max-数字`，配置最大显示个数，也可以不写。

输入：

```markdown
:::Gallery
max-10
2023-1.webp
threejs/flower-2.jpg
2023-2.webp
2023-3.png
threejs/flower-6.jpg
shiki-className.webp
threejs/flower-1.jpg
shiki-inline-styles.webp
toc-optimize.gif
toc.gif
threejs/flower-3.jpg
view-frustum.png
threejs/flower-4.jpg
2022-1.png
threejs/flower-5.jpg
threejs/wall.jpg
:::
```

输出

:::Gallery
max-10
2023-1.webp
threejs/flower-2.jpg
2023-2.webp
2023-3.png
threejs/flower-6.jpg
shiki-className.webp
threejs/flower-1.jpg
shiki-inline-styles.webp
toc-optimize.gif
toc.gif
threejs/flower-3.jpg
view-frustum.png
threejs/flower-4.jpg
2022-1.png
threejs/flower-5.jpg
threejs/wall.jpg
:::

# Literal autolink

输入：

```markdown
www.example.com, https://example.com, and contact@example.com.
```

输出：

www.example.com, https://example.com, and contact@example.com.

# footnote

输入：

```markdown
A note[^1]

[^1]: Big note.
```

输出：

A note[^1]

[^1]: Big note.

# 任务列表

输入：

```markdown
- [ ] to do
- [x] done
```

输出：

- [ ] to do
- [x] done

# 视频

## B 站

输入：

```markdown
::bilibili[【官方 MV】Never Gonna Give You Up - Rick Astley]{#BV1GJ411x7h7}
```

输出：

::bilibili[【官方 MV】Never Gonna Give You Up - Rick Astley]{#BV1GJ411x7h7}

## Youtube

输入：

```markdown
::youtube[Rick Astley - Never Gonna Give You Up (Official Music Video)]{#dQw4w9WgXcQ}
```

输出：

::youtube[Rick Astley - Never Gonna Give You Up (Official Music Video)]{#dQw4w9WgXcQ}

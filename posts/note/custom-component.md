---
title: Markdown Extensions.
date: 2025-04-27
order: 1
---

本博客 Markdown 拓展基于 remark 和 rehype 生态构建。

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

# Playground

用于展示代码和组件，包括打印栏等。不同 Tab 通过 `///` 表达式分隔，后续可以加上 meta 信息（例如 `line` 显示行数）。其中样式基于 ShadowRoot，不会影响到全局。

> [!NOTE]
>
> `Playground` 为动态运行，有风险，请谨慎使用

## React 组件

支持 `tsx`。

输入：

````markdown
```tsx Playground
/// App.jsx
import Random from './Random'

function App() {
  console.log('App')
  return <div className="app">{Math.random()}</div>
}
export default App
/// App.css line
.app {
  font-size: 24px;
  color: blue;
}
```
````

输出：

```tsx Playground
/// App.jsx
import Random from './Random'

function App() {
  return <div className="app">{Math.random()}</div>
}
export default App

/// App.css line
.app {
  font-size: 24px;
  color: blue;
}
```

## HTML

HTML 暂不支持打印

输入：

````markdown
```html Playground
/// index.html
<div class="test" onclick="console.log(111)">hello</div>
/// color.css .test { color: red; font-weight: 600; }
```
````

输出：

```txt Playground
<div class="test" onclick="console.log(111)">hello</div>
/// color.css
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

输入：

````markdown
```js Run
const start = Date.now()
console.log('start')
while (Date.now() - start < 3000) {}
console.log('end')
```
````

输出：

```js Run
const start = Date.now()
console.log('start')
while (Date.now() - start < 3000) {}
console.log('end')
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

# 代码块增删高亮

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

meta 添加 Switcher 字符，并通过 `///` 语法划分。

输入：

````markdown
```bash Switcher
/// npm
npm install @plumbiu/react-store
/// yarn
yarn add @plumbiu/react-store
/// pnpm
pnpm add @plumbiu/react-store
```
````

输出：

```bash Switcher
/// npm
npm install @plumbiu/react-store
/// yarn
yarn add @plumbiu/react-store
/// pnpm
pnpm add @plumbiu/react-store
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

# emoji

配置文件 [markdown/config/emoji.ts](https://github.com/Plumbiu/blog/blob/main/markdown/config/emoji.ts)。

输入：

```markdown
:smile:
```

输出：

:smile:

# 变量

`{{}}` 语法将文字替换成全局变量，配置文件 [markdown/config/variables.ts](https://github.com/Plumbiu/blog/blob/main/markdown/config/variables.ts)。

输入：

```markdown
{{bar['test'].a}}
```

输出：

{{bar['test'].a}}

# 自动链接

将文字通过配置转换为链接，配置文件 [markdown/config/links.ts](https://github.com/Plumbiu/blog/blob/main/markdown/config/links.ts)。

输入：

```markdown
Next.js
```

输出：

Next.js

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

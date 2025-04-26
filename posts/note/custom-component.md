---
title: 自定义组件
date: 2024-10-03
desc: Markdown 拓展和自定义组件。
---

[源码](https://github.com/Plumbiu/blog/blob/main/data/posts/note/custom-component.md?plain=1).

# 代码执行相关

## React

可运行 `tsx` 和 `jsx` 组件。基于 ShadowRoot，css 样式不会影响到全局。

```tsx Playground
/// App.jsx
import Random from './Random'

function App() {
  return (
    <div>
      <div className="app">App</div>
      <Random />
    </div>
  )
}
export default App

/// Random.tsx
type TypeTest = string | number

function Random({ text }: RandomProps) {
  console.log('Random')
  return <div className="random">{Math.random()}</div>
}
export default Random

/// App.css line
.random {
  font-weight: 700;
}
/// Random.css line
.app {
  font-size: 24px;
  color: blue;
}
```

## HTML

暂时不支持 `Console` 打印面板。

```txt Playground
<div class="test" onclick="console.log(111)">hello</div>
/// color.css
.test {
  color: red;
}
/// font-weight.css
.test {
  font-weight: 600;
}
```

## 配置

用户配置的组件，不需要动态执行。

```js Playground path="custom/three/ThreeLearnPrimitivesBox" component="ThreeLearnPrimitivesBox"

```

## 打印

### 基本例子

```ts Run
function log(n: any) {
  console.log(n)
}

log(1)
log('ch')
log({ obj: 1 })
log([1, 2, 3])
log(function t() {})
log(() => {
  console.log(1)
})
log(Symbol('foo'))
log(undefined)
log(null)
log(true)
log(/foo/)
log(new Date(Date.now()))
```

### 代码阻塞

在 `Web Worker` 中运行，不会卡死主线程。

```js Run
const start = Date.now()
console.log('start')
while (Date.now() - start < 3000) {}
console.log('end')
```

# 代码块

## Tab 切换

```bash Switcher
/// npm
npm install @plumbiu/react-store
/// yarn
yarn add @plumbiu/react-store
/// pnpm
pnpm add @plumbiu/react-store
```

## Diff

```diff-ts
-console.log('hewwo')
+console.log('hello')
console.log('goodbye')
console.log('wallo') // [!code --]
console.log('callo') // [!code ++]
```

## 高亮

```ts {1,2}
console.log('hewwo')
console.log('hello')
console.log('goodbye')
console.log('wallo')
console.log('callo') // [!code highlight]
```

```ts /log/
// [!code word:console]
console.log('hewwo')
console.log('hello')
console.log('goodbye')
console.log('wallo')
console.log('callo')
```

## 显示行

```ts line
console.log('hewwo')
console.log('hello')
console.log('goodbye')
```

## path

本地：

```jsx path="generic/iframe/index"

```

远程：

```js path="https://gist.githubusercontent.com/Plumbiu/7fc950397d9913b6f9558f7fc2c541ed/raw/4a3c95548679087f4ccd6ac032ed7aa1b1ca7e87/blog-remote-test.js"

```

## 自定义标题

```js title="test/console.js"
console.log('hello')
console.log(1)
```

# 自定义组件

<ThreeSunEarthMoon />

# Blockquote

> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

**自定义标题：**

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

# Details 组件

:::Details[Detail 测试]
Hello World
`console.log('details')`
:::

# 画廊

:::Gallery
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

**配置最多显示图片个数：**

:::Gallery
max-6
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

# 替换插件

## 文字

文字 `{{foo}}` 替换为 {{foo}}

## emoji

文字 `:smile:` 替换为 :smile:

## link

文字 `Next.js` 转换为 Next.js

# GFM 插件

## 自动转换链接

www.example.com, https://example.com, and contact@example.com.

## 脚注

A note[^1]

[^1]: Big note.

## 删除线

~one~ or ~~two~~ tildes.

## 任务列表

- [ ] to do
- [x] done

## 表格

## Table

| a   | b   |   c |  d  |
| --- | :-- | --: | :-: |
| 1   | 2   |   3 |  4  |

# 视频

## B 站

::bilibili[【官方 MV】Never Gonna Give You Up - Rick Astley]{#BV1GJ411x7h7}

## Youtube

::youtube[Rick Astley - Never Gonna Give You Up (Official Music Video)]{#dQw4w9WgXcQ}

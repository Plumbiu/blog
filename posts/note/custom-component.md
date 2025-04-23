---
title: 自定义组件
date: 2024-10-03
desc: 一篇用于测试/查看博客上的一些自定义组件的文章。
---

[源码](https://github.com/Plumbiu/blog/blob/main/data/posts/note/custom-component.md?plain=1).

# Code

## Playground

### tsx

```tsx Playground
/// App.jsx
import Test from './Test'
import './App.css'

function App() {
  return (
    <div onClick={() => console.log('App')}>
      <h1 className="app">App - {Math.random()}</h1>
      <Test text="Test1" />
    </div>
  )
}
export default App
/// Test.css line
.app {
  color: blue;
}
/// Test.tsx
import Test2 from './Test2'

interface Test1Props {
  text: string
}

function Test({ text }: Test1Props) {
  console.log('Test1')
  return <div className="test">{text}<Test2 text="Test2" /></div>
}
export default Test
/// Test2.tsx
import './Test.css'

interface Test2Props {
  text: string
}

function Test2({ text }: Test2Props) {
  console.log('Test2')
  return <div className="test">{text}</div>
}
export default Test2
/// App.css line
.test {
  font-weight: 700;
}
```

### static

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

### meta

```js Playground path="custom/three/ThreeLearnPrimitivesBox" component="ThreeLearnPrimitivesBox"

```

## Runner

### simple

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

### long time

```js Run
const start = Date.now()
console.log('start')
while (Date.now() - start < 3000) {}
console.log('end')
```

## Switcher

```bash Switcher
/// npm
npm install @plumbiu/react-store
/// yarn
yarn add @plumbiu/react-store
/// pnpm
pnpm add @plumbiu/react-store
```

## Block

### Diff

```diff-ts
-console.log('hewwo')
+console.log('hello')
console.log('goodbye')
```

Notation:

```ts
console.log('hewwo') // [!code --]
console.log('hello') // [!code ++]
console.log('goodbye')
```

### Highlight

#### Line

```ts {1,2}
console.log('hewwo')
console.log('hello')
console.log('goodbye')
```

Notation:

```ts
console.log('hewwo') // [!code highlight]
console.log('hello') // [!code highlight]
console.log('goodbye')
```

#### Word

```ts /.log('/
console.log('hewwo')
console.log('hello')
console.log('goodbye')
```

Notation:

```ts
// [!code word:.log(']
console.log('hewwo')
console.log('hello')
console.log('goodbye')
```

#### Show line

```ts line
console.log('hewwo')
console.log('hello')
console.log('goodbye')
```

## Path

### Local

```jsx path="generic/iframe/index"

```

### Remote

```js path="https://gist.githubusercontent.com/Plumbiu/7fc950397d9913b6f9558f7fc2c541ed/raw/4a3c95548679087f4ccd6ac032ed7aa1b1ca7e87/blog-remote-test.js"

```

## Title

```js title="test/console.js"
console.log('hello')
console.log(1)
```

# Custom Component

<ThreeSunEarthMoon a="1" />

# Blockquote

:::Note[This is Note]{.note}
This is some description. This is some description. This is some description.

`console.log('note')`
:::

:::Note[This is Tip]{.tip}
This is some description. This is some description. This is some description.

`console.log('tip')`
:::

:::Note[This is Warn]{.warn}
This is some description. This is some description. This is some description.

`console.log('warn')`
:::

:::Note[This is Caution]{.caution}
This is some description. This is some description. This is some description.

`console.log('caution')`
:::

:::Note[This is Important]{.important}
This is some description. This is some description. This is some description.

`console.log('important')`
:::

# Details

:::Details[Detail 测试]
Hello World
`console.log('details')`
:::

# Image gallery

## None config

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

## Max show

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

# Injection and Table

## Variable

| Expression        | Text             | Code               | Blod                 | Link                           |
| ----------------- | ---------------- | ------------------ | -------------------- | ------------------------------ |
| $\{foo}           | ${foo}           | `${foo}`           | **${foo}**           | [${foo}](#injection)           |
| $\{bar.test.a}    | ${bar.test.a}    | `${bar.test.a}`    | **${bar.test.a}**    | [${bar.test.a}](#injection)    |
| $\{bar['test'].a} | ${bar['test'].a} | `${bar['test'].a}` | **${bar['test'].a}** | [${bar['test'].a}](#injection) |

Object:

| Expression      | Text           | Code             | Blod               |
| --------------- | -------------- | ---------------- | ------------------ |
| $\{bar.test}    | ${bar.test}    | `${bar.test}`    | **${bar.test}**    |
| $\{bar['test']} | ${bar['test']} | `${bar['test']}` | **${bar['test']}** |

## Emoji

| Expression | Text    | Code      | Blod        |
| ---------- | ------- | --------- | ----------- |
| \:smile\:  | :smile: | `:smile:` | **:smile:** |
| \:hugs\:   | :hugs:  | `:hugs:`  | **:hugs:**  |

# GFM

## Autolink literals

www.example.com, https://example.com, and contact@example.com.

## Footnote

A note[^1]

[^1]: Big note.

## Strikethrough

~one~ or ~~two~~ tildes.

## Tasklist

- [ ] to do
- [x] done

# Video

## Bilibili

::bilibili[【官方 MV】Never Gonna Give You Up - Rick Astley]{#BV1GJ411x7h7}

## Youtube

::youtube[Rick Astley - Never Gonna Give You Up (Official Music Video)]{#dQw4w9WgXcQ}

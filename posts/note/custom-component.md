---
title: 自定义组件
date: 2024-10-03
desc: 一篇用于测试/查看博客上的一些自定义组件的文章
---

# Playground

用于展示 react 组件或者原生 HTML

## jsx

```jsx Playground
import Test from './Test'
import './App.css'

function App() {
  return (
    <div onClick={() => console.log('This is App')}>
      <h1 className="app">This is App</h1>
      <Test />
    </div>
  )
}
export default App
/// Test.css
.app {
  color: blue;
}
/// Test.jsx
import Test2 from './Test2'
import './Test.css'

function Test() {
  console.log('This is Test')
  return <div className="test">This is Test1<Test2 /></div>
}
export default Test
/// Test2.jsx
import './Test.css'

function Test2() {
  console.log('This is Test')
  return <div className="test">This is Test2</div>
}
export default Test2
/// App.css
.test {
  font-weight: 700;
}
```

## static

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

## tsx

```tsx Playground
import Test from './Test'

function App() {
  return (
    <div onClick={() => console.log('This is App')}>
      <h1>This is App</h1>
      <Test logText="Text log from App" />
    </div>
  )
}
export default App
/// Test.jsx

interface TestProps {
  logText: string
}
function Test(props: TestProps) {
  console.log(props.logText)
  return <div>This is Test</div>
}
export default Test
```

## custom preview

```js Playground='three/ThreeLearnPrimitivesBox'

```

# Tip

一些提示组件

> Normal Tip
>
> This is some description. This is some description.This is some description.
>
> `console.log('info')`

:::Note[This is Info]{.info}

This is some description. This is some description. This is some description.

`console.log('info')`

:::

:::Note[This is Warn]{.warn}
This is some description. This is some description. This is some description.

`console.log('warn')`
:::

:::Note[This is Danger]{.danger}
This is some description. This is some description. This is some description.

`console.log('danger')`
:::

:::Note{.info}

This is some description. This is some description. This is some description.

`console.log('info')`

:::

:::Note{.warn}
This is some description. This is some description. This is some description.

`console.log('warn')`
:::

:::Note{.danger}
This is some description. This is some description. This is some description.

`console.log('danger')`
:::

# Details

模拟原生 `detail` 组件

:::Details[Detail 测试]
Hello World
`console.log('details')`
:::

# Image

图片组件，类名用 `image-wrap` 包裹

![image-20240310213919215](2023-1.webp)
![image-20240310213930618](2023-2.webp)
![image-20240310213919215](2023-3.png)

# Table

`remark-gfm` 提供的 table 组件

| 类型      | 转换为数字(`Number` 方法) | 转换为字符串(`String` 方法) |
| --------- | ------------------------- | --------------------------- |
| null      | 0                         | null                        |
| undefined | NaN                       | undefined                   |
| false     | 0                         | false                       |
| true      | 1                         | true                        |
| Array     | NaN                       | 运行 `.join('')` 拼接       |
| Object    | NaN                       | [object Object]             |
| Symbol    | 报错                      | Symbol('xxx')               |

# Code Runner

执行 JavaScript/TypesSript 代码，运行在 web worker 中

## js

```js Run
function fn(n) {
  console.log(n)
}

fn(1)
fn('ch')
fn({ obj: 1 })
fn(function t() {})
fn(() => {
  console.log(2)
  console.log(1)
})
fn(Symbol('foo'))
fn(undefined)
fn(null)
fn(true)
fn(new Date(Date.now()))
```

## ts

```ts Run
interface Foo {
  text: string
}

function fn(n: Foo) {
  console.log(n.text)
}

fn({ text: 'Hello' })
```

## long time

```js Run
function fn(n) {
  console.log(n)
}

const start = Date.now()
while (Date.now() - start < 3000) {}

fn(1)
fn('ch')
fn({ obj: 1 })
```

# Code Diff

代码中的删除添加

```diff-js
- console.log('hewwo')
+ console.log('hello')
```

# Custom Component

自定义组件，仅用于展示

## TreeBasic

:ThreeBasic

---
title: 自定义组件测试
date: 2024-10-03
desc: 这是用来测试博客上的一些自定义组件，持续更新....
---

# Playground

## jsx

```jsx showLineNumbers Playground
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

# Tip

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

:::Details[Detail 测试]
Hello World
`console.log('details')`
:::

# Image

![image-20240310213919215](/assets/images/2023-1.png)
![image-20240310213930618](/assets/images/2023-2.png)
![image-20240310213919215](/assets/images/2023-3.png)

# Table

常见的转换：

| 类型      | 转换为数字(`Number` 方法) | 转换为字符串(`String` 方法) |
| --------- | ------------------------- | --------------------------- |
| null      | 0                         | null                        |
| undefined | NaN                       | undefined                   |
| false     | 0                         | false                       |
| true      | 1                         | true                        |
| Array     | NaN                       | 运行 `.join('')` 拼接       |
| Object    | NaN                       | [object Object]             |
| Symbol    | 报错                      | Symbol('xxx')               |

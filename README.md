# [Plumbiu's blog](https://blog.plumbiu.top/)

在 [posts](/posts) 文件夹新建 `markdown` 文件添加文章

# `makrdown` 规则：

访问 [note/custom-component](https://blog.plumbiu.top/posts/note/custom-component) 查看所有自定义组件

## CodeRunner [预览](https://blog.plumbiu.top/posts/note/custom-component#code-runner)

````markdown
```js Run
console.log(123)
```
````

## Playground [预览](https://blog.plumbiu.top/posts/note/custom-component#playground)

展示 `Playground`，有两种用法

1. 动态运行 jsx 语法

多个文件以 `///` 为开头标注

````markdown
```jsx Playground
/// App.jsx
import Test from './Test'

function App() {
  return <Test />
}
export default App
/// Test.jsx
function Test() {
  return <div>test</div>
}
export default Test
```
````

2. 我们自定义的组件

在 [src/components/index.tsx](/src/components/index.tsx) 文件中，有一个 `componentMap` 变量，用于指定对应的组件名称：

````markdown
```jsx Playground path="Your_Component_Path" component="ComponentName"

```
````

## Tip [预览](https://blog.plumbiu.top/posts/note/custom-component#tip)

语法：

```markdown
:::Note[Title]{.info}
Content
:::

:::Note[Title]{.danger}
Content
:::

:::Note[Title]{.warn}
Content
:::
```

## 自定义组件 [预览](https://blog.plumbiu.top/posts/note/custom-component#custom-component)

在 [src/components/index.tsx](/src/components/index.tsx) 文件中，有一个 `componentMap` 变量，用于指定对应的组件名称，对应语法：

```markdown
:ComponentName
```

## Details [预览](https://blog.plumbiu.top/posts/note/custom-component#details)

语法：

```markdown
:::Details[Title]
Content
:::
```

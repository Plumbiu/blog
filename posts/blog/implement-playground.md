---
title: 在 Markdown 中实现 Playground
date: 2024-10-13
desc: 1
---

之前书写博客时，总会想着展示一个 React 组件，当时的实现是写一段代码，然后再贴一张图片预览，但是图片毕竟总是静态的，缺乏了交互性，后续了解到了 [MDX](https://github.com/MDX-js/MDX)，MDX 是一个很棒的方案，允许我们导入 React 组件，同时也可以执行一些 JavaScript 代码，但是最终我没有使用它，因为它并不像 JavaScript 那样“动态化”，例如我想使用 Nextjs 的 `dynamic` 功能，我不能确定它是否能完整的运行，同时相比于使用规则，我更喜欢**创造规则**。

先看一下效果：

```jsx Playground
import Test from './Test'

function App() {
  return (
    <div onClick={() => console.log('This is App')}>
      <h1>This is App</h1>
      <Test />
    </div>
  )
}
export default App
/// Test.jsx
function Test() {
  console.log('This is Test')
  return <div>This is Test</div>
}
export default Test
```

在 markdown 中的语法：

````markdown
```jsx Playground
/// App.jsx
import Test from './Test'

function App() {
  return (
    <div onClick={() => console.log('This is App')}>
      <h1>This is App</h1>
      <Test />
    </div>
  )
}
export default App
/// Test.jsx
function Test() {
  console.log('This is Test')
  return <div>This is Test</div>
}
export default Test
```
````

# 开始之前

> 如果你想直接使用 Playground，而不是在 markdown 文件中，你可以试试 [@plumbiu/react-live](https://github.com/Plumbiu/react-live)，不算依赖只有 30 多行代码
>
> 另外，如果你喜欢 MDX，或者更成熟的方案，你可以用 [sandpack](https://github.com/codesandbox/sandpack)，由于我对产物体积以及性能的追求，这里选择自己实现。

**如果你只是想要“展示”组件，而不是动态执行 React，参考这篇文章 [markdown-component](/posts/blog/markdown-component)**

# 我的方案

最终的方案是使用 [remark](https://github.com/remarkjs/remark)、[rehype](https://github.com/rehypejs/rehype) 插件，加上 [sucrase](https://github.com/alangpierce/sucrase) 解析 JSX 语法。

[`react-markdown`](https://github.com/remarkjs/react-markdown) 中通过 `unified` 转换语法树，最后通过 `hast-util-to-jsx-runtime` 转换为 React 组件，通过语法树转化，这是一个很棒的想法，因为我可以把 Markdown 本身的标签替换为我的自定义标签。

**Markdown 本身不会生产 `<div />` 标签，所以用自定义组件替换 div 是一个不错的选择**

```jsx {6-10} showLineNumbers
import ReactMarkdown from 'react-markdown'

async function Markdown(props) {
  return (
    <ReactMarkdown
      components={{
        div(props) {
          return <MyCustomComponent {...props} />
        },
      }}
    >
      {props.md}
    </ReactMarkdown>
  )
}
```

同时 react-markdown 还可以接受 remark 和 rehype 插件：

```jsx {2,3}
<ReactMarkdown
  remarkPlugins={[myRemarkPlugin]}
  rehypePlugins={[myRehypePlugin, { custom: true }]}
>
  {props.md}
</ReactMarkdown>
```

另外，我的高亮插件是基于 [rehype-prism-plus](https://github.com/timlrx/rehype-prism-plus) 的，只不过将 [prismjs](https://github.com/PrismJS/prism) 替换成了 [shiki](https://github.com/shikijs/shiki)（为啥不用 [@shikijs/rehype](https://shiki.style/packages/rehype)，是因为 **`react-markdown` 不支持异步的插件**，参考 [issue](https://github.com/remarkjs/react-markdown/issues/680)）

# ReactMarkdown 配置

在书写 `Playground` 之前，我们首先考虑如何配置 `react-markdown` 的组件（components）选项，我的方案中，是替换掉 `div` 标签，因为常规 Markdown 语法不会产生 div 标签：

```jsx {8-14}
// 自定义组件 map，我们可以在 remark 插件中给元素的 props 添加 data-component 属性，从而在这里来获取这些组件
const customComponentMap = {
  Playground: <div>My Playground</div>
}

<ReactMarkdown
  components={{
    div(props) {
      const customComponentKey = props['data-component']
      if (customComponentKey) {
        return customComponentMap[customComponentKey]
      }
      return <div {...props} />
    },
  }}
>
  {props.md}
</ReactMarkdown>
```

# Remark 插件

首先需要说明的是，因为完整代码十分复杂，而且还区分了 HTML 和 JSX，所以这里只会出现关键的 JSX 部分。

````js
import { visit } from 'unist-util-visit'

const LangKey = 'data-playground-lang'
const ComponentKey = 'data-component'
const CodeKey = 'data-playground-code'
const PlaygroundName = 'playground'
function remarkPlayground() {
  return (tree) => {
    visit(tree, 'code', (node) => {
      // 确保 node.data.hProperties 不为空
      makeProperties(node)
      // 依次获取元素的 props、code、meta 以及 lang 属性
      const props = node.data!.hProperties!
      const code = node.value.trim()
      const meta = node.meta
      const lang = node.lang?.toLowerCase() ?? 'txt'
      props[LangKey] = lang
      // 例如 markdown 这样写:
      // ```jsx {1-3} Playground showLineNumbers
      // Some Code
      // ```
      // 上述的 meta 就是 "{1-3} Playground showLineNumbers"
      if (meta?.includes(PlaygroundName)) {
        props[ComponentKey] = PlaygroundName
        props[CodeKey] = code
        // 这里的作用是避免产生副作用，影响 react-markdown 中的 pre 标签设置
        node.type = 'root'
        node.data!.hName = 'div'
      }
    })
  }
}

function makeProperties(node) {
  if (!node.data) {
    node.data = {}
  }
  if (!node.data.hProperties) {
    node.data.hProperties = {}
  }
}
````

# 解析 JSX

解析 JSX 使用的是 surcase，你可以在 [这里](https://sucrase.io) 看到它解析的结果，大致是这样的，但是我们可以只关注 `7` 和 `14` 行：

```js {6,7,13,14} showLineNumbers
'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}
// require 本质上是一个函数
var _react = require('react')
var _react2 = _interopRequireDefault(_react)

function App() {
  return _react2.default.createElement('div', null, '123')
}
// 这里导出的是经过转换后的 React 组件
exports.default = App
```

但是如何拿到 `exports` 的数据呢，因为我们拿到的是一个字符串，解析之后也是字符串，但是好在 JavaScript 是一个脚本语言，对于字符串的运行，可以使用 [`eval`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval)，也可以通过 [`Function`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/Function)，当然，这里更推荐使用 Function.

```js
import React from 'react'

const scope = {
  import: {
    react: React,
  },
}
function evalCode(code) {
  // 上述的 require 函数
  const _require = (key) => {
    return scope.import[key]
  }
  const exports = {}
  // 定义传递的函数参数
  const fn = new Function('exports', 'require', 'React', code)
  // 将我们需要的数据传递给 Function
  fn(exports, _require, React)
  // 转换后的代码 `exports.default = App`，这里返回转换后的 React 组件
  return exports.default
}
```

# 最后

本文实现的 Playground 其实并不难，但是你能看到，这里实现的的只能解析一段代码，也就是说，最开始演示的那种具有文件栏以及 Console 面板的 Playground 本文并未实现，但其实思路还是挺简单的：

- 将多个文件解析代码，并添加到 `scope` 作用域中（在 Markdown 语法中，我是使用 `///` 作为分割每个文件）
- Console 面板实现关键在于如何修改文本代码中的 `console.log`，这个可以在 `new Function` 中传入 `console` 参数，进而修改，提供一个简单的代码：

```jsx {21-24} showLineNumbers
import React, { createElement } from 'react'

function App() {
  const [logs, setLogs] = useState([])

  const node = useMemo(() => {
    const fn = evalCode(CODE, (value) => setLogs((prev) => [...prev, value]))
    return createElement(fn())
  }, [])

  return node
}

export default App

function evalCode(code, setLogs) {
  const _require = (key) => {
    return scope[key]
  }
  const _exports = {}
  const fn = new Function('exports', 'require', 'React', 'console', code)
  fn(_exports, _require, React, {
    log: setLogs,
  })
  return _exports.default
}
```

另外，如果去掉 React 中的客户端的 Hooks，这个组件是**完全可以成为 SSR 组件**，但是这样的话，`onClick` 等浏览器事件就会报错，而且 Console 面板也无法生效。

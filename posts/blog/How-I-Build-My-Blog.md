---
title: 我是如何构建自己的博客的
date: 2024-10-10
desc: 1
---

在国庆假期期间，因为闲来无事，重拾起了构建博客的这一想法，事实上，自己在此之前已经有过两版博客了，第一版是根据 [hexo](https://github.com/hexojs/hexo) 构建的，但毕竟只是一个模板，并没有自己的东西，[第二版](https://blog.plumbiu.top/) 是自己从头开始搭建的，但是当时对 Next.js 并不熟悉，有些实现还是不够优雅的，于是便有了这一版。

相比于上一版，UI 的变化是比较大的，这里要感谢 [托尼的博客](https://antfu.me/)，但是变化最大的是扩展了 markdown 的语法，但我并没有使用 [MDX](https://github.com/MDX-js/MDX)，事实上 MDX 应该是最好的解决方案，它可以导入自定义组件，也可以导出数据，Next.js 也提供了很好的 [解决方案](https://nextjs.org/docs/app/building-your-application/configuring/MDX)，但是回到最初为何放弃第一版博客，正是因为“没有自己的东西”，而 MDX 就是一个集成度很高的模板

# 如何实现一个 MDX

实现之前，我们要知道 markdown 本质是一个静态的 markup language，要实现一些动态组件，例如 jsx 和 vue，简单的替换是不行的

对 ast 了解的朋友应该知道，ast 可以作为跨端的一种实现方法，例如 nodejs 并不知道 css，但是却知道经过 ast 转换后的对象，而 markdown 转换为 jsx 也是相应的道理，这里使用的是 unified 和 remark、rehype 插件，更进一步说是封装好的 ReactMarkdown。

说到这，可能会有人发出质疑，“你不说因为之前的博客'没有自己的东西'而放弃了吗，上面的东西也不是你的啊”，对此我想说，有现成的扩展性比较高的工具还是能用的，事实上，我也想自己写一个 markdown 语法分析的库，奈何没这个能力。

一个 `Playground` 实例：

```jsx Playground
/// App.jsx
import Test from './Test'

function Button() {
  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: 24
      }}
      onClick={() => {
        console.log('This is Test')
      }}
    >
      <Test />
    </div>
  )
}

export default Button
/// Test.jsx
function Test() {
  return <div>This is Test</div>
}

export default Test
```

它的原始代码是：

```jsx
import Test from './Test'
function Button() {
  return <div style={{
    display: 'grid',
    placeContent: 'center',
    height: '100%',
  }}><Test /></div>
}

export default Button
/// Test.jsx
function Test() {
  return <div>This is Test</div>
}
export default Test
```

我们使用 `/// ${Name}` 作为各个模块命名，构建这一个 `Playground` 需要三个步骤

## 1. `remark` 插件

适配 Playground 组件的 remark 插件

````js
import { visit } from 'unist-util-visit'

// 为了让 RemarkNode 的属性不为空
function makeProperties(node) {
  if (!node.data) {
    node.data = {}
  }
  if (!node.data.hProperties) {
    node.data.hProperties = {}
  }
}

const SupportLang = new Set(['jsx', 'tsx', 'react'])
const Code_Key = 'data-code'
const Default_Selector_Key = 'data-selector'
function remarkPlayground() {
  return (tree) => {
    visit(tree, 'code', (node) => {
      makeProperties(node)
      // props 为标签属性
      const props = node.data.hProperties
      // markdown code 语法对应的语言
      const lang = node.lang?.toLowerCase()
      // code
      const code = node.value.trim()
      // 例如 ```jsx Playgounrd ``` 的 meta 就是 Playground
      const meta = node.meta
      if (meta !== 'Playground' || !SupportLang.has(lang)) {
        return
      }
      // 设置属性，为了能在 ReactMarkdown 中替换
      props[Code_Key] = code
      // 这个操作是为了不与
      node.type = 'root'
      node.data.hName = 'div'
      props['data-component'] = meta
      props[Default_Selector_Key] = selector
    })
  }
}
````

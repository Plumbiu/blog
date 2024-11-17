---
title: 在 Markdown 中展示 React 组件
date: 2024-11-10
tags: ['react', 'markdown']
desc: 1
---

之前写过一篇[如何在 Markdown 中实现 Playground 的文章](/posts/blog/implement-playground)，后续开发过程中，思来想去，觉得这个方案可能不是最好的**展示组件**的方法，因为展示组件并不需要 `runtime` 执行，换句话说，下面的伪代码可能更加合理：

````jsx
import ReactMarkdown from 'react-markdown'

const componentMap = {
  Foo: () => <div>foo</div>
}

<ReactMarkdown
  components={{
    div(props) {
      return componentMap[props.componentName] ?? props.children
    }
  }}
>
```jsx Component="Foo" path="xxx"

```
</ReactMarkdown>
````

分析一下它的步骤：

1. 首先我们需要有一个组件 Map，表示我们的自定义组件有哪些
2. 接着配置 `react-markdown` 的 `div` 属性，如果 `props.componentName` 命中了我们的组件 Map，那么就会展示自定义组件，否则展示 `children`
3. 最后 markdown 中的自定义语法，包括组件名称（与组件 Map 对应），以及它的 `path`，表示代码在工程中的位置，方便展示代码

# 开始之前

强烈建议读者事先了解过 [`react-markdown`](https://github.com/remarkjs/react-markdown) 以及 [remark](https://github.com/remarkjs/remark)、[rehype](https://github.com/rehypejs/rehype) 插件

# remark 插件

这一部分做的工作主要是将 markdown 中的 `code block` 默认产生的 `pre -> code` 标签替换为 `div` 标签，并将自定义组件名称和代码添加到组建的 `props` 属性中

```jsx
import path from 'node:path'
import fs from 'node:fs'
import { visit } from 'unist-util-visit'

const ComponentNameRegx = /Component="([^"]+)"/
const ComponentPathRegx = /path="([^"]+)"/
function remarkPlayground() {
  return (tree) => {
    visit(tree, 'code', (node) => {
      const meta = node.meta
      if (!meta) {
        return
      }
      const [_, componentName] = ComponentNameRegx.exec(meta)
      const [__, componentPath] = ComponentPathRegx.exec(meta)
      if (componentName && componentPath) {
        makeProperties(node)
        const props = node.data!.hProperties!
        // 给 props 添加 componentName 属性
        props['componentName'] = componentName
        const code = fs.readFileSync(componentPath, 'utf-8')
        // 给 props 添加 componentCode 属性
        props['componentCode'] = code
        // 避免与其它标签产生副作用
        node.type = 'root'
        // 设置标签名为 div
        node.data!.hName = 'div'
      }
    })
  }
}

export default remarkPlayground

// 确保 node.data.hProperties 不为空
export function makeProperties(node) {
  if (!node.data) {
    node.data = {}
  }
  if (!node.data.hProperties) {
    node.data.hProperties = {}
  }
}
```

# react-markdown 配置

```jsx
import ReactMarkdown from 'react-markdown'
import { createElement } from 'react'

const componentMap = {
  Foo: (props) => (
    // 省略样式
    <div>
      <pre>
        {/* 展示代码 */}
        <code>{props.componentCode}</code>
      </pre>
      {/* 展示组件效果，这部分可以自定义编写 */}
      <div>Preview</div>
    </div>
  ),
}

// 自定义组件
function CustomComponent(props) {
  const component = componentMap[props.componentName]
  if (component) {
    return createElement(component, props) // 调用 react 的 createElement 方法，主要是为了传递 props
  }
  return props.children
}

function Markdown({ text }) {
  return (
    <ReactMarkdown
      components={{
        div(props) {
          return <CustomComponent {...props} />
        },
      }}
    >
      {text}
    </ReactMarkdown>
  )
}
```

# 优化

## 动态加载

假设你配置了一万个自定义组件，那么就算一篇博客一个也没用到，那么这些组件也会加入到网络请求中，编译器并不知道你有没有用到。如果你使用 nextjs，它提供了 [`dynamic`](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#nextdynamic) 功能，只有引用了这个组件，页面才会加载，当然你也可以尝试 [`动态导入 import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)

```jsx
import dynamic from 'next/dynamic'

const Foo = dynamic(() => import('./Foo'))
const componentMap = {
  Foo,
}

// ....
```

## 延迟执行

有一些自定义组件执行起来非常耗时，并且会加载大量资源，我们希望用户滚轮滚到自定义组件时再加载，这样会大大降低我们的首屏渲染时间，这里我们使用 [`IntersectionObserver API`](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)，修改上面的 `CustomComponent` 组件：

```jsx
// 自定义组件
function CustomComponent(props) {
  const component = componentMap[props.componentName]
  if (component) {
    return <IntersectionCustomComponent component={component} {...props} />
  }
  return props.children
}

function IntersectionCustomComponent({ component, props }) {
  const observerRef = useRef < HTMLDivElement > null
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const observerDom = observerRef.current
    if (!observerDom) {
      return
    }
    const observer = new IntersectionObserver((entries, self) => {
      const isIntersecting = entries[0].isIntersecting
      if (isIntersecting) {
        setIsIntersecting(true)
        self.unobserve(observerDom)
      }
    })
    observer.observe(observerDom)
    return () => observer.unobserve(observerDom)
  }, [])

  return (
    <div ref={observerRef}>
      {isIntersecting ? createElement(component, props) : <Loading />}
    </div>
  )
}
```

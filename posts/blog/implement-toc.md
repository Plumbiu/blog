---
title: 一个优雅的文章目录组件
date: 2024-10-24
desc: 1
---

在我的博客文章页面，随着页面滚动，右边的目录也会跟着发生变化，几乎所有静态网站生成的框架，例如 [vitepress](https://github.com/vuejs/vitepress)，都支持这种功能，这篇文章是讲解我实现 TOC 的思路，以及如何做到比 `vitepress` 更好的效果。

![toc](/assets/images/toc.gif)

# 思路

首先，本文实现的 TOC，也就是目录组件是一个完全的“客户端组件”，它不是从服务端解析 Markdown 文件获取目录结构，而是通过 `document` 对象：

```jsx Playground
import { useEffect, useState } from 'react'

export default function App() {
  const [list, setList] = useState([])

  useEffect(() => {
    // 获取文章下所有的 h1,h2,h3 标签
    const nodes = document.querySelectorAll('.md > h1,h2,h3')
    setList(
      Array.from(nodes).map((node) => ({
        title: node.textContent,
        id: node.id,
        depth: +node.tagName[1],
      })),
    )
  }, [])
  return (
    <ul>
      {list.map(({ title, id, depth }) => (
        <li key={id}>
          <a href={`#${id}`} style={{ paddingLeft: depth * 16 }}>
            {title}
          </a>
        </li>
      ))}
    </ul>
  )
}
```

为什么 `list` 这个 state 不能从服务端获取呢，这和我们要实现的功能有关，如果我们要实现**目录跟随**，那么就不可避免的需要拿到 DOM 的引用，进而改变 DOM 的状态，而服务端组件只会渲染一遍。

接下来的事情就更简单了，如果你对八股熟悉的话，那么应该知道 [getBoundingClientRect](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect) 这个 API，它可以获取是否有元素进入了窗口：

```js
const rect = dom.getBoundingClientRect()
if (rect.bottom >= 0 && rect.top < window.innerHeight) {
  // 进入窗口
}
```

最后，在 scroll 的事件中，依次遍历我们得到的 NodeList，通过 `getBoundingClientRect` 获取元素是否到达可视区域即可：

```jsx
import { useEffect, useState, useRef } from 'react'
import clsx from 'clsx'

export default function App() {
  const [list, setList] = useState([])
  const [activeIndex, setActiveIndex] = useState()
  // 记录所有 h1,h2,h3 标签
  const nodes = useRef()

  function scrollHandler() {
    const viewHeight = window.innerHeight
    // 注意：nodes 和 list 其实是一一对应的，所以我们可以设置一个索引判断哪个目录高亮了
    for (let i = 0; i < nodes.current.length; i++) {
      const node = nodes.current[i]
      const rect = node.getBoundingClientRect()
      if (rect.bottom >= 0 && rect.top < viewHeight) {
        setActiveIndex(i)
        break
      }
    }
  }

  useEffect(() => {
    nodes.current = document.querySelectorAll('.md > h1,h2,h3')
    scrollHandler()
    setList(
      Array.from(nodes.current).map((node) => ({
        title: node.textContent,
        id: node.id,
        depth: +node.tagName[1],
      })),
    )
    window.addEventListener('scroll', scrollHandler)

    return () => window.removeEventListener('scroll', scrollHandler)
  }, [])
  return (
    <ul>
      {list.map(({ title, id, depth }, i) => (
        <li key={id}>
          <a
            href={`#${id}`}
            className={clsx({
              active: activeIndex === i,
            })}
            style={{ paddingLeft: depth * 16 }}
          >
            {title}
          </a>
        </li>
      ))}
    </ul>
  )
}
```

# 最后的优化

你可能遇到过很长的目录，超过整个屏幕高度的那种，如果是上面的写法，那么当你翻阅到文章最下面时，目录组件高亮的部分可能在视区之外，用户需要手动滚动目录组件才行，因此目录组件也需要有个**滚动关联**功能：

![toc-optimize](/assets/images/toc-optimize.gif)

我们可以调用 `dom.scrollTo` 方法实现滚动，继续补充上述的 `scrollHandler` 函数（高亮部分）

```jsx {9-10,20-27,48} showLineNumbers
import { useEffect, useState, useRef } from 'react'
import clsx from 'clsx'

export default function App() {
  const [list, setList] = useState([])
  const [activeIndex, setActiveIndex] = useState()
  // 记录所有 h1,h2,h3 标签
  const nodes = useRef()
  // TOC 组件的 DOM 引用
  const tocRef = useRef(null)

  function scrollHandler() {
    const viewHeight = window.innerHeight
    // 注意：nodes 和 list 其实是一一对应的，所以我们可以设置一个索引判断哪个目录高亮了
    for (let i = 0; i < nodes.current.length; i++) {
      const node = nodes.current[i]
      const rect = node.getBoundingClientRect()
      if (rect.bottom >= 0 && rect.top < viewHeight) {
        setActiveIndex(i)
        // 包括可滚动区域的 top 值
        const top = tocRef.current?.children[i]?.offsetTop
        if (top) {
          // 获取 TOC DOM 的高度
          const tocHeight = tocRef.current?.clientHeight ?? 0
          // 使用 scrollTo 滚动到 TOC DOM 当前视图高度一半的位置
          tocRef.current?.scrollTo({ top: top - tocHeight / 2 })
        }
        break
      }
    }
  }

  useEffect(() => {
    nodes.current = document.querySelectorAll('.md > h1,h2,h3')
    scrollHandler()
    setList(
      Array.from(nodes.current).map((node) => ({
        title: node.textContent,
        id: node.id,
        depth: +node.tagName[1],
      })),
    )
    window.addEventListener('scroll', scrollHandler)

    return () => window.removeEventListener('scroll', scrollHandler)
  }, [])
  return (
    <ul ref={tocRef}>
      {list.map(({ title, id, depth }, i) => (
        <li key={id}>
          <a
            href={`#${id}`}
            className={clsx({
              active: activeIndex === i,
            })}
            style={{ paddingLeft: depth * 16 }}
          >
            {title}
          </a>
        </li>
      ))}
    </ul>
  )
}
```

完结

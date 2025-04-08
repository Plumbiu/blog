---
title: Next.js 中的一些优化技巧
date: 2024-11-22 21:09:00
tags: ['next.js']
desc: 1
hidden: true
---

本篇讲述的内容是我在构建博客中运用的技巧，以及对 Next.js 中一些概念的重新理解，由于我的博客是纯静态构建的，所以也就不涉及后端的东西了。

# 避免使用 [`use-client`](https://nextjs.org/docs/app/api-reference/directives/use-client)

`use-client` 会将该区域的所有代码，包括依赖打包进客户端，例如在我博客里常见的代码高亮，它是在服务端生产的，使用的是 [`shiki`](https://shiki.style/)，你可以查看开发者工具网络一栏，是不存在 shiki 的 bundle 的。

很多人可能觉得我说的这一点是废话，谁会没事在开头加一个 `use-client`，或许这节标题起的不太好，应该叫做**避免一些服务端依赖打包进客户端**。

参考一下代码（打印 ts 转换为 js 的压缩代码）：

```tsx Playground
'use client'
import minify from './minify-ts'

const tsCode = `
const s: string = '123'
console.log(s)
`

function App(props) {
  const code = minify(tsCode)
  return (
    <pre
      onClick={() => {
        console.log(code)
      }}
    >
      {tsCode}
    </pre>
  )
}
export default App
/// minify-ts.ts
// 将 ts 转换为 js 的一个包，通常很大
import { transfrom } from 'test:transfrom-ts'

function minify(code: string) {
  return transfrom(code)
}

export default minify
```

这里的客户端组件导入了服务端组件，导致 `test:transfrom-ts` 这个依赖打包进了客户端，再看一眼，既然我们的需求是**打印 js 压缩代码**，既然是字符串，那么我们便可以通过 [`fetch`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/fetch) 或者其他方法从服务端获取，参考 next.js 的 [api 路由](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)：

```js
// app/api/[code]/route.ts

import { transfrom } from 'test:transfrom-ts'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const code = (await params).code // 'a', 'b', or 'c'

  return new Response(minify(code))
}

function minify(code: string) {
  return transfrom(code)
}
```

# 避免第三方组件库

很多组件库，包括 [`antd`](https://ant.design/components/overview-cn/)、[`material-ui`](https://mui.com/material-ui/getting-started/) 等，对于服务端框架的优化是很少的，几乎所有代码都会被打包进客户端，不过像是 [shadcn-ui](https://github.com/shadcn-ui/ui) 这种定制化比较高的组件可以尝试一下

# 使用 dynamic/lazy

一些组件在“真正”使用之前也会加载，使用 [`dynamic`](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#nextdynamic) 或者 [`lazy`](https://zh-hans.react.dev/reference/react/lazy) 可以延迟加载这些组件

```diff-tsx
- import HeaveComponent from './HeaveComponent'

+ import dynamic from 'next/dynamic'
+ const HeaveComponent = dynamic(() => import('./HeaveComponent'))

function App() {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <button onClick={() => setVisible(true)}>show heavey component</button>
      {/* 只有 visible 为 true 时，网络才会请求 HeaveComponent 资源 */}
      { visible && <HeaveComponent /> }
    </div>
  )
}

export default App
```

---
title: NextJS 中的渲染模式
date: 2023-05-04
---

此笔记来源于笔者未完全理解 NextJS 中的渲染模式

# 渲染模式

## CSR(Client Side Rendering)

客户端渲染，Vue、React 等框架采用的渲染模式，需要使用 JavaScript，调用接口 API 来获取数据，前后端完全分离

存在的问题：

1.   首次渲染白屏时间长
2.   首次构建只包含一串 JavaScript 脚本，不利于 SEO 和爬虫

## SSR(Server Side Rendering)

服务端渲染，古老的 PHP 和 JSP 采用的是这种渲染模式，NextJS、Nuxt 等框架也包含这种渲染模式

SSR 解决了白屏问题和 SEO 问题，但也存在一定的问题：

1.   请求量增加，每次重新渲染都增加了服务器开销
2.   需要等待页面中所有接口请求完成才可以返回 html，虽然不是白屏，但完成在 `hydrate` 之前，用户不可操作

## SSG(Static Site Generation)

静态站点生成，为了缓解服务器压力，在构建时生成静态页面

SSG 非常快，缺点是静态，不能动态渲染

## ISR(incremental Static Regeneration)

增量静态生成，在访问时生成静态页面，在 NextJS 中，配置好 ISR 后，当用户访问**持续*网页n 秒(开发者指定)后才会重新构建页面，n 秒之前我们刷新页面数据也不会更改

# 项目初始化

运行以下命令，会有 GUI 提示安装配置：

```bash
yarn create next-app
```

安装完成后，配置 `package.json` 文件：

```json
"script": {
	+"export": "next export"
}
```

以上命令为打包成**纯静态**网站

# 预生成静态页面

## getStaticProps

如果在组件函数中获取数据(即 React 写法)，那么首次构建的页面是无法被爬虫获取的。点击右键 -> 查看源代码，能看到是没有数据的：

```tsx
export default function Page() {
  const [data, setData] = useState([])
  useEffect(() => {
    fetch('https://dummyjson.com/posts').then(data => data.json()).then(result => {
      setData(result.posts)
    })
  }, [])
  return (
  	<ul>
      {data.map(item => (
      	<li>{item.title}</li>
      ))}
    </ul>
  )
}
```

-   右键检查源代码：

![](https://plumbiu.github.io/blogImg/QQ截图20230501203235.png)

为了使首次构建能展示数据，我们可以按需导出 NextJS 的 `getStaticProps()` 函数

```tsx
// NextJS 允许 getStaticProps 为异步函数
export async function getStaticProps() {
  const response = await fetch('https://dummyjson.com/posts')
  const result = await response.json()
  return {
    props: {
      data: result.posts
    }
  }
}
```

修改组件函数代码：

```tsx
export default function Page(props: any) { // 使用 props 参数获取 getStaticProps 函数返回的 props.data 属性
  return (
  	<ul>
      {props.data.map((item: any) => (
      	<li>{item.title}</li>
      ))}
    </ul>
  )
}
```

-   右键检察院代码

可以看到有服务端渲染回来的数据

![](https://plumbiu.github.io/blogImg/QQ截图20230501204107.png)

## 注意的问题

上述测试结果是我们在 `dev` 环境测试的，`dev` 环境可以看做每次修改代码或刷新页面都会执行 `build -> start`，但实际部署到服务器上只会进行一次 `build -> start`。通过以下代码展示问题所在：

1.   React 中写法

这种写法在 `dev`、`start` 环境下，刷新页面均会更新时间

```tsx
export default function Page() {
  const [datetime, setDatetime] = useState<Date>()
  useEffect(() => {
    setDatetime(new Date())
  }, [])
  return (
  	<h1> {datetime?.toString()}</h1>
  )
}
```

2.   预生成静态页面

采用 `getStaticProps` 返回一个时间戳，此写法在 `dev` 环境下刷新页面会更新时间，在 `start` 则不会

>   在 `start` 环境下刷新页面不会更新时间的原因其实很简单，因为 **`getStaticProps` 本身是预先产生的静态页面**，`datetime` 也是一直是预先生成的静态数据(可以在 `.next/server/pages` 目录看到预先生成的 `html` 文件)，后面不会更改 

```tsx
export default function Page(props: any) {
  return (
  	<h1> {props.datetime}</h1>
  )
}

export async function getStaticProps() {
  const datetime = new Date()
  return {
    props: {
      datetime: JSON.stringify(datetime)
    }
  }
}
```

# 按需构建静态页

## getStaticPaths

对于静态路由，NextJS 只需要 `getStaticProps` 即可，而 NextJS 还具有动态路由，即路由参数不确定

由于 `getStaticProps` 是**预先**生成静态页面的，无法单独处理动态路由

>   理解：动态与静态互为相反词，所以 `getStaticProps` 无法单独处理动态路由

为此，NextJS 提供了 `getStaticPaths` 方法，让我们“手动”指定动态路由的参数

```tsx
export async function getStaticPaths() {
  return {
    // 指定动态路由参数，便可以预先静态渲染了
    paths: [
      { params: { postId: '1' } },
      { params: { postId: '2' } }
    ],
    fallback: false // 之后讲解该
  }
}
```

`getStaticPaths` 方法返回的数据，可以在 `getStaticProps` 的第一个参数接收

```tsx
export async function getStaticProps(context: any) {
  const id = context.params.postId // 获取 id
  const response = await fetch(`https://dummyjson.com/posts/${id}`)
  const result = await response.json()
  return {
    props: {
      data: result
    }
  }
}
```

## 注意的问题

虽然这样能够解决**某些**动态路由无法预先静态生成的问题，但是手动指定往往效率过低，我们可以尝试以下几种方式

1.   直接获取服务端的数据

由于数据都是存在服务器的数据库中，我们获取到对应的数据即可指定有哪些动态路由

```tsx
export async function getStaticPaths() }{
  const response = await fetch('https://dummyjson.com/posts')
  const result = await response.json()
  return {
    // 直接通过服务端返回的 result 数据，进行 map 渲染对应的模板
    paths: result.posts.map(item => ({ params: { postId: item.id.toString() } })),
    fallback: false
  }
}
```

>   这样做固然可以，但是当我们的网站有很多数据，这样做构建成本是非常高的。所以此方法只适合数据量小的情景(自己的博客等)

2.   **按需构建**

修改 `fallback: ‘blocking’`，修改后，NextJS 就无法提供纯静态的页面了，这意味着我们需要 nodejs 服务器来按需构建静态页

>   这种方式不是服务端渲染(SSR)，只是服务器生成(SSG)，生成之后路由就不变了

```tsx
export async function getStaticPaths() }{
  return {
    paths: [
      { params: { postId: '1' } },
      { params: { postId: '2' } }
    ],
    fallback: 'blocking'
  }
}
```

上述代码的意思是，我们 `build` 之后，NextJS 会预先生成 `postId` 路由参数为 1 和 2 的网页(在 `.next/server/pages` 找到对应的路由文件，可以看到 `1.html`、`2.html`)，对于其他网页，只有我们访问的时候才会生成，例如当我们访问 `postId` 为 3 的网页，那么 `.next/server/pages` 对应的路由文件便会生成 `3.html`

>   注：NextJS 具有预渲染功能，例如当某个链接(路由链接)和某个 `postId` 动态路由链接挂钩时，服务器会直接全部生成 `postId` 的所有可能值

这种方式固然可以，但是 SSG 耗费的时间可能比较长，用户一直看到白屏页面可能失去耐心，此时我们可以修改 `fallback: true`

```tsx
export async function getStaticPaths() {
	return {
    paths: [
      { params: { postId: '1' } },
      { params: { postId: '2' } }
    ],
    fallback: true
  }
}
```

之后在修改组件函数：`router` 路由对象中有一个 `isFallback` 属性，表示是否在构建，我们可以利用此属性为用户返回一个加载动画，增加用户体验

```tsx
export default function Page() {
  const router = useRouter() // 拿到路由对象信息
  // 构建时间返回的 html 页面
  if(router.isFallback) {
    return <h1>Loading...</h1>
  }
  return <h1>Page页</h1>
}
```

# 增量静态页面生成

我们按需构建的静态页面，如果不重新构建，那么内容始终是静态的，不会发生改变，此时我们可以使用 `revalidate` 属性：

```tsx
export async function getStaticProps(context) {
  const dt = new Date()
  const response = await fetch(`https://dummyjson.com/posts/${context.params.postId}`)
  const result = await response.json()
  return {
    props: {
      dt: dt.toString(),
      data: result
    },
    revalidate: 30 // 单位：秒
  }
}
```

>   上述代码表示，当用户访问该网页，30s 内重新请求(例如刷新浏览器)是不会更改内容的，30s 后页面重新构建后内容才会更新

这其实是 http 协议标准的一部分，我们可以查看响应头：

![](https://plumbiu.github.io/blogImg/QQ截图20230503101613.png)

# 服务端渲染

无论是预生成静态页面(SSG)、增量静态生成(ISR)还是全态静态生成，生成的页面也都是静态页面。

如果一个页面对时间要求很大，例如京东淘宝物品的价格等，都需要实时更新，此时我们可以使用服务端渲染。

## getServerSideProps()

NextJS 提供了 `getServerSideProps` 函数实现服务端渲染

不同于 `getStatciProps` 需要 `getStaticPaths` 提供参数，`getServerSideProps` 可以根据用于路由地址获取对应路由参数，例如下面代码示例：

1.   `req`、`res`：同 `express` 框架
2.   `params`：路由路径参数
3.   `query`：路由查询参数
4.   `rest`：`result.resolvedUrl` 表示完整的路由路径，其它的参数与语言有关

>   `[[...params]].tsx`：表示将 `index.tsx` 和 `[...params].tsx` 合并

```tsx
// pages/products/[[...params]].tsx
export async function getServerSideProps({ req, res, params, query, ...rest }) {
  console.log({ params, query, rest })
  const response = await fetch('https://dummyjson')
  const result = await response.json()
  return {
    props: {
      dt: (new Date()).toString(),
      data: result.products
    }
  }
}
```

当我们访问 `/products` 时，打印的参数：

![](https://plumbiu.github.io/blogImg/QQ截图20230504135907.png)

当访问 `/procuts/hello` 时，打印的参数：

![](https://plumbiu.github.io/blogImg/QQ截图20230504140007.png)

当访问 `/products/hello?foo=bar&baz=42` 时，打印的参数：

![](https://plumbiu.github.io/blogImg/QQ截图20230504140302.png)

>   其中 `params` 和 `query` 中的 `params` 属性，来自于文件名，即 `[[...params]].tsx`

---
title: 博客系统中 Next.js 优化
date: 2025-04-24 20:52:00
tags: ['next.js']
desc: 1
---

Next.js 是一个很优秀的全站框架，支持 SSR、CSR 和 SSG 等混合渲染，这篇博客就是 CSR 和 SSG 混合渲染的。

# SSG

SSG 即静态站点生成，在我们运行 build 命令之后，Next.js 会将页面的所有内容通过预构建生成 HTML，这样用户访问网站内容只需要传输预先构建的 HTML 即可，而无需像 SSR 一样，使用服务器资源动态生成 HTML。

一篇博客的网站完全可以使用 SSG 预构建，因为博客内容在你写完之后**基本是一直不变**的，没必要每次都通过服务器渲染生成内容。

使用 SSG 渲染在 APP 路由中需要导出 `generateStaticParams` 函数

```jsx title="app/post/[id]/page.tsx"
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({
    id: post.title,
  }))
}
```

# 避免 "use client"

`"use client"` 表明该组件将在客户端进行渲染，一般用在需要水和的场景，例如为 DOM 元素绑定点击事件等。

**这里说避免 `use client` 并不是完全不适用这个指令**，毕竟绑定事件肯定无法在服务端中运行，主要想表达的是，一些需要在客户端渲染的 HTML 内容，完全可以单独分出一个组件，避免和其他无副作用的组件（服务端组件）混在一起。

## 事先思考的问题

很多人都有一个想法（包括最初的我），直接在 `layout` 中写个 `"use client"`，那我就不用考虑服务端和浏览器环境了，这样性能和方便性不就一举两得了？

有上面想法的人可能没清楚 SSR 相比 CSR 的性能优势在哪里，你可能要理解下面这个问题，当我最开始接触 Next.js 的时候，字节面试官问了我这个问题：

- **SSR 为什么比 CSR 快？SSR 一定比比 CSR 快吗？**

当初我稀里糊涂的回答，大多数情况 SSR 都比 CSR 快，因为 CSR 需要 JavaScript 动态生成 HTML 内容，所以会有白屏，而 SSR 服务器将渲染好的 HTML 返回给了用户，不会有白屏效果。但是面试官紧接着就问：

- **那 SSR 也是服务器里的 JavaScript 动态生成 HTML，为啥 SSR 就比 CSR 快了？**

好吧，我认输，这一块当初确实还不明白，只说了句跟服务器硬件应能有关吧。

## 根本原因

其实最根本的原因之一在于，SSR 往往所需要的网络传输小于 CSR，这是因为很多库都可以转移到 SSR 中。例如如果你想要将 markdown 格式转换为 html 格式的话，可能会用到 [remark-rehype](https://github.com/remarkjs/remark-rehype)、[markdown-it](https://github.com/markdown-it/markdown-it) 一类的库。

如果你使用 CSR，那么这些库就会打包进最终代码，但如果你使用 SSR，那么这些库代码只会在服务端消耗，不会带进客户端，你可以打开 F12 查看一下网络传输，看一下本篇博客所有文件的大小。

如果加上代码高亮，[shiki](https://github.com/shikijs/shiki)、[highlight.js](https://github.com/highlightjs/highlight.js) 这种体积往往非常大。

**总而言之，SSR 等会将编译文件转移到服务端，从而减少客户端网络传输的文件大小。**

# 图片优化

图片优化确实是绕不过的话题了，幸运的是，使用 [react-markdown](https://github.com/remarkjs/react-markdown) 的库很容易实现图片优化：

```jsx
import Markdown from 'react-markdown'
import Image from 'next/image'
<Markdown
  components={{
    img(props) {
      const { src, alt } = props
      return <Image src={src} alt={alt} width={WIDTH} height={HEIGHT} />
    },
  }}
/>
```

当然，你可以使用 `sharp` 获取图片大小和 `blur-hash` 值，这样图片未加载完成时，就不会显示空白了：

```js
import sharp from 'sharp'

export default async function getBlurDataUrl(filePath: string) {
  try {
    const image = sharp(filePath)
    const metadata = await image.metadata()
    const originWidth = metadata.width
    const originHeight = metadata.height
    if (!(originHeight && originWidth)) {
      return {}
    }
    const resizedSize = 14
    const resizedImage = image.resize({
      width: Math.min(originWidth, resizedSize),
      height: Math.min(originHeight, resizedSize),
      fit: 'inside',
    })
    const output = resizedImage.webp({
      quality: 20,
      alphaQuality: 20,
      smartSubsample: true,
    })
    const { data } = await output.toBuffer({ resolveWithObject: true })
    return {
      base64: data.toString('base64'),
      metadata,
    }
  } catch (error) {
    return {}
  }
}
```

然后使用 `MarkdownAsync` 生成：

```jsx
import { MarkdownAsync } from 'react-markdown'
import Image from 'next/image'
<MarkdownAsync
  components={{
    async img(props) {
      const { src, alt } = props
      const imagePath = getAssetImagePath(src)
      const { base64, metadata } = await getBlurDataUrl(
        decodeURIComponent(imagePath),
      )
      const { width, height } = metadata ?? {}
      if (!width || !height || !base64) {
        return props.children
      }
      const imageProps = {
        src: resolveAssetPath(`images/${src}`),
        alt,
        blurDataURL: getBase64Url(base64),
        placeholder: 'blur',
        width,
        height,
      }
      return <Image {...imageProps} />
    },
  }}
/>
```

# 一些极端的方式

## 最小化类名

Next.js 很奇怪，对于 `module css`，类名的样子大概是 `文件相对路径+Hash值+类名`，所以如果你的组件嵌套比较深的话，类名往往非常之长，你可以使用 [@nimpl/classnames-minifier](https://github.com/vordgi/nimpl-classnames-minifier#readme) 生成最小化类名。

> [!NOTE]
> 使用 `@nimpl/classnames-minifier` 意味着不能使用 turbopack 打包，但是你可以通过 `process.env.NODE_ENV` 判断开发和生产环境，开发的时候使用 turbopack 即可。

如果使用原子化 CSS，那就不用考虑这个问题了。

## 减少库的使用

**使用库一般稳定性、兼容性和功能很不错，但是代码体积也会上升，这个看衡量吧。如果比较难实现，那我就会使用库了。**

先总结一下哪些库是自己写的吧：

- 一些 UI 组件。
- markdown 扩展。
- Overlay scrollbar。
- 基于 Github issues 的评论。

UI 组件例如 `Selector` 和 `Modal` 等，自己写实现的功能并不是很多，大概能用就行，然后还有图片预览是模仿 [antd-image](https://ant.design/components/image-cn) 实现的，不过缺少下面的功能栏，这个拖拽计算当时做了两天，很困难。

markdown 扩展可以看这篇[自定义组件测试文章](https://blog.plumbiu.top/posts/note/custom-component)，实现了 [codesandbox](https://codesandbox.io/) 等库的功能。

其次这篇博客的页面滚动条，是模仿 [overlayScrollbars](https://github.com/KingSora/OverlayScrollbars) 实现的，自己的代码在 [github 仓库](https://github.com/Plumbiu/blog/blob/main/src/components/layout/OverlayScrollbar.tsx)，加上 css 不到 200 行代码。

评论实现的话，其实有很多库使用都很方便，加一个 `script` 标签就行了，但是颜色主题不好控制。所以自己用 Github APP 搓了一个，大家想要自己实现的话，可以看阮一峰老师 [Github OAuth](https://ruanyifeng.com/blog/2019/04/github-oauth.html) 这篇文章。

特别难的也有，比如说 `image-gallery`，效果在这里 [测试文章#image-gallery](https://blog.plumbiu.top/posts/note/custom-component#image-gallery)，计算起来很困难，比那个图片预览感觉还要难计算，所以就直接用 [react-photo-album](https://github.com/igordanchenko/react-photo-album) 这个库了。

# shiki 的优化

简单来说，[shiki](https://github.com/shikijs/shiki) 的代码是内联样式，会导致很多重复的 style 属性，可以看这篇文章 [转换 Shiki 的内联样式](https://blog.plumbiu.top/posts/blog/shiki-class-transformer) 了解如何优化。

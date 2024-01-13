---
title: Puppeteer 爬取推特图片/视频
date: 2024-01-02 8:30:00
updated: 2023-01-02 8:30:00
tags:
  - JavaScript
  - TypeScript
categories:
  - FE
---

2024 年第一篇文章.

本文章的完整代码在 [Plumbiu/twid](https://github.com/Plumbiu/twid) 可以看到，项目已经实现通过命令行的方式爬取推特图片/视频了，这里介绍一下基本思路。

Puppeteer  是一个 Node 工具库，它提供了一套高阶 API 来通过 DevTools 协议控制 Chromium 或 Chrome —— 官方介绍。

简而言之，Puppeteer 提供了一套编程方法，模拟用户使用浏览器，例如打开某个网页，滑动页面等操作，也可以监听页面中的相应等，由于是直接操作浏览器，所以 Puppeteer 几乎可以爬取任意网站的内容。

# 如何爬取图片

图片/视频内容主要在 `/user/media` 页面，然而这个页面需要用户登录才可以，一般登录的信息都是在 Cookie 或者 Localstroge 里，而推特将登录信息放在了 `cookie -> auth_token` 字段上，如下图：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea34b17b85fc4fcab2379556a9a9d7d6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=745&h=270&s=45303&e=png&b=2a2a2a)

同时 puppeteer 也提供了设置 cookie 的方法：

```ts
import { launch } from 'puppeteer'

// 启动浏览器
const browser = await launch()
// 打开一个页面
const page = await browser.newPage()
// 页面跳转到 baseUrl 地址
await page.goto(baseUrl)
// 设置页面的 cookie 值
await page.setCookie({
  name: 'auth_token',
  value: token,
})
// 设置好后，跳转到对应的 media 页面
await page.goto(baseUrl + '/media')
```

现在，我们能打开推特用户的媒体页面了，紧接着就是监听我们对图片的请求：

```ts
// 定义一个 set 结构，用来存储图片地址
const images = new Set()
page.on('request', () => {
  // 请求的类型
  const reqType = req.resourceType()
  // 请求的地址
  const reqUrl = req.url()
  if (reqType === 'image') {
    // 如果请求类型为图片，将该地址添加到 images
    images.add(reqUrl)
  }
})
```

获取图片地址的方法有了，但是还有个问题，推特的图片是懒加载的，这意味着我们需要滚动，才能获取所有的图片，在翻阅 puppeteer 的 issue 时，找到了模拟浏览器滚动的方法：

```ts
async function scrollToBottom(page: Page) {
  // page.evaluate 运行在浏览器环境中
  await page.evaluate(async () => {
    await new Promise<void>((resolve, _reject) => {
      // 浏览器总高度
      let totalHeight = 0
      // 每一次滚动的距离
      const distance = 100
      // 定时器，每 500ms 滚动 100px 像素
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight
        window.scrollBy(0, distance)
        totalHeight += distance
        // 如果总高度和滚动高度一致，那么说明我们滚动到底部了
        if (totalHeight >= scrollHeight) {
          clearInterval(timer)
          resolve()
        }
      }, 500)
    })
  })
}
```

继续完善我们之前的代码，只需要加上一句话

```ts
// 定义一个 set 结构，用来存储图片地址
const images = new Set()
page.on('request', () => {
  // 请求的类型
  const reqType = req.resourceType()
  // 请求的地址
  const reqUrl = req.url()
  if (reqType === 'image') {
    // 如果请求类型为图片，将该地址添加到 images
    images.add(reqUrl)
  }
})
// 添加这一句话，就可以模拟滚动了
await scrollToBottom()
```

另外在最后记得要把浏览器和页面关掉：

```ts
await page.close()
await browser.close()
```

## 图片下载

知道了图片的地址，那么就很好下载了，这里使用的是 [got](https://www.npmjs.com/package/got)，因为它比 axios 少了 60kb 大小，而且对于下载图片视频来说完全够用

```ts
import { got } from 'got'

// images 是我们之前定义的 Set，这里转换为数组
Promise.all(
  [...images].map(async (url) => {
    const res = await got.get(url, {
      // 这里我们伪造一下请求头
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36',
      },
      // 设置响应类型为 buffer
      responseType: 'buffer',
    })
    await fsp.writeFile(writePath, res.rawBody)
  }),
)
```

# 视频下载

视频下载关键在于推特会返回一个以 `UserMedia` 开头的 `json` 文件，json 文件里会有一个 `video_info` 字段，在其中可以找到视频的真实地址：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b09a7628452f4535a04c2a150643e4e2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=818&h=704&s=111046&e=png&b=292929)

由于 `json` 文件是响应回来的，因此我们需要监听页面的响应事件，和之前监听请求时间类似：

```ts
// 定义一个 Set，用于存储 videos 地址
const videos = new Set()
page.on('response', async (res) => {
  const url = res.url()
  // 如果地址里包含 UserMedia
  if (url.includes('UserMedia')) {
    // 将相应数据转换为字符串
    // 不转换为对象的原因是因为 json 字段嵌套的太深了
    // 我需要 xxx.yyy.zzz.ttt .... 嵌套几十层，这里我们选择正则匹配，具体可以看项目里的代码
    const requestSource = await res.text()
    // 处理函数
    resolveVideoInfo(requestSource, videos, user)
  }
})
```

`resolveVideoInfo` 函数地址 [core/src.utils](https://github.com/Plumbiu/twid/blob/main/packages/core/src/utils.ts#L48C1-L85C2)

## 下载视频

视频需要流来下载，这部分 `got` 做的十分简单：

```ts
import { pipeline as streamPipeline } from 'node:stream/promises'
import fs from 'node:fs'
import { got } from 'got'

Promise.all(
  [...videos].map(async (url) => {
    await streamPipeline(
      got.stream(url, {
        ...USER_AGENT_HEADER,
      }),
      // outputDir 是输出文件
      fs.createWriteStream(outputDir),
    )
  }),
)
```

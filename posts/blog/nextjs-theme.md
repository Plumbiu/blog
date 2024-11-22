---
title: Next.js 下主题切换最佳实践
date: 2024-11-22
tags: ['next.js', 'theme', 'css']
desc: 1
---

在 CSR（客户端渲染）的情况下，主题切换往往不会出现问题，因为页面内容是 JS 动态渲染出来的，在渲染之前我们就能拿到用户系统或者 localStorage 中保存的主题，然而在 SSR/SSG 情况下，服务端返回的是一个完整的 HTML 页面，而 JS 执行的结果往往在 HTML 之后，如果 JS 设置的主题和 HTML/CSS 不一致，这时候便会出现**闪烁**的情况。

根据我的实践下来，最佳的解决方案还是在 `<head>` 中插入同步的 `script` 标签，很多人可能对**同步 script**避而远之，因为它会阻塞 HTML 的渲染，但是如果你的需求涉及以下需求的的话，可能不可避免（另外，**一小段 `script` 标签对性能的影响可以忽略不计**）：

- 用户首次打开页面，根据用户系统主题设置
- 用户切换主题时，在 localStorage 保存当前主题
- 用户第二次进入页面，根据 localStorage 设置主题

# 代码

准备 `<script>` 标签内容：

```js
// <html data-theme='dark'>...</html> 和 localStorage.getItem('data-theme')
const ThemeKey = 'data-theme'
const Dark = 'dark'
const Light = 'light'

// 检测当前主题
const media = window.matchMedia('(prefers-color-scheme: light)')

// 获取 localStorage 保存的主题，如果没有，返回用户系统主题
function getTheme() {
  const localTheme = getLocalTheme()
  const theme = localTheme ? localTheme : media.matches ? Light : Dark
  return theme
}
// 获取 localStorage 保存的主题
function getLocalTheme() {
  return localStorage.getItem(ThemeKey)
}
// 设置 localStorage 中的主题
function setLocalTheme(theme) {
  localStorage.setItem(ThemeKey, theme)
}
// 设置 html 标签属性
function setHtmlTheme(theme) {
  document.documentElement.setAttribute(ThemeKey, theme)
}
// 根据传参设置主题
function setTheme(theme) {
  setHtmlTheme(theme)
  setLocalTheme(theme)
}
// 应用当前主题
const theme = getTheme()
setTheme(theme)

// 用户系统主题发生变化
media.addEventListener('change', (e) => {
  setTheme(e.matches ? Light : Dark)
})
// localStorage 主题发生变化
window.addEventListener('storage', , () => {
  const theme = getLocalTheme()
  setHtmlTheme(theme)
})
```

配置 `app/layout.tsx` 文件：

```diff-tsx
function RootLayout({ children }) {
  return (
+    <html lang="en" suppressHydrationWarning>
+      <head>
+        <script src="/theme.js"></script>
+      </head>
      {/* .... */}
    </html>
  )
}
export default RootLayout
```

[suppressHydrationWarning](https://nextjs.org/docs/messages/react-hydration-error#solution-3-using-suppresshydrationwarning) 是解决客户端水和时，和服务端 HTML 不一致的情况，因为我们的 JS 代码修改了 `<html>` 标签的属性。

# 一些踩坑的点

## 为什么不用 cookie？

[`cookie`](https://nextjs.org/docs/app/api-reference/functions/cookies) 也是一种解决方式，但是我并不推荐，因为你还要保持 `localStorage` 同步，会有非常大的心智负担。

**更糟糕搞的是，我的网站采取的是 SSG，而 `cookie` 只能运行在服务端，使用它会破坏 SSG**。

## 为什么不用 css 媒体查询？

如果你的网站不需要根据 localStorage 来设置网页主题，那么这是一个好办法，如果你使用了 localStorage，那么也会出现**闪烁问题**。

## 主题图标问题？

在我之前的博客版本中，如果用户当前是暗色主题，主题图标会是 `<MoonIcon>`，亮色主题则是 `<SunIcon>`，这里是通过 react 中的 `useState` + `useLayoutEffect` 设置的，但是这样图标也会出现闪烁，唯一解决方案就是等待 React 的虚拟 DOM 全部 mount 后（hydrate 水和完成）重新渲染，但是这样就失去了 ssr/ssg 的优势。

我的解决方案是图标替换为下拉框，你可以在我的博客头部尝试，这里给出一个简单的版本：

```jsx
export default function Selector() {
  return (
    <select
      onChange={(e) => {
        const value = e.target.value
        // ... 设置主题 ...
      }}
    >
      <option value="system">⚙️ system</option>
      <option value="light">☀️ light</option>
      <option value="dark">🌖 dark</option>
    </select>
  )
}
```

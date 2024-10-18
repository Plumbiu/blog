---
title: Electron 基础篇(未完~~)
date: 2023-03-20
---

代码仓库：[Plumbiu/electron](https://github.com/Plumbiu/electron)

(其实很早就开始学了，奈何本人实力太弱，笔记基本都是抄的官网或者别人的，不好意思放到博客里。最近又开始学了，开始整理一下自己的思路，这下都是自己思考来的了)

# Electron 安装

推荐使用 vite 创建，但是刚入门，还是从头开始配置好了

```shell
yarn init
```

```shell
yarn add --dev electron
```

安装好后，需要配置 `package.json` 文件

```json
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "description": "Hello World!",
  "main": "main.js",
  "author": "Jane Doe",
  "license": "MIT"
  "scripts": {
    "start": "electron ."
  }
}
```

其中 `"main": "main.js"` 指 electron 程序的入口文件为 `main.js`，同时在 `"script"` 脚本中指定启动 Electron 的命令，当然，如果有热更新的效果，可以将 `"satrt"` 指定为 `"nodemon --exec  electron ."`

注意这些规则：

- `entry point` 应为 `main.js`

- `author` 与 `description` 可以为任意值，但对于[应用打包](https://www.electronjs.org/zh/docs/latest/tutorial/quick-start#package-and-distribute-your-application)是必填项

启动

```shell
yarn start
```

# Electron 快速入门

Electron是一个使用 JavaScript、HTML 和 CSS 构建桌面应用程序的框架。 嵌入 [Chromium](https://www.chromium.org/) 和 [Node.js](https://nodejs.org/) 到 二进制的 Electron 允许您保持一个 JavaScript 代码代码库并创建 在Windows上运行的跨平台应用 macOS和Linux——不需要本地开发 经验

## Electron 主进程与渲染进程

**主进程**：启动项目时的 main.js 脚本就是我们说的主进程，在主进程运行的脚本可以以创建 Web 页面的形式展示 GUI。**主进程只有一个**

**渲染进程**：每个 Electron 的页面都在运行着自己的进程，这样的进程称之为渲染进程(基于 Chormium 的多进程结构)

![](https://plumbiu.github.io/blogImg/QQ%E6%88%AA%E5%9B%BE20230206110830.png)

主进程使用 `BrowerWindow` 创建实例，主进程销毁后，对应的渲染进程会被终止。主进程与渲染进程通过 IPC 方式(事件驱动)进行通信

## 第一个 Electron 程序

这样创建的程序只有一个基本架构，不会展示任何内容

**解释**：

使用 CommonJS 语法引入的两个 Electron 模块：

```javascript
const { app, BrowserWindow } = require('electron')
```

- `app` 模块，控制着应用程序的事件生命周期

- `BrowerWindow` 模块，它创建和管理应用程序窗口

添加 `createWindow()` 方法来加载一个基本 `BrowerWindow` 实例

```javascript
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })
}
```

在 Electron 中，只有在 `app` 模块的 `ready` 事件被激发后才能创建浏览器窗口。我们可以通过 `app.whenReady()` API 来监听此事件。在 `whenReady()` 成功后调用 `createWindow()`

```javascript
app.whenReady().then(createWindow)
```

**加载内容：**

在项目根目录中创建一个名为 `index.html` 的文件，写入以下内容

```html
...
<body>
  Hello World
</body>
...
```

同时，在**第一个程序**代码中，使用 `win` 对象的 `loadFile` 方法，创建自定义页面

```javascript
win.loadFile('index.html')
```

重新启动项目，即可看到 `Hello World`

当然，我们也可以传入某个网站的地址，让 Electron 去加载：

```javascript
win.loadURL('https://www.bilibili.com/')
```

这样，Electron 便会以桌面应用程序的方式加载B站首页

## 生命周期

我们可以使用进程(`process`)全局的 `platfrom` 属性专门为某些操作系统运行代码：

### 关闭所有窗口时退出应用

Windows、Linux 中，关闭所有窗口通常会完全退出一个应用程序。

1. **Windows、Linux** 关闭窗口时退出应用

为了实现这一点，你需要监听 `app` 模块的 [`'window-all-closed'`](https://www.electronjs.org/zh/docs/latest/api/app#event-window-all-closed) 事件。如果用户不是在 macOS(`darwin`) 上运行程序，则调用 [`app.quit()`](https://www.electronjs.org/zh/docs/latest/api/app#appquit)。

```javascript
app.on('window-all-closed', () => {
  if (process.platfrom !== 'drawin') app.quit()
})
```

2. 没有窗口打开则打开一个窗口(macOS)

macOS 应用通常即使在没有打开任何窗口的情况下也继续运行，并且在没有窗口可用的情况下激活应用时会打开新的窗口。

为了实现这一特性，监听 `app` 模块的 [`activate`](https://www.electronjs.org/zh/docs/latest/api/app#event-activate-macos) 事件。如果没有任何浏览器窗口是打开的，则调用 `createWindow()` 方法。

因为窗口无法在 `ready` 事件前创建，你应当在你的应用初始化后仅监听 `activate` 事件。 通过在您现有的 `whenReady()` 回调中附上您的事件监听器来完成这个操作。

```javascript
app.whenReady().then(() => {
  createWindow()
  app.on('avtivate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
  }) createWindow()
})
```

# 通过预加载脚本从渲染器访问 Node.js

我们不能直接在主进程中编辑 DOM，因为它无法访问渲染器文档上下文，他们存在于完全不同的进程！

这是将**预加载**脚本连接到渲染器时派上用场的地方，预加载脚本在渲染器进程加载之前加载，并有权访问两个渲染器全局(`window`、`document`) 和 `Node.js` 环境

**场景：**

将 `Electron` 版本号和他的依赖项展示在 web 页面上

1. 首先在根目录上创建 `preload.js` 文件，内容如下：

```javascript
window.addEventListener('DOMContentLoaded', () => {
  const renderText = (dom, text) => {
    const ele = document.getElementById(dom)
    if (ele) ele.innerText = text
  }
  for (const dependency of ['chrome', 'node', 'electron']) {
    renderText(`${dependency}-version`, process.versions[dependency])
  }
})
```

2. 在 `BrowserWindow` 中添加属性 `webPreferences`

```javascript
const path = require('path')
const createWindow = () => {
  const win = new BrowerWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
}
```

两个 Node.js 概念：

- `__dirname` 字符串指向当前正在执行脚本的路径

- `path.join` API 将多个路径联结在一起，创建一个跨平台的路径字符串

**另外，这个文件也可以添加到 index.html 文件中**

对于与您的网页内容的任何交互，您想要将脚本添加到您的渲染器进程中。 由于渲染器运行在正常的 Web 环境中，因此您可以在 `index.html` 文件关闭 `</body>` 标签之前添加一个 `<script>` 标签，来包括您想要的任意脚本：

```html
<script src="./renderer.js"></script>
```

`renderer.js` 中包含的代码可以在接下来使用与前端开发相同的 JavaScript API 和工具。例如使用 `webpack` 打包最小化代码，或者使用 `React` 管理用户界面

## 打包

最快捷的打包方式是使用 [Electron Forge](https://www.electronforge.io/)。

1. 将 Electron Forge 添加到开发依赖中，并使用 import 命令设置 Froge 脚手架

```shell
yarn add --dev @electron-forge/cli
npx electron-forge import
```

2. 使用 Forge 的 `make `命令来创建可分发的应用程序

```shell
yarn run make
```

# Electron 核心概念

## 流程模型

Electron 继承了来自 Chromium 的多进程架构，这使得此框架在架构上非常相似于一个现代的网页浏览器。

### 多进程模型

网页浏览器是个极其复杂的应用程序。 除了显示网页内容的主要能力之外，他们还有许多次要的职责，例如：管理众多窗口 ( 或 标签页 ) 和加载第三方扩展。

在早期，浏览器通常使用单个进程来处理所有这些功能。 虽然这种模式意味着您打开每个标签页的开销较少，但也同时意味着**一个网站的崩溃或无响应会影响到整个浏览器**。

为了解决这个问题，Chrome 团队决定让每个标签页在自己的进程中渲染。

![](https://plumbiu.github.io/blogImg/QQ%E6%88%AA%E5%9B%BE20230206141018.png)

Electron 应用程序的结构非常相似。

### 主进程

每个 Electron 应用都有一个单一的主进程，作为应用程序的入口点。主进程在 Node.js 环境中运行，这意味着它具有 `require` 模块和使用所有 Node.js API 的能力

**窗口管理**

主进程的主要目的是使用 [`BrowserWindow`](https://www.electronjs.org/zh/docs/latest/api/browser-window) 模块创建和管理应用程序窗口。

`BrowserWindow` 类的每个实例创建一个应用程序窗口，且在单独的渲染器进程中加载一个网页。 您可从主进程用 window 的 [`webContent`](https://www.electronjs.org/zh/docs/latest/api/web-contents) 对象与网页内容进行交互。

**应用程序生命周期**

主进程能通过 Electron 的 `app` 模块来控制应用程序的生命周期。该模块提供了一整套的事件和方法，可以用来添加自定义的应用程序行为。例如：

```javascript
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
```

**原生 API**

为了使 Electron 的功能不仅仅限于对网页内容的封装，主进程也添加了自定义的 API 来与用户的作业系统进行交互。 Electron 有着多种控制原生桌面功能的模块，例如菜单、对话框以及托盘图标。

### 渲染器进程

每个 Electron 应用都会为每个打开的 `BrowerWindow` (与每个网页嵌入)生成一个单独的渲染器进程。渲染器负责**渲染**网页内容。所以渲染器进程中代码遵守网页标准。

虽然解释每一个网页规范超出了本指南的范围，但您最起码要知道的是：

- 以一个 HTML 文件作为渲染器进程的入口点。
- 使用层叠样式表 (Cascading Style Sheets, CSS) 对 UI 添加样式。
- 通过 `<script>` 元素可添加可执行的 JavaScript 代码。

此外，这也意味着渲染器无权直接访问 `require` 或其他 Node.js API。 为了在渲染器中直接包含 NPM 模块，您必须使用与在 web 开发时相同的打包工具 (例如 `webpack` 或 `parcel`)

### Preload 脚本[​](https://www.electronjs.org/zh/docs/latest/tutorial/process-model#preload-%E8%84%9A%E6%9C%AC "直接链接到标题")

预加载（preload）脚本包含了那些执行于渲染器进程中，且先于网页内容开始加载的代码 。 这些脚本虽运行于渲染器的环境中，却因能访问 Node.js API 而拥有了更多的权限。

从 Electron 20 开始，预加载脚本默认 **沙盒化** ，不再拥有完整 Node.js 环境的访问权。 实际上，这意味着你只拥有一个 polyfilled 的 `require` 函数，这个函数只能访问一组有限的 API。

| 可用的 API            | 详细信息                                                     |
| --------------------- | ------------------------------------------------------------ |
| Electron 模块         | 渲染进程模块                                                 |
| Node.js 模块          | [`events`](https://nodejs.org/api/events.html)、[`timers`](https://nodejs.org/api/timers.html)、[`url`](https://nodejs.org/api/url.html) |
| Polyfilled 的全局模块 | [`Buffer`](https://nodejs.org/api/buffer.html)、[`process`](https://www.electronjs.org/zh/docs/latest/api/process)、[`clearImmediate`](https://nodejs.org/api/timers.html#timers_clearimmediate_immediate)、[`setImmediate`](https://nodejs.org/api/timers.html#timers_setimmediate_callback_args) |

配置 `main.js` 中的 `BrowerWindow`

```javascript
// main.js
new BrowserWindow({
    webPreferences: {
    	preload: path.join(__dirname, 'preload.js')
    }
})
```

例如，我们可以访问 `process` 、`electron` 对象

```javascript
const { contextBridge } = require('electron')
console.log(process)
console.log(contextBridge)
```

`contextBridge` 可以暴露一个接口，供外部访问

```javascript
// preload.js
const { contextBridge } = require('electron')
contextBridge.exposeInMainWorld('myApi', {
	platform: process.platform
})
```

这时候，外部的环境就可以访问 `myApi` 了

```javascript
// renderer/app.js
console.log(window.myApi)
```

### 上下文隔离

上下文隔离功能将确保您的 `预加载`脚本 和 Electron的内部逻辑 运行在所加载的 [`webcontent`](https://www.electronjs.org/zh/docs/latest/api/web-contents)网页 之外的另一个独立的上下文环境里。 这对安全性很重要，因为它有助于阻止网站访问 Electron 的内部组件 和 您的预加载脚本可访问的高等级权限的API 。

这意味着，实际上，您的预加载脚本访问的 `window` 对象**并不是**网站所能访问的对象。 例如，如果您在预加载脚本中设置 `window.hello = 'wave'` 并且启用了上下文隔离，当网站尝试访问`window.hello`对象时将返回 undefined。

其实对于上一章节 `Preload 脚本`，我们可以使用以下方式进行简单的通讯，但这样并不安全

```javascript
// preload.js
window.myApi = {
    platform: process.platform
}
```

 `platform` 属性可以在渲染进程中直接使用

```javascript
// renderer/app.js
console.log(window.myApi.platform)
```

>   注：不要使用 `contextBridge` 暴露高等级 API，会引起安全问题。例如将 nodejs 中的 fs 模块暴露给渲染进程

### 主进程与渲染进程通信(单向)

在 `preload 脚本` 章节，我们已经通过 `contextBridge` 简单实现了渲染器进程到主进程的单向通信，接下来我们将尝试点击按钮渲染网页的功能

我们可以使用 `ipcRenderer.send` API 发送消息，然后使用 `ipcMain.on` API 接收

1.   使用 `ipcMain.on` 监听事件

```javascript
// main.js
function handleSetTitle(event, title) {
    const webContents = event.sender
    const win = BrowerWindow.fromWebContents(webContents)
    win.setTitle(title)
}
app.whenReady().then(() => {
    ipcMain.on('set-title', handleSetTitle)
    createWindow()
})
```

上述代码中的 `handleSetTitle` 回调函数有两个参数：第一个为 [IpcMainEvent](https://www.electronjs.org/zh/docs/latest/api/structures/ipc-main-event) 结构和一个 `title` 字符串

2.   预加载脚本暴露 `ipcRenderer.send`

```javascript
// preload.js
const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('electronApi', {
    setTitle: (title) => ipcRenderer.send('set-title', title)
})
```

此时，我们可以在渲染器进程中使用 `window.electronAPI.setTitle()` 函数

3.   构建渲染器进程 UI

```html
<!-- index.html -->
<script src="./renderer/app.js" defer></script>
<body>
    Title: <input id="titleIpt" />
    <btn id="btn">Set</btn>
</body>
```

```javascript
// renderer/app.js
const btn = document.getElementById('btn')
const titleIpt = document.getElementById('titleIpt')
btn.addEventListener('click', () => {
    const title = titleIpt.value
    window.electronAPI.setTitle(title)
})
```

4.   **总结**

`ipcRender.send()` API 在预加载脚本(preload.js)中运行，`ipcMain.on()` 在主进程(main.js)中运行。

预加载脚本(preload.js)可以向渲染器进程(renderer/app.js)暴露一些方法

### 主进程与渲染进程通信(双向)

双向 IPC 的一个常见应用是从渲染器进程代码调用主程序模块并等待结果。通过`ipcRenderer.invoke` 与 `ipcMain.handle` 搭配使用

1.   使用 `ipcMain.handle` 监听事件

```javascript
// main.js
async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if(canceled) return 
    else return filePaths[0]
}
app.whenReady(() => {
    ipcMain.handle('dialog:openFile', handleFileOpen)
    createWindow()
})
```

2.   通过预加载脚本暴露 `ipcRenderer.invoke`

在预加载脚本中，我们暴露了一个单行的 `openFile` 函数，它调用并返回 `ipcRenderer.invoke(‘dialog:openFile’)` 的值。我们将在下一步使用此 API 从渲染器进程的用户界面调用原生对话框。

```javascript
// preload.js
const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('electronApi', {
    openFile: () => ipcRenderer.invoke('dialog:openFile')
})
```

3.   构建渲染器进程 UI

```html
<!-- index.html -->
<button type="button" id="btn">Open a File</button>
FilePath: <strong id="filePath"></strong>
```

```javascript
const btn = document.getElementById('btn')
const filePathElement = document.getElementById('filePath')

btn.addEventListener('click', async () => {
    const filePath = await window.electronApi.openFile()
    filePathElement.innerText = filePath
})
```

更多主进程和渲染进程通信：[进程间通信 | Electron (electronjs.org)](https://www.electronjs.org/zh/docs/latest/tutorial/ipc)

# 主进程

>   Electron API 有两种：
>
>   -   Main Process (主进程)
>   -   Renderer Process (渲染进程)

## APP

### 事件

**before-quit:**

>   在应用程序开始关闭窗口之前触发

```javascript
app.on('before-quit', (e) => {
    console.log('App is quiting')
    e.preventDefault()
})
```

**brower-window-blur**

>   在 browserWindow 失去焦点时触发

```javascript
app.on('brower-window-blur', (e) => {
    console.log('App unfocused')
})
```

**browser-window-focus**

>   在 browerWindow 获得焦点时触发

```javascript
app.on('browser-window-focus', (e) => {
    console.log('App focused')
})
```

### 方法

**app.quit()**

>   退出应用程序的方法，使用此方法，应用程序会关闭

```javascript
app.on('browser-window-blur', (e) => {
    setTimeout(() => {
        app.quit()
    }, 3000)
})
app.on('browser-window-blur', (e) => {
    setTimeout(app.quit, 3000)
})
```

**app.getPath(name)**

>   获取本地事先命名好的路径，例如 桌面(desktop)、文档/音乐(music)...

``` js
app.winReady().then(() => {
    console.log(app.getPath('desktop'))
	console.log(app.getPath('music'))
	console.log(app.getPath('temp'))
	console.log(app.getPath('userData'))
    createWindow()
})
```

## BrowserWindow

### 实例方法

`win.loadURL(url[, options])`：加载网页资源

`win.loadFile(url[, options])`：加载本地文件资源

>   注：`win.loadUrl()` 和 `win.loadFile()` 互斥

```javascript
win.loadURL('https://blog.plumbiu.club')
```

```javascript
win.loadFile('./index.html')
```

### 优雅的显示窗口

之前显示窗口的方式，如果加载过慢，会出现很长时间的白屏问题，非常影响体验

-   使用 `ready-to-show` 事件

>   当窗口将要显示(ready to show)的时候，即页面资源加载完毕，再显示窗口，这样就没有白屏问题了。

```javascript
let mainWindow = new BrowserWindow({ show: false }) // 将 BrowserWindow 中的 show 属性设置为 false
mainWindow.once('ready-to-show', () => {
    mainWindow.show()
})
```

-   设置 `backgroundColor`

```javascript
let win = new BrowserWindow({ backgroundColor：'#2e2c29' })
```

### 父子窗口

-   窗口定义

```javascript
secondaryWindow = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: { nodeIntegration: true }
})
secondaryWindow.loadFile('index.html')
secondaryWindow.on('closed', () => {
    mainWindow = null
})
```

-   窗口定义

```javascript
secondaryWindow = new BrowserWindow({
    parent: mainWindow, // 定义父窗口
    model: true // 锁定在主窗口，即此窗口打开后，父窗口无法移动
})
```

### 无边框窗口

应用窗口基本都是有边框窗口，但是 electron 提供了无边框的选择

```javascript
const win = new BrowserWindow({
	frame: false
})
```

为了使无窗口页面可以拖拽，我们需要使用 css 属性

```css
html {
	height: 100%;
}
body {
    height: 100%;
    user-select: none;
	-webkit-app-region: drag;
}
```

同时，如果页面含有 `type=“range”` 的 `input` 拖拽框，会出现 `input` 无法拖拽，以下为修复此控件的方法

```html
<input style="-webkit-app-region: no-drag;" type="range" />
```

### 属性和方法

**minWidth && minHeight**

最小宽度和最小高度

```javascript
mainWindow = new BrowserWindow({
    minWidth: 300,
    minHeight: 300
})
```

**窗口焦点事件**

```javascript
secWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: { nodeIntegration: true }
})
mainWindow.on('focus', () => {
    console.log('mainWindow focused')
})
secWindow.on('focus', () => {
    console.log('secWindow focused')
})
app.on('browser-window-focus', () => {
    console.log('App focused')
})
```

**静态方法**

-   getAllWindows()

方法返回所有打开窗口的一个数组

```javascript
let allWindows = BrowserWindow.getAllWindows()
console.log(allWindows)
```

**实例方法**

-   maximize()

```javascript
secWindow.on('closed', () => {
    mainWindow.maximize()
})
```

## webContents

>   webContents 是 EventEmitter 的实例，负责渲染和控制网页，是 BrowserWindow 对象的一个属性

```javascript
let wc = mainWindow.webContents
console.log(wc)
```

### getAllWebContents()

-   返回所有 WebContents 实例的数组。包含所有 Windows、webviews、opened devtools 和 devtools 扩展背景页的 web 内容

```javascript
const { app, BrowserWindow, webContents } = require('electron')
console.log(webContents.getAllWebContents())
```

### 实例事件

-   did-finish-load && dom-ready

相当于 Vue 中的 `created` 和 `mounted`

```html
<div>
    <img src="https://plumbiu.github.io/blogImg/yuanshen1.webp"
</div>
<script>
let wc = mainWindow.webContents
wc.on('did-finsih-load', () => {
    console.log('Conent fully loaded')
})
wc.on('dom-ready', () => {
    console.log('DOM ready')
})
</script>
```

-   new-window

此事件将在新打开一个窗口后触发

```html
<div>
    <a target="_blank" href="https://blog.plumbiu.club">Plumbiuの小屋</a>
</div>
<script>
wc.on('new-window', (e, url) => {
    e.preventDefault()
    console.log('DOM Ready')
})
</script>
```

-   context-menu：右键上下文信息

此事件将在我们右键窗口后触发

```javascript
wc.on('context-menu', (e, params) => {
    console.log(`conext menu opened on: ${params.mediaType} at x:${params.x}, y:${params.y}`)
})
wc.on('context-menu', (e, params) => {
    console.log(`User selected text: ${params.selectionText}`)
    console.log(`Selection can be copied: ${params.editFlags.canCopy}`)
})
```

## dialog - 对话框

>   显示用于打开和保存文件、警报灯的本机系统对话框

`showDialog` 的各个属性：

-   `buttonLabel`：表示选择按钮的文字
-   `defaultPath`：表示选择文件时默认的路径

-   `properties`：打开后的选择框的一些性质，其参数项有以下

| 参数项          | 作用                   |
| --------------- | ---------------------- |
| multiSelections | 是否可以选择多个文件   |
| createDirectory | 是否可以创建文件夹     |
| openFile        | 是否可以打开文件       |
| openDirectory   | 是否可以打开一个文件夹 |

`dialog` 本身返回一个 `Promise` 对象，其函数参数中可以打印 `result` 查看具体信息:

![](https://plumbiu.github.io/blogImg/QQ截图20230318113621.png)

`result` 共有两个属性，`canceled` 表示用户选择的是确实还是取消，`true` 表示用户选择取消，`false` 表示用户选择确认。filePaths 表示用户选择的文件/文件夹的绝对路径(看样子不支持中文)


```javascript
const { app, BrowserWindow, dialog } = require('electron')
mainWindow.webContents.on('did-finish-load', () => {
    dialog.showOpenDialog({
        buttonLabel: '选择',
        defaultPath: app.getPath('desktop'),
        properties: ['multiSelections', 'createDirectory', 'openFile', 'openDirectory']
    }).then(result => {
        console.log(result)
    })
})
```

```javascript
dialog.showSaveDialog({}).then(result => {
    console.log(result.filePath)
})
```

```javascript
const answers = ['Yes', 'No', 'Maybe']
dialog.showMessageBox({
    title: 'Message Box',
    message: 'Please select an option',
    detail: 'Message details',
    buttons: answers
}).then(({ response }) => {
    console.log(`User selected: ${answers[response]}`)
})
```

## 快捷键和系统快捷键

>   **快捷键**：定义键盘快捷键
>
>   **系统快捷键**：在应用程序没有键盘焦点时，监听键盘事件

快捷键可以包含多个功能键和一个键码的字符串，有符号+结合定义应用中的键盘快捷键

示例：

-   CommandOrControl+A
-   CommandOrControl+Shift+Z

```javascript
const { app, BrowserWindow, globalShortcut } = require('electron')
globalShortcut.register('G', () => {
    console.log('User pressed G')
})
```

```javascript
globalShortcut.register('CommandOrControl+Y', () => {
    console.log('User pressed G with a combination key')
    globalShortcut.unregister('CommandOrControl+G')
})
```

## Menu

![](https://plumbiu.github.io/blogImg/Snipaste_2023-03-19_20-44-34.png)

electron 提供了默认菜单，也可以自定义菜单(例如上图 vscode 的菜单)

1.   引入 `Menu` 对象

```javascript
const { Menu } = require('electron')
```

2.   创建菜单模板

```javascript
const mainMenu = Menu.buildFromTemplate([
    { label: 'item 1' },
    // ...更详细配置可看下面第二段代码
])
```

3.   设置菜单模板(在创建窗口函数中)

```javascript
Menu.setApplicationMenu(mainMenu)
```

4.   完整代码

```javascript
// main.js
const { app, BrowserWindow, Menu, MenuItem } = require('electron')

let mainWindow

let mainMenu = Menu.buildFromTemplate(require('./mainMenu'))
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 100, height: 800,
        webPreferences: { nodeIntegration: true }
    })
    mainWindow.loadFile('index.html')
    Menu.setApplicationMenu(mainMenu)
    mainWindow.on('closed', () => {
        mainWindow = null
    })
    Menu.setApplicationMenu(mainMenu)
}
app.on('ready', createWindow)
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit()
})
app.on('active', () => {
    if(mainWindow === null) createWindow()
})
```

```javascript
// mainMenu.js
module.exports = [
    {
        label: 'Electron',
        submenu: [
            { label: 'Item 1' },
            { label: 'Item 1', submenu: [{ label: 'Sub Item 1' }] },
            { label: 'Item 1' }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { label: 'undo' },
            { label: 'redo' },
            { label: 'copy' },
            { label: 'paste' }
        ]
    },
    {
        label: 'Actions',
        submenu: [
            { label: 'DevTools', role: 'toggleDevTools' }, // 可以打开或者关闭 devTools 开发者工具
            { role: 'toggleFullScreen' }, // 全屏功能呢
            {
                label: 'Greet',
                click: () => { console.log('Hello from Main Menu') },
                accelerator: 'Shi'
            }
        ]
    }
]
```

如果希望主进程(main.js)向 mainMenu.js 传递数据，可以导出一个函数，即：

```javascript
// mainMenu.js
module.exports = (args) => {
	return 'some thing'
}
// main.js
Menu.setApplicationMenu(mainMenu('主进程的消息'))
```

如果希望 `mainMenu.js` 向主进程(main.js)发送数据，可以使用回调函数

```javascript
// mainMenu.js
module.exports = (args, cb) => {
    cb('mainMenu.js 的消息')
    return 'some thing'
}
// main.js
Menu.setApplicationMenu(mainMenu('主进程的消息', (args) => {
    console.log(args)
}))
```

## Context Menus

可以实现右键应用程序打开菜单

```javascript
let contextMenu = Menu.buildFromTemplate([
    { label: 'Item 1' },
    { label: 'editMenu' }
])
let wc = win.webContents
wc.on('context-menu', () => {
    contextMenu.popup() // 弹出菜单
})
```

## 托盘(Tray)

托盘指的是应用程序在右下角(winodws)的图标，我们可以自定义一些方法

```javascript
// Tray.js
const { Tray, Menu } = require('electron')
function createTray(app, win) {
    const tray = new Tray('1.png') // 与 Tray.js 平级的一张图片
    tray.setToolTip('My Electron Application')
    tray.on('click', (e) => {
        if(e.shiftKey) {
            app.quit()
        }
    })
    tray.setContextMenu(Menu.buildFromTemplate([
        { label: 'item 1' },
        { label: 'item2', click: () => {
            win.isVisible() ? win.hide() : win.show() // 判断窗口是否隐藏，如果隐藏，点击 item 2 就会显示；如果窗口显示，则点击 item 2 会隐藏
        }}
    ]))
}
```

解释：

-   `new Tray(‘1.png’)`：应用程序图标的图片
-   `tray.setToolTip('My Electron Application')`：鼠标悬浮到托盘显示的文字
-   `tray.on(action, callback)`：给托盘绑定点击事件
-   `tray.setContextMenu`：右键托盘时，显示的菜单，可以在里面定义 `click` 方法

# 渲染进程

## clipboard

>   作用：在系统剪贴板上进行复制和粘贴操作
>
>   在主进程(main process)和渲染进程(renderer process)均可使用

### readText() && writeText(test)

`readText()`：返回字符串 —— 剪贴板中的内容为纯文本

`writeText(text)`：将文本作为纯文本写进剪贴板

```javascript
const { clipboard } = require('electron')
clipboard.writeText('https://blog.plumbiu.club')
const text = clipboard.readText()
console.log(text)
```

注意：如果在渲染进程中使用，需要在非沙盒环境中使用。即配置下面的参数

```javascript
const win = new BrowserWinodw({
    // ...
    webPreferences: {
        sandbox: false
    }
})
```

## contextBridge

>   作用：创建一个安全的、双向的、跨越隔离情景的同步桥梁
>
>   只在渲染进程(renderer process)中可用

基本使用：

1.   主进程配置 `webPreferences`

```javascript
// main.js
new BrowserWindow({
	// ...
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
    }
})
```

2.   preload 脚本

`preload` 也属于渲染器进程，只不过可以访问更多 API

下面代码中，我们通过 `contextBridge` 中的 `exposeInMainWorld` 暴露一些方法。

`exposeInMainWorld(key, callback)` 的两个参数：

-   `key`：表示渲染器(非 preload 脚本)进程调用唯一值(会挂载到 window 对象上)
-   `callback`：回调函数，返回一个对象，渲染器进程可以访问对象中的方法

```javascript
// preload.js
const { contextBridge } = require('electron')
contextBridge.exposeInMainWorld('myApi', () => {
    platform: process.platform
})
```

3.   renderer 渲染进程

```javascript
console.log(window.myApi.platform)
```

## desktopCapturer

>   使用 navigator.mediaDevices.getUserMedia API 访问可用于从桌面捕获音频和视频的媒体源信息。
>
>   只在主进程(main process)可用

使用看官网：[desktopCapturer | Electron (electronjs.org)](https://www.electronjs.org/zh/docs/latest/api/desktop-capturer) (有空我再整理)


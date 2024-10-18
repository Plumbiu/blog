---
title: Slidev——网页PPT
date: 2023-02-28
---

# 安装

```shell
yarn create slidev
```

跟随命令行提示，会自动打开幻灯片，网址为: http://localhost:3030

**全局安装**

如果觉得每一次手动安装模板太麻烦，可以在全局安装 Slidev：

```shell
npm i -g @slidev/cli
```

然后即可在任何地方直接输入 `slidev`，即可创建模板

```shell
slidev
```

**项目目录结构**

![](https://plumbiu.github.io/blogImg/QQ%E6%88%AA%E5%9B%BE20230208183207.png)

# slidev 命令选项

## slidev [entry]

为 Slidev 启动一个本地服务器

- `[entry]`(string，默认值为 `slides.md`)：幻灯片 markdown 的入口文件

**选项**

| 选项名              | 类型                                    | 默认值 | 作用                                                         |
| ------------------- | --------------------------------------- | ------ | ------------------------------------------------------------ |
| --port、-p          | number                                  | 3030   | 项目启动的端口号                                             |
| --open、-o          | boolean                                 | false  | 在浏览器打开                                                 |
| --remote [password] | string                                  |        | 监听公共主机并启用远程控制。如果传递了该值，那么演讲者模式是私有的，只有通过在 URL 查询 `password` 参数中给定密码才能访问 |
| --log               | 'error' \| 'warn' \| 'info' \| 'silent' | warn   | 日志级别                                                     |
| --forece、-f        | boolean                                 | false  | 强制优化器忽略缓存并重新构建                                 |
| --theme、-t         | string                                  |        | 覆盖主题                                                     |

## slidev build [entry]

建立可托管的 SPA

- `[entry]`(string，默认值为 `slides.md`)：幻灯片 markdown 的入口文件

**选项**

| 选项名      | 类型    | 默认值 | 作用                                                      |
| ----------- | ------- | ------ | --------------------------------------------------------- |
| --watch、-w | boolean | false  | 构建观察                                                  |
| --out、-o   | string  | dist   | 要输出到的目标文件夹                                      |
| --base      | string  | /      | base URL（参阅 https://cli.vuejs.org/config/#publicpath） |
| --download  | boolean | false  | 运行在 SPA 内下载 PDF 式的幻灯片                          |
| --theme、-t | string  |        | 覆盖主题                                                  |

## slidev export [entry]

将幻灯片导入为 PDF(或者其他格式)

- `[entry]`(string，默认值为 `slides.md`)：幻灯片 markdown 的入口文件

**选项**

| 选项名            | 类型                   | 默认值                                                       | 作用                                                         |
| ----------------- | ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| --output          | string                 | use exportFilename (参阅 https://sli.dev/custom/#frontmatter-configures) 或使用 [entry]-export) | 输出的路径                                                   |
| --base            | 'pdf' \| 'png' \| 'md' | pdf                                                          | 输出的格式                                                   |
| --timeout         | number                 | 30000                                                        | 渲染打印页面的超时时间（参阅 https://playwright.dev/docs/api/class-page#page-goto）。 |
| --range           | string                 |                                                              | 输出的页面范围，例如 `1,4-5,6`                               |
| --dark            | boolean                | false                                                        | 导出暗色主题                                                 |
| --with-clicks、-c | boolean                | false                                                        | 输出每次点击的页面（参阅 https://playwright.dev/docs/api/class-page#page-goto）。 |
| --theme、-t       | string                 |                                                              | 覆盖主题                                                     |

## slidev format [entry]

格式化 markdown 文件

- `[entry]` (`string`，默认值：`slides.md`)：幻灯片 markdown 的入口文件。

## sidev theme [subcommand]

与主题相关的业务

子命令：

- `eject [entry]`：将当前主题弹出到本地文件系统中
    - `[entry]` (`string`，默认值：`slides.md`)：幻灯片 markdown 的入口文件。
    - 选项：
        - `--dir` (`string`，默认值：`theme`)：要输出到的目标文件夹。
        - `--theme`，`-t` (`string`)：覆盖主题。

# Markdown 语法

以后会记笔记，这里留个坑

# 导航

将鼠标移动到窗口左下角，即可显示导航栏，当然也可以使用快捷键

| 快捷键        | 说明                                                         |
| ------------- | ------------------------------------------------------------ |
| f             | 切换全屏                                                     |
| right / space | 下一动画或幻灯片                                             |
| left          | 上一动画或幻灯片                                             |
| up            | 上一张幻灯片                                                 |
| down          | 下一张幻灯片                                                 |
| o             | 切换 [幻灯片总览](https://cn.sli.dev/guide/navigation.html#slides-overview) |
| d             | 切换暗黑模式                                                 |
| -             | 切换 [摄像头视图](https://cn.sli.dev/guide/recording.html#camera-view) |
| -             | [演讲录制](https://cn.sli.dev/guide/recording.html#camera-view) |
| -             | 进入 [演讲者模式](https://cn.sli.dev/guide/presenter-mode.html) |
| -             | 切换 [集成编辑器](https://cn.sli.dev/guide/editors.html#integrated-editor) |
| -             | 下载幻灯片 (仅在 [单页（SPA）构建](https://cn.sli.dev/guide/exporting.html#single-page-application-spa) 中支持) |
| -             | 显示该演示文稿的信息                                         |
| -             | 显示设置菜单                                                 |
| g             | 显示“前往...”                                                |

# 动画

类似 PPT 中的点击效果

## 点击动画

### v-click

为元素添加"点击动画"，可以使用 `v-click` 指令或者 `<v-click>` 组件，被指令或者组件嵌套的元素，再按下"下一步"之前，是不可见的

```markdown
# Hello

<v-click>

Hello World

</v-click>

<div v-click class="text-xl p-2">

  Hey!

</div>
```

### v-after

`v-after` 和 `v-click` 用法类似，但是 `v-after` 会再上一个 `v-click` 出发后使元素可见

```html
<div v-click>Hello</div>
<div v-after>World</div>
```

### v-click-hide

与 `v-click` 相同，但不是让元素出现，而是让元素在点击后不可见

```html
<div c-click-hide>Hello</div>
```

### v-clicks

`v-clicks` 仅能作为组件使用，用于快速将其子元素全部添加 `v-click` 指令。在列表结构中常见

```html
<v-clicks>
  - Item1
  - Item2
  - Item3
</v-clicks>
```

这意味着，每次点击下一步时，子元素依次出现

### 自定义点击数量

默认情况下，Slidev 会计算进入下一张幻灯片之前需要执行多少步。我们可以在 `frontmatter` 选项中设置 `clicks` 来覆盖该设置

```markdown
---
# 在进入下一页之前，需要点击 10 次
clicks: 10
---
```

### 排序

通过传递点击索引，可以自定义展示顺序

```html
<div v-click>1</div>
<div v-click>2</div>
<div v-click>3</div>
```

顺序颠倒可以这样写

```html
<div v-click="3">1</div>
<div v-click="2">2</div>
<div v-click="1">3</div>
```

实现其他效果

```markdown
---
clicks: 3
---
<-- 点击三次后可见 -->
<v-clicks at="3">
  <div>Hi</div>
</v-clicks>
```

### 元素过渡

当你在元素中应用 `v-click` 指令时，它会给该元素添加名为 `slidev-vclick-target` 的类。当元素隐藏时，还加上了 `slidev-vclick-hidden` 类。例如：

```html
<div class="slidev-vclick-target slidev-vclick-hidden">Text</div>默认情况下，这些类都应用了半透明的过渡效果：
```

点击后，会变成：

```html
<div class="slidev-vclick-target">Text</div>
```

默认情况下，这些类都应用了半透明的过渡效果

```css
/* default options */
.slidev-vclick-target {
    transition: opacity 100ms east;
}
.slidev-vclick-hidden {
    opacity: 0;
    pointer-events: none;
}
```

我们可以在自定义样式表中自定义过渡效果来覆盖默认配置，例如下面

```css
/* style.css */
.slidev-vclick-target {
    transition: all 500ms ease;
}
.slidev-vclick-hidden {
    transform: scale(0);
}
```

我们也可以只为某也换扥片或布局指定动画

```less
.slidev-page-7, .slidev-layout.my-custom-layout {
    .slidev-vclick-target {
        transition: all 500ms ease;
    }
    .slidev-vclick-hidden {
        transform: scale(0);
    }
}
```

欲了解更多详细信息，请参阅 [自定义样式](https://cn.sli.dev/custom/directory-structure.html#style)。

## 移动

Slidev 内置了 [@vueuse/motion](https://motion.vueuse.org/)。我们可以使用 `v-motion` 指令，以对它们施加运动效果，例如：

```html
<div
     v-motion
     :initial:"{ x: -80 }"
     :enter="{ x: 0 }">
    Slidev
</div>
```

文本 `Slidev` 将从其初始化位置 `80px` 移动到其原始位置。

>   注意：Slidev 会预加载下一张幻灯片以提高性能，这意味着动画可能会在你导航到该页面之前就开始了。为了使其正常工作，你可以禁用指定幻灯片的预加载
>
>   ```markdown
>   ---
>   preload: false
>   ---
>   ```
>
>   或者使用 `v-if` 控制元素的生命周期来获得对组件更细粒度的控制
>
>   ```html
>   <div
>    v-if="$slidev.nav.currentPage === 7"
>    v-motion
>    :initial="{ x: -80 }"
>    :enter="{ x: 0 }">
>    Slidev
>   </div>
>   ```

学习模式： [Demo](https://sli.dev/demo/starter/7) | [@vueuse/motion](https://motion.vueuse.org/) | [v-motion](https://motion.vueuse.org/directive-usage.html) | [Presets](https://motion.vueuse.org/presets.html)

# 导出

## PDF

导出 PDF 工鞥基于 `Playwright` 实现渲染，因此需要先安装 `playwright-chromium` 依赖

```shell
yarn add --dev playwright-chromium
```

接着使用下面的命令导出 PDF

```shell
slidev export
```

稍作等待，在 `./slides-export` 路径下看到幻灯片的 PDF 文件，如果要导出暗色主题，使用 `--dark` 选项

```shell
slidev export --dark
```

**导出点击步骤**

默认情况下，Slidev 会将每张幻灯片导出为 1 页，并忽略点击动画。如果想要将多个步骤的幻灯片，分解为多个页面，需要使用 `--with-clicks` 选项

```shell
sidev export --with-clicks
```

## PNGs

当命令传入 `--format png` 选项时，Slidev 会将每张幻灯片导出为 PNG 图片格式。

```shell
slidev export --format png
```

## 单页应用(SPA)

看下一张，静态部署章节

# 静态部署

## 构建单页应用(SPA)

还可以将幻灯片构建成可部署的单页应用(SPA)

```shell
slidev build
```

生成的应用程序会保存在 `dist/` 目录下，然后可以将该目录部署在 [GitHub Pages](https://pages.github.com/)，[Netlify](https://netlify.app/)，[Vercel](https://vercel.com/)等任何想要部署的地方，并且将幻灯片连接分享给其他人

### 配置基础路径

如果需要将幻灯片部署在网站的子路由下，可以使用 `--base` 选项来进行修改。例如：

```shell
slidev build --base /talks/my-cool-talk/
```

### 提供可下载的 PDF

我们可以向浏览幻灯片应用的观众提供一个可下载的 PDF。可以通过如下配置启动它：

```markdown
---
download: true
---
```

配置好后，Slidev 将生成一个 PDF 文件，并在单页应用中展示下载按钮。

你也可以为 PDF 提供一个自定义的 URL。在这种情况下，PDF 的渲染过程将被忽略。

```markdown
---
download: 'https://myside.com/my-talk.pdf'
---
```

## 部署

### Netlify

-   [Netlify](https://netlify.com/)

在你项目的根目录创建 `netlify.toml` 文件，其内容如下：

```toml
[build.environment]
  NODE_VERSION = "14"

[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

接着，去 Netlify 的仪表盘，选择对应仓库并创建新的站点。

### Vercel

-   [Vercel](https://vercel.com/)

在你项目的根目录创建 `vercel.json` 文件，其内容如下：

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

接着，去 Vercel 的仪表盘，选择对应仓库并创建新的站点。

## GitHub Pages

-   [GitHub Pages](https://pages.github.com/)

创建 `.github/workflows/deploy.yml` 文件，并包含如下内容。然后通过 Github Action 将你的幻灯片部署到 Github Pages。

```yml
name: Deploy pages
on: push
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '14'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Deploy pages
        uses: crazy-max/ghaction-github-pages@v2
        with:
          build_dir: dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

# 绘图与批注

## 对绘图进行持久化

`forntmatter` 中的配置可以把你得到的绘图作为 SVG 保存在 `.slidv/drawings` 目录下，并把它们放入导入的 pdf 或部署的网站中

```markdown
---
drawings:
	presist: true
---
```

## 禁用绘图

完全禁用：

```markdown
---
drawings:
	enabled: false
---
```

仅在开发环境可用

```markdown
---
drawings:
	enabled: dev
---
```

仅在演讲者模式可用：

```markdown
---
drawings:
  presenterOnly: true
---
```

## 绘图同步

默认情况下，Slidev 会在所有实例中同步你的绘图。如果你在和他人共享幻灯片，你可能会需要通过以下方式禁用同步：

```
---
drawings: 
  syncAll: false
---
```

通过这个配置，只有来自演讲者实例的绘图会和其他实例同步。
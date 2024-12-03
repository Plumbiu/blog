# posts 文件夹结构

你可以看到 post 文件夹有四个子文件夹，这是我用来记录区分不同类别的文章，如果你要删除或者增加，建议**修改 [`constants`](/src/constants.ts) 中的 `PostDir` 变量**，并查找它使用的地方，作出相应修改。

同时 front-matter 至少具备以下几条，才会显示文章：

```markdown
---
title: 你的文章标题
date: 文章发表日期
desc: 文章简介，可以是数字，表示简介是文章正文第 n 行内容（从 1 开始）
---
```

# Github Pages

目前具备上传 [Github Pages](https://docs.github.com/zh/pages/getting-started-with-github-pages/creating-a-github-pages-site) 能力，**但是它暂时托管不了 `public` 文件夹，因此里面的图片或者 rss 不会正常展示**，但是对 `theme.js` 做了处理，具体可查看 [`package.json`](/package.json) 文件的 `build:gitpage` 命令以及 [`git-page.tsx`](/src/app/git-page.tsx) 文件。

> **如果你有处理 public 文件夹更好的方法，欢迎 PR**！

# posts 文件夹结构

你可以看到 post 文件夹有四个子文件夹，这是我用来记录区分不同类别的文章，如果你要删除或者增加，**修改 [`constants.ts` 文件](/src/constants.ts) 中的 `PostDir` 变量**，并查找它使用的地方，作出相应修改。

同时 front-matter 至少具备以下几条，才会显示文章：

```markdown
---
title: 你的文章标题
date: 文章发表日期
desc: 文章简介，可以是数字，表示简介是文章正文第 n 行内容（从 1 开始）
---
```

# Github Pages

修改 [`constants.ts` 文件](/src/constants.ts) 中的 `RepoName` 变量，对应你仓库的名字

# 图片

文章中所有的图片都存储在 [public/images](/public/images/) 文件夹下，如果你的图片存储在其它位置，修改 [src/app/posts/\_components/Markdown/index.tsx](/src/app/posts/_components/Markdown/index.tsx) 文件，搜索关键字 `imagePath`

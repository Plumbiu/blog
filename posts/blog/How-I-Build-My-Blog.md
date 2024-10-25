---
title: 我是如何构建自己的博客的
date: 2024-10-10
desc: 1
---

在国庆假期期间，因为闲来无事，重拾起了构建博客的这一想法，事实上，自己在此之前已经有过两版博客了，第一版是根据 [hexo](https://github.com/hexojs/hexo) 构建的，但毕竟只是一个模板，并没有自己的东西，[第二版](https://blog.plumbiu.top/) 是自己从头开始搭建的，但是当时对 Next.js 并不熟悉，有些实现还是不够优雅的，于是便有了这一版。

相比于上一版，UI 的变化是比较大的，这里要感谢 [托尼的博客](https://antfu.me/)，但是变化最大的是扩展了 markdown 的语法，但我并没有使用 [MDX](https://github.com/MDX-js/MDX)，事实上 MDX 应该是最好的解决方案，它可以导入自定义组件，也可以导出数据，Next.js 也提供了很好的 [解决方案](https://nextjs.org/docs/app/building-your-application/configuring/MDX)，但是回到最初为何放弃第一版博客，正是因为“没有自己的东西”，而 MDX 就是一个集成度很高的模板

# 最后我决定拆分成以下文章

- [在 Markdown 中实现 Playground](/posts/blog/implement-playground)
- [一个优雅的文章目录组件](/posts/blog/implement-toc)

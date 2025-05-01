# [Plumbiu's blog](https://blog.plumbiu.top/)

<p align="center">
  <a href="/README.md">简体中文</a>
  <a href="/README-en.md">English</a>
</p>

Thanks to [fuwari](https://github.com/saicaca/fuwari) styles.

<details>

<summary>Performance</summary>

**Phone:**
![phone-scores](./assets/phone-scores.webp)

**PC:**
![pc-scores](./assets/pc-scores.webp)

</details>

# Features

- Static stite generate(SSG), 123kB first load JS(mostly [React][])
- Highly designed by [remark][] and [rehype][]
- Static syntax highlighting via [shiki][]
- Light/dark theme width [persistent storage][] and [system theme listener][]
- Image optimization and blurhash support via [sharp][] and [next/image][]
- Comment system via [Gtihub API][]
- Component lazy load via [IntersectionObserver][]

# Customize

For markdown extension configuration, please refer to the article [Markdown extensions](https://blog.plumbiu.top/posts/note/custom-component).

## Site info

The site information configuration file is in the [config/site.ts](/config/site.ts) file. When deleting a variable, remember to delete the code that references the variable.

## Article

The article files are in the [posts](/posts/) folder, and its subdirectories represent `Categories`. If you want to delete some categories, please modify the [data/constants/categories.ts](/data/constants/categories.ts) file at the same time.

## Front matter

front-matter contains at least the title and release date:

```markdown
---
title: article title
date: article release date
desc: article description (can be a number, indicating the description of the line in the text)
---
```

### i18n

i18n support is not perfect at present, but you can create new directories in each category directory, such as [posts/note/en](/posts/note/en) directory, and by configuring the [config/locale.ts](/config/locale.ts) file, the article list can display the corresponding language

### Image

By default, the image URL carries the prefix `images`, which means that the file should be stored in the [public/images](/public/images/) folder.

# Deploy to Github pages

Uncomment (./.github/workflows/nextjs.yml)[./.github/workflows/nextjs.yml] and edit the `RepoName` in [data/site.ts](/data/site.ts).

> [!WARNING]
> Github pages do not support API routes, so comments will not work.

<!-- Definitions -->

[React]: https://github.com/facebook/react
[rehype]: https://github.com/rehypejs/rehype
[remark]: https://github.com/remarkjs/remark
[shiki]: https://github.com/shikijs/shiki
[persistent storage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
[system theme listener]: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
[sharp]: https://github.com/lovell/sharp
[next/image]: https://nextjs.org/docs/basic-features/image-optimization
[Gtihub API]: https://docs.github.com/zh/rest
[remark-directive]: https://github.com/remarkjs/remark-directive
[IntersectionObserver]: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver

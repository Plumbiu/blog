---
title: 转换 Shiki 的内联样式
date: 2024-11-15
desc: 1
---

[`Shiki`](https://github.com/shikijs/shiki) 是一个基于 TextMate 语法的代码语法高亮器，它与 VS Code 的语法高亮引擎 [`onIguruma`](https://github.com/kkos/oniguruma) 一致，几乎所有主流编程语言提供非常准确且快速的语法高亮，然而 `Shiki` 并不关注于 CSS，它的语法高亮都是通过 HTML 的 `style` 属性实现的，这会导致很多样式无法得到复用，产生体积更大的 `HTML` 体积，本文实现**内敛样式**到**类名**的转换

![shiki-inline-styles](shiki-inline-styles.webp)

> **如果你有这方面的需求，可以使用 [`shiki-class-transformer`](https://github.com/Plumbiu/shiki-class-transformer)**，另外 `shiki` 也是有[自己的转换器](https://shiki.style/packages/transformers#transformerstyletoclass)的，但是它是 js 动态产生 css 片段，并不是直接导入 css

# 为什么是内联样式？

如果你曾经魔改过 VS Code 的主题的话，你应该有印象需要修改 `scope` 属性和 `settings.foreground` 等属性，我们举一个 [`tm-themes` 仓库](https://github.com/shikijs/textmate-grammars-themes/tree/main/packages/tm-themes)（`shiki` 中的主题基于这个） 的一个简化例子：

```json
{
  "tokenColors": [
    {
      "scope": ["comment"],
      "settings": {
        "foreground": "#a0ada0"
      }
    },
    {
      "scope": ["constant"],
      "settings": {
        "foreground": "#999999"
      }
    }
  ]
}
```

> 如果你好奇为什么是 `scope` 和 `settings` 这种设计模式，你可以参考 [`vscode-textmate`](https://github.com/microsoft/vscode-textmate?tab=readme-ov-file#using) 官方的例子，在注释代码中可以看到打印结果

可以看到代码颜色是基于 `scope` 字段决定的，而配置颜色的字段在 `settings.forground` 中，我在看到这段配置的时候，也是在想，**为什么 `settings` 不能直接写一个类名？**

原因之一在于有时候 `scope` 会过长，如果我们像 [`prism`](https://github.com/PrismJS/prism) 一样，将类名分为 `keyword`、`variable` 等等，会导致类名比内敛样式还长的情况：

```json
{
  "scope": [
    "delimiter.bracket",
    "delimiter",
    "invalid.illegal.character-not-allowed-here.html",
    "keyword.operator.rest",
    "keyword.operator.spread",
    "keyword.operator.type.annotation",
    "keyword.operator.relational",
    "keyword.operator.assignment",
    "keyword.operator.type",
    "meta.brace",
    "meta.tag.block.any.html",
    "meta.tag.inline.any.html",
    "meta.tag.structure.input.void.html",
    "meta.type.annotation",
    "meta.embedded.block.github-actions-expression",
    "storage.type.function.arrow",
    "meta.objectliteral.ts",
    "punctuation",
    "punctuation.definition.string.begin.html.vue",
    "punctuation.definition.string.end.html.vue"
  ],
  "settings": {
    "foreground": "#999999"
  }
},
```

因此直接从 `settings` 中设置 `style` 属性是最方便的做法，**但是我认为 `shiki` 可以做得更好，因为颜色可以一一对应一个类名，这样 `shiki` 就不需要内联样式了**，这也是这篇文章实现的主要思路。

# 实现思路

之前讲过，我们可以将颜色对应为一个类名，结合 `shiki` 的 `transfomer` 即可实现外联样式：

```js
// 导入对应的 json 文件
import vitesseDark from 'tm-themes/themes/vitesse-dark.json'
import fs from 'node:fs'

// 准备好前缀和后缀
const PREFIX = 's'
let suffix = 0

function generateMap() {
  // key 为颜色，value 为类名
  const map = {}
  for (const token of vitesseDark.tokenColors) {
    const color = token?.settings?.foreground
    if (color && !map[color]) {
      map[color] = PREFIX + suffix
      suffix++
    }
  }
  fs.writeFileSync('./vitesse-dark.json', JSON.stringify(map))
  return map
}
generateMap()
```

现在我们得到了一个 `map`，这个 `map` 会在后面的 `transfomer` 中使用：

```json
{
  "#a0ada0": "s0",
  "#999999": "s1",
  "#a65e2b": "s2",
  "#59873a": "s3"
  // ...
}
```

接下来生成对应的 `css` 文件

```js
function generateCss() {
  const map = generateMap()
  let style = ''
  for (const [color, className] of Object.entries(map)) {
    style += `
      .${className}: {
        color: ${color};
      }
    `
  }
  fs.writeFileSync('./vitesse-dark.css')
}

generateCss()
```

得到的文件：

```css
.s0 {
  color: #a0ada0;
}
.s1 {
  color: #999999;
}
.s2 {
  color: #a65e2b;
}
.s3 {
  color: #59873a;
}
/* ... */
```

接下来书写 `transformer`：

> 完整代码请看 [`shiki-class-transformer`](https://github.com/Plumbiu/shiki-class-transformer/blob/main/src/index.ts)，这里实现的只是最基本的，很多情况没有考虑

```js
// map 为之前我们生成的 json 文件
function shikiClassTransformer({ map }) {
  return {
    tokens(tokens) {
      for (const items of tokens) {
        for (const token of items) {
          let htmlStyle = token.htmlStyle
          if (!htmlStyle || typeof htmlStyle === 'string') {
            return
          }
          // shiki 默认情况下会使用 color 作为颜色，例如 style="color:#fff"
          const className = map[htmlStyle.color]
          // map 中没有对应类名，删除掉
          if (!className) {
            continue
          }
          // 保证 token.htmlAttrs 不为空
          if (!token.htmlAttrs) {
            token.htmlAttrs = {}
          }
          // 设置类名
          token.htmlAttrs.class = className
          // 将原有 style.color 删除
          // 如果 htmlStyle 为 {} 空对象，不会产生内联样式
          delete token.htmlStyle['color']
        }
      }
    },
  }
}
```

大功告成（你可以开发者面板看一下我博客里的类名）：

![shiki-className](shiki-className.webp)

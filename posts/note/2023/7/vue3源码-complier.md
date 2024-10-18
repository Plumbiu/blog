---
title: Vue3源码 —— ast语法树(complie)
date: 2023-07-24
---

# parse

> `parse.js` 包含 `ast` 语法树生成的函数

ast 语法树用于解析 vue 中 `template` 的模板，以便后续虚拟 DOM 及 DIFF 算法做准备

![](https://plumbiu.github.io/blogImg/QQ截图20230702164759.png)

例如有以下模板：

```html
<div>
  <p>hello</p>
  <p>{{msg}}</p>
</div>
```

经过 `parse` 转换后的语法树：

> 为了更清晰，删掉了 `type` 和 `tagType` 属性

```json
{
  "children": [
    {
      "tag": "div",
      "children": [
        { "content": "\n    " },
        {
          "tag": "p",
          "children": [{ "content": "hello" }]
        },
        { "content": "\n    " },
        {
          "tag": "p",
          "children": [{  "content": { "content": "msg"} }]
        },
        { "content": "\n  " }
      ]
    }
  ],
  "helpers": []
}
```

## ast 生成函数

1. **一些基础的函数**

基础转换函数

> 虽然 `baseParse` 代码很少，但却是解析 ast 的入口函数

```typescript
export function baseParse(content: string) {
  const context = createParserContext(content)
  return createRoot(parseChildren(context, []))
}
```

上面的 `baseParse` 用到了很多函数，这里逐个讲解：

- `createParserContext` 函数

  简单的将内容(template 中的 html)包裹进一个对象，对象的 `source` 属性即是 `content`

  ```typescript
  function createParserContext(content) {
    return {
      source: content
    }
  }
  ```

  > 之所以多做一步返回一个对象，而不是单纯返回 `content`，是借用 JavaScript 中的引用类型，便于直接修改 `content` 内容，即：
  >
  > - 简单类型，例如 string、number 函数传参时，会开辟新的内存去存储这些值
  > - 复杂类型，例如 object 等函数传参是，传递的是值的地址，函数内部修改此种类型，会直接反馈到该函数外部的数值

- `createRoot` 函数

  用于标记根节点

  ```typescript
  function createRoot(children) {
    return {
      // NodeTypes 是在外定义的枚举属性，Root 枚举值为 1
      type: NodeTypes.ROOT,
      children,
      helpers: []
    }
  }
  ```

- `parseChildren` 函数

  `parseChildren` 函数是解析 template 模板的核心函数，下面仔细介绍

2. `isEnd` 函数

`isEnd` 函数用于检测标签的节点，例如当我们遇到了结束标签，首先需要看看之前的开始标签，如果是相同标签，那么就应该结束，例如 `<div><span></div>`，这种情况就应该报错

> 这里的操作大多是因为：vue 通过不断截取 `template` 中的字符串，即截取 `context.source`
>
> Tip：这里只允许存在单个根标签，和 vue3 真实情况不同

```typescript
function isEnd(context: any, ancestors) {
  const s = context.source
  // 遇到了结束标签
  if(context.source.startsWith('</')) {
    for(let i = ancestors.length - 1; i >= 0; -- i) {
      // ancestors 会存储当前位置的标签名
      if(startsWithEndTagtOpen(s, ancestors[i].tag)) {
        return true
      }
    }
  }
  return !context.source
}
```

- `startsWithEndTagOpen` 函数

  用于判断开始标签和结束标签是否一致
  
  ```typescript
  function startsWithEndTagOpen(source: string, tag: string) {
  	return (
    	startsWith(source, '</') &&
      // 如果一直，那么从 </ 开始，截取 tag.length 个字符的名字，应该与 tag 一致
      source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
    )
  }
  ```
  
  - `startsWith` 函数
  
    和字符串的 `startsWith` 功能一致
    
    ```typescript
    function startsWith(source: string, searchString: string): boolean {
      return source.startsWith(searchString)
    }
    ```

3. `advanceBy` 函数

上面的结束中，我们知道了 `vue3` 通过截取字符串生成 ast 语法树，`advanceBy` 函数就是用来处理字符串究竟要步进多少

```typescript
function advanceBy(context, numberOfCharacters) {
  context.source = context.source.slice(numberOfCharacters)
}
```

> 例如，但我们遇到 `<div>` 标签，只需要将原字符串移动 `tag.length + 2` 个单位即可

4. `parseChildren` 函数

通过循环转换为 ast 语法树：

- 如果字符串移 `{{` 开始，表明这个是需要插值的字符串，交给 `parseInterpolation` 函数处理
- 如果字符串开头是 `<`，还需要进一步判断
  - 如果 `s[1]` 是 `/`，那么这个就是结束字符串了，交给 `parseTag` 函数处理，并跳出此次循环
  - 如果 `s[1]` 仅仅是一个字母，那么交给 `parseElement` 处理

> `parseInterpolation`、`parseTag`、`parseElement` 都会在内部处理 `context.source` 的内容，具体是根据自身函数的功能，去截取字符串，例如 `paseInterpolation` 会步进 `'{{'.length = 2` 的步数

```typescript
function parseChildren(context, ancestors) {
  const nodes: any = []
  
  while(!isEnd(context, ancestors)) { // isEnd 函数定义在上方，用于判断是否遇到了结束标签
    let node
    const s = context.source
    // 第 1 次判断
    if(startsWith(s, "{{")) {
      // 1. 开头是 {{，表明这是一个插值语法，需要解析它
      node = parseInterpolation(context)
    } else if(s[0] === '<') {
      if(s[1] === '/') {
        if(/[a-z]/i.test(s[2])) {
          // 匹配 </div>
          // 需要改变 context.source 的值，也就是之前所说的逐步移动指针，截取字符串
          parseTag(context, TagType.End)
          // 结束标签就以为已经处理完了，可以跳出本次循环
          continue
        }
      } else if(/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestors)
      }
    }
    if(!node) {
      node = parseText(context)
    }
    nodes.push(node)
  }
  return nodes
}
```

5. 解析函数

> 这些函数都是为了返回对应的格式数据，例如文本数据，插值数据，标签数据等

- `parseText` 函数

  `parseText` 主要解析文本数据

  ```typescript
  function parseText(context) {
    // 文本的情况：
    //  hello, {{msg}} <p></p>
    // 我们要做的就是，先找到 < 的位置，如果找到了，那么 endIndex 就指向 < 的位置
    // 如果没有找到 <，那么找 {{ 的位置，如果找到了，那么 endIndex 就指向 {{
    // endIndex 就是移动的步长
    const endTokens = ['<', '{{']
    let endIndex = context.source.length
    for(let i = 0; i < endTokens.length; i++) {
      const index = context.source.indexOf(endTokens[i])
      if(index !== -1 && endIndex　> index) {
        endIndex = index
      }
    }
    const content = parseTextData(context, endIndex)
    return {
      type: NodeTypes.Text,
      content
    }
  }
  ```

  - `parseTextData` 函数

    用于处理文本数据的字符串步进，并将文本数据返回

    ```typescript
    function parseTextData(content, length) {
      const rawText = context.source.slice(0, length)
      advanceBy(context, length)
      return rawText
    }
    ```

- `parseTag` 函数

  处理标签字符串的步进，将标签即标签名返回

  ```typescript
  function parseTag(context: any, type: TagType) {
    const match: any = /^<\/?([a-z][^\r\n\t\f />]*)/i.exec(context.source)
    const tag = match[1] // 收集 `<标签名`
    // TODO: 处理 selfClose 的情况
    advanceBy(conttext, match[0].length + 1) // 这里没有做处理自闭合标签的情况
    
    if(type === TagType.End) return // 表明这是结束标签，没必要识别了
    
    let tagType = ElementTypes.Element
    
    return {
      type: NodeTypes.ELEMENT, // 节点属性，猜测是原生节点属性
      tag,
      tagType // 元素属性
    }
  }
  ```

- `parseInterpolation` 函数

  用于处理插值语法

  ```typescript
  function parseInterpolation(context: any) {
    // 例如：{{ msg }}
    const openDelimiter = '{{'
    const closeDelimiter = '}}'
    const closeIndex = context.source.indexOf(
    	closeDelimiter,
      openDelimieter.length
    )
    // TODO: closeIndex = -1，即未找到 }}， 需要报错
    
    // 步进 2 个长度，即可去掉 {{
    advanceBy(context, 2)
    
    // 处理思路：
    //  1. 获取 `闭合标记` 的位置：context.source.indexOf(...)
    //  2. 步进 2 个长度，获取 `开始标记` 到 `结束标记` 的内容(rawContent)：closeIndex - openDelimiter.length
    //  3. 使用 parseTextData 处理 context，并获取到文本(preTrimContent)
    //  4. 去除两端空格(content)
    
    const rawContentLength = closeIndex - openDelimiter.length
    const rawContent = context.source.slice(0, rawContentLength)
    
    // 获取插值语法中的文本，例如 {{msg}}，获取msg
    const preTrimContent = parseTextData(context, rawContent.length)
    const content = preTrimContent.trim() // 去除两端空格
    
    advance(context, closeDelimiter.length)
    return {
      type: NodeTypes.INTERPOLATION,
      content: {
        type: NodeTypes.SIMPLE_EXPRESSION,
        content
      }
    }
  }
  ```

  - `parseElement` 函数

  前面的 `parseChildren` 函数的几个情况中中，当我们遇到了 `<`，且不是结束标签时，需要使用 `parseElement` 函数

  ```typescript
  function parseElement(context, ancestors) {
    // 先处理标签元素
    const element = parseTag(context, TagType.Start) // TagType.Start = 1
    ancestors.push(element)
    const children = parseChildren(context, ancestors) // 递归处理
    ancestors.pop()
    
    if(startsWithEndTagOpen(context.source, element.tag)) {
      praseTag(context, TagType.End)
    } else {
      throw new Error(`缺少结束标签 ${element.tag}`)
    }
    element.children = children
    return element
  }
  ```
  
## 理解 parseElement 和 parseChildren 之间的调用

parseElement 和 parseChildren 函数相互调用非常巧妙，也非常难理解，这里笔者做了一个简单的示意图，帮助理解

![](https://plumbiu.github.io/blogImg/QQ截图20230702164546.png)

## ancestors 变量的作用

在 `mini-vue` 中，`ancestors` 主要在两个函数用到了：`parseElement` 和 `isEnd`

它的作用是，判断标签前后是否一致，暂不考虑自闭合的情况

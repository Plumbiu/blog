---
title: Vue源码 —— ast抽象语法树(vue2)
date: 2023-05-30
---

这篇笔记实现的都是简易版的，有些情况是没有考虑进去的

代码仓库：https://github.com/Plumbiu/vue_source_code

# 什么是 AST 抽象语法树

JS 中的抽象语法树(Abstract Syntax Tree)本质上就是一个 JS 对象

![](https://plumbiu.github.io/blogImg/QQ截图20230529083125.png)

>   AST 抽象语法树并不是 vue 的原创，这里只是简单的学习一下

## AST 和虚拟节点的关系

模板语法 -> 抽象语法树 AST -> 渲染函数(h函数) -> 虚拟节点(diff) -> 界面

# parse 函数

`parse` 函数用来生成 `AST` 抽象语法树

```javascript
function parse(templateStr) {
  /* CODE HERE */
}
```

步骤：

1.   首先准备指针和一些正则标记等：

```javascript
let index = 0  // 指针
let rest  = '' // 模板字符串剩余部分
// 开始正则标记
const startRegExp = /^\<([a-z]+[1-6]?)\>/
// 结束正则标记
const endRegExp = /^\<\/([a-z]+[1-6?]\>)/
// 开始与结束标签之间的文字标记
const wordRegExp = /^([^\<]+)\<\/([a-z]+[1-6]?)\>/
```

2.   准备两个栈

>   `vue` 源码中只使用到了一个栈，为了方便理解，这里使用了两个栈

```javascript
cosnt stack1 = []
const stack2 = [{ children: [] }]
```

>   最终结果是 `stack2`，`stack1` 作为中介用于判断开始结束标签是否一致

3.   while 循环遍历模板字符串

```javascript
while(index < templateStr.length - 1) {
  rest = templateStr.substring(index)
  // ...
}
```

4.   各个正则的逻辑

-   当遇到开始标签

```javascript
if(startRegExp.test(rest)) {
  // 获取标签名
  let tag = rest.match(startRegExp)[1]
  // 向 stack1 中 push 标签
  stack1.push(tag)
  // 向 stack2 中 push 对应的数据
  stack2.push({ tag, children: [] })
  // 让指针位移 tag.length + 2 (因为 <> 占了 2 个字符)
  index += tag.length + 2
}
```

-   遇到文字

```javascript
if(wordRegExp.test(rest)) {
  let word = rest.match(wordRegExp)[1]
  // 判断 word 是否为空，不为空才进行操作
  if(!/^\s+$/.test(word)) {
    // 改变此时 stack2 栈顶元素
    stack[stack.length - 1].children.push({ text: word, type: 3 })
  }
}
```

-   遇到结束标签

```javascript
if(endRegExp.test(rest)) {
  let tag = rest.match(endRegExp)[1]
  let pop_tag = stack1.pop()
  // 只有 pop_tag 和结束标签的 tag 一致才进行操作，否则报错
  if(tag === pop_tag) {
    // 将 stack2 栈顶弹出
    let pop_arr = stack2.pop()
    // 检查 stack 的长度
    if(stack2.length > 0) {
      // 假设在 stack2 未弹出时的数据如下：
      /*
      	[
      		{ tag: 'ul', children: [] },
      		{
      			tag: 'li',
      			children: [{
      				text: '你好',
      				type: 3
      			}]
      		}
      	]
      */
      stack2[stack2.length - 1].children.push(pop_arr)
    	// 弹出之后，遇到上面语句，stack2 数据如下：
      /*
      	[
      		{
      			tag: 'ul',
      			children: [
      				tag: 'li',
      				children: [
      					{ text: '你好', type: 3 }
      				]
      			]
      		}
      	]
      */
    }
  } else {
    throw new Error('标签没有封闭')
  }
  // 指针移动标签长度加 3，因为 </> 占 3 位
  index += tag.length + 3
}
```

-   什么都没遇到

```javascript
else {
  // 指针加一
  index++
}
```

完整代码：

```javascript
function parse(templateStr) {
  // 指针
  let index = 0
  // 剩余部分
  let rest = ''
  // 开始标记
  const startRegExp = /^\<([a-z]+[1-6]?)\>/
  const endRegExp = /^\<\/([a-z]+[1-6]?)\>/
  // 抓取结束标记前的文字
  const wordRegExp = /^([^\<]+)\<\/([a-z]+[1-6]?)\>/
  // 准备两个栈(vue源码一个栈，但是不好理解)
  const stack1 = []
  const stack2 = [{ children: [] }]
  while (index < templateStr.length - 1) {
    rest = templateStr.substring(index)
    // 识别遍历到的这个字符，是不是一个开始标签
    if (startRegExp.test(rest)) {
      let tag = rest.match(startRegExp)[1]
      // 将开始标记推入 stack1 中
      stack1.push(tag)
      // 将空数组推入 stack2 中
      stack2.push({ tag, children: [] })
      // 指针移动标签的长度 + 2，因为 <> 占 2 位
      index += tag.length + 2
    } else if (endRegExp.test(rest)) {
      let tag = rest.match(endRegExp)[1]
      // 此时，tag 一定是和栈 1 顶部相同的
      let pop_tag = stack1.pop()
      if (tag === pop_tag) {
        let pop_arr = stack2.pop()
        if (stack2.length > 0) {
          // 检查 stack2 是否有 childrren 属性，没有就创建一个数组
          stack2[stack2.length - 1].children.push(pop_arr)
        }
      } else {
        throw new Error('标签没有封闭')
      }
      // 指针移动标签长度加 3，因为 </> 占 3 未
      index += tag.length + 3
    } else if (wordRegExp.test(rest)) {
      // 识别遍历到的这个字符，是不是文字，并别不能是全空
      let word = rest.match(wordRegExp)[1]
      // 看 word 是不是全是空
      if (!/^\s+$/.test(word)) {
        // 改变此时 stack2 栈顶元素中
        stack2[stack2.length - 1].children.push({ text: word, type: 3 })
      }
      // 此时，tag 一定是和栈 1 顶部相同的
      // 指针移动标签长度加 3，因为 </> 占 3 未
      index += word.length
    } else {
      // 标签中的文字
      index++
    }
    console.log(stack1, stack2)
  }
  return stack2[0].children[0]
}
```

部分流程图：

```javascript
// stack2 栈
[
  { children: [] }
]
// 遇到 <div>
[
  { children: [] },
  { tag: 'div', children: [] }
]
// 遇到 <h3>
[
  { children: [] },
  { tag: 'div', children: [] },
  { tag: 'h3', children: [] }
]
// 遇到 "你好"
[
  { children: [] },
  { tag: 'div', children: [] },
  { tag: 'h3', children: [{
    text: '你好',
    type: 3
  }] }
]
// 遇到 </h3>
[
  { children: [] },
  { tag: 'div', children: [{
    tag: 'h3', children: [{
      text: '你好',
      type: 3
    }]
  }] }
]
// ...
```

# parseAttrsString

观察平时我们写的标签属性：

```html
<div class="aa bb cc" id="hello">
  hello
</div>
```

首先更改 `parse` 函数的开始标签的正则匹配：

```javascript
const startRegExp = /^\<([a-z]+[1-6]?)(\s[^\<]+)?\>/
```

然后在匹配到 `startRegExp` 的判断语句中加入：

```javascript
if(startRegExp.test(rest)) {
  // 以上述 html 为例，这里的 attrsString='class="aa bb cc" id="hello"'
  let attrsString = rest.match(startRegExp)[2]
  const attrsLength = attrsString ? attrsString.length : 0
  stack2.push({
    tag, children: [],
    attrs: parseAttrsString(attrsString)
  })
  index += tag.length + attrsLength + 2
}
```

>   `parseAttrsString` 用于识别 `attrs`，即标签内的属性，例如 `class`、`id` 等

处理 `attrsString`，初学者可能会想到数组的 `split` 方法，但其实无论分隔符为 `=` 还是 `‘ ’` 都会有问题，这里采用的方法是循环遍历：

```javascript
function parseAttrsString(attrsString) {
  // attrsString 不为真，则返回空数组
  if(!attrsString) return []
  /* CODE HERE */
}
```

1.   首先定义需要的变量

>   通过 `isInQuote` 来判断当前的循环是否在引号内，只需要在每次碰到 `"` 取反即可，例如 `class=“aa bb cc”`，第一次遇见之后 `isInQuote` 为 `true`，第二次遇到 `isInQuote` 为 `false`

```javascript
// 是否在引号内
let isInQuote = false
// 起始端点
let point = 0
// 结果数组
let result = []
```

2.   循环遍历模板字符串

```javascript
for(let i = 0; i < attrsString.length; i++) {
  let char = attrsString[i]
  // 该字符为 " 单引号
  if(char === '"') {
    isInQuote = !isInQuote
  } else if(char === ' ' && !isInQuote) { // 遇到空格，并且不在引号内
    // 判断该范围内的字符串是否全空
    if(!/^\s*$/.test(attrsString.substring(point, i))) {
      // 不是全空的话将结果 push 到 result 结果数组中
      result.push(attrsString.substring(point, i).trim())
      // 将起始端点设置为 i
      point = i
    }
  }
}
```

3.   循环结束处理最后一个 `attr`

```javascript
result.push(attrsString.substring(point).trim())
```

4.   转换格式

>   上树操作结束后，得到的结果类似这种形式：
>
>   -   `[ ‘class=“aa bb cc”’, ‘id=“hello”’ ]`
>
>   我们需要转换为这种形式：
>
>   -   `[ { name: ‘class’, value: ‘aa bb cc’ }, { name: ‘id’, value: ‘hello’ } ]`
>
>   可以用 `=` 为分隔符进行操作，也可以使用正则表达式

```javascript
result = result.map(item => {
  // 根据 = 划分
  const o = item.match(/^(.+)="(.+)"$/)
  return {
    name: o[1],
    value: o[2]
  }
})
```

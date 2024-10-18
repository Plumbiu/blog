---
title: Vue3源码 —— complier/transform
date: 2023-07-24
---

在 `compiler` 一章中，我们成功生成了 `vue` 的 `ast` 语法树，但我们知道，`ast` 语法树不能被语言直接执行，他需要转换成真正的代码才可以。那么如何将 `ast` 语法树转换为真正的代码呢？

在转换到真正的代码前(预告一下是通过 `codegen` 函数)，需要经过 `transform` 的处理

# 什么是 transform

> 一言以蔽之，ast 告诉了我们 `vue` 代码的结构，便于我们使用插件等扩展功能，例如自动导入插件，他就是解析的 `vue` 代码的 ast 语法树，达到插入代码的功能；`transform` 要做的是在 `ast` 的基础上，生成容易被转换为真实 `js` 代码的结构，

`ast` 语法树告诉了我们代码的结构，而 `transfrom` 就是对语法树进一步处理，更细的讲是将处理一些特殊节点，举个例子：

- 这是 `vue` 代码

```vue
<script setup lang="ts">
const msg = 'hello world'
</script>
<template>
	<div>
    {{ msg }}
  </div>
</template>
```

- 这是我们生成的 `ast` 语法树

```typescript
{
  type: 1,
  children: [{
    type: 4,
    tag: 'div',
    tagType: 0,
    children: [{
      type: 2,
      content: {
        type: 3,
        content: 'msg', // 这里又是一个 content，下面的 transformExpression 函数要注意一点
      },
    },
  ],
}],
 helpers: [],
}
```

在 `complier` 一章中，我们为了精简语法树的结构，把 `type` 和 `tagType` 属性去掉了，观察源码对 `type` 和 `tagType` 的描述：

```typescript
const enum TagType {
  Start, // 开始节点
  End, // 结束节点
}
const enum NodeTypes {
  TEXT, // 文本节点
  ROOT, // 根节点
  INTERPOLATION, // 需要插值的节点
  SIMPLE_EXPRESSION, // 简单的表达式节点
  ELEMENT, // 元素节点
  COMPOUND_EXPRESSION // 复合表达式节点
}
```

观察生成的 `ast` 语法树，在第二个 `children` 中：

```typescript
children: [{
	type: 2, // 表明这个节点需要插值
  content: {
    type: 3, // 表明这个内容(content)需要转换为表达式
    content: 'msg'
  }
}]
```

- 经过 `transform` 处理后的语法树

```typescript
{
  type: 1,
  children: [{
    type: 4,
    tag: 'div',
    tagType: 0,
    children: [{
      type: 2,
      content: {
        type: 3,
        content: '_ctx.msg',
      },
    }],
    codegenNode: {
      type: 4,
      tag: "'div'",
      props: null,
      children: {
        type: 2,
        content: {
          type: 3,
          content: '_ctx.msg',
        },
      },
    },
  },
  codegenNode: {
    type: 4,
    tag: "'div'",
    props: null,
    children: {
      type: 2,
      content: {
        type: 3,
        content: '_ctx.msg',
      },
    },
  },
  helper: [
    Symbol(toDisplayString),
    Symbol(createElementVNode)
  ]
},
```

可以看到内容多了很多，每一个节点都单独增加了 `codegenNode` 属性，这个方便以后生成代码，同时我们注意到，需要变为表达式的节点的 `content` 变为了 `_ctx.msg` 这同样是为了以后生成可执行代码

> `helper` 内存储的是一些通用(或者直接翻译成帮助)方法，会在后续 `codegen` 中用到

# transform 原理

先看看语法：

```typescript
transform(
	ast,
	Object.assign(options, {
		nodeTransforms: [transformElement, transformText, transformExpression],
	})
);
```

- 第一个参数很好理解，就是我们刚生成的 `ast` 语法树；


- 第二个参数就是我们配置解析各个节点的配置(也可以理解为插件)，例如上面有解析元素节点的方法(`transfromElement`)、解析文本的方法(`transformText`)等

## transform

`transform` 是转换的入口函数：

```typescript
export function transform(root, options = {}) {
  // 1. 创建 context
  const context = createTransformContext(root, options);
  // 2. 遍历 node
  traverseNode(root, context);
  createRootCodegen(root, context);
  root.helpers.push(...context.helpers.keys());
}
```

### createTransfromContext

用于创建上下文对象，方便操作

```typescript
function createTransformContext(root, options) {
  // root 即 ast 语法树
  const context = {
    root,
    nodeTransforms: options.nodeTransfroms || [],
    helpers: new Map(),
    helper(name) {
      // 收集到用的次数
      // 收集次数是为了给删除做处理的(count 为 0 的时候才会真正删除)
      const count = context.helpers.get(name) || 0
      context.helpers.set(name, count + 1)
    }
  }
  return context
}
```

### traverseNode

用于遍历 node 节点

让我们先回顾一下 node 节点的类型：

```typescript
const enum NodeTypes {
  TEXT,
  ROOT,
  INTERPOLATION,
  SIMPLE_EXPRESSION,
  ELEMENT,
  COMPOUND_EXPRESSION
}
```

1. `traverseNode` 函数：

这个函数用于转换 ast 结构树，生成能够被渲染真正 js 语法的结构树

```typescript
function traverseNode(node: any, context) {
  const type: NodeTypes = node.type
  // 遍历所有的 nodeTransforms
  // 把 node 交给 transform
  // 用户可以对 node 做处理
  const nodeTransforms = context.nodeTransforms
  const exitFns: any = []
  for(let i = 0; i < nodeTransforms.length; i++) {
    // 注意这个 transform 不是上述的 transform 函数，而是调用 transform 时传过来的第二个参数
    const transform = nodeTransforms[i]
    const onExit = transform(node, context)
    if(onExit) {
      exitFns.push(onExit)
    }
  }
  switch(type) {
    case NodeTypes.INTERPOLATION:
      // 插值的点，在于后续生成 render 代码的时候获取变量的值
      context.helper(TO_DISPLAY_STRING)
    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      traverseChildren(node, context)
      break
    default:
      break
  }
  let i = exitFns.length
  while(i --) {
    exitFns[i]()
  }
}
```

## transform 各个插件函数

在上面的 `traverseNode` 函数中，我们有这样一段话：

```typescript
for(let i = 0; i < nodeTransforms.length; i++) {
  const transform = nodeTransforms[i]
}
```

在 `mini-vue` 中，`transform` 共有三个插件函数，在目录 `complier-core/src/transforms` 中：

### transformElement

> 这里没有实现 `Block`，`Block` 是一种特殊的 `vnode`，和普通 `vnode` 相比，会多出一个额外的 `dyncmicChild` 属性，用于存储动态节点
>
> 动态节点指的是带有动态变量或者带有 `v-for`、`v-if/v-show` 指令的节点，它可能会随着变量值更改而变化，实现 `Block` 能够减少 `diff` 算法的比较(从比较所有结点到只比较动态节点)

```typescript
export function transformElement(node, context) {
  return () => {
    // TODO: Block & props
    const vnodeTag = `'${node.tag}'`
    const vnodeProps = null
    let vnodeChildren = null
    if(node.children.length > 0) {
      if(node.children.length === 1) {
        const child = node.children[0]
        vnodeChildren = child
      }
    }
    node.codegenNode = createVNodeCall(
    	context,
      vnodeTag, // 标签名
      vnodeProps, // 属性值，这里没有实现
      vnodeChildren // 只有当 node.children.length === 1 时才会有
    )
  }
}
```

为什么只有 `node.children.length` 等于 1 才会有 `vnodeChildren` 属性呢？这和 ast 语法树结构有关，因为如果我们处理一个含有 `{{}}` 插值语法的节点，那么它肯定被包裹在一个 Element 内

- `createVnodeCall`

```typescript
export function createVNodeCall(context, tag, props?, children?) {
  if(context) {
    context.helper(CREATE_ELEMENT_VNODE)
  }
  return {
    // TODO: vue3 源码内这里的 type 是 VNODE_CALL
    // 由于 mini-vue 没有 block，故创建 Element 就够了
    type: NodeTypes.ELEMENT,
    tag,
    props,
    children
  }
}
```

### transformExpression

用于处理 `tag=2` 的情况，即节点中包含表达式

```typescript
export function transformExpress(node) {
  if(node.type === NodeTypes.INTERPOLATION) {
    node.contet = processExpression(node.content)
  }
}
function processExpression(node) {
  node.content = `_ctx.${node.content}`
  return node
}
```

`transformExpress` + `transformElement` 转换过程：

原本的 `ast` 语法树：

```typescript
{
  tag: 'p',
	children: [{
		type: 2,
		content: {
			type: 3,
			content: 'msg'
		},
	}]
}
```

转换后：

```typescript
{
  tag: 'p',
	children: [{
    type: 2,
    content: {
      type: 3,
      content: 'msg'
    }
  }] 
  codegenNode: {
    type: 4, // NodeTypes.ELEMENT
    tag: 'p',
    props: null,
    children: {
      type: 2,
     	content: '_ctx.msg'
    }
  }
}
```

### transformText

先看一下不进行 `transform` 的语法树

`vue` 代码：

```vue
<script lang="ts" setup>
const msg = 'world'
</script>
<template>
	<p>HI,{{msg}}</p>
</template>
```

`ast` 语法树：

```typescript
{
  type: 4,
  tag: 'p',
  tagType: 0,
  children: [{
    type: 0,
    content: 'HI,',
  }, {
    type: 2,
    content: {
      type: 3,
      content: 'msg',
    },
  }],
}
```

`transform` 转换后的结构：

```typescript
{
  type: 1,
  children: [{
    type: 4,
    tag: 'p',
    tagType: 0,
    children: [{
      type: 5,
      children: [
      	{
        	type: 0,
        	content: 'HI,',
      	},
      	' + ',
        {
        	type: 2,
         	content: {
            type: 3,
            content: '_ctx.msg',
          },
        }],
		}],
    codegenNode: {
      type: 4,
      tag: "'p'",
      props: null,
      children: {
        type: 5,
        children: [
          {
            type: 0,
            content: 'HI,',
          },
          ' + ',
          {
            type: 2,
            content: {
              type: 3,
              content: '_ctx.msg',
            },
          },
        ],
    	},
    },
  }],
  helpers: [null, null],
  codegenNode: {
    type: 4,
    tag: "'p'",
    props: null,
    children: {
      type: 5,
      children: [
        {
          type: 0,
          content: 'HI,',
        },
        ' + ',
        {
          type: 2,
          content: {
            type: 3,
            content: '_ctx.msg',
          },
        },
      ],
    },
  },
}
```

主要的变化是在 `Text` 和 `interpolation` 节点前加入了 `+`，这样会方便代码生成

#### 实现原理

先看一下 `isText` 的逻辑：

```typescript
export function isText(node) {
  return node.type === NodeTypes.INTERPOLATION || node.type === NodeTypes.TEXT
}
```

`transformText` 用于处理文本，这里的逻辑会改变 ast 树，例如 `hi,{{msg}}` 我们需要将其变成 `"hi" + _toDisplayString(_ctx.msg)` 才可以，但是 `hi` 是 text 节点，`{{msg}}` 是 `interpolation` 节点

```typescript
export function transformText(node, context) {
  if(node.type === NodeTypes.ELEMENT) {
    // 在 exit 的时期执行
    return () => {
      const children = node.children
      let currentContainer
      
      for(let i = 0; i < children.length; i++) {
        const child = children[i]
        if(isText(child)) {
          for(let j = i + 1; j < children.length; j++) {
            const next = children[j]
            if(isText(next)) {
              // currentContainer 的目的是把相邻的节点都放到一个容器内
              if(!currentContainer) {
                currentContainer = children[i] = {
                  type: NodeTypes.COMPOUND_EXPRESSION,
                  loc: child.loc.
                  children: [child]
                }
              }
            	// push 方法可以直接做到修改引用值
            	currentContainer.children.push(` + `, next)
            	// 把当前节点放到容器内，然后删除 j，否则下次 i 会多处理
            	children.slice(j, 1)
            	// 因为把 j 删除了，所以这里就少了一个元素，那么 j 需要减一
            	j--
          	} else {
              currentContainer = undefined
              break
            }
          }
        }
      }
    }
  }
}
```

## traverseChildren

`traverseChildren` 用来处理节点类型为 `Element` 或者 `Root` 的情况，基本原理就是递归

```typescript
function traverseNode(node: any, context) {
  const type: NodeTypes = node.type;
  const nodeTransforms = context.nodeTransforms;
  const exitFns: any = [];
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i];
    const onExit = transform(node, context);
    if (onExit) {
      exitFns.push(onExit);
    }
  }
  switch (type) {
    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING);
      break;
    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      traverseChildren(node, context);
      break;
    default:
      break;
  }
  let i = exitFns.length;
  while (i--) {
    exitFns[i]();
  }
}

function traverseChildren(parent: any, context: any) {
  // node.children
  parent.children.forEach((node) => {
    // TODO 需要设置 context 的值
    traverseNode(node, context);
  });
}
```

## createRootCodegen

`createRootCodegen` 用于为 `codegen` 生成代码做最后的处理，即在根节点上添加 `codeg：

```typescript
function createRootCodegen(root, context) {
  // 我们只需要关注根节点的 children 即可，这里我们只支持一个根节点
  const { children } = root
  const child = children[0]
  if (child.type === NodeTypes.ELEMENT && child.codegenNode) {
    const codegenNode = child.codegenNode;
    root.codegenNode = codegenNode;
  } else {
    root.codegenNode = child;
  }
}
```

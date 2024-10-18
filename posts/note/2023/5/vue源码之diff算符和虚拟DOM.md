---
title: Vue源码 —— 虚拟DOM和diff算法
date: 2023-05-28
---

这里的 diff 算法和虚拟 DOM 都是简易版的，有很多情况没有讨论

代码仓库：https://github.com/Plumbiu/vue_source_code

# 提前了解的知识

## insertBefore

`Node.insertBefore()` 方法在参考节点之前插入一个拥有指定父节点的子节点

```javascript
const insertedNode = parentNode.insertBefore(newNode, referenceNode)
```

其中：

-   `insertedNode` 为被插入节点(newNode)
-   `parentNode`：新插入节点的父节点
-   `newNode`：用于插入的节点
-   `referenceNode`：即 `newNode` 要插在这个节点之前

>   Tip：如果 `referenceNode` 为 `null` 或者 `undefined`，则 `newNode` 会被插入到子节点末尾

```html
<div>
  <ul id="container">
    <li>1</li>
    <li>2</li>
    <li id="c3">3</li>
    <li>4</li>
  </ul>
  <button id="btn1">添加5</button>
  <button id="btn2">添加3.5</button>
</div>
<script>
  const container = document.getElementById('container')
  const c3 = document.getElementById('c3')
  const btn1 = document.getElementById('btn1')
  const btn2 = document.getElementById('btn2')
  btn1.addEventListener('click', () => {
    const dom1 = document.createElement('li')
    dom1.innerText = 5
    container.insertBefore(dom1, null)
  })
  btn2.addEventListener('click', () => {
    const dom2 = document.createElement('li')
    dom2.innerText = 3.5
    container.insertBefore(dom2, c3)
  })
</script>
```

>   如果指定的节点已经存在，即是对文档现有节点的引用，`insertBefore()` 会将其从当前位置移动到新位置

## 判断是否为空(null 或 undefined)

我们可以使用 `==` 运算符来判断，看下面示例就明白了：

```javascript
null == undefined // true
undefined == null // true
null === undefined // false
undefined === null // false
```

# 核心概念

当我们更新视图时，例如添加一个标签内柔，由于 CSS 的**回流(repaint)** 和 **重绘(repaint)**，浏览器需要重新计算元素的几何属性，将其安放在界面的正确位置，这会造成额外的性能开销

## diff 算法

**`diff 算法`** 可以进行更精细化的比对，实现最小量更新，从而实现性能上的优化

>   `diff` 算法需要基于 `key`，也就是我们写 `v-for` 循环都要加的唯一标识，只有这样 `diff` 算法才能实现最小量更新
>
>   **只有是同一个虚拟节点，才进行精细化比较**，否则暴力拆除，例如 `<ul><li key='lis'>1</li></ul>`
>
>   改为 `<ol><li key='lis'>1</li></ol>`，会直接将最初的 `ul` 拆掉换成 `ol` 并重新渲染 `li`。同一个虚拟节点指的是，**选择器相同且 `key` 相同**
>
>   **只进行同层比较，不会进行跨层比较。**即使是同一个虚拟节点，但是跨层了，`diff` 算法依旧保留删除旧的，重新渲染新的

但事实上，我们使用 `diff` 算法的时候不会遇到上述的问题，所以放心使用就好了

## 虚拟 DOM

>   虚拟 DOM：用 JavaScript 对象描述 DOM 的层次结构。DOM 中的一切属性都在虚拟 DOM 中有对应的属性。
>
>   在更新 DOM 时，虚拟 DOM 可以进行 diff (精细化比较)，算出应该如何最小量更新，最后反映到真正的 DOM 上

真实DOM：

```html
<div class="box">
  <h3>我是一个标题</h3>
  <ul>
    <li>one</li>
    <li>two</li>
    <li>three</li>
  </ul>
</div>
```

虚拟 DOM：

```json
{
  "sel": "div",
  "data": {
    "class": { "box": true }
  },
  "children": [
    {
      "sel": "h3",
      "data": {},
      "text": "我是一个标题"
    },
    {
      "children": [
        { "sel": "li", "data": {}, "text": "one" },
        { "sel": "li", "data": {}, "text": "two" },
        { "sel": "li", "data": {}, "text": "three" }
      ]
    }
  ]
}
```

# snabbdom 的基本使用

`snabbdom` 是著名的虚拟 DOM 库，是 `diff` 算法的鼻祖，也是 `vue` 中的虚拟 DOM 灵感来源，其基本内容如下：

1.   首先在 `html` 文件中定义一个标签，并引入对应的 文件

```html
<div id="container"></div>
<script src='./main.js'></script>
```

2.   使用 `snabbdom` 渲染 DOM

```javascript
import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  h,
} from 'snabbdom'

// 初始化 patch 函数
const patch = init([
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
])

// 使用 h 函数定义自己的 vnode
const myVnode1 = h(
  'a',
  { props: { href: 'http://blog.plumbiu.club' } },
  'Plumbiuの小屋'
)

console.log(myVnode1)

// 获取之前定义的标签，让上述 vnode 上述
const container = document.getElementById('container')
patch(container, myVnode1)
```

## h 函数使用

`h` 函数的第一个参数表示哪种 `html` 标签，第二个参数可以是标签的属性对象，也可以是需要渲染的 DOM 对象

**如果渲染的 DOM 元素没有属性的情况下**，`h` 函数的第二个参数可以是以下几种：

1.   一个简单的字符串，表示该标签中的字符串内容

```javascript
// <div>hello</div>
h('div', 'hello')
```

2.   一个 `h` 标签，表示嵌套一个 `h` 函数，即第一个参数标签的子节点元素

```javascript
/*
		<div>
			<p>world</p>
		</div>
*/
h('div', h('p', 'world'))
```

3.   一个数组，数组元素可以是多个 `h` 函数，标签多层嵌套

```javascript
/*
		<ul>
			<li>苹果</li>
			<li>西瓜</li>
			<li>火龙果</li>
		</ul>
*/

h('ul', [
  h('li', '苹果'),
  h('li', '西瓜'),
  h('li', '火龙果'),
])
```

## 手写 h 函数

`snabbdom` 中的 `h` 函数可以接受 5 个参数，而且做了许多重载，这里我们简化为 3 个参数，且不支持重载

我们想要的效果是 `h` 函数可以支持上章节的三种情况，例如：

```javascript
/*
		<div>
			<p>1</p>
			<p>1</p>
			<div>
				<p>3</p>
				<p>4</p>
				<div>
					<h1>hello</h1>
				</div>
			</div>
		</div>
*/
const vnode = h('div', {}, [
  h('p', {}, '1'),
  h('p', {}, '2'),
  h('div', {}, [
    h('p', {}, '3'),
    h('p', {}, '4'),
    h('div', {}, h('h1', {}, 'hello')),
  ]),
])

console.log(vnode)
```

首先我们先定义 `vnode` 函数，该函数非常简单，只是将对应对象返回：

-   `sel` 表示虚拟节点的对应标签，即 `h` 函数第 1 个参数
-   `data` 为需要渲染的函数，即 `h` 函数第 2 个参数
-   `children` 表示子节点，如果 `h` 函数第 3 个参数是嵌套数组的话，这个函数不为 `undefined` 或者 `[]`
-   `text` 表示标签内容为文本，即 `h` 函数第 3 个参数为字符串
-   `elm` 表示真实 DOM 标签，这个参数在第一次上树的时候有用

```javascript
// vnode.js
export default function(sel, data, children, text, elm) {
  return {
    sel, data, children, text, elm
  }
}
```

观察上述 `h` 函数的使用，其实**已经包含了嵌套关系**，所以我们只需要判断第三项参数的类型，将对应的值使用 `vnode` 函数返回即可

```javascript
export default function(sel, data, c) {
  // 首先判断参数是否有 3 个，不是的话抛出错误
  if(arguments.length !== 3) throw new Error('参数必须为 3 个')
  if(typeof c === 'string' || typeof c === 'number') {
    // 第 1 种情况
    return vnode(sel, data, undefined, c, undefined)
  } else if(Array.isArray(c)) {
    // 第 2 种情况
    let children = []
    for(let i = 0; i < c.length; i++) {
      if(!typeof c[i] === 'object' && Reflect.has(c[i], 'sel'))
        throw new Error('传入的参数不是 h 函数')
    	children.push(c[i])
    }
    return vnode(sel, data, children, undefined, undefined)
  } else if(typeof c === 'object' && Reflect.has(c, 'sel')) {
    // 第 3 种情况
    let children = [c]
    return vnode(sel, data, children, undefined, undefined)
  } else {
    throw new Error('传入的参数第 3 个类型错误')
  }
}
```

## patch 函数使用

`patch` 函数既可以作为第一次上树渲染的函数，也可以作为虚拟 `DOM` 节点更新后，使用 `diff` 算法实现最小量更新

```javascript
// 第一次上树
const vnode = h(
  'a',
  { props: { href: 'http://blog.plumbiu.club' } },
  'Plumbiuの小屋'
)
const container = document.getElementById('container')
patch(container, vnode)
```

```javascript
// 第一次已经上树
// 比较两个 vnode 不同并进行最小化更新
const vnode1 = h('ul', [
  h('li', 'hello'),
  h('li', 'world')
])
const vnode2 = h('ul', [
  h('li', 'hello'),
  h('li', 'snabbdom')
])
patch(vnode1, vnode2) // 页面内容渲染为 vnode2 中的数据内容
```

## 手写 patch 函数

### 文本节点创建

`patch` 函数的参数可以是真实的 DOM 节点，也可以能是我们用 `h` 函数创建的虚拟节点：

>   出现真实 DOM 的情况只能是虚拟节点第一次上树的时候，目前这里写的 `patch` 函数也只是考虑了这个情况

```javascript
function patch(oldVnode, newVnode) {
  // 判断传入的第一个参数，是 DOM 节点还是虚拟节点
  if(oldVnode.sel === '' || oldVnode.sel === undefined) {
    // DOM 节点，要包装为虚拟节点
    oldVnode = vnode(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode)
  }
  // 判断 oldVnode 和 newVnode 是不是同一个节点
  if(oldVnode.key === newVnode.key && oldVnode.sel === newVnode.sel) {
    // 同一个节点
  } else {
		// createElement 返回一个真实的 DOM
    let newVnodeElm = createElement(newVnode)
    // 拆掉旧的，插入新的
  	oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm)	
  }
  // 删除节点
  oldVnode.elm.parentNode.removeChild(oldVnode.elm)
}

/*
	// vnode.js 这里好对照一下
	export default function(sel, data, children, text, elm) {
  	return {
    	sel, data, children, text, elm
  	}
	}
*/
```

`createElement` 函数是我们自己实现的，具体功能时**拆掉旧的，插入新的元素**：

```javascript
function createElement(vnode) {
  // 创建一个 DOM 节点，这个节点现在还是孤儿节点
  let domNode = document.createElement(vnode.sel) // 通过 sel 创建节点
  // 判断 vnode 文本节点还是有子节点
  if(vnode.text !== '' && (vnode.children === undefined || vnode.children.length === 0)) {
    // vnode 是文本节点
    domNode.innerText = vnode.text
  } else if(Array.isArray(vnode.children) && vnode.children.length !== 0) {
    // vnode 具有子节点
    // ...
  }
  vnode.elm = domNode
  // 返回的 elm 是一个真实 DOM 对象
  return domNode.elm
}
```

为了方便理解，这里说一下流程：

1.   首先我们需要实现 `patch` 函数的上树操作：

```javascript
// 演示调用 patch 函数的代码
const container = document.getElementById('container')
const vnode = h('div', 'hello world')
patch(container, vnode)
```

2.   `DOM` 节点的转换

在 `patch` 函数的基本使用中，我们已经讲过，patch 函数接受的可以是真实的 DOM 节点，也可以是虚拟节点，所以首先我们需要判断

之后便是将真实的 DOM 节点转换为虚拟节点，直接调用 `vnode` 函数即可

>   真实 DOM 节点只能出现在第一个参数中，且只会在上树时才会有

```javascript
function patch(oldVnode, newVnode) {
  // 判断真实 DOM 节点和虚拟节点
  if(oldVnode.sel === '' || oldVnode.sel === undefined) {
    // 将真实 DOM 节点转换为虚拟节点
    oldVnode = vnode(oldVnode.tagName.toLowerCase(), {}, [], oldVnode)
  }
}
```

3.   判断 `oldVnode` 和 `newVnode` 是不是同一个节点：

同一个节点指的是**选择器相同且 `key` 相同**，因此我们只需要判断 `key`、`sel` 属性即可，对于不同节点的情况，我们需要暴力拆除旧的，插入新的

```javascript
function patch(oldVnode, newValue) {
	// ...
  if(oldVnode.key === newVnode.key && oldVnode.sel === newVnode.sel) {
    // 同一个节点
  } else {
    // 不是同一个节点
    // createElement 返回一个真实的 DOM
    let newVnodeElm = createElement(newVnode)
    // 拆掉旧的，插入新的
  	oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm)
  }
  // 删除节点
  oldVnode.elm.parentNode.removeChild(oldVnode.elm)
}
```

4.   实现渲染的具体函数 `createElement`

`createElement` 是将虚拟节点转换为真实的 DOM 节点，同时渲染到页面

传过来的 `vnode` 有可能包含子节点，也可能只是一个包含文本的节点，所以我们先判断一下

```javascript
function createElement(vnode) {
  let domNode = document.createElement(vnode.sel)
  // 判断节点是否有子节点，还是只是一个文本
  if(vnode.text !== '' && (vnode.children === undefined || vnode.children.length === 0)) {
    // 节点只是一个文本
    domNode.innerText = vnode.text
  } else if(Array.isArray(vnode.children) && vnode.children.length !== 0) {
    // 节点包含子节点
    // ...
  }
  vnode.elm = domNode
  return vnode.elm
}
```

### 子节点创建

子节点创建需要递归，而且递归较为简单，这里不再赘述

首先先列出 `createElement` 完整代码：

```javascript
// 真正创建节点，将 vnode 创建为 DOM，插入到 pivot 这个元素之前
function createElement(vnode) {
  // 把虚拟节点 vnode 插入到标杆 pivot
  // 创建一个 DOM 节点，这个节点现在还是孤儿节点
  let domNode = document.createElement(vnode.sel)
  // 有子节点还是有文本
  if(vnode.text !== '' && (vnode.children === undefined || vnode.children.length === 0)) {
    // 内部是文本
    domNode.innerText = vnode.text
    // 将孤儿节点上树，让标杆节点的父元素调用 insertBefore 将新的孤儿节点插入到标签节点之前
  } else if(Array.isArray(vnode.children) && vnode.children.length > 0) {
    // ...
    for(let i = 0; i < vnode.children.length; i++) {
      let ch = vnode.children[i]
      console.log(ch)
      // 创建出 DOM，一旦调用 createElment 意味着：创建出 DOM 了，并且它的 elm 属性指向了
      // 创建出的 DOM，但还没有上树，是一个孤儿节点
      let chDOM = createElement(ch)
      // 上树
      domNode.appendChild(chDOM)
    }
  }
  vnode.elm = domNode
  // 返回 elm，elm 属性是一个纯 DOM 对象
  return vnode.elm
}
```

处理子节点代码：

```javascript
if(Array.isArray(vnode.children) && vnode.children.length > 0) {
  // ...
  for(let i = 0; i < vnode.children.length; i++) {
    let ch = vnode.children[i]
    console.log(ch)
    // 创建出 DOM，一旦调用 createElment 意味着：创建出 DOM 了，并且它的 elm 属性指向了
    // 创建出的 DOM，但还没有上树，是一个孤儿节点
    let chDOM = createElement(ch)
    // 上树
    domNode.appendChild(chDOM)
  }
}
```

# diff 算法的子节点更新策略

## patchVnode

`patchVnode` 用于 `patch` 函数中判断 `oldVnode` 和 `newVnode` 是同一节点的情况下，即：

```javascript
if(oldVnode.key === newVnode.key && oldVnode.sel === newVnode.sel) {
  patchVnode(oldVnode, newVnode)
}
```

完整代码：

```javascript
function patchVnode(oldVnode, newVnode) {
  if(oldVnode === newVnode) return
  // 判断 newVnode 有没有 text 属性
  if(newVnode.text !== undefined && (newVnode.children == null || newVnode.children.length === 0)) {
    // newVnode 有 text 属性
    if(newVnode.text !== oldVnode.text) {
      // newVnode 的 text 属性和 oldVnode 的 text 属性不同，则更新
      oldVnode.elm.innerText = newVnode.text
    }
  } else {
    // newVnode 没有 text 属性，则 newVnode 具有 children 属性
    // 判断 oldVnode 有没有 children 属性
    if(oldVnode.children != undefined && oldVnode.children.length > 0) {
      // oldVnode 具有 children 属性，此时情况较为复杂，我们定义 updateChildren 函数来操作
      updateChildren(oldVnode.elm, oldVnode.children, newVnode.children)
    } else {
      // oldVnode 没有 children 属性，则具有 text 属性
      // 清空 oldVnode 的内容
      oldVnode.elm.innertHTML = ''
      for(let i = 0; i < newVnode.children.length; i++) {
        // newVnode.children 每一项的真实 DOM 节点
        let dom = createElement(newVnode.children[i])
        // 将 DOM 节点插入到 oldVnode.elm 后
        oldVnode.elm.appendChild(dom)
      }
    }
  }
  // newVnode 应该和 oldVnode 一样，具有真实 DOM 节点属性
  newVnode.elm = oldVnode.elm
}
```

`patchVnode` 函数的大体思路是：

1.   `newVnode` 存在 `text` 属性。

如果`newVnode` 有 `text` 属性，那么直接将 `oldVnode` 对应的 DOM 节点赋值为 `newVnode` 的 `text` 属性即可

```javascript
if(newVnode.text != null && (newVnode.children == null || newVnode.children.length === 0)) {
  // 额外判断一下 newVnode 和 oldVnode 的 text 属性是否一致
  if(newVnode.text !== oldVnode.text) {
    oldVnode.elm.innerText = newVnode.text
  }
}
```

>   这里没有判断 `oldVnode` 是否有 `text` 或者 `children` 属性，是因为不管 `oldVnode` 是否有 `text` 属性还是 `children` 属性，最终都会被 `newVnode.text` 所替代

2.   `newVnode` 存在 `children` 属性

此时需要判断一下 `oldVnode` 是否有 `text` 或者 `children` 属性

```javascript
if(/* newVnode 存在 text 属性 */) {
  // 上述代码
} else {
  // newVnode 不存在 text 属性，即存在 children 属性
  if(oldVnode.chilren != null && oldVnode.children.length > 0) {
    // oldVnode 存在 children，此时情况复杂，需要分理出一个函数处理
    updateChildren(oldVnode.elm, oldVnode.children, newVnode.children)
  } else {
    // oldVnode 不存在 children，即存在 text 属性
    // 先清空 oldVnode 对应 DOM 节点的内容
    oldVnode.elm.innerHTML = ''
    for(let i = 0; i < newVnode.children.length; i++) {
      let dom = createElement(newVnode.children[i])
      oldVnode.elm.appendChild(dom)
    }
  }
}
```

3.   更新 `newVnode` 的 `elm` 属性

在 `patchVnode` 函数最后添加：

```javascript
newVnode.elm = oldVnode.elm
```

即可

## checkSameVnode

`checkSameVnode` 用于判断两个节点是否为同一节点，为下面章节的 `diff` 四中命中做铺垫

```javascript
function checkSameVnode(a, b) {
  return a.sel === b.sel && a.key === b.key
}
```

## updateChildren

`updateChildren` 函数主要处理 `oldVnode` 和 `newVnode` 都具有 `children` 的情况，要使用到 diff 算法 

`diff` 算法的关键在于四种命中查找，顺序为：

1.   新前与旧前
2.   新后与旧后
3.   新后与旧前(新前指向的节点，移动到旧后之后)
4.   新前与旧后(新前指向的节点，移动到旧前之前)

其中，第 3 种情况和第 4 种情况 需要移动节点

>   命中一次就不需要再进行命中判断了，如果都没有命中，那么就需要循环来寻找了

函数的大体样子：

```javascript
function updateChildren(parentElm, oldCh, newCh) {
  // 旧前、新前、旧后、新后索引
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let newEndIdx = newCh.length - 1
  // 旧前、新前、旧后、新后节点
  let oldStartVnode = oldCh[0]
  let newStartVnode = newCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndVnode = newCh[newEndIdx]
  // 循环命中
  while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // ....处理逻辑
  }
  // 新旧节点有没有剩余情况
  if(newStartIdx <= newEndIdx) {
    // ...
  } else if(oldStartIdx <= oldIdx) {
    // ...
  }
}
```

### 新前与旧前

```javascript
while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if(checkSameVnode(newStartVnode, oldStartVnode)) {
    patchVnode(oldStartVnode, newStartVnode) // patchVnode 用于判断 patch 函数中为同一节点的情况
    // 新前指针加一
    newStartVnode = newCh[++newStartIdx]
    // 旧前指针加一
    oldStartVnode = oldCh[++oldStartIdx]
  }
  // ...
}
```

我们以下述例子简介，如果按照新旧指针都加一的情况下，我们会发现到最后：

-   `oldStartIdx`、`newStartIdx` 分别指向 `vnode1`、`vnode2` 数组下标为 3 项(其中 `vnode1` 还越界了)
-   观察两个 `vnode`，发现是在原有的基础上增加了两个 `h` 函数，所以我们只需要将其转换为 DOM 节点后 append 到 `oldStartVnode` 之后即可

```javascript
const vnode1 = h('ul', {}, [
  h('li', { key: 'A' }, 'A'),
  h('li', { key: 'B' }, 'B'),
  h('li', { key: 'C' }, 'C'),
])
const vnode2 = h('ul', {}, [
  h('li', { key: 'A' }, 'A'),
  h('li', { key: 'B' }, 'B'),
  h('li', { key: 'C' }, 'C'),
  h('li', { key: 'D' }, 'D'),
  h('li', { key: 'E' }, 'E'),
])
patch(vnode1, vnode2)
```

分析完毕，需要在 `while` 后面添加 `if` 判断语句：

```javascript
while(/* */) {
  // ...
}
if(newStartIdx <= newEndIdx) {
  // 有时命中其他情况时，newEndIdx 指向会变，所以要判断一下
  const before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm
  // 依次将 newVnode 中新的几项加到页面上
  for(let i = newStartIdx; i <= newEndIdx; i++) {
    for(let i = newStartIdx; i <= newEndIdx; i++) {
      parentElm.insertBefore(createElement(newCh[i], before))
    }
  }
}
```

### 新后与旧后

```javascript
while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if(checkSameVnode(newEndVnode, oldEndVnode)) {
    patchVnode(oldEndVnode, newEndVnode) // patchVnode 用于判断 patch 函数中为同一节点的情况
    // 新前指针减一
    newEndVnode = newCh[--newEndIdx]
    // 旧前指针减一
    oldEndVnode = oldCh[--oldEndIdx]
  }
  // ...
}
```

我们以下述例子简介，不符合**“新前与旧后情况”**，下一层命中情况是**“新后与旧后”**，新旧指针均减一

如果按照新旧指针都减一的情况下，我们会发现到最后：

-   `newVnode` 的 `newEndIdx` 会指向数组下标为 1 的项
-   `oldVnode` 的 `oldEndIdx` 变为 -1

```javascript
const vnode1 = h('ul', {}, [
  h('li', { key: 'A' }, 'A'),
  h('li', { key: 'B' }, 'B'),
  h('li', { key: 'C' }, 'C'),
])
const vnode2 = h('ul', {}, [
  h('li', { key: 'D' }, 'D'),
  h('li', { key: 'E' }, 'E'),
  h('li', { key: 'A' }, 'A'),
  h('li', { key: 'B' }, 'B'),
  h('li', { key: 'C' }, 'C'),
])
patch(vnode1, vnode2)
```

分析之后，我们发现需要将 `newVnode` 中的前几项插入到 `oldVnode` 对应的 DOM 节点之前，由于 `newVnode` 有剩余，所以 while 循环中还要单独判断

```javascript
if(newStartIdx <= newEndIdx) {
  // 有时命中其他情况时，newEndIdx 指向会变，所以要判断一下
  const before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm
  // 依次将 newVnode 中新的几项加到页面上
  for(let i = newStartIdx; i <= newEndIdx; i++) {
    for(let i = newStartIdx; i <= newEndIdx; i++) {
      parentElm.insertBefore(createElement(newCh[i], before))
    }
  }
}
```

与新前和旧后的命中情况不同的是，`before` 不再是 `null`，而是对应的 `vnode2` 中数组下标为 2 的项，我们再使用 `insertBefore` 时，第二个参数便是一个真正的 DOM 元素，成功插入到前面

### 新后与旧前

从第 3 种情况开始，再指针加减之前需要进行插入了

```javascript
if(checkSameVnode(newEndVnode, oldStartVnode)) {
	patchVnode(newEndVnode, oldStartVnode)
  // 新后与旧前命中，需要移动节点，仔细想想，旧的节点跑到最下面了，那肯定要移动的
  // 注意，insertBefore 会将 oldStartVnode.elm 移动，这样就不用手动删除了(因为 oldStartVnode.elm 本来就是文档中存在的节点)
  parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)
  // 旧指针末尾减一
  oldStartVnode = oldCh[++oldStartIdx]
  // 新指针开头加一
  newEndVnode = newCh[--newEndIdx]
}
```

我们以下述例子简介，不符合前两种情况，但符合**“新后与旧前”**，

```javascript
const vnode1 = h('ul', {}, [
  h('li', { key: 'A' }, 'A'), 
  h('li', { key: 'B' }, 'B'),
  h('li', { key: 'C' }, 'C'),
])
const vnode2 = h('ul', {}, [
  h('li', { key: 'C' }, 'C'),
  h('li', { key: 'B' }, 'B'),
  h('li', { key: 'A' }, 'A'),
])
patch(vnode1, vnode2)
```

新后与旧前命中，则将 `vnode1` 中数组下标为 1 的项移动到最后，以此往复

### 新前与旧后

```javascript
if(checkSameVnode(newStartVnode, oldEndVnode)) {
  patchVnode(oldEndVnode, newStartVnode)
  // 将 newVnode 的节点插入到 oldVnode 前面
  parentElm.insertBefore(newStartVnode.elm, oldStartVnode.elm)
  // 旧节点末尾指针减一
  oldEndVnode = oldCh[--oldEndIdx]
  // 新节点开头指针加一
  newStartVnode = newCh[++newStartIdx]
}
```

和**“新后与旧前”**类似，这里不再赘述

### 旧节点剩余问题

上述代码中 `while` 循环我们已经完成了大部分，但是还有一种情况，就是旧节点节点数大于新节点

以下述例子讲述：

```javascript
const vnode1 = h('ul', {key: 'ul'}, [
  h('li', {key: 'A'}, 'A'),
  h('li', {key: 'B'}, 'B'),
  h('li', {key: 'C'}, 'C'),
  h('li', {key: 'D'}, 'D'),
])

const vnode2 = h('ul', {key: 'ul'}, [
  h('li', {key: 'C'}, 'C'),
  h('li', {key: 'B'}, 'B'),
  h('li', {key: 'A'}, 'A'),
])
```

当我们 `while` 循环结束时，需要移除元素：

```javascript
if(oldStartIdx <= oldEndIdx) {
	for(let i = oldStartIdx; i <= oldEndIdx; i++) {
    if(oldCh[i]) {
      parentElm.removeChild(oldCh[i].elm)
    }
  }
}
```

### 都没有命中

例如以下示例：

```javascript
const vnode1 = h('ul', {key: 'ul'}, [
  h('li', {key: 'A'}, 'A'),
  h('li', {key: 'C'}, 'C'),
  h('li', {key: 'D'}, 'D'),
])

const vnode2 = h('ul', {key: 'ul'}, [
  h('li', {key: 'E'}, 'E'),
  h('li', {key: 'F'}, 'F'),
  h('li', {key: 'G'}, 'G'),
])
```

思路是，使用 `keyMap` 存储旧节点的 `key`：

-   如果新节点不存在含有此 `key` 的节点，则表明新节点为新属性，直接移动新节点到旧节点最开始之前即可
-   如果新节点存在含有此 `key` 的节点，则表明已经存在，直接移动旧节点到旧节点开始位置之前即可
-   将 `newVnode` 的开头指针(`newStartIdx`) 加一，同时赋值当前的 `newVnode` 对应指针指向的节点(`newCh[++newStartIdx]`)

```javascript
let keyMap = null // 在 while 循环外

// 四种都没有命中
// 寻找 key 的 map，
if(!keyMap) {
  keyMap = {}
  // 从 oldStartIdx 开始，到 oldEndIdx 结束，创建 keyMap 映射对象
  for(let i = oldStartIdx; i <= oldEndIdx; i++) {
    const key = oldCh[i].key
    if(key !== undefined) {
      keyMap[key] = i
    }
  }
}
// 寻找当前 newStartIdx 这项在 keyMap 中的映射的位置序号
const idxInOld = keyMap[newStartVnode.key]
if(idxInOld === undefined) {
  // 如果 idxInOld 是 undefined，表明它是全新的项
  // 被加入的项(就是 newStartvNode 这项)
  parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm)
} else {
  // 如果 idxInOld 不是 undefined，表明不是全新的项，要进行移动
  const elmToMove = oldCh[idxInOld]
  patchVNode(elmToMove, newStartVnode)
  // 把这项设置为 undefined，表示已经处理完这项了
  oldCh[idxInOld] = undefined
  // 移动，调用 insertBefore 也可以实现移动
  parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm)
}
newStartVnode = newCh[++newStartIdx]
```

### 优化代码

在都没有命中的情况下，如果未命中的 `newVnode` 那一项是 `oldVnode` 中的一项，那么将 `oldCh[idxInOld]` 一项置为 `undefined`，表示这项已经处理完，所以我们有必要在 `while` 循环中判断新旧首尾节点是否为空

```javascript
while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if(oldStartVnode == null) {
    oldStartVnode = oldCh[++oldStartIdx]
  } else if(oldEndVnode == null) {
    oldEndVnode = oldCh[--oldEndIdx]
  } else if(newStartVnode == null) {
    newStartVnode = oldCh[++newStartIdx]
  } else if(oldEndVnode == null) {
    oldEndVnode = oldCh[--oldEndIdx]
	}
  // ...
}
```

### 完整代码：

```javascript
import createElement from "./createElement"
import patchVNode from "./patchVNode"

function checkSameVnode(a, b) {
  return a.sel === b.sel && a.key === b.key
}
export default function updateChildren(parentElm, oldCh, newCh) {
  // 旧前
  let oldStartIdx = 0
  // 新前
  let newStartIdx = 0
  // 旧后
  let oldEndIdx = oldCh.length - 1
  // 新后
  let newEndIdx = newCh.length - 1
  // 旧前节点
  let oldStartVnode = oldCh[0]
  // 旧后节点
  let oldEndVnode = oldCh[oldEndIdx]
  // 新前节点
  let newStartVnode = newCh[0]
  // 新后节点
  let newEndVnode = newCh[newEndIdx]
  let keyMap = null
  // 开始 while 循环
  while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if(oldStartVnode == null) {
      oldStartVnode = oldCh[++oldStartIdx]
    } else if(oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if(newStartVnode == null) {
      newStartVnode = oldCh[++newStartIdx]
    } else if(oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if(checkSameVnode(oldStartVnode, newStartVnode)) {
      // 新前和旧前
      console.log('1.1 新前旧后命中')
      patchVNode(oldStartVnode, newStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if(checkSameVnode(newEndVnode, oldEndVnode)) {
      // 新后和旧后
      console.log('1.2 新后旧后命中')
      patchVNode(oldEndVnode, newEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if(checkSameVnode(newEndVnode, oldStartVnode)) {
      // 新后和旧前
      console.log('1.3 新后旧前命中')
      patchVNode(oldStartVnode, newEndVnode)
      // 当 新后与旧前 命中的时候，此时要移动节点，移动新前指向的这个节点到老节点的旧后的后面
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if(checkSameVnode(newStartVnode, oldEndVnode)) {
      // 新前和旧后
      console.log('1.4 新前旧后命中')
      patchVNode(oldEndVnode, newStartVnode)
      // 当 新后与旧前 命中的时候，此时要移动节点，移动新前指向的这个节点到老节点的旧后的后面
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      // 四种都没有命中
      // 寻找 key 的 map，
      if(!keyMap) {
        keyMap = {}
        // 从 oldStartIdx 开始，到 oldEndIdx 结束，创建 keyMap 映射对象
        for(let i = oldStartIdx; i <= oldEndIdx; i++) {
          const key = oldCh[i].key
          if(key !== undefined) {
            keyMap[key] = i
          }
        }
      }
      console.log(keyMap)
      // 寻找当前 newStartIdx 这项在 keyMap 中的映射的位置序号
      const idxInOld = keyMap[newStartVnode.key]
      console.log(idxInOld, 'idxInOld')
      if(idxInOld === undefined) {
        // 如果 idxInOld 是 undefined，表明它是全新的项
        // 被加入的项(就是 newStartvNode 这项)
        parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm)
      } else {
        // 如果 idxInOld 不是 undefined，表明不是全新的项，要进行移动
        const elmToMove = oldCh[idxInOld]
        patchVNode(elmToMove, newStartVnode)
        // 把这项设置为 undefined，表示已经处理完这项了
        oldCh[idxInOld] = undefined
        // 移动，调用 insertBefore 也可以实现移动
        parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm)
      }
      newStartVnode = newCh[++newStartIdx]
    }
  }
  // 继续观望有没有剩余的，循环结束了 start 还是比 oldEndIdx 小
  if(newStartIdx <= newEndIdx) {
    console.log('new 还有剩余')
    const before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm
    for(let i = newStartIdx; i <= newEndIdx; i++) {
      parentElm.insertBefore(createElement(newCh[i]), before)
    }
  } else if(oldStartIdx <= oldEndIdx) {
    console.log(oldStartIdx, oldEndIdx)
    console.log('old 还有节点剩余')
    // 批量删除 oldStart 和 oldEnd 指针之间的项
    for(let i = oldStartIdx; i <= oldEndIdx; i++) {
      if(oldCh[i]) {
        parentElm.removeChild(oldCh[i].elm)
      }
    }
  }
}
```

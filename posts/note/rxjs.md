---
title: RxJS
date: 2025-05-19
desc: 1
hidden: true
---

[rxjs][] 是一个响应式编程库，可用于处理异步或者基于事件的程序代码。官网上说是“**Think of RxJS as Lodash for events.**”。

官网的第一个例子：

```js Switcher
//@tab 原生.js
document.addEventListener('click', () => {
  console.log('Clicked!')
})
//@tab rxjs.js
import { fromEvent } from 'rxjs'

fromEvent(document, 'click').subscribe(() => {
  console.log('Clicked!')
})
```

这个例子用 rxjs 多此一举，另一个例子可以好理解一下 rxjs 的用处。

[rxjs][] 可以产生纯函数，参考下面的例子。关于纯函数、非纯函数和函数副作用可看[文章](/posts/note/pure-sideffect-fn)。

```js Switcher
//@tab 原生.js
let count = 0
document.addEventListener('click', () => {
  console.log(`clicked ${count++} times`)
})
//@tab rxjs.js
import { fromEvent, scan } from 'rxjs'
fromEvent(document, 'click')
  .pipe(scan((count) => count + 1, 0))
  .subscribe((count) => {
    console.log(`clicked ${count++} times`)
  })
```

> `scan` 类似数组的 `reduce` 方法，可以产生累计值。

当然上述例子使用了 rxjs 反而代码量增加了，程序员最讨厌多写代码了！那就参考下面节流的例子：

```js Switcher
//@tab 原生.js
let count = 0
let lastClick = Date.now()
const limit = 1000
document.addEventListener('click', (e) => {
  if (Date.now() - lastClick <= limit) {
    count += e.clientX
    console.log(count)
    lastClick = Date.now()
  }
})
//@tab rx.js
import { fromEvent, throttleTime, scan, map } from 'rxjs'

fromEvent(document, 'click')
  .pipe(
    throttleTime(1000),
    map((e) => e.clientX),
    scan((count, clientX) => count + clientX, 0),
  )
  .subscribe((count) => console.log(`clicked ${count++} times`))
```

> 纯函数使得代码更易维护，减少了外部变量的影响。

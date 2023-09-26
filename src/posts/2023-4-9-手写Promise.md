---
title: 手写 Promise(未完)
date: 2023-4-9 21:08:00
updated: 2023-4-9 21:08:00
tags:
  - ES6
categories:
  - FE
---

代码仓库：[Plumbiu/ES6_Type](https://github.com/Plumbiu/ES6_Type)

手写挺难得，最后的 race、all 方法还没有实现，代码也不一定保证正确

# 高阶函数

高阶函数可以扩展功能，也可以对函数的参数进行预制参数

## 什么是高阶函数

函数满足以下条件，那么这个函数就是高阶函数

-   该函数返回一个函数
-   该函数参数包含函数

```javascript
// 返回一个函数
function a() {
  return () => {}
}
// 参数为函数
function b(callback) {}
b(function(){})
```

假如我们有个核心代码函数 `core`，我们想在执行 `core` 之前执行另外一些函数。如果我们直接修改 `core` 函数，这是不符合要求的，因为核心代码一般是不会修改的，我们只能扩展，可以使用以下方法实现 `core` 的扩展：

>   箭头函数：
>
>   1.   没有 `this`，或者说箭头函数的 `this` 会向上级查找，直到找到包含 `this` 的函数
>   2.   没有 `arguments`
>   3.   没有 `prototype`

```javascript
function core(...args) {
  console.log(`core code ${args}`)
}
// 加入到 Function 的原型上，这样所有函数都有 before 函数了
Function.prototype.before = function(cb) { // 参数是一个函数
  return (...args) => { // 返回一个函数
    cb() // 在 core 函数之前执行
    // core() // 写死了，不通用
    this(...args) // this 指向 core
  }
}
let newCore = core.before(function() {
  console.log('before')
})
newCore(1, 2, 3)
```

## 闭包

闭包就是函数定义的作用域和执行的作用域不是同一个，就会产生闭包

函数的**柯里化**、**偏函数**都是基于高阶函数来实现的

```javascript
function a() {
  /*  */
  return function() {}
}
let c = a()
c()
```

判断类型是否相同

判断类型常见的4种方式

1.   `typeof`：可以判断基本类型，但是不能判断引用类型，例如 `typeof null === 'object`

2.   `instanceof` 可以判断某个类型是否属于谁

3.   `Object.*prototype*.toString` 需要在对象的原型中找到方法

4.   `constructor`，例如：`[].constructor === Array`，`{}.constructor === Object`

-   **函数柯里化**：将范围具体化，可以实现批量传递参数，例如下面的代码

>   通过 `isType` 传递对应类型，将 `isType` 返回的函数赋值给 `utils` 对应的判断方法

```javascript
function isType(typing) {
  return function(val) {
    return Object.prototype.toString.call(val) === `[object ${typing}]`
  }
}

let utils = {}
let typeArr = ['Number', 'Boolean', 'String', 'Null', 'Undefined', 'Object', 'Array', 'Function', 'Symbol']
typeArr.forEach(type => {
  utils[`is${type}`] = isType(type)
  // utils[`is${type}`] = function(val) {
  //   return Object.prototype.toString.call(val) === `[object ${typing}]`
	// }
})
console.log(utils.isNumber(123))
console.log(utils.isFunction(function() {
  console.log('hello')
}))
```

## 解决异步问题

由于异步任务总是在同步任务处理完之后执行，所以以下代码打印 `obj` 是 `{}` 空对象

```javascript
let obj = {}
fs.readFile(path.resolve(__dirname, 'a.txt'), 'utf-8', (err, data) => {
  console.log(data)
  obj.msg = data
})
fs.readFile(path.resolve(__dirname, 'b.txt'), 'utf-8', (err, data) => {
  console.log(data)
  obj.age = data
})
console.log(obj) // {}
```

我们可以使用回调函数解决这个问题

```javascript
function cb(key, value) {
  obj[key] = value
  if(Reflect.ownKeys(obj).length === 2) {
    console.log(obj)
  }
}
fs.readFile(path.resolve(__dirname, 'a.txt'), 'utf-8', (err, data) => {
  obj.msg = data
  cb('msg', data)
})
fs.readFile(path.resolve(__dirname, 'b.txt'), 'utf-8', (err, data) => {
  obj.age = data
  cb('age', data)
})
```

但这样也不好，通过判断 `obj` 键的长度打印 `obj`，相当于写死了，改进：

```javascript
function after(times, cb) {
  let obj = {}
  return (key, value) => {
    obj[key] = value
    if(--times === 0) {
      cb(obj)
    }
  }
}
let cb = after(2, (data) => {
  console.log(data)
})
fs.readFile(path.resolve(__dirname, 'a.txt'), 'utf-8', (err, data) => {
  obj.msg = data
  cb('msg', data)
})
fs.readFile(path.resolve(__dirname, 'b.txt'), 'utf-8', (err, data) => {
  obj.age = data
  cb('age', data)
})
```

>   `cb` 变量为 `after` 函数的返回值，即：
>
>   ```javascript
>   cb = (key, value) => {
>   	/* ... */
>   }
>   ```
>
>   只不过内部变量采用了**闭包**

这样虽然解决了异步问题，但是只有在两次完成后，才能得到结果，但是无法监控中间的过程(发布订阅)

## 发布订阅模式

发布：触发功能

订阅：订阅一些功能

`events.on` 方法可以将要执行的函数保存到 `_attr` 属性中，当触发 `events.emit` 方法时，便会依次执行之前订阅的函数

```javascript
let events = {
  _obj: {},
  _attr: [],
  on(cb) {
    this._attr.push(cb)
  },
  emit(key, value) {
    this._obj[key] = value
    this._attr.forEach(cb => cb(this._obj))
  }
}
events.on(() => {
  console.log('读取一段数据后完毕')
})
events.on((data) => {
  if(Reflect.ownKeys(data).length === 2) {
    console.log('读取完毕后触发', data)
  }
})
fs.readFile(path.resolve(__dirname, 'a.txt'), 'utf-8', (err, data) => {
  events.emit('msg', data)
})
fs.readFile(path.resolve(__dirname, 'b.txt'), 'utf-8', (err, data) => {
  events.emit('age', data)
})
```

## 观察者模式

发布订阅模式要求用户要手动订阅，手动发布，而观察者模式是基于发布订阅模式，主动的一种模式，状态变化后悔主动通知

```javascript
// 被观察者类
class Subject {
  constructor(name) {
    this.name = name
    this._attr = []
  	this.state = '初始的状态'
  }
  // 被观察者绑定观察者，observer 为观察者类的实例
  attach(observer) {
    this._attr.push(observer)
  }
  // 为被观察者设置新的状态
  setState(newState) {
    this.state = newState
    // 设置新的状态，触发观察者的 update 方法，并将被观察者实例传入
    this._attr.forEach(observer => observer.update(this))
  }
}
// 观察者类
class Observer {
  constructor(name) {
    this.name = name
  }
  update(subject) {
    console.log(`${this.name}: ${subject.name}-${subject.state}`)
  }
}
let s = new Subject('被观察者')
let o1 = new Observer('观察者1')
let o2 = new Observer('观察者2')
s.attach(o1)
s.attach(o2)
s.setState('新的状态')
```

# Promise

## 手写 Promise

### 基本代码

1.   首先我们先创建 `Promise` 类和构造方法(`constructor`)

`Promise` 有三种状态 `pending(等待)`、`fulfilled(成功)`、`rejected(失败)`，当状态发生变化后，不能重新发生变化

```javascript
class Promise {
  constructor(executor) {   // executor 为创建 Promise 的参数
    this.status = 'pending' // Promise 的状态
    this.value = undefined  // resolve 最终的返回值
    this.reason = undefined // reject 后的原因
  }
}
```

2.   书写 `resolve`、`reject` 函数代码

```javascript
class Promise {
	// ...
  const resolve = (value) => {
    if(this.status === 'pending') { // 只有之前状态是 'pending' 时，才会触发 resolve
      this.status = 'fulfilled' // 修改 Promise 的状态
      this.value = value // 赋值
    }
  }
  const reject = (reason) => {
    if(this.status === 'pending') {
      this.status = 'rejected'
      this.reason = reason
    }
  }
}
```

3.   执行 `executor` 函数，并处理错误

```javascript
class Promise {
  // ...
  try {
    exector(resolve, reject) // 执行用户传递的 exector 函数，将之前书写的 resolve、reject 函数作为参数传递
  } catch(e) {
    reject(e) // 如果发生错误，那么直接调用 reject 函数
  }
}
```

4.   `then` 方法

当 `Promise` 实例调用 `then` 方法时，`this.value` 或者 `this.reason` 已经有值了，因为在 `constructor` 已经赋值了

```javascript
class Promise {
  constructor() {
    // ...
  }
  then(onFulfilled, onRejected) {
    if(this.status === 'fulfilled') {
      onFuliflled(this.value)
    } else if(this.status === 'rejected') {
      onRejected(this.reason)
    }
  }
}
```

5.   创建 `Promise` 实例

`new Promise` 的参数是一个函数，会立即执行，因为执行的代码在 `Promise` 类的构造器(`constructor`)中

```javascript
const p = new Promise((resolve, reject) => {
	if(true) {
    resolve('ok')
  } else {
    reject('no ok')
  }
})
p.then(
	(data) => {
    console.log(data)
  },
  (err) => {
    console.log(err)
  }
)
```

6.   完整代码

```javascript
class Promise {
  constructor(executor) {
    this.status = 'pending'
    this.value = undefined
    this.reason = undefined
    const resolve = (value) => {
      if(this.status === 'pending') {
        this.status = 'fulfilled'
        this.value = value
      }
    }
    const reject = (reason) => {
      if(this.status === 'pending') {
        this.status = 'reject'
        this.reason = reason
      }
    }
    try {
      executor(resolve, reject)
    } catch(e) {
      reject(e)
    }
  }
  then(onFulfilled, onRejected) {
    if(this.status === 'fulfilled') {
      onFulfilled(this.value)
    } else if(this.status === 'rejected') {
      onRejected(this.reason)
    } else if(this.status === 'pending') {
			// TODO
    }
  }
}
const p = new Promise((resolve, reject) => {
	if(true) {
    resolve('ok')
  } else {
    reject('no ok')
  }
})
p.then(
	(data) => {
    console.log(data)
  },
  (err) => {
    console.log(err)
  }
)
```

### 异步方法/处理多个 `then` 方法

`Promise` 处理请求 API 操作时，难免会有一些延迟，例如下面的代码

```javascript
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('ok')
  }, 1000)
})
```

只需要修改 `Promise` 类中的 `then` 方法即可

1.   在 `constructor` 构造器中添加 2 个属性

和之前的**发布订阅**模式一样，需要接受**”订阅”**的函数，在这里指的是 `then` 方法的参数

```javascript
class Promise {
  constructor(executor) {
    this.onResolvedCallbacks = []
  	this.onRejectedCallbacks = []
  }
}
```

2.   在 `Promise` 中的 `then` 方法处理 `pending` 状态

```javascript
class Person {
  // ...
  then(onFulfilled, onRefjected) {
    // ...
    else if(this.status === 'pending') {
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.value)
      })
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
  }
}
```

3.   在 `resolve`、`reject` 函数中执行这些函数

```javascript
class Person {
  constructor(executor) {
    // ...
    const resolve = (value) => {
      if(this.status === 'pending') {
        this.status = 'fulfilled'
        this.value = value
        this.onResolvedCallbacks.forEach(cb => cb())
      }
    }
    const reject = (reason) => {
      if(this.status === 'pending') {
        this.status = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach(cb => cb())
      }
    }
  }
}
```

## promisify

使用 `Promise` 封装处理函数

```javascript
function promisify(fn) {
	return (...args) => {
    let promise = new Promise((resolve, reject) => {
      fn(...args, (err, data) => {
      	if(err) return reject(err)
        resolve(data)
    	})
    })
    return promise
  }
}
```

```javascript
let readFile = promisify(fs.readFile)

readFile(path.resolve(__dirname, 'a.txt'), 'utf-8').then(data => {
  console.log(data)
}, err => {
  console.log(err)
})
```

借用此方法，我们可以实现 `then` 链的调用，`then` 链有以下特点

1.   如果在 `then` 方法中返回一个 `promise`，内不会解析这个 `promise`，将其结果传递到外层的下一个 `then` 方法中
2.   如果 `then` 方法返回的不是 `promise`，那么这个结果直接传递到下一个 `then` 的成功函数(即第一个参数)
3.   如果 `then` 方法中抛出异常，则会执行下一个 `then` 的失败函数(即第二个参数)

```javascript
readFile(path.resolve(__dirname, 'a.txt'), 'utf-8').then(data => {
	return readFile(data, 'utf-8')
}).then(data => {
  console.log(data)
}, err => {
  console.log(err)
})
```

## 完整实现

```javascript
// 为了方便测试，我们把Promise放在一个文件中
function resolvePromise(p, x, resolve, reject) {
  // 如果 x 和 p 引用同一个对象，那么 reject 一个 TypeError
  if (x === p) return reject(new TypeError('循环引用'))
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    // 有可能是 promise
    // x 可能是一个 promise
    let called = false
    try {
      let then = x.then // then 方法可能是通过 defineProperty 定义的
      if (typeof then === 'function') {
        // 是 promise，则 then 应该是个函数
        then.call(
          x,
          y => {
            if (called) return
            called = true
            resolve(y)
          },
          r => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } else {
        // 就是一个对象或者函数
        resolve(x)
      }
    } catch (error) {
      if (called) return
      called = true
      reject(error)
    }
  } else {

    resolve(x) // 普通值
  }
}

class Promise {
  constructor(executor) {
    this.status = 'pending'
    this.value = undefined
    this.reason = undefined
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []
    const resolve = value => {
      if (this.status === 'pending') {
        this.status = 'fulfilled'
        this.value = value
        this.onResolvedCallbacks.forEach(cb => cb())
      }
    }
    const reject = reason => {
      if (this.status === 'pending') {
        this.status = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach(cb => cb())
      }
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e }
    let p = new Promise((resolve, reject) => {
      if (this.status === 'fulfilled') {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(p, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      } else if (this.status === 'rejected') {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(p, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      } else if (this.status === 'pending') {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              console.log(x)
              resolvePromise(p, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          })
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(p, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          })
        })
      }
    })
    return p
  }
}
module.exports = Promise
```

## race、all

以后再说，手写真的难
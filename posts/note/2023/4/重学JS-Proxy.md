---
title: 重学JavaScript——Proxy
date: 2023-04-04
---

代码仓库：[Plumbiu/ES6_Type](https://github.com/Plumbiu/ES6_Type)

# Proxy 的作用

`Proxy` 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”(meta programming)，即对编程语言进行编程

`Proxy`：代理，可以在访问目标之前进行“拦截”，并且对此访问进行过滤和拦截

# Proxy 语法

基本使用：

```javascript
let obj = {
  foo: 'bar',
  baz: 42,
  hello: 'world'
}
let p = new Proxy(obj, {
  get(target, key) {
    return `get: ${target[key]}`
  },
  set(target, key, value) {
    target[key] = `set: ${value}`
  }
})
console.log(p.foo) // get: bar
console.log(p.baz) // get: 42
console.log(p.hello) // get: world
p.foo = 'a'
console.log(p.foo) // get: set: a
p.baz = 'b'
console.log(p.baz) // get: set: b
p.hello = 'c'
console.log(p.hello) // get: set: c
```

`Proxy` 构造函数接收两个对象，第一个参数为代理对象，第二个参数为配置拦截器选项，例如上述代码，当我们读取 `Proxy` 实例属性时，增加前缀 `get: `，当我们为 `Proxy` 实例属性赋值时，增加前缀 `set: `

>   注：
>
>   -   当我们读取 `Proxy` 实例属性时才会触发 `get` 方法，访问代理对象无法触发 `get` 方法。
>
>   -   `set` 方法也会修改代理对象，或者说对 `Proxy` 实例属性修改，也会同步修改到代理对象

```javascript
console.log(obj.foo) // "set: a"
console.log(obj) // { foo: 'set: a', baz: 'set: b', hello: 'set: c' }
```

目标代理对象也可以函数

```javascript
let f = new Proxy(function() {
  return 'hello world'
}, {})
console.log(f()) // hello world
```



# Proxy 实例方法

## get()

`get` 方法用于拦截某个属性的读取操作，可以接受三个参数，依次为代理目标对象、属性名和 proxy 实例本身。最后的一个参数可选

```javascript
let obj1 = {
  name: 'plumbiu'
}
let p1 = new Proxy(obj1, {
  get(target, key) {
    if(Object.keys(obj1).includes(key)) {
      return `get: ${target[key]}`
    } else {
      throw new ReferenceError(`Prop name ${key} does not exist.`)
    }
  }
})
console.log(p1.name) // "get: plumbiu"
console.log(p1.age) // ReferenceError: Prop name age does not exist.
```

上述代码表名，当我们读取 `Proxy` 实例属性时，当键值 `key` 在 `obj1` 对象中时，返回带有 `get: ` 前缀的值，如果不在，那么就抛出一个错误

>   一定要访问 `Proxy` 的实例才可以触发 `get` 方法！！！

`get` 方法可以继承

```javascript
let p2 = new Proxy({}, {
  get(target, key) {
    return `get: ${key}`
  }
})
let p3 = Object.create(p2)
console.log(obj.foo) // "set: a"
```

## set()

`set` 方法用于拦截 `Proxy` 实例属性赋值操作，可以接受四个参数，分别为目标代理对象、属性名、属性值和 `Proxy` 实例本身，其中最后一个参数可选

```javascript
let p4 = new Proxy({
  name: 'plumbiu'
}, {
  set(target, key, value) {
    target[key] = `set: ${value}`
  }
})
console.log(p4.name) // "plumbiu"
p4.name = 'brickle'
console.log(p4.name) // "set: brickle"
```

## apply()

`apply` 方法可以拦截函数的调用、`call` 和 `apply` 操作

`apply` 方法可以接受三个参数，分别是目标对象、目标对象的上下文对象(`this`)和目标对象的参数数组

```javascript
let f1 = function() {
  return 'target'
}
let p5 = new Proxy(f1, {
  apply(target, ctx, args) {
    return 'proxy'
  }
})
console.log(p5()) // "proxy"
```

## has()

`has` 方法用于拦截 `HasProperty` 操作，会拦截用户判断对象是否具有某个属性。典型的操作就是 `in` 运算符

`has` 方法接收两个参数，分别为目标代理对象、需要查询的属性名

以下方法实现对象的私有属性：

```javascript
const obj2 = {
  _name: 'plumbiu',
  name: 'brickle'
}
const p6 = new Proxy(obj2, {
  has(target, key) {
    if(key[0] === '_') {
      return false
    }
    return key in target
  }
})
console.log('_name' in p6) // false
console.log('name' in p6) // true
```

如果原对象不可配置或者禁止扩展，这时 `has` 拦截会报错

```javascript
const obj2 = {
  _name: 'plumbiu',
  name: 'brickle'
}
Object.preventExtensions(obj2)
const p6 = new Proxy(obj2, {
  has(target, key) {
    if(key[0] === '_') {
      return false
    }
    return key in target
  }
})
console.log('_name' in p6) // TypeError: 'has' on proxy: trap returned falsish for property '_name' but the proxy target is not extensible.
```

>   `has` 拦截的是 `HasProperty` 操作，而不是 `HasOwnProperty` 等操作，同时虽然 `for in` 循环也使用了 `in` 运算符，但是 `has` 拦截对 `for in` 不生效

## construct()

`construct` 方法用于拦截 `new` 命令，下面是拦截对象的写法

`construct` 方法可以接受三个参数：

-   `target`：目标对象
-   `args`：构造函数的参数对象
-   `newTarget`：创造实例对象时，`new` 命令作用的构造函数(下面例子的 `p7`)

```javascript
const p7 = new Proxy(function() {}, {
  construct(target, args) {
    return {
      value: 'hello world'
    }
  }
})
console.log((new p7()).value) // "hello world"
```

>   `construct` 方法返回的对象必须是一个对象，否则会报错

```javascript
const p8 = new Proxy(function() {}, {
  construct() {
    return 1
  }
})
new p8() // TypeError: 'construct' on proxy: trap returned non-object ('1')
```

>   同时 `Proxy` 的实例对象必须是可以 `new` 构造的，否则也会报错

```javascript
const p9 = new Proxy({}, {
  construct() {
    return {
      value: 1
    }
  }
})
new p9() // TypeError: 'construct' on proxy: trap returned non-object ('1')
```

## 其他方法

-   `deleteProperty()`：用于拦截 `delete` 操作

接收两个参数：

-   `target`：代理目标对象
-   `key`：`delete` 时操作的对象键名

```javascript
let obj3 = {
  _prop: 'foo',
  prop: 'bar'
}
const p10 = new Proxy(obj3, {
  deleteProperty(target, key) {
    if(key[0] === '_') {
      throw new Error(`Invalid attempt to delete private "${key}" property`)
    }
    return true
  }
})
console.log(delete p10.prop) // true
console.log(delete p10._prop) // Error: Invalid attempt to delete private "_prop" property
```

>   如果对象自身不可配置(configurable)的属性，不能被 `deleteProperty` 方法删除，否则报错

-   `defineProperty()`：拦截 `Object.defineProperty()` 操作

接收三个参数：

-   `target`：目标代理对象
-   `key`：属性值(键值)
-   `descriptor`：对应的 `Proxy` 实例对象

```javascript
const p11 = new Proxy({}, {
  defineProperty(target, key, descriptor) {
    return false
  }
})
p11.foo = 'bar'
console.log(p11) // {}
```

>   同理，如果对象自身不可配置(configurable)的属性，不能被 `deleteProperty` 方法删除，否则报错

-   更多方法请看[ Proxy - JavaScript | MDN ](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)，这里不再介绍

# 响应式语法

自己手写一个类似 vue 中的 `ref` 方法，当然不一定对，还有很多问题没有考虑

```html
<div id="app"></div>
<button onclick="valHandler()">change</button>
<script>
  function ref(template) {
    let el = document.querySelector(template.el)
    let val = template.data ? JSON.stringify(template.data) : 'none data'
    el.innerHTML = val
    return new Proxy(template, {
      set(target, key, value) {
        el.innerHTML = JSON.stringify(value)
      }
    })
  }
  const obj = {
    el: '#app',
    data: {
      name: 'xj',
      age: 18
    }
  }
  const val = ref(obj)
  function valHandler() {
    val.data = {
      name: 'yq',
      age: 19
    }
  }
</script>
```

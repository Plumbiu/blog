---
title: 重学JavaScript——Reflect
date: 2023-4-5 21:08:00
updated: 2023-4-5 21:08:00
tags:
  - ES6
categories:
  - 重学系列
---

# 前置知识

JavaScript 中允许指定函数中 this 的指向，提供了 3 个方法：

-   `call()`
-   `apply()`
-   `bind()`

## call

使用 `call` 方法**调用函数**，同时指定被调用函数的 this 的值

```javascript
func.call(thisArg, ...args)
```

-   `thisArg`：在 func 函数运行时指定的 this 值
-   `...args`：传递的其他参数

`call` 方法会调用函数，所以其返回值就是 `func` 函数的返回值

```javascript
function fn(x = 0, y = 0) {
  console.log(this)
  console.log(x + y)
}
fn()
// window
// 0

const obj = {
  name: 'plumbiu'
}
fn.call(obj, 1, 2)
// { name: 'plumbiu' }
// 3
```

>   `this` 打印的是 window 对象，为了简写只写 window

## apply

使用 `apply` 方法可以调用函数，同时指定被调用函数中的值

```javascript
func.apply(thisArg, [argsArray])
```

-   `thisArg`：在 func 函数运行时指定的 this 值
-   `argsArray`：传递的值，必须包含在数组里

`apply` 方法会调用函数，所以其返回值就是 `func` 函数的返回值。同时，由于传递的参数为数组，所以可以使用数组的一些方法，例如 `Math.max()` 求其中的最大值

```javascript
fn.apply(obj, [1, 2])
// { name: 'plumbiu' }
// 3
```

```javascript
console.log(Math.max(1, 2, 3)) // 3
let arr = [1, 2, 3]
console.log(Math.max.apply(null, arr)) // 3
```

>   其实上面可以用展开运算符 `...`，更简单
>
>   ```javascript
>   console.log(Math,max(...[1, 2, 3]))
>   ```

## bind

`bind` 方法不会调用函数，但是能改变内部 this 的指向

```javascript
func.bind(thisArg, ...args)
```

-   `thisArg`：在 `func` 函数运行时指定的 this 值
-   `args`：传递的参数

返回由指定的 `this` 值和初始化参数改造的**原函数拷贝(新函数)**。当我们不希望函数调用，只希望改变指向时，可以使用 `bind`，例如，react 中函数的传参：

```tsx
const App = () => {
  const [counter, setCounter] = useState(0)
  function increment(n: number) {
    setCounter(counter + n)
  }
  return (
    <div>
      <div>{ counter }</div>
      <button onClick={increment.bind(this, 2)}>+2</button>
    </div>
  )
}
```

或者在 React 中这样写：

```tsx
<button onClick={() => increment(3)}>+3</button>
```



# Reflect 概述

`ES6` 为操作对象提供了新的 API：`Reflect`，`Reflect` 设计的目的有以下几个：

1.   将 `Object` 对象的一些明显属于语言内部的方法(例如 `Object.defineProperty`)，放入 `Reflect` 对象上。现阶段，某些方法同时在 `Object` 和 `Reflect` 对象上部署，未来的新方法只部署在 `Reflect` 对象上。也就是说，从 `Reflect` 对象上可以拿到语言内部的方法
2.   修改 `Object` 一些方法的返回结果，使得返回结果更加合理。比如 `Object.defineProperty` 无法定义属性时，会抛出错误，而 `Reflect.defineProperty` 只会返回 `flase`

```javascript
let obj1 = {}
Object.preventExtensions(obj1)

// Object 的老写法
try {
  Object.defineProperty(obj1, 'baz', { value: 44 })
} catch(err) {
  console.log(err.message) // Cannot define property baz, object is not extensible
}

// Reflect 的新写法
if(Reflect.defineProperty(obj1, 'baz', { value: 42 })) {
  console.log(obj1.baz)
} else {
  console.log('error!') // error!
}
```

3.   函数式操作，`Object` 的某些操作是命令式，例如 `name in obj` 和 `delete obj[name]`，而 `Reflect.has(obj, name)` 和 `Reflect.deleteProperty(obj, name)` 是函数式的

```javascript
let obj2 = {
  name: 'plumbiu'
}
// 老写法
console.log('name' in obj2) // true
// 新写法
console.log(Reflect.has(obj2, 'name')) // true
```

4.   `Reflect` 对象的方法与 `Proxy` 对象的方法一一对应，只要是 `Proxy` 的方法就能在 `Reflect` 对象上找到对应的方法。同时不管 `Proxy` 怎么修改默认行为，`Reflect` 总是能获取默认行为

```javascript
let obj3 = {
  foo: 'bar'
}
let p1 = new Proxy(obj3, {
  set(target, key, value) {
    let success = Reflect.set(target, key, value)
    if(success) {
      console.log(`property ${key} on obj3 set to ${value}`) // property foo on obj3 set to baz
    }
    return success
  }
})
console.log(p1.foo = 'baz') // "baz"
```

5.   `Reflect` 使得某些方法的使用更简单

```javascript
console.log(Function.prototype.apply.call(Math.floor, undefined, [1.75])) // 1
console.log(Reflect.apply(Math.floor, undefined, [1.75])) // 1
```

# Reflect 静态方法

## Reflect.get(target, key, receiver)

`Reflect.get` 方法可以返回 `target` 对象的 `key` 属性，没有该属性，则返回 `undefined`

```javascript
let obj4 = {
  foo: 'bar',
  baz: 42
}
console.log(Reflect.get(obj4, 'foo')) // bar
console.log(Reflect.get(obj4, 'baz')) // 42
console.log(Reflect.get(obj4, 'name')) // undefined
```

>   `Reflect.get()` 第一个参数如果不是对象，会报错
>
>   ```javascript
>   Reflect.get(1, 'foo') // TypeError: Reflect.get called on non-object
>   ```

如果 `key` 属性部署了读取函数(getter)，则读取函数的 `this` 绑定的 `receiver`

```javascript
let obj5 = {
  foo: 'bar',
  baz: 1,
  get fn() {
    return this.baz + 5
  }
}
let obj6 = {
  baz: 0
}
console.log(obj5.fn) // 6
console.log(Reflect.get(obj5, 'fn')) // 6
console.log(Reflect.get(obj5, 'fn', obj6)) // 5
```

>   `Reflect.get` 本身是不读取函数的，如果想要读取函数内容，可以使用 `Reflect.apply(target, thisArg, args)`

## Reflect.set(target, key, value, receiver)

`Reflect.set` 可以设置 `target` 对象的 `key` 属性对应的值，设置为 `value`，参数 `receiver` 可以修改对应的 this 指向

```javascript
let obj7 = {
  foo: 'bar'
}
console.log(obj7.foo) // "bar"
Reflect.set(obj7, 'foo', 'barbar')
console.log(obj7.foo) // "barbar"
```

如果 `key` 设置了赋值函数(setter)，则赋值函数的 `this` 绑定 `receiver`

```javascript
let obj8 = {
  baz: 1,
  set fn(value) {
    this.baz = value
  }
}
let obj9 = {
  baz: 0
}
Reflect.set(obj8, 'bar', 1, obj9)
console.log(obj8.baz) // 1
console.log(obj9.baz) // 0
```

>   注：如果 `Proxy` 对象和 `Reflect` 对象联合使用，前者拦截赋值操作，后者完成赋值的默认行为，而且传入了 `receiver`，那么 `Reflect.set` 会触发 `Proxy.defineProperty` 拦截

```javascript
let obj10 = {
  foo: 'bar'
}
let p2 = new Proxy(obj10, {
  set(target, key, value, receiver) {
    console.log('set')
    Reflect.set(target, key, value, receiver)
  },
  defineProperty(target, key, attr) {
    console.log('defineProperty')
    Reflect.defineProperty(target, key, attr)
  }
})
p2.foo = 'barbar'
// "set"
// "defineProperty"
```

>   同 `Reflect.get`，如果 `Reflect.set` 的第一个参数不是对象，会报错

## Reflect.has(obj, key)

用于判断 `obj` 是否含有 `key` 属性，相当于 `key in name` 里的 `in` 运算符

```javascript
let obj11 = {
  foo: 'bar'
}
// 旧写法
console.log('foo' in obj11) // true
// 新写法
console.log(Reflect.has(obj11, 'foo')) // true
```

同上，第一个参数不是对象会报错

## Reflect.deleteProperty(obj, key)

`Reflect.deleteProperty(obj, key)` 方法等同于 `delete obj[key]`，用于删除对象的属性

```javascript
let obj12 = {
  foo: 'bar',
  baz: 42
}
// 旧写法
delete obj12.foo
console.log(obj12) // { baz: 42 }
// 新写法
Reflect.deleteProperty(obj12, 'baz')
console.log(obj12) // {}
```

如果删除成功，`Reflect.deleteProperty` 方法会返回 `ture`，否则返回 `false`

同上，第一个参数不是对象会报错

## Reflect.construct(target, args)

`Reflect.construct` 方法等同于 `new target(...args)`，提供了不用 `new` 构造函数来调用构造函数的方法

```javascript
function Greeting(name, age) {
  this.name = name
  this.age = age
}
const instance1 = new Greeting('plumbiu', 20)
console.log(instance1) // Greeting { name: 'plumbiu', age: 20 }
const instance2 = Reflect.construct(Greeting, ['brickle', 19])
console.log(instance2) // Greeting { name: 'brickle', age: 19 }
```

同上，第一个参数不是对象会报错

## Reflect.apply(func, thisArg, args)

`Reflect.apply` 方法等同于 `Function.prototype.apply.call(func, thisArg, args)`，用于绑定 `this` 对象后执行对应函数

一般来说，更改函数的 `this` 对象，只需要 `fn.apply(obj, args)` 即可，但是如果函数定义了自己的 `apply` 方法，就只能写成 `Function.prototype.apply.call(fn, obj, args)`，采用 `Reflect` 对象可以简化这种操作

```javascript
const arr = [1, 2, 3, 4, 5, 6]
// 旧写法
const min1 = Math.min.apply(Math, arr)
console.log(min1) // 1
// 新写法
const min2 = Reflect.apply(Math.min, Math, arr)
console.log(min2) // 1
```

## Reflect.defineProperty(target, key, attrubutes)

`Reflect.defineProperty` 方法基本等同于 `Object.defineProperty`，用来为对象定义属性。未来，后者会被逐渐废除，所以请使用 `Reflect.defineProperty` 代替

```javascript
function nowTime() { }
// 旧写法
Object.defineProperty(nowTime, 'now',  {
  value: () => Date.now()
})
console.log(nowTime.now()) // 1680695227921
// 新写法
Reflect.defineProperty(nowTime, 'after', {
  value: () => Date.now() + 10
})
console.log(nowTime.after()) // 1680695227931
```

同上，第一个参数不是对象会报错

## Reflect.getOwnPropertyDescriptor(target, propertyKey)

`Reflect.getOwnPropertyDescriptor` 基本等同于 `Object.getOwnPropertyDescriptor`，用于得到指定属性的描述对象，将来会替代掉后者

```javascript
let obj13 = {
  foo: 'bar'
}
console.log(Object.getOwnPropertyDescriptor(obj13, 'foo'))
// { value: 'bar', writable: true, enumerable: true, configurable: true }
console.log(Reflect.getOwnPropertyDescriptor(obj13, 'foo'))
// { value: 'bar', writable: true, enumerable: true, configurable: true }
```

`Object` 写法和 `Reflect` 写法的不同是，如果第一个参数不是对象：

-   `Object.getOwnPropertyDescriptor` 不会报错，而是返回 `undefined`
-   `Reflect.getOwnPropertyDescriptor` 会抛出错误 `TypeError: Reflect.getOwnPropertyDescriptor called on non-object`

## Reflect.isExtensible(target)

`Reflect.isExtensible` 对应 `Object.isExtensible`，返回一个布尔值，表示当前对象是否可以扩展，我们可以使用 `Reflect.preventExtensions(target)` 或者 `Object.preventExtensions(target)` 来改变 `target` 默认可扩展的行为

```javascript
let obj14 = {}
console.log(Object.isExtensible(obj14)) // true
console.log(Reflect.isExtensible(obj14)) // true
Reflect.preventExtensions(obj14)
console.log(Object.isExtensible(obj14)) // false
console.log(Reflect.isExtensible(obj14)) // false
```

如果参数不是对象，`Object.isExtensible`会返回`false`，因为非对象本来就是不可扩展的，而`Reflect.isExtensible`会报错。

```javascript
console.log(Object.isExtensible(1)) // false
console.log(Reflect.isExtensible(1)) // TypeError: Reflect.isExtensible called on non-object
```

## Reflect.preventExtensions(target)

`Reflect.preventExtensions`对应`Object.preventExtensions`方法，用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功。

```javascript
let obj15 = {}
console.log(Object.preventExtensions(obj15)) // {}
console.log(Reflect.preventExtensions(obj15)) // true
```

如果参数不是对象

-   `Object.preventExtensions` 在 ES5 环境报错，而在 ES6 环境返回传入的参数
-   `Reflect.preventExtensions` 会直接报错

```javascript
// ES5
Object.preventExtensions(1) // 报错
// ES6
console.log(Object.preventExtensions(1)) // 1
console.log(Reflect.preventExtensions(1)) // TypeError: Reflect.preventExtensions called on non-object
```

## Reflect.ownKeys(target)

`Reflect.ownKeys` 方法用于返回对象的所有属性，基本等同于 `Object.getOwnPropertyNames` 与 `Object.getOwnPropertySymbols` 之和

```javascript
let obj16 = {
  foo: 'bar',
  baz: 42,
  [Symbol('foofoo')]: 'barbar',
  [Symbol('bazbaz')]: 4242
}
console.log([...Object.getOwnPropertyNames(obj16), ...Object.getOwnPropertySymbols(obj16)])
// [ 'foo', 'baz', Symbol(foofoo), Symbol(bazbaz) ]
console.log(Reflect.ownKeys(obj16))
// [ 'foo', 'baz', Symbol(foofoo), Symbol(bazbaz) ]
```

同上，第一个参数不是对象会报错

## Reflect.getPrototypeOf(obj)、Reflect.setPrototypeOf(obj, newProto)

-   `Reflect.getPrototypeOf` 用于读取对象的 `__proto__` 属性，对应 `Object.getPrototypeOf` 方法

-   `Reflect.setPrototypeOf` 方法用于设置对象的原型(prototype)，对应 `Object.setPrototypeOf` 方法，返回一个布尔值，表示是否设置成功 

**`Reflect.getPrototypeOf`**：

>   如果参数不是对象，`Reflect.getPrototypeOf` 会直接报错，而 `Object.getPrototypeOf` 会将这个参数转换为对象，然后再运行(话虽如此，但是打印出来的是空对象，浏览器打印的如下图)
>
>   ![](https://plumbiu.github.io/blogImg/QQ截图20230405205924.png)

```javascript
function myFn() {}
const obj17 = new myFn()
console.log(Object.getPrototypeOf(obj17) === myFn.prototype) // true
console.log(Reflect.getPrototypeOf(obj17) === myFn.prototype) // true
```

```javascript
console.log(Object.getPrototypeOf(12)) // {}
console.log(Reflect.getPrototypeOf(1)) // TypeError: Reflect.getPrototypeOf called on non-object
```

**`Reflect.setPrototypeOf`**

>   如果无法设置目标对象的原型(例如目标对象禁止扩展)，则`Reflect.setPrototypeOf` 方法返回 `false`，否则返回 `true`
>
>   同时，如果第一个参数不是对象，`Object.setPrototypeOf` 会返回第一个参数本身，而 `Reflect.setPrototypeOf` 会报错

```javascript
const obj18 = {}
console.log(Object.setPrototypeOf(obj18, {
  len: 1
})) // {}
console.log(obj18.len) // 1
console.log(Reflect.setPrototypeOf(obj18, {
  lens: 2
})) // true
console.log(obj18.lens) // 2
```

```javascript
console.log(Object.setPrototypeOf(1, {})) // 1
console.log(Reflect.setPrototypeOf(1, {})) // TypeError: Reflect.setPrototypeOf called on non-object
```

另外，如果第一个参数是 `undefined` 或者 `null`，那么 `Object.setPrototypeOf` 和 `Reflect.setPrototypeOf` 都会报错

```javascript
console.log()(Object.setPrototypeOf(null, {})) // TypeError: Object.setPrototypeOf called on null or undefined
console.log()(Reflect.setPrototypeOf(null, {})) // TypeError: Reflect.setPrototypeOf called on non-object
```

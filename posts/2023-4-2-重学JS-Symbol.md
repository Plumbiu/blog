---
title: 重学JavaScript——Symbol
date: 2023-4-2 11:27:00
updated: 2023-4-2 11:27:00
tags:
  - ES6
categories:
  - 重学系列
---

代码仓库：[Plumbiu/ES6_Type](https://github.com/Plumbiu/ES6_Type)

# JS 的原始类型

ES6 新增了 JavaScript 的原始类型：`Symbol`，现在 JS 的数据类型有 7 种：

`undefined`、`null`、`Boolean(布尔值)`、`String(字符串)`、`Number(数值)`、`Object`、`Symbol`

# Symbol 基本概述

`Symbol` 类型主要是避免对象属性冲突，例如当我们想要对别人提供的方法添加属性时，很容易重名导致冲突，这是因为ES5 对象属性名都是字符串

`Symbol` 值通过 `Symbol` 函数生成，表示**独一无二的值**

```javascript
let s = Symbol()
console.log(typeof s) // "symbol"
```

上述代码中的 `s` 变量是便是一个独一无二的值。`typeof s` 语句的打印结果也是 `symbol`

## Symbol 函数传参

`Symbol` 函数可以接受一个字符串作为参数，表示对 Symbol 实例进行描述。主要是为了在控制台上显示或者在转换为字符串时，比较容易区分

```javascript
let s1 = Symbol('foo') // Symbol(foo)
let s2 = Symbol('bar') // Symbol(bar)
console.log(s1)
console.log(s2)
console.log(s1.toString()) // "Symbol(foo)"
console.log(s2.toString()) // "Symbol(bar)"
```

如果 `Symbol` 不加参数，那么 `s1`、`s2` 在控制台打印的都是 `Symbol()`，不利于区分

## 传入对象参数

如果 `Symbol` 函数的参数是一个对象，就会调用对象的 `toString` 方法，将其转化为字符串，然后才生成一个 Symbol 值。

```javascript
const obj = {
  toString() {
    return 'abc'
  }
}
const s3 = Symbol(obj)
console.log(s3) // Symbol(abc)
```

## Symbol 值比较

前面已经说过，`Symbol` 表示独一无二的值，所以即使传递相同的参数或者不传参数的两个值也是不相等的

```javascript
let s4 = Symbol()
let s5 = Symbol()
console.log(s4 === s5) // false
let s6 = Symbol('foo')
let s7 = Symbol('foo')
console.log(s6 === s7) // false
```

## Symbol 值运算

首先 `Symbol` 值并不能与其他类型的值进行运算，会报错

```javascript
let s8 = Symbol('world')
let str1 = 'hello ' + s8 // TypeError: Cannot convert a Symbol value to a string
let str2 = `hello ${s8}` // TypeError: Cannot convert a Symbol value to a string
```

但是，Symbol 可以显式转为字符串

```javascript
let str3 = `hello ${String(s8)}` // "hello Symbol(world)"
```

另外，Symbol 也可以转换为布尔值，但不能转换为数值

```javascript
console.log(Boolean(s8)) // true
console.log(!s8) // false
console.log(Number(s8)) // TypeError: Cannot convert a Symbol value to a number
```

# Symbol 的一些其他方法

## Symbol.prototype.description

ES2019 为 `Symbol` 的实例属性增添了 `description`，可以直接返回 `Symbol` 的描述

```javascript
let s9 = Symbol('foo')
console.log(s9.description) // "foo"
```

>   描述：在创建 `Symbol` 可以添加一个描述：
>
>   ```javascript
>   const sym = Symbol('foo')
>   ```
>
>   参数 `foo` 便是 `sym` 变量的描述

## symbol 作为对象属性名

ES6 新增了 `[var]` 扩展运算符，我们使用变量当做对象的属性：

```javascript
let abc = {}
let key = 'bar'
abc[key] = '123' // 等同于 abc['bar]
console.log(abc.bar) // "123"
```

我们可以运用此运算符来修改写法

>   采用 `Symbol` 值作为对象的属性，获取值的时，不要试图传递 `Symbol` 的描述

```javascript
let s10 = Symbol('foo') // 创建描述为 bar 的 symbol 值
let abc = {
  abc[s10] = '456'
}
console.log(abc[s10]) // "456"
console.log(abc['foo']) // undefined
```

同时不要使用 `.`  运算符操作对象，因为 JS 会把 `.` 后面的当做字符串处理，而不是 `Symbol`


```javascript
let s11 = Symbol('foo')
const obj1 = {
  [s11]: 'hello',
  's11': 'world'
}
console.log(obj1[s11]) // "hello"
// 以下写法等同于 obj1['s11']
console.log(obj1.s11) // "world"
```

**最佳实践：**

1.   使用 `[Symbol()]` 运算符写法定义对象属性
2.   使用 `[Sybol 实例]` 获取对象属性

```javascript
let obj = {
  [s1]: 'hello',
  [s2]: 'world',
  [s3](args) { /*  */ }
}
obj[s1]
obj[s2]
obj[s3]('abc')
```

## Symbol 属性名的遍历

`Symbol` 作为属性名，遍历对象的时候，无法出现在 `for in`、`for of` 循环，也不会被 `Object.keys()`、`Object.getOwnPropertyNames()`、`JSON.stringify()` 返回。

但是可以通过 **`Object.getOwnPropertySymbols()`** 方法，获取指定对象的所有 Symbol 属性名

```javascript
let obj2 = {
  [Symbol('a')]: 'Hello',
  [Symbol('b')]: 'World',
  foo: 'bar'
}
const symbols1 = Object.getOwnPropertySymbols(obj2)
const symbols2 = Object.getOwnPropertyNames(obj2)
const symbols3 = Object.keys(obj2)
for(let key in obj2) {
  console.log(key, obj2[key]) // "foo" "bar"
}
for(let [key, value] of Object.entries(obj2)) {
  console.log(key, value) // "foo" "bar"
}
console.log(symbols1) // [ Symbol(a), Symbol(b) ]
console.log(symbols2) // [ 'foo' ]
console.log(symbols3) // [ 'foo' ]
console.log(JSON.stringify(obj2)) // {"foo":"bar"}
```

>   上述代码看到，除了 `Object.getOwnPropertySymbols()` 方法，其余方法不会返回 `Symbol` 属性

另外，还有一个新的 API，`Reflect.ownKeys()` 方法，可以返回所有类型的键名：

```javascript
console.log(Reflect.ownKeys(obj2)) // [ 'foo', Symbol(a), Symbol(b) ]
```

由于 `Symbol` 值不会被常规遍历方法读取到，因此可以设置一些私有属性

## Symbol.for()、Symbol.keyFor()

`Symbol.for()` 方法可以让我们重新使用同一个 Symbol 值。接收一个字符串参数，然后搜索有没有以该参数作为名称的 Symbol 值，如果有，就返回这个 Symbol 值，否则重新创建一个以该字符串为名称的 Symbol 值，并**注册到全局**

`Symbol.for()` 同样参数的两个值是相等的，例如下面代码

```javascript
let s12 = Symbol.for('foo')
let s13 = Symbol.for('foo')
console.log(s12 === s13) // true
```

>   `Symbol.for()` 和 `Symbol()`：
>
>   -   两者都会生成新的 `Symbol`
>   -   `Symbol.for()` 会被登记到全局环境中搜索，具体来说就是，当我们调用 `Symbol.for(key)` 时，会每次检查 `key` 是否存在，如果不存在才会新建一个新值，否则不会创建新值
>   -   `Symbol()` 每次调用都会产生新值
>
>   举例说明：当我们调用多次 `Symbol.for(‘bar’)`，每次都会返回同一个 `Symbol` 值。但是如果我们多次调用 `Symbol(‘bar’)`，每次都返回不同的 `Symbol()` 值

`Symbol.keyFor()` 返回一个已登记的 `Symbol` 类型值的 `key`。

>   由于 `Symbol()` 没有登记机制，所以 `keyFor()` 返回的是 `undefined`

```javascript
let s14 = Symbol.for('foo')
let s15 = Symbol('foo')
console.log(Symbol.keyFor(s14)) // "foo"
console.log(Symbol.keyFor(s15)) // undefined
```

>   `Symbol.for()` 登记机制作用域是全局的，不管所处的环境是不是全局环境

```javascript
function foo() {
  return Symbol.for('key')
}
let s16 = foo()
let s17 = Symbol.for('key')
console.log(s16 === s17) // true
```

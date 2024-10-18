---
title: 重学JavaScript——Set/Map
date: 2023-04-02
---

代码仓库：[Plumbiu/ES6_Type](https://github.com/Plumbiu/ES6_Type)

# Set

Set 是一种数据结构，类似于数组，但是没有重复的元素

可以用 `Set` 构造函数生成 `Set` 数据结构

1.   `Set` 构造函数参数可以是数组，用于**数组的去重**

由于扩展运算符 (`...`) 内部使用 `for of` 循环，所以也可以用于 `Set` 结构

```javascript
let a = [1, 1, 2, 2, 3, 3, 'a', 'b', 'a', 'c', 'b']
console.log(new Set(a)) // Set(6) { 1, 2, 3, 'a', 'b', 'c' }
console.log([...new Set(a)]) // [ 1, 2, 3, 'a', 'b', 'c' ]
```

2.   也可以是字符串，用于**字符串的去重**

```javascript
console.log([...new Set('hello world')].join('')) // helo wrd
```

3.   `Set` 内部判断元素相等的规则

`Set` 内部判断元素相等的算法叫做 `Same-value-zero-equality`，类似于 `===` 判断运算符，但也有所不同，主要区别在于对 `NaN` 的判别

>   `===` 运算符认为 `NaN` 不等于自身

```javascript
console.log(NaN === NaN) // false
console.log([...new Set([NaN, NaN])]) // [ NaN ]
```

4.   传入对象

两个对象总是不相等的

```javascript
let set = new Set()
set.add({})
console.log(set) // Set(1) { {} }
set.add({})
console.log(set) // Set(2) { {}, {} }
```

如果要判断两个对象是否相等，可以使用 `JSON.stringify()` 方法

```javascript
console.log({} === {}) // false
console.log(JSON.stringify({}) === JSON.stringify({})) // true
```

## 实例(prototype)的属性方法

### size

返回 `Set` 实例的成员总数

```javascript
let s1 = new Set([1, 1, 2, 2, 'a', 'a', 'b'])
console.log(s1.size) // 4
```

### add(value)

向 `Set` 实例中添加某个值，返回 `Set` 数据结构本身

```javascript
let a2 = [1, 1, 2, 2, 3, 3, 'a', 'b', 'a', 'c', 'b']
let s2 = new Set()
a2.forEach(x => s2.add(x))
console.log([...s2]) // [ 1, 2, 3, 'a', 'b', 'c' ]
```

返回数据结构本身：

```javascript
let s3 = new Set()
console.log(s3.add(1)) // Set(1) { 1 }
```

### delete(value)

删除某个值，返回一个布尔值，表示删除是否成功

```javascript
let s4 = new Set([1, 1, 2, 3, 3, 'a', 'a', 'b'])
console.log([...s4]) // [ 1, 2, 3, 'a', 'b' ]
s4.delete('a')
console.log([...s4]) // [ 1, 2, 3, 'b' ]
console.log(s4.delete('a')) // false
```

### has(value)

返回一个布尔值，表示该值是否为 `Set` 实例的成员

```javascript
let s5 = new Set([1, 1, 2, 3, 3, 'a', 'a', 'b'])
console.log(s5.has(1)) // true
console.log(s5.has(5)) // false
```

### clear()

清除所有成员，无返回值

```javascript
let s6 = new Set([1, 1, 2, 3, 3, 'a', 'a', 'b'])
console.log(s6) // Set(5) { 1, 2, 3, 'a', 'b' }
s6.clear()
console.log(s6) // Set(0) {}
```

## 其他用法

### Set 数据结构转换为数组

使用 `Array.from` 方法可以实现 `Set` 结构转换为数组。可以作为数组去重的一种方法

```javascript
let s7 = new Set([1, 1, 2, 2, 3, 4, 5])
console.log(Array.from(s7)) // [ 1, 2, 3, 4, 5 ]
```

### 遍历操作

`Set` 结构的实例主要有四个遍历方法，可以用于遍历成员

-   `keys()`：键名遍历
-   `values()`：键值遍历
-   `entries()`：键值对遍历
-   `forEach()`：回调函数遍历每个成员

#### keys()、values()、entries()

其中 `keys()`、`values()`、`entries()` 返回的都是遍历器对象，这是由于 Set 结构没有键名，只有键值(或者键名和键值都是同一个值)

```javascript
let s8 = new Set(['a', 'b', 'c'])
for(let item of s8.keys()) {
  console.log(item)
}
// "a"
// "b"
// "c"
for(let item of s8.values()) {
  console.log(item)
}
// "a"
// "b"
// "c"
for(let item of s8.entries()) {
  console.log(item)
}
// ["a", "a"]
// ["b", "b"]
// ["c", "c"]
```

同时，`Set` 结构实例的默认遍历器生成函数就是它的 `values` 方法

```javascript
console.log(Set.prototype[Symbol.iterator] === Set.prototype.values) // true
```

意味着，我们可以省略 `values()` 方法，直接使用 `for of` 循环遍历 `Set`

```javascript
for(let item of s8) {
  console.log(item)
}
// "a"
// "b"
// "c"
```

#### forEach()

`Set` 结构的 `forEach()` 方法和数组基本一样

```javascript
let a3 = [1, 2, 'a', 'b']
a3.forEach((value, key) => console.log(`${key}: ${value}`))
// "0: 1"
// "1: 2"
// "2: a"
// "3: b"
let s9 = new Set(a3)
s9.forEach((value, key) => console.log(`${key}: ${value}`))
// "1: 1"
// "2: 2"
// "a: a"
// "b: b"
```

### 交并差集

使用 `Set` 数据结构可以很容易实现交并差集

```javascript
let a4 = new Set([1, 2, 3])
let a5 = new Set([2, 3, 4])
// 并集
let union = new Set([...a4, ...a5])
console.log([...union]) // [ 1, 2, 3, 4 ]
// 交集
let intersect = new Set([...a4].filter(x => a5.has(x)))
console.log([...intersect]) // [ 2, 3 ]
// 差集
let difference = new Set([...a4].filter(x => !a5.has(x)))
console.log([...difference]) // [ 1 ]
```

# WeakSet

`WeakSet` 结构和 `Set` 类似，但是有两个区别

1.   `WeakSet` 成员只能是对象，而不能是其他类型的值
2.   `WeakSet` 中的对象都是弱引用，即垃圾回收机制不考虑 `WeakSet` 对该对象的引用。也就是说，如果其他对象都不再引用该对象，那么回收机制会自动回收该对象所占用内存，不考虑对象还存在与 `WeakSet` 中
3.   `WeakSet` 实例对象只有三个方法 `add(value)`、`delete(value)`、`has(value)`，没有 `size` 属性和 `clear()` 方法
4.   由于 `WeakSet` 没有 `size` 属性，所以无法遍历它的成员

```javascript
let ws1 = new WeakSet()
ws1.add(1) // TypeError: Invalid value used in weak set
```

```javascript
let obj = {}
let foo = {}
ws1.add(obj)
console.log(ws1.has(obj)) // true
console.log(ws1.has(foo)) // false
console.log(ws1.delete(obj)) // true
console.log(ws1.has(obj)) // false
```

```javascript
console.log(ws1.size) // undefined
console.log(ws1.forEach) // undefined
```

>   `WeakSet` 不能遍历的主要原因是因为成员都是弱引用，随时可能被回收机制回收，遍历机制无法保证成员的存在

由于以上特性，`WeakSet` 适合临时存放一组对象，以及存放跟对象绑定的信息，例如存储 DOM 节点，这样就不用担心节点从文档移除时，会引发内存泄漏

举例

```javascript
const foos = new WeakSet()
class Foo {
  constructor() {
    foos.add(this)
  }
  method() {
    if(!foos.has(this)) {
      throw new TypeError('Foo.prototype.method 只能在Foo的实例上调用')
    }
    console.log('good')
  }
}
const fo = new Foo()
console.log(foos.has(fo)) // true
fo.method() // 'good'
```

上面代码保证了`Foo`的实例方法，只能在`Foo`的实例上调用。这里使用 WeakSet 的好处是，`foos`对实例的引用，不会被计入内存回收机制，所以删除实例的时候，不用考虑`foos`，也不会出现内存泄漏。

# Map

传统的 `Object` 中的键只能是字符串，这限制了开发者的使用范围，ES6 提供的 `Map` 数据结构，可以使用任意类型的键。也就是说 `Object` 提供了 `字符串 <-> 值` 的对应，而 `Map` 提供了 `值 <-> 值` 的对应，而且是根据 Hash 结构实现。

>   注：需要键值对的场景，`Map` 不一定比 `Object` 好用。当数据量很小或者数据量不发生变化时，`Object` 往往性能更高。`Map` 适用于大数据且需要改动数据的场景

```javascript
const s = Symbol('title')
const m = new Map([
  ['name', 'John'],
  [s, 'hello world']
])
console.log(m) // Map(2) { 'name' => 'John', 'age' => 30 }
console.log(m.size) // 2
console.log(m.get('name')) // "John"
console.log(m.get(s)) // "hello world"
```

## 实例(prototype)属性和方法

### Size

`size` 属性返回 Map 结构成员总数

```javascript
const m1 = new Map([
  ['foo', 'bar'],
  ['baz', 42]
])
console.log(m1.size) // 2
```

### set(key, value)

`set` 传递两个参数，返回当前的 `Map 对象`，`key` 代表键名，`value` 代表键值，两者都可以是任意类型。

```javascript
const m2 = new Map()
m2.set('foo', 'bar')
m2.set(1, 'hello')
m2.set(undefined, 'world')
m2.set(Symbol('bar'), 'baz')
console.log(m2) 
// Map(4) {
//   'foo' => 'bar',
//   1 => 'hello',
//   undefined => 'world',
//   Symbol(bar) => 'baz'
// }
```

`set` 方法还可以采用链式写法

```javascript
m2.set('1', 1).set('2', 2).set('3', 3)
```

### get(key)

`get` 方法读取 `key` 对应的键值，如果找不到 `key`，则返回 `undefined`

```javascript
const m3 = new Map([
  ['foo', 'bar'],
  ['baz', 42],
])
console.log(m3.get('foo')) // "bar"
console.log(m3.get('baz')) // 42
console.log(m3.get('hello')) // undefined
```

### has(key)

`has` 方法返回一个布尔值，判断对应键的键值是否存在，如果存在返回 `true`，否则返回 `false`

```javascript
console.log(m3.has('foo')) // true
console.log(m3.has('hello')) // false
```

### delete(key)

`delete` 用于删除某个键，删除成功返回 `true`，否则返回 `false`

```javascript
const m4 = new Map([
  ['foo', 'bar'],
  ['baz', 42],
])
console.log(m4.delete('foo')) // true
console.log(m4.delete('hello')) // false
```

### clear()

`clear` 方法清除 `Map` 中的所有成员且没有返回值

```javascript
m4.clear()
console.log(m4) // Map(0) {}
```

### 遍历方法

`Map` 结构原生提供了三个遍历器生成函数和一个遍历方法

-   `keys()`：键名遍历
-   `values()`：键值遍历
-   `entries()`：键名+键值遍历
-   `forEach()`：遍历 Map 的所有成员

```javascript
let m5 = new Map([
  ['F', 'no'],
  ['T', 'yes']
])
// "F"
// "T"
for(let key of m5.keys()) {
  console.log(key)
}
// "no"
// "yes"
for(let value of m5.values()) {
  console.log(value)
}
// F => no
// T => yes
for(let [key, value] of m5.entries()) {
  console.log(`${key} => ${value}`)
}
// F => no
// T => yes
```

`Map` 结构的默认遍历器接口 `Symbol.iterator` 属性就是 `entries` 方法

```javascript
console.log(m5[Symbol.iterator] === m5.entries) // true
```

所以对于 `entries()` 方法，可以省略

```javascript
for(let [key, value] of m5) {
  console.log(`${key} => ${value}`)
}
// F => no
// T => yes
```

## 使用

### Map <-> Array

`Map` 可以转换为数组，通过 `keys()`、`values()` 方法可以转换为键名数组和键值数组

```javascript
const m6 = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three']
])
console.log([...m6.keys()]) // [ 1, 2, 3 ]
console.log([...m6.values()]) // [ 'one', 'two', 'three' ]
console.log([...m6.entries()]) // [ [ 1, 'one' ], [ 2, 'two' ], [ 3, 'three' ] ]
console.log([...m6]) // [ [ 1, 'one' ], [ 2, 'two' ], [ 3, 'three' ] ]
```

`Array` 转换为 `Map` 在传参的时候就已经知道了，这里不再赘述

### map <-> Object

如果 `Map` 的键都是字符串，那么可以直接转换为对象，只不过我们需要实现转换的函数

```javascript
function map2obj(map) {
  let obj = {}
  for(let [k, v] of map) {
    obj[k] = v
  }
  return obj
}
const m7 = new Map([
  ['yes', true],
  ['no', false]
])
console.log(map2obj(m7)) // { yes: true, no: false }
```

`Object` 转换为 `Map`

```javascript
function obj2map(obj) {
  let map = new Map()
  for(let [key, value] of Object.entries(obj)) {
    map.set(key, value)
  }
  return map
}
const obj1 = {
  yes: true,
  no: false
}
console.log(obj2map(obj1)) // Map(2) { 'yes' => true, 'no' => false }
```

# WeakMap

正如 `WeakSet` 对于 `Set` 一样。`WeakMap` 结构也与 `map` 结构类似，也适用于生成键值对的集合，它与 `map` 有以下不同：

-   `WeakMap` 只接受对象作为键名(`null` 除外)
-   `WeakMap` 键名所指向的对象，不计入垃圾回收机制
-   `WeakMap` 无法遍历，意味着其实例没有 `keys()`、`values()`、`entries()` 方法，这与 JS 的垃圾回收机制有关
-   `WeakMap` 不支持 `clear()` 方法，但支持 `get()`、`set()`、`has()`、`delete()` 方法
-   `WeakMap` 没有 `size` 属性

>   `WeakMap` 弱引用的只是键名，而不是键值

`WeakMap` 设计的目的在于，有时候我们想在某个对象上面放一些数据，但是这会形成对于这个对象的引用，一旦不需要这些对象，我们必须手动删除，否则垃圾回收机制不会释放对应内存，例如以下代码：

```javascript
const e1 = document.getElementById('foo')
const e2 = document.getElementById('bar')
const arr = [
  [e1, 'foo 元素'],
  [e2, 'bar 元素']
]
// 我们需要这手手动删除引用
arr[0] = null
arr[1] = null
```

上面写法显然对开发者的心智造成了很大影响，一旦忘记书写，可能会造成内存泄漏

`WeakMap` 使用的一个典型场景便是在网页的 DOM 元素上添加数据，当该 DOM 元素被清除，其所对应的 `WeakMap` 记录便会自动被移除

```javascript
const wm = new WeakMap()
const element = document.getElementById('example')
wm.set(element, 'some information')
```

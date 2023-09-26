---
title: MDN-Object
date: 2023-2-26 16:47:00
updated: 2023-2-26 16:47:00
tags:
  - MDN
categories:
  - FE
---

# 从一个对象上删除一个属性

Object 自身没有提供方法删除其自身属性(但是 Map 中的 `Map.prototype.delete()` 可以删除自身属性)，为了删除对象上的属性，必须使用 `delete` 操作符：

```javascript
const person = {
    name: 'xj',
    address: 'hdu'
}
console.log(person.address) // hdu
delete person.address // 或者 delete person['address']
console.log(person.address) // undefined
```

# 构造函数

**Object()** 构造函数将给定的值包装为一个新对象。

-   如果给定的值是 `null` 或 `undefined`，它会创建并返回一个空对象
-   否则，它将会返回一个和给定的值相对应的类型的对象
-   如果给定值是以一个已经存在的对象，则会返回这个已经存在的值(相同地址)

在非构造函数上下文中调用时，`Object` 和 `new Object()` 表现一致。

**语法：**

```javascript
new Object()
new Object(value)
```

**例子：**

```javascript
let o1 = new Object() // 空对象
let o2 = new Object(undefined)
let o3 = new Object(null)
let o4 = new Object(true
```

# 静态方法

## Object.assign()

`Object.assign()` 方法将所有可枚举的自由属性从一个或多个源对象复制到目标对象，并返回修改后的对象。

**语法：**

```javascript
Object.assign(target, ...sources)
```

**注意：**

-   如果 `sources` 为 `null` 或 `undefined` 时，会抛出错误

-   此方法会修改 `target` 的值

**例子：**

```javascript
const t1 = { a: 1, b: 2 }
const t2 = { b： 3, c: 4 }
const t = Object.assign(t1, t2)
console.log(t1) // { a: 1, b: 3, c: 4 }
cosnole.log(t1 === t) // true
```

## Object.create()

`Object.create()` 方法用于创建一个新对象，使用现有的对象来作为新创建对象的原型(prototype)

**语法：**

```javascript
Object.create(proto)
Object.create(proto, propertiesObject)
```

**注意：**

-   `proto` 参数需为 `null` 或者 除基本类型包装对象以外的对象

-   基本类型包装对象：一种既非对象也无方法或属性的数据。有 7 种原始数据类型：`string`、`number`、`bigint`、`boolean`、`undefined`、`symbol`、`null`

-   使用 null 作为 proto 会产生不可预期的后果，因为它从未从 `Object.prototype` 继承任何对象方法

-   `propertiesObject` 见一下实例，注意有些属性会冲突

**例子：**

```javascript
const o = { a: 1, b: 2 }
const obj = Object(o, {
    foo: {
        value: '11',
        writable: false,
        enumerable: true,
        configurable: true,
        get() {},
        set() {}
    }
})
console.log(obj)
```

控制台打印结果

![](https://plumbiu.github.io/blogImg/QQ截图20230226182109.png)

打印结果表明，foo 的原型对象为 o

## Object.defineProperty()

`Object.defineProperty()` 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。

>   注：直接在 `Object` 构造器对象上调用此方法，不要再对象实例上调用

**语法：**

```javascript
Object.defineProperty(obj, prop, descriptor)
```

**参数：**

-   `obj`：要定义属性的对象
-   `prop`：要定义或修改的名称或 Symbol
-   `descriptor`：要定义或修改的属性描述符
    1.   `configurable`：默认 false，当该值为 true 时，该属性描述符才能够被更改，同时该属性也能从对应的对象上被删除
    2.   `enumerable`：默认 false，当该值为 true 时，对象才可以被 `for in`、`Object.keys` 枚举到
    3.   `value`：该属性对应的值，默认为 `undefined`
    4.   `writable`：默认为 false，只有设置为 true 时，才可以被赋值运算符改变
    5.   `get`：属性的 getter 函数
    6.   `set`：属性的 setter 函数

## Object.entries()

`Object.entries()` 方法返回一个给定对象自身可枚举属性的键值对数组，其排列与使用 `for in` 循环遍历该对象时返回的顺序一致(区别在于 `for in` 循环还会枚举原型链中的属性)

```javascript
const o = {
    a: 'something',
    b: 19
}
for(const [key, value] of Object.entries(o)) {
    console(`${key}: ${value}`)
}
```

**描述：**

`Object.entries()` 返回一个数组，例如下面

```javascript
const obj = { foo: 'bar', baz: 42 }
console.log(Object.entries(obj)) // [['foo', 'bar'], ['baz', 42]]
```

利用此特性，我们可以将 `Object` 转换为 Map

```javascript
const obj = { foo: 'bar', baz: 42 }
const map = new Map(obj.entries(obj))
```

## Object.freeze()

`Object.freeze()` 方法可以冻结一个对象。意味着该冻结的对象不能添加新的属性、不能删除已有属性、不能修改对象的可枚举性、可配置性、可写性以及属性的值、也不能修改该对象的原型。试图尝试以上操作，都会抛出错误

```javascript
Object.freeze(obj)
```

## Object.getOwnPropertyDescriptir()

`Object.getOwnPropertyDescriptor()` 方法返回指定对象上一个自由属性对应的属性描述符。

```javascript
const object = {
	property: 42
}
const description = Object.getOwnPropertyDescriptor(object, 'property')
console.log(description.configurable) // true
console.log(description.value) // 42
```

**语法：**

```javascript
Object.getOwnPropertDescriptor(obj, prop)
```

`obj` 需要查找的目标对象，`prop` 目标对象内属性名称。

**注意：**

-   如果指定的属性存在于对象上，则返回其属性描述符对象(property descriptor)，否则返回 `undefined`

## Object.getOwnPropertyNames()

`Object.getOwnPropertyNames()` 方法返回一个由指定对象的所有自身属性的属性名(包括不可枚举属性，但不包括 Symbol 值作为名称的属性)组成的数组

**语法：**

```javascript
Object.getOwnPropertyNames(obj)
```

`obj` 一个对象，其自身的可枚举和不可枚举属性的名称被返回

**示例：**

```javascript
const arr = ['a', 'b', 'c']
console.log(Object.getOwnPropertyNames(arr).sort()) // ["0", "1", "2", "length"]

// 类数组对象
const obj = { 0: "a", 1: "b", 2: "c" }
console.log(Object.getOwnPropertyNames(obj).sort()) // ["0", "1", "2"]

// 使用 Array.forEach 输出属性名和属性值
Object.getOwnPropertyNames(obj).forEach((val, idx, array) => {
    console.log(`${val} -> ${obj[key]}`)
})
// 0 -> a
// 1 -> b
// 2 -> c
```

## Object.defineProperty()

`Object.defineProperty()` 方法会直接在一个对象上定义一个新属性，或者修改一个对象的先有属性，并返回此对象

```javascript
const object = {}
Object.defineProperty(object, 'property', {
    value: 42,
    writable: false
})
object.property = 77 // 在严格模式下会抛出错误
console.log(object.property) // 42
```

**语法：**

```javascript
Object.defineProperty(obj, prop, desciptor)
```

`obj`：要定义属性的对象；`prop`：要定义或修改的属性的名称或 `Symbol`；`descriptor`：要定义或修改的属性描述符。

## Object.getOwnPropertySymbols()

`Object.getOwnPropertySymbols()` 方法返回一个给定对象自身的所有 Symbol 属性的数组

**语法：**

```javascript
Object.getOwnPropertySymbols(obj)
```

`obj` 要返回 Symbol 属性的对象

`Object.getPrototypeOf()` 方法返回指定对象的原型

**语法：**

```javascript
Object.getPrototypeOf(object)
```

`obj` 要返回其原型的对象。如果没有继承属性，则返回 `null`

## Object.is()

`Object.is()` 方法判断两个值是否为同一个值

**语法：**

```javascript
Object.is(value1, value2)
```

`Object.is()` 方法判断两个值是否为同一个值，如果满足以下任意条件则两个值相等：

-   都是 `undefined`
-   都是 `null`
-   都是 `true` 或都是 `false`
-   都是相同长度、相同字符、按相同顺序排列的字符串
-   都是相同对象（意味着都是同一个对象的值引用）
-   都是数字且
    -   都是 `+0`
    -   都是 `-0`
    -   都是 `NaN`
    -   都是同一个值，非零且都不是 `NaN`

## Object.isXxx()

1.   `Object.isExtensible()` 方法判断一个对象是否是可扩展的(是否可以在它上面添加新的属性)

**语法：**

```javascript
Object.isExtensible(obj)
```

2.   `Object.isFrozen()` 方法判断一个对象是否被冻结。

**语法：**

```javascript
Object.isFrozen(obj)
```

3.   `Object.isSealed()` 方法判断一个对象是否被密封

## Object.keys()

`Object.keys()` 方法会返回一个由一个给定对象的自身可枚举属性组成的数组，数组中属性名的排列顺序和正常循环遍历该对象时返回的顺序一致。

```javascript
const o = {
    a: 'something',
    b: 42,
    c: false
}
console.log(Object.keys(o)) // ['a', 'b', 'c']
```

**注意**

在 ES5 里，如果此方法的参数不是对象(而是一个原始值)，那么他会抛出 `TypeError`

在 ES2015 中，非对象的参数将被强制转换为一个对象

```javascript
// In ES5
Object.keys('foo') // TypeError: "foo" is not an object

// In ES2015+
Object.keys('foo') // ["0", "1", "2"]
```

## Object.preventExtensions()

`Object.preventExtensions()` 方法让一个对象变的不可扩展，也就是永远不能再添加新的属性。

**语法：**

```javascript
const obj = {}
Object.preventExtensions(obj)
```

## Object.seal()

**`Object.seal()`** 方法封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要原来是可写的就可以改变。

```javascript
const obj = {
    property: 53
}
Object.seal(obj)
```

## Object.setPrototypeOf()

`Object.setPrototypeOf()` 方法设置一个指定的对象原型(即内部 `[[Prototype]]` 属性)到另一个对象或 `null`，并返回指定的对象

>   由于 JS 引擎优化属性访问带来的特性的关系，更改对象的 `[[Prototype]]` 在浏览器的操作很慢。会不可避免的造成性能问题。

**语法：**

```javascript
Object.setPrototypeOf(obj, prototype)
```

`obj`：要设置其原型的对象，`prototype`：该对象的新原型(一个对象或null)

## Object.values()

`Object.values()` 方法返回一个给定对象自身的所有可枚举属性值的数组，值的书序与使用 `for in` 循环的书序相同(区别在于 for-in 循环枚举原型链中的属性)

**语法：**

```javascript
Object.values(obj)
```

`obj`：被返回可枚举属性的对象

```javascript
const obj = { foo: 'bar', baz: 42 }
console.log(Object.values(obj)) // ['bar', 42]
```

# instanceof

`instanceof` 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上

**语法：**

```javascript
object instanceof constructor
```

`object` 某个实例对象；`constructor` 某个构造函数

```javascript
function Car(make, model, year) {
    this.make = make
    this.model = model
    this.year = year
}
const auto = new Car('aaa', 'bbb', 'ccc')
console.log(auto instanceof Car) // true
console.log(auto instanceof Object) // true
```

```javascript
console.log([1, 2, 3] instanceof Array) // true

const date = new Date()
console.log(date instanceof Date) // true
```

# 实例方法

## hasOwnProperty

`hasOwnProperty()` 方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性(也就是，是否有指定的键)

```javascript
const obj = {
	name: 'xj',
    age: 19,
    address: 'hdu'
}
console.log(obj.hasOwnProperty('name')) // true
```

## isPrototypeOf

`isPrototypeOf()` 方法用于测试一个对象是否存在于另一个对象的原型链上

[Object.prototype.isPrototypeOf() - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isPrototypeOf)

## propertyIsEnumerable

`propertyIsEnumerable()` 方法返回一个布尔值，表示指定的属性是否可枚举

```javascript
const obj = {}
const arr = []
obj.prop1 = 42
arr[0] = 42
console.log(obj.propertyIsEnumerable('prop1')) // true
console.log(arr.propertyIsEnumerable(0)) // true
console.log(arr.propertyIsEnumerable('length')) // false
```

## valueOf

`valueOf` 方法将 `this` 值转换为一个对象。此方法旨在用于自定义类型转换的逻辑时，重写派生类对象

```javascript
function MyNumberType(n) {
    this.number = n
}
MyNumberType.prototype.valueOf = function() {
    return this.number
}
const obj = new MyNumberType(4)
console.log(obj + 3) // 7
```

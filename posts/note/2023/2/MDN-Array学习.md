---
title: MDN-Array
date: 2023-02-28
---

# 数组下标

`Array` 对象不能使用任意字符串作为元素索引，必须使用非负整数。数组元素是对象属性，就是 `toString` 是属性(准确一点是方法)一样。

同时，JavaScript 语法要求使用方括号表示法，而不是点号表示法来访问以数字开头的属性，也可以用引号包裹数组下表(例如，`years[‘2’]` 而不是 `years[2]`)

```javascript
console.log(arr.0) // a syntax error
```

JS 引擎通过隐式的 `toString`，将 `years[2]` 中的 `2` 强制转换为字符串。因此，`2` 和 `02` 将指向 `years` 对象上的两个不同槽位，下面的例子可能是 `true`：

```javascript
console.log(years['2'] !== years['02'])
```

# 静态方法

## Array.from()

`Array.from()` 方法对一个类似数组或可迭代对象创建一个新的、浅拷贝的数组实例

```javascript {1,3-4}
console.log(Array.from('foo')) // ["f", "o", "o"]
console.log(Aray.from([1, 2, 3], x => x + x)) // [2, 4, 6]
```

**语法**

```javascript
// 箭头函数
Array.from(arrayLike, (element) => { /* */ })
Array.from(arrayLike, (element, index) => { /* */ })
// 映射函数
Array.from(arrayLike, mapFn)
Array.from(arrayLike, mapFn, thisArg)
// 内联映射函数
Array.from(arrayLike, function mapFn(element) { /* … */ })
Array.from(arrayLike, function mapFn(element, index) { /* … */ })
Array.from(arrayLike, function mapFn(element) { /* … */ }, thisArg)
Array.from(arrayLike, function mapFn(element, index) { /* … */ }, thisArg)
```

**参数：**

-   `arrayLike`：想要转换成数组的伪数组对象或可迭代对象
-   `mapFn`：可选，如果制定了改参数，新数组每个元素都会执行该回调函数
-   `thisArg`：可选，执行回调函数 `mapFn` 时 `this` 对象

**数组去重合并：**

```javascript
function combine() {
    const arr = [].concat.apply([], arguments)
    return Array.from(new Set(arr))
}
var m = [1, 2, 3], n = [2, 3, 3]
console.log(combine(m, n)) // [1, 2, 3]
```

## Array.isArray()

`Array.isArray()` 用于确定传递的值是否是一个 `Array`

```javascript
Array.isArray([1, 2, 3]) // true
Array.isArray({ foo: 123 }) // false
Array.isArray('foobar') // false
A
```

## Array.of()

`Array.of()` 方法通过可变数量的参数创建一个新的 `Array` 实例，而不考虑参数的数量或者类型。

**语法：**

```javascript
Array.of(element0)
Array.of(element0, element1)
Array.of(element0, element1, ...[elements])
```

**例子：**

```javascript
Array.of(1, 2, 3) // [1, 2, 3]
Array(1, 2, 3) // [1, 2, 3]
Array.of(undefined) // [undefined]
```

# 实例方法

## Array.prototype.at()

`at()` 方法接受一个整数值并返回该索引值对应的元素，允许整数和负数。负整数从数组中的最后一个元素开始倒数。

```javascript
const arr = [1, 2, 3, 4, 5]
console.log(arr.at(2)) // 3
console.log(arr.at(-2)) // 4
```

## Array.prototype.concat()

`concat()` 方法用于合并两个或者多个数组。此方法不会改变现有数组，而是返回一个新数组

```javascript
const arr1 = ['a', 'b', 'c']
const arr2 = ['d', 'e', 'f']
const arr3 = arr1.concat(arr2)
console.log(arr3) // ['a', 'b', 'c', 'd', 'e', 'f']
```

**语法：**

```javascript
arr.concat([...arrs])
```

## Array.prototype.copyWithin()

`copyWithin()` 方法浅复制数组的一部分到同一数组中的另一个位置，并返回它，不会改变原数组的

```javascript
arr.copyWithin(target)
arr.copyWithin(target, start)
arr.copyWithin(target, start, end)
```

**参数：**

-   `target`：0 为基底的索引，复制序列到该位置。如果是负数，`target` 将从末未开始计算。如果 `target` 大于等于 `arr.length`，将不会发生拷贝。如果 `target` 在 `start` 之后，复制的序列将被修改以符合 `arr.length`
-   `start`: 0 为基底的索引，开始复制元素的起始位置。如果是负数，`start` 将从末尾开始计算。如果 `start` 被忽略，`copyWithin` 将会从 0 开始复制
-   `end`: 0 为基底的索引，开始复制元素的结束位置。`copyWithin` 将会拷贝到该位置，但**不包括 `end` 这个未知的元素**。如果是负数，`end` 将会从末尾开始计算。如果 `end` 被忽略，`copyWithin` 方法将会一直复制至数组结尾(默认为 `arr.length`)

**示例：**

```javascript
[1, 2, 3, 4, 5].copyWithin(-2) 		 	// [1, 2, 3, 1, 2]
[1, 2, 3, 4, 5].copyWithin(0, 3) 	 	// [4, 5, 3, 4, 5]
[1, 2, 3, 4, 5].copyWithin(0, 3, 4)	 	// [4, 2, 3, 4, 5]
[1, 2, 3, 4, 5].copyWithin(-2, -3, -1)	// [1, 2, 3, 3, 4]
```

## Array.prototype.entries()

`entries()` 方法返回一个新的数组迭代器对象，该对象包含数组中每个索引的键/值对

```javascript
const arr = ['a', 'b', 'c']
const iterator = arr.entries()
console.log(iterator.next().value) // Array [0, "a"]
console.log(iterator.next().value) // Array [1, "b"]
```

## Array.prototype.every()

`every()` 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试，它将返回一个布尔值。

>   **备注：**若收到一个空数组，此方法在任何情况下都会返回 `true`

```javascript
const test = (currentValue) => currentValue < 40
const arr = [1, 30, 12, 5, 21, 11, 2, 2]
console.log(arr.every(test)) // true
```

**语法：**

```javascript
// 箭头函数
every((element) => { /* … */ } )
every((element, index) => { /* … */ } )
every((element, index, array) => { /* … */ } )

// 回调函数
every(callbackFn)
every(callbackFn, thisArg)

// 内联回调函数
every(function(element) { /* … */ })
every(function(element, index) { /* … */ })
every(function(element, index, array){ /* … */ })
every(function(element, index, array) { /* … */ }, thisArg)
```

**参数：**

-   `callback`：用来测试每个元素的函数，可以接收三个参数：
    -   `element`：用于测试的当前值
    -   `index`：用于测试的当前值的索引
    -   `array`：调用 `every` 的当前数组
-   `thisArg`：可选，执行 `callback` 时使用的 `this` 值

## Array.prototype.fill()

`fill()` 方法用一个固定值填充一个数组从起始索引到终止索引内的全部元素。不包括终止索引。

```javascript
const arr = [1, 2, 3, 4]
console.log(arr.fill(0, 2, 4)) // Array [1, 2, 0, 0]
console.log(arr.fill(5, 1))	   // Array [1, 5, 5, 5]
console.log(arr.fill(6))	   // Array [6, 6, 6, 6]
```

**语法：**

```javascript
arr.fill(value)
arr.fill(value, start)
arr.fill(value, start, end)
```

**参数：**

-   `value`：用来填充数组元素的值
-   `start`：可选，起始索引，默认值为 0
-   `end`：可选，终止索引，默认值为 `arr.length`

## Array.prototype.filter()

`fliter` 方法创建给定数组的一小部分浅拷贝，其包含通过所提供的函数实现的测试的所有元素。

```javascript
const words = [12, 1, 5, 4, 22, 32, 1, 5, 48, 9, 15]
console.log(words.filter(item => item > 20)) // [22, 32, 48]
```

**语法：**

```javascript
// 箭头函数
filter((element) => { /* … */ } )
filter((element, index) => { /* … */ } )
filter((element, index, array) => { /* … */ } )

// 回调函数
filter(callbackFn)
filter(callbackFn, thisArg)

// 内联回调函数
filter(function(element) { /* … */ })
filter(function(element, index) { /* … */ })
filter(function(element, index, array){ /* … */ })
filter(function(element, index, array) { /* … */ }, thisArg)
```

## Array.prototype.find()

`find()` 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 `undefined`

```javascript
const arr = [5, 12, 8, 130, 44]
console.log(arr.find(item => item > 10)) // 12
```

**语法：**

```javascript
// 箭头函数
find((element) => { /* … */ } )
find((element, index) => { /* … */ } )
find((element, index, array) => { /* … */ } )

// 回调函数
find(callbackFn)
find(callbackFn, thisArg)

// 内联回调函数
find(function(element) { /* … */ })
find(function(element, index) { /* … */ })
find(function(element, index, array){ /* … */ })
find(function(element, index, array) { /* … */ }, thisArg)
```

## Array.prototype.findIndex()

`findIndex()` 方法返回数组中满足提供的测试函数的第一个元素的索引。若没有找到对应的元素，则返回 -1

```javascript
const arr = [5, 12, 8, 130, 44]
console.log(arr.findIndex(item => item > 10)) // 1
```

**语法：**

```javascript
// 箭头函数
findIndex((element) => { /* … */ } )
findIndex((element, index) => { /* … */ } )
findIndex((element, index, array) => { /* … */ } )

// 回调函数
findIndex(callbackFn)
findIndex(callbackFn, thisArg)

// 内联回调函数
findIndex(function(element) { /* … */ })
findIndex(function(element, index) { /* … */ })
findIndex(function(element, index, array){ /* … */ })
findIndex(function(element, index, array) { /* … */ }, thisArg)
```

## Array.prototype.findLast()

`findLast()` 与 `find()` 方法类似，只不过是从数组最后的元素往前找。

```javascript
const arr = [5, 12, 8, 130, 44]
console.log(arr.find(item => item > 10)) // 44
```

## Array.prototype.findLastIndex()

`findLastIndex()` 与 `findIndex()` 类似，只不过是从数组最后的元素往前找。

```javascript
const arr = [5, 12, 8, 130, 44]
console.log(arr.findIndex(item => item > 10)) // 4
```

## Array.prototype.flat()

`flat()` 方法会按照一个指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

```javascript
const arr1 = [0, 1, 2, [3, 4]]
console.log(arr1.flat()) // Array [0, 1, 2, 3, 4]
const arr2 = [0, 1, 2, [[3, 4]]]
console.log(arr2.flat()) // Array [0, 1, 2, Array [3, 4]]
```

**语法：**

```javascript
arr.flat()
arr.flat(depth)
```

`depth` 指定要提取嵌套数组的结构深度，默认值为 1

**示例：**

```javascript
const arr1 = [1, 2, [3, 4, [5, 6]]]
console.log(arr1.flat()) // [1, 2, 3, 4, [5, 6]]
console.log(arr1.flat(2)) // [1, 2, 3, 4, 5, 6]
//使用 Infinity，可展开任意深度的嵌套数组
const arr2 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]]
console.log(arr2.flat(Infinity)) // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

同时，`flat` 方法还会移除数组中的空项：

```javascript
const arr = [1, 2, , 4, 5]
console.log(arr.flat()) // [1, 2, 4, 5]
```

## Array.prototype.flatMap()

`flatMap()` 方法首先使用映射函数映射每个元素，然后将结果压缩成一个新数组。它与 `map` 连着深度值为 1 的 flat 几乎相同，但 `flatMap` 在合并成一种方法的效率稍微高一些

```javascript
const arr = [1, 2, [3], [4, 5], 6, []]
const result = arr.flatMap(num => num)
console.log(result) // Array [1, 2, 3, 4, 5, 6]
```

**语法：**

```javascript
// 箭头函数
flatMap((currentValue) => { /* … */ } )
flatMap((currentValue, index) => { /* … */ } )
flatMap((currentValue, index, array) => { /* … */ } )

// 回调函数
flatMap(callbackFn)
flatMap(callbackFn, thisArg)

// 行内回调函数
flatMap(function(currentValue) { /* … */ })
flatMap(function(currentValue, index) { /* … */ })
flatMap(function(currentValue, index, array){ /* … */ })
flatMap(function(currentValue, index, array) { /* … */ }, thisArg)
```

**map() 与 flatMap()**

```javascript
const arr = [1, 2, 3, 4]
arr.map(x => [x * 2]) // [[2], [4], [6], [8]]
arr.flatMap(x => [x * 2]) // [2, 4, 6, 8]
arr.flatMap(x => [[x * 2]]) // [[2], [4], [6], [8]]
```

## Array.prototype.forEach()

遍历数组，不再介绍

## Array.prototype.group()

[Array.prototype.group() - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/group)

[Array.prototype.groupToMap() - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/groupToMap)

实验性，不再介绍

## Array.prototype.includes()

`includes()` 方法用来判断一个数组是否包含一个指定的值，包含返回 true，否则返回 false

```javascript
const array1 = [1, 2, 3]
console.log(array1.includes(2)) // true
const pets = ['cat', 'dog', 'bat']
console.log(pets.includes('cat')) // true
console.log(pets.includes('at')) // false
```

**语法：**

```javascript
arr.includes(searchElement)
arr.includes(searchElement, fromIndex)
```

`searchElement`：需要查找的元素值

`fromIndex`：从 `fromIndex` 索引处开始查找 `searchElement`。存在负值和数据大于 length 情况

**示例：**

```javascript
[1, 2, 3].includes(2) // true
[1, 2, 3].includes(4) // false
[1, 2, 3].includes(3, 3) // false
[1, 2, NaN].includes(NaN) // true
```

1.   fromIndex 大于等于数组长度

如果 `fromIndex` 大于等于数组的长度，则将直接返回 `false`，且不搜索该数组

```javascript
const arr = ['a', 'b', 'c']
arr.includes('c', 3) // false
arr.includes('c', 100) // false
```

2.   fromIndex 为负值

如果 `fromIndex` 为负值，计算出的索引将作为开始搜索 `searchElement` 的位置。如果计算出的索引小于 0，则整个数组都会被搜索。

```javascript
const arr = ['a', 'b', 'c']
// arr.length = 3, fromIndex = -100, computed index = 3 - 100 = -97
arr.includes('a', -100) // true
```

## Array.prototype.indexOf()

`indexOf()` 方法返回在数组中可以找到给定元素的第一个索引，如果不存在，则返回 -1。与之对应的是 `lastIndexOf()` 找到指定元素的最大索引。 

```javascript
const people = ['xj', 'sx', 'yq', 'xj', 'xm']
console.log(people.indexOf('xj')) // -1
console.log(people.indexOf('xj', 2)) // 3
console.log(people.indexOf('wz')) // -1
```

**语法：**

```javascript
arr.indexOf(searchElement)
arr.indexOf(searchElement, fromIndex)
```

`searchElement`：要查找的元素；`fromIndex`：可选，开始查找的位置。如果索引值大于等于数组长度，意味着不会在数组中查找，返回-1。如果是负值，则从末未开始计算，-1 表示从最后一个元素开始查找，-2 表示从倒数第二个元素开始查找。

## Array.prototype.join()

`join()` 方法将一个数组(或一个类数组对象)的所有元素连接成一个字符串并返回这个字符串

```javascript
const elements = ['Fire', 'Air', 'Water']
console.log(elements.join()) // "Fire,Air,Water"
console.log(elements.join('')) // "FireAirWater"
console.log(elements.join('-')) // "Fire-Air-Water"
```

**语法：**

```javascript
arr.join()
arr.join(separator)
```

`separator` 指定一个字符串来分隔数组的每个元素。

**注意：**如果一个元素是 `undefined` 或 `null`，将会转换为空字符串

## Array.prototype.keys()

`keys()` 方法返回一个包含数组中每个索引键的 `Array Iterator` 对象

```javascript
const arr = ['a', 'b', 'c']
const iterator = arr.keys()
for(const key of iterator) {
    console.log(key)
}
// 0
// 1
// 2
```

## Array.prototype.map()

`map()` 方法创建一个新数组，这个数组由原数组中的每个元素都调用一次提供的函数后的返回值组成

```jsx
const arr = [1, 4]
const lis = arr.map(item => <li>{item}</li>)
console.log(lis)
// <li>1</li>
// <li>4</li>
```

**语法：**

```javascript
// 箭头函数
map((element) => { /* … */ })
map((element, index) => { /* … */ })
map((element, index, array) => { /* … */ })

// 回调函数
map(callbackFn)
map(callbackFn, thisArg)

// 内联回调函数
map(function(element) { /* … */ })
map(function(element, index) { /* … */ })
map(function(element, index, array){ /* … */ })
map(function(element, index, array) { /* … */ }, thisArg)
```

## Array.prototype.pop()

`pop()` 方法从数组中删除最后一个元素，并返回该元素的值。此方法会更改数组的长度

```javascript
const plants = ['a', 'b', 'c', 'd', 'e']
console.log(plants.pop()) // "e"
console.log(plants) // ['a', 'b', 'c', 'd']
```

## Array.prototype.push()

`push()` 方法将一个或多个元素添加到数组的末尾，并返回该数组的新长度

```javascript
const animals = ['pigs', 'goats', 'sheep']
const cout = animals.push('cows')
console.log(cout) // 4
animals.push('chickens', 'cats', 'dogs')
console.log(animals) // Array ["pigs", "goats", "sheep", "cows", "chickens", "cats", "dogs"]
```

**语法：**

```javascript
arr.push([...elements])
```

## Array.prototype.reverse()

`reverse()` 方法将数组中元素的位置颠倒，并返回该数组。

```javascript
const arr = [1, 2, 3, 4, 5]
console.log(arr.reverse()) // [5, 4, 3, 2, 1]
```

## Array.prototype.shift()

`shift()` 方法从数组中删除第一个元素，并返回该元素的值。此方法更改数组的长度

```javascript
const arr = [1, 2, 3]
const firstEle = arr.shift()
console.log(arr) // Array [2, 3]
console.log(firstEle) // 1
```

## Array.prototype.slice()

`slice()` 方法返回一个新的数组对象，这一对象是一个由 `begin` 和 `end` 决定的原数组的**浅拷贝**(包括 `begin`，不包括 `end`)。原始数组不会改变

```javascript
const people = ['xj', 'sx', 'yq', 'xm', 'wz']
console.log(people.slice(2)) // ['yq', 'xm', 'wz']
console.log(people.slice(2, 4)) // ['yq', 'xm']
console.log(people.slice()) // ['xj', 'sx', 'yq', 'xm', 'wz']
```

**语法：**

```javascript
arr.slice()
arr.slice(start)
arr.slice(start, end)
```

**一些负数的情况**

```javascript
people.slice(-2) // ['xm', 'wz']
people.slice(2, -1) // ['yq', 'xm']
```

## Array.prototype.some()

`some()` 方法测试数组中是不是至少有 1 个元素通过了被提供的函数测试。它返回的是一个 Boolean 类型的值

>   **备注：**如果用一个空数组进行测试，在任何情况下都返回 `false`

```javascript
const arr = [1, 2, 3, 4, 5, 6]
console.log(arr.some(item => item % 2 === 0)) // true
```

**语法：**

```javascript
// 箭头函数
some((element) => { /* … */ } )
some((element, index) => { /* … */ } )
some((element, index, array) => { /* … */ } )

// 回调函数
some(callbackFn)
some(callbackFn, thisArg)

// 内联回调函数
some(function(element) { /* … */ })
some(function(element, index) { /* … */ })
some(function(element, index, array){ /* … */ })
some(function(element, index, array) { /* … */ }, thisArg)
```

## Array.prototype.sort()

`sort()` 方法用原地算法对数组的元素进行排序，并返回数组。默认排序顺序是在将元素转换为字符串，然后比较它们的 UTF-16 代码单元值序列时构建的

```javascript
const months = ['March', 'Jan', 'Feb', 'Dec']
console.log(months.sort()) // Array ["Dec", "Feb", "Jan", "March"]
const arr1 = [1, 30, 4, 21, 100000]
console.log(arr1) // [1, 100000, 21, 30, 4]
```

**语法：**

```javascript
// 无函数
sort()
// 箭头函数
sort((a, b) => { /* … */ } )
// 比较函数
sort(compareFn)
// 内联比较函数
sort(function compareFn(a, b) { /* … */ })
```

**参数：**

`compareFn`：可选，用于自定义排列规则

-   `a`：第一个用于比较的元素
-   `b`：第二个用于比较的元素

**说明**

-   如果 `a - b > 0`，那么为升序排列
-   如果 `a - b = 0`，那么不会有任何操作
-   如果 `a - b < 0`，那么为降序排列

**示例**

-   打乱数组

```javascript
const arr = []
for(let i = 1; i <= 50; i++) {
    arr.push(i)
}
function randomArr(arr) {
    return arr.sort(() => Math.random() - 0.5)
}
console.log(randomArr(arr))
```

## Array.prototype.splice()

`splice()` 方法通过删除或替换现有元素、或者原地添加新的元素来修改数组，并以数组形式返回被修改的内容。此方法会改变原数组。

**语法**

```javascript
arr.splice(start)
arr.splice(start, deleteCout)
arr.splice(start, deleteCout, [...items])
```

**参数：**

-   `start`：指定修改的开始位置(从 0 计数)
    1.   如果超出数组长度：从数组末尾添加内容
    2.   如果是负值：表示数组末尾开始的第几位(-1 为最后一个元素，-2 为倒数第二个元素)
    3.   如果负数的绝对值大于数组的长度：表示开始位置为第 0 位
-   `deleteCount`：可选，表示要移除的数组元素个数
    1.   如果 `deletCount` 大于 `start` 之后的元素的总数，则从 `start` 后面的元素(包括 `start` 位)都将被删除
    2.   `deleteCount` 被省略，或者值大于 `arr.length - start`：`start` 之后的数组的所有元素都会被删除
    3.   `deleteCount` 是 0 或者负数：不移除元素，这种情况下，至少应添加一个新元素
-   `[...items]`：可选，要添加金属组的元素，从 `start` 位置开始。如果不指定，则 `splice()` 将只删除数组元素

**示例：**

```javascript
const nums = [1, 2, 3, 4]
console.log(nums.splice(1, 0, 1.5)) // [1, 1.5, 2, 3, 4]
console.log(nums.splice(4, 1, 5)) // [1, 1.5, 2, 3, 5]
```

## Array.prototype.toString()

`toString()` 方法返回一个字符串，表示指定的数组及其元素

```javascript
const arr = [1, 2, 'a', 'b']
console.log(arr.toString()) // "1,2,a,b"
```

## Array.prototype.unshift()

`unshift()` 方法将一个或多个元素添加到数组的开头，并返回该数组的新长度

```javascript
const arr = [1, 2, 3]
console.log(arr.unshift(4, 5)) // 5
console.log(arr) // [4, 5, 1, 2, 3]
```

## Array.prototype.values()

`values()` 方法返回一个新的 `Array Iterator` 对象，该对象包含数组每个索引的值

```javascript
const arr = ['a', 'b', 'c']
const iterator = arr.values()
for(const value of iterator) {
    console.log(value)
}
// "a"
// "b"
// "c"
```


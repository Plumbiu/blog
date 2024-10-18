---
title: JS 中的数据类型
date: 2023-05-20
---

此笔记来自于笔者在手写 `vue` 源码时，忘记了 JS 中的数据类型，导致很多地方不理解

JS 中的数据类型分为**基本数据类型**和**引用数据类型**，变量赋值也分为深拷贝和浅拷贝

基本数据类型又叫做基本数据类型或者值类型，引用数据类型又叫做复杂类型

# 堆栈

事实上，JS 并没有完善的堆栈系统，这里借助堆栈容易理解。为此微软重写了 JavaScript，发明了 TypeScript 是有完善的堆栈语言的

堆栈分配的区别：

-   栈：存储值类型，由操作系统自动分配释放存放函数的参数值、局部变量等，操作方式类似于数据结构中的栈
-   堆：存储引用类型，一般由程序员分配释放，如果程序员不释放，由垃圾回收机制回收

示例：

```javascript
let num = 10
let obj = { age: 18 }
let obj2 = obj
```

![](https://plumbiu.github.io/blogImg/zhifff.png)

# 值类型

所谓的简单数据类型/值类型指的是：**在存储时，变量中存储的是值本身**，JS 中的值类型有以下：

1.   `string`
2.   `number`
3.   `boolean`
4.   `undefined`
5.   `null`

题目：

```javascript
let num1 = 10
let num2 = num1
num2 = 20
console.log(num1) // 10
```

>   `num1` 声明赋值后在栈区开辟了一个空间，将 `let num2 = num1` 的意思是将 `num1` 的**值**赋值给 `num2`，即 `num2` 的声明赋值重新在栈区开辟了空间

# 引用数据类型

所谓的复杂数据类型/引用类型指的是：**在存储时，变量中存储的仅仅是地址(引用)**，因此叫做引用数据类型，在 JS 中，任意一个可以 用 `new` 关键字创建的对象都是引用数据类型，例如;

1.   `Obejct`
2.   `Array`
3.   `Date`
4.   ...

```javascript
let obj1 = {
  age: 18
}
let obj2 = obj1
obj2.age = 20
console.log(obj1.age) // 20
```

>   **引用数据类型在栈区存储的是其在堆区的地址**，也就是说 `let obj2 = obj1` 是将 `obj1` 的地址分配给了 `obj2`，`obj1` 最初的值 `{ age: 18 }` 是存储到堆区的。

同理，将引用数据类型作为函数参数传递，当函数内部对其操作时，也会改变原先的引用类型数值：

```javascript
let a = [0, 1, 2, 3]
function addItem(arr) {
  arr[4] = 4
}
addItem(a)
console.log(a) // [0, 1, 2, 3, 4]
```

不过有一点要注意，浏览器控制台执行顺序和 nodejs 环境下似乎不一样，以下代码在浏览器和 node 中打印结果不同

```javascript
let a = [0, 1, 2, 3]
// 先打印
console.log(a)
// 再调用函数
addItem(a)
function addItem(arr) {
  arr[4] = 4
}
```

在浏览器中，打印的工作是靠后执行的，也就是说先执行了 `addItem` 函数，再打印，所以浏览器结果是：

![](https://plumbiu.github.io/blogImg/QQ截图20230521112649.png)

而 node 则是按正常顺序：

![](https://plumbiu.github.io/blogImg/QQ截图20230521112726.png)

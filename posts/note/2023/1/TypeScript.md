---
title: TS
date: 2023-01-03
---

# TS 常用类型

可以将 TS 常用基础类型分为两类： 

1. `JS` 已有类型
   - **原始类型**： number、string、boolean、null、undefined、symbol
   - **对象类型**：object(数组、对象、函数等)
2. `TS` 新增类型
   - **联合类型**：自定义类型(类型别名)、接口、元组、字面量类型、枚举、void、any等

## 类型注解

```typescript
let age: number = 18
```

代码中的 `:number` 就是类型注解。

作用：为变量添加**类型约束**，即约定了什么类型，就只能给变量赋值该类型的值，否则会报错。

例如以下错误写法：

```typescript
// let age: number = '18'
```

## 原始类型

**原始类型**： number、string、boolean、null、undefined、symbol

这些类型完全按照 `JS` 中的类型名称来书写

```typescript
let age: number = 18
let uname: string = 'xj'
let isLoading: boolean = true
let a: null = null
let b: undefined = undefined
let s: symbol = Symbol()
```

## 数组类型

数组类型的两种写法

```typescript
let numbers: number[] = [1, 2, 3, 4]
let strings: Array<string> = ['a', 'b', 'c']
```

如果希望数组中既有 number 类型，又有 string 类型，可以这样写：

```typescript
let arr: (number | string)[] = [1, 'a', 2, 'b', 3, 'c']
let arr2: Array<number | string> = [1, 'a', 2, 'b', 3, 'c']
```

`|` (竖线)在 `TS` 中叫做**联合类型**(由多个类型组成的类型，表示元素类型可以是这些类型中的任意一种)。

**注意**：如果不加括号，例如下面

```typescript
let a: number | string[]
```

代表` a` 只能是` number` 类型或者是`string[]`类型，与上述加括号的类型不同

## 函数类型

**函数类型**

函数类型实质上是函数参数和返回值的类型

函数指定类型有两种方式

- 单独指定参数、返回值类型

  ```typescript
  function add(num1: number, num2: number): number {
      return num1 + num2
  }
  ```

  ```typescript
  const add = (num1: number, num2: number): number => {
      return num1 + num2
  }
  ```

- 同时指定参数、返回值类型

  ```typescript
  const add: (num1: number, num2: number) => number = (num1, num2) => {
      return num1 + num2
  }
  ```

  **解释**：当函数作为表达式时，可以通过**类似箭头函数形式的语法**来为函数添加类型

  **注意**：这种形式只适用于箭头函数

如果没有返回值，那么可以指定函数返回值类型为 `void`

```typescript
function greet(name: string): void {
    console.log('Hello,', name)
}
```

### 函数类型可选参数

使用函数实现某个功能时，有的参数可传可不传，这种情况下就要用到**可选参数**了

比如，数组的 `slice` 方法，可以 `slice()`、`slice(1)`、`slice(1, 3)`

```typescript
function mySlice(start?: number, end?: number): void {
    console.log('起始索引:', start, '结束索引:', end)
}
```

只需要在函数参数后面加 `?` 即可。

**注意**：

1. 可选参数只能出现在**参数列表之后**，也就是说必选参数在前，可选参数在后
2. 未传值的参数为 `undefined`

## 对象类型

`JS` 中的对象是由**属性**和**方法**构成的，而 `TS` 中对象的类型就是在描述对象的结构(**有什么类型的属性和方法**)

```typescript
let person: { name: string; age: number; sayHi(): void } = {
    nameL: 'jack',
    age: 19,
    sayHi() {}
}
```

**解释**:

1. 直接使用 `{}` 来描述对象结构。属性采用**属性名:类型**的形式：方法采用**方法名():返回值类型**的形式。
2. 如果方法有参数，就类似这样的写法 `greet(name: string): void`
3. 在一行代码中指定对象的多个属性类型时，使用 `; (分号)` 来分隔
   - 如果一行代码只指定一个属性(通过换行来分隔多个类型)
   - 方法的类型也可以是用箭头函数形式(比如: `say: () => void`)

```typescript
let person: {
    name: string
    age: number
    sayHi(): void
} = {
    nameL: 'jack',
    age: 19,
    sayHi() {}
}
```

### 对象类型的可选属性或方法

对象的属性或方法，也是可选的，此时需要适用**可选属性**

比如 `axios` 请求中，使用 `GET` 请求时，method 属性就可以省略

```typescript
function myAxios(config: { url: string; method?: string }) {
    console.log(config)
}
```

**对象的可选属性**语法与函数类型可选参数一致，都使用 `? (问号)` 来表示

## 类型复用

### type 类型别名

**类型别名**(自定义类型)：为任意类型起别名，相当于将类型赋值给变量

```typescript
type CustomArray = (string | number)[]
let arr1: CustomArray = [1, 'a']
let arr2: CustomArray = [2, 'b']
```

**解释：**

1. 使用 `type` 关键字创建类型别名
2. 同一个类型很复杂或者被多次使用，使用类型别名可以简化某些类型的使用
3. 创建类型别名后，指机使用该类型作为变量的类型注解即可

### interface 接口

当一个对象类型被多次使用时，一般会使用**接口(`interface`)** 来描述对象的类型，达到复用的目的

同时**接口的可选属性**语法与函数、对象类型可选参数一致，都使用 `? (问号)` 来表示

```typescript
interface IPerson {
    name: string
    age: number
    sayHi(): void,
    weight?: number
}

let person: IPerson = {
    name: 'jack',
    age: 19,
    sayHi() {}
}
```

**解释**：

1. 使用 `interface` 关键字来声明接口
2. 声明接口后，直接使用名称作为变量的类型
3. 每一行代表一个属性，因此不需要添加 `;` 或者 `,`

#### 接口其他知识

1. **接口的继承**

   如果两个接口之间有相同的属性或方法，可以将**公共的属性或方法抽离出来，通过继承来实现复用**

   比如，两个接口都有 x、y 两个属性：

   ```typescript
   interface Point2D { x: number; y: number }
   interface Point3D { x: number; y: number; z: number }
   ```

   简化：

   ```typescript
   interface Point2D { x: number; y: number }
   interface Point3D extends Point2D { z: number }
   ```

   **解释**：

   - 使用 `extends` 关键字实现接口继承
   - 继承后，`Point3D` 就有了 `Point2D` 的所有属性和方法，此时 `｛｝`中为 `Point3D` 的属性

   





### interface 和 type 的区别

**相同点**：

- 都可以给对象指定类型。

**不同点**：

- 接口，只能为对象指定类型，不需要 `=` 连接
- 类型别名，不仅可以为对象指定类型，可以为任意类型指定别名，指定别名时，需要用 `=` 连接

```typescript
interface IPerson {
    name: string
    age: number
    sayHi(): void
}
```

```typescript
type IPerson = {
	name: string
    age: number
    sayHi(): void
}
```

```
type NumStr = number | string
```

## 元组类型

场景：使用经纬度记录位置信息

可以使用数组来记录坐标

```typescript
let position: number[] = [39.5427, 114.514]
```

虽然可以实现我们的要求，但这样很不严谨，因为数组中可以出现任意多个方式

使用**元祖(Tuple)**

```typescript
let position: [number, number] = [39.5427, 114.514]
```

解释：

1. 元组使用另一种类型的数组，它规定了**数组包含几个元素**，以及元素的**类型**
2. 以上实例，`position` 元组包含了两个元素，两个元素类型均为 `numbe`r 类型

## 类型推论

在 TS 中，某些没有明确指出类型的地方，TS 的类型推论机制会帮助提供类型

发生类型推论的 2 中常见场景：变量未初始化、决定函数返回值

```typescript
let age = 18 // 将鼠标移到 age 变量上，便可以看到 let age: number
```

```typescript
function add(num1: number, num2: number) { return num1 + num2 } // 鼠标移到 add 函数上，便可以看到 function add(num1: number, num2: number): number
```

**注意**：这两种情况下，类型注解可以省略不写，但是我建议写，因为更直观

## 类型断言

有时会你会比 TS 更加明确一个值的类型，此时，可以使用**类型断言**来指定更具体的类型

例如

```html
<a href="https://blog.plumbiu.club" id="link">博客</a>
```

```typescript
const aLink = document.getElementById('link') // 鼠标移到 aLink，便可以看到 const aLink: HTMLElement
```

**注意**：

`getElementById` 方法返回值的类型是 `HTMLElement`，该类型只包含所有标签公共的属性和方法，不包含 `a 标签`特有的 `href` 属性。

因此，这个**类型太宽泛**，无法操作 `href` 等 `a 标签`特有的属性或方法

解决方式：使用**类型断言**指定更加具体的类型

```typescript
const aLink = document.getElementById('link') as HTMLAnchorElement // 鼠标移到 aLink，便可以看到 const aLink: HTMLAnchorElement
```

**解释：**

1. 使用 `as` 关键字实现类型断言
2. 关键字 `as` 后面的类型是一个更加具体的类型(`HTMLAnchorElement` 是 `HTMLElement` 的子类型)
3. 通过类型断言，`aLink` 的类型变得更加具体，这样就可以访问 `a 标签`特有的属性或方法了

另一种语法，使用 `<>` 语法，这种语法形式不常用

```typescript
const aLink = <HTMLAnchorElement>docuement.getElementById('link')
```

**技巧**：在浏览器控制台，通过 `console.dir()` 打印 DOM 元素，在属性列表的最后面，即可看到该元素类型

## 字面量类型

```typescript
let str1 = 'Hello TS'
const str2 = 'Hello TS'
```

通过 TS 类型推断，可以看出：

1. 变量 `str1` 的类型为 `string`
2. 常量 `str2` 的类型为 `Hello TS`

解释：

1. `str1` 是一个变量(let)，它的值可以使任意字符串，所以类型为 `string`
2. `str2` 是一个常量(const)，它的值不能变化只能是 `Hello TS`，所以它的类型为 `Hello TS`
3. `Hello TS` 就是一个字面量类型，除了字符串外，任意的 `JS 字面量`(对象、数字等)都可以作为类型使用

### 使用场景

**字面量类型**一般配合**联合类型**一起使用，用来表示一组明确的可选值列表

在贪吃蛇游戏中，游戏的方向可选值只能是上、下、左、有中的任意一个

```typescript
function changeDirection(direction: 'up' | 'down' | 'left' | 'right') {
    console.log(direction)
}
changeDirection('up')
changeDirection('down')
changeDirection('left')
changeDirection('right')
```

**解释**：参数 `direction` 的值只能是 up/down/left/right 中的任意一个，相比于 `string` 类型，使用字面量类型更加准确、严谨

## 枚举类型

枚举的功能类似与字面量类型+联合类型组合的功能，也可以表示一组明确的可选值

**枚举**：定义一组命名常量。它描述一个值，该值可以是这些命名常量中的一个

```typescript
enum Direction { Up, Down, Left, Right }
function changeDirection(direction: Direction) {
    console.log(direction)
}
changeDirection(Direction.Up)
changeDirection(Direction.Down)
changeDirection(Direction.Left)
changeDirection(Direction.Right)
```

**解释**：

1. 使用 `enum` 关键字定义枚举
2. 约定枚举名称，枚举中的值以大写字母开头，多个值之间通过 `,` (逗号)分隔
3. 定义好枚举后，直接使用枚举名称作为类型注解
4. 访问枚举成员和对象类似，使用 `.` 访问

### 枚举成员的值

```typescript
changeDirection(Direction.up) // 鼠标移动到 Direction.up 可以看到枚举成员 Up 的值为 0
```

**注意**：

1. 枚举成员默认有值的，默认从 0 开始自增

2. 我们把枚举成员的值称为**数字枚举**

3. 当然我们可以指定枚举中成员的初始值

   ```typescript
   // Down: 11、Left: 12、Right: 13
   enum Direction { Up = 10, Down, Left, Right }
   ```

   ```typescript
   enum Direction { Up = 2, Down = 4, Left = 8, Right = 16 }
   ```

### 字符串枚举

**字符串枚举**：枚举成员的值都是字符串

```typescript
enum Direction {
    Up = 'UP',
    Down = 'DOWN',
    Left = 'LEFT',
    Right = 'Right'
}
```

**注意**：字符串枚举没有自增长行为，因此，**字符串枚举的每个成员都必须有初始值**

### 枚举的特性

枚举是`TS` 为数不多非 `JS` 类型级扩展(不仅仅是类型)的特性之一

因为：其他类型仅仅会被当成类型，而枚举**不仅用作类型，还提供值**

也就是说，其他的类型会在编译为 JS 代码时自动移除，但是，枚举类型会被编译为 `JS `代码。

```typescript
enum Direction {
    Up = 'UP',
    Down = 'DOWN',
    Left = 'LEFT',
    Right = 'Right'
}
```

编译后的 JS 代码

```javascript
var Direction;
(function (Direction) {
	Direction["Up"] = "UP";
	Direction["Down"] = "DOWN";
	Direction["Left"] = "LEFT";
    Direction["Right"] = "RIGHT"
})(Direction || (Direction = {}))
```

**说明**：枚举类型与前面讲到的字面量类型+联合类型组合的功能类似，都用来表示一组明确的可选值列表。

一般情况下，推荐使用**字面量+联合类型组合**的方式，相比于枚举更直观

## any 类型

**原则：不是用 any！**使用 `any` 类型 `TypeScript` 就和普通 `JavaScript `没有任何区别了

当值的类型为 `any` 时，可以对该值进行任意操作，并且不会有代码提示

```typescript
let obj: any = { x: 0 }
obj.bar = 100
obj()
const n: number = obj
```

以上代码存在错误，但是不会有任何错误提示

其他隐式具有 `any` 类型的情况：

1. 声明变量不提供类型也不提供默认值
2. 函数参数不加类型

**所以，千万不要使用 `any`！**

## typeof

TS 也和 JS 一样，提供了 `typeof` 操作符：可以在类型上下文中引用变量或属性的类型(类型查询)

```typescript
let p = { x: 1, y: 2 }
function formatPoint(point: { x: number; y: number }) {}
formatPoint(p)
```

```typescript
function formatPoint(point: typeof p) {}
```

**解释**：

1. `typeof` 返回的类型可以当做类型注解
2. `typeof` 只能用来查询变量或属性的类型，无法查询其他的类型(函数调用类型)

# TS 高级类型

## class 类

```typescript
class Person {}
const p = new Person()
```

**解释**：

1. 根据 `TS` 中的类型推论，可以知道 `Person` 类的实例对象 `p` 的类型是 `Person`
2. TS 中的 `class` 不仅提供了 `class` 的语法功能，也作为一种类型存在

```typescript
class Person {
    age: number
    gender = '男'
    // gender: string = '男'
}
const p = new Person()
p.age
p.gender
```

**解释**：

1. 声明成员 `age`，类型为 `number`(没有初始值)
2. 声明成员 `gender`，并设置初始值，`TS` 可以根据类型推论判断该类型

### class 构造函数

```typescript
class Person {
    age: number
    gender: string
    
    constructor(age: number, gender: string) {
        this.age = age
        this.gender = gender
    }
}
const p = new Person(19, '男') // 不指定参数会报错
```

解释：

1. 成员初始化(比如 `age:number`)后，才可以通过 `this.age` 来访问实例成员
2. 需要为构造函数指定类型注解，否则会被隐式判断为 `any`
3. 构造函数不需要返回值类型，写了会报错

### class 的实例方法

```typescript
class Point {
    x = 10
    y = 10
    scale(n: number): void {
        this.x *= n
        this.y *= n
    }
}
```

方法的类型注解(参数和返回值)与函数用法相同

### class 的继承

类继承的方式有两种：

1. **extends 继承父类**

   ```typescript
   class Animal {
   	move() { console.log('Moving along!') }
   }
   class Dog extends Animal {
       bark() { console.log('汪!') }
   }
   const dog = new Dog()
   dog.move()
   dog.bark()
   ```

   **解释**：

   - 通过 `extends` 关键字实现继承
   - 子类 `Dog` 继承父类 `Animal`，则 `dog` 就同时具有了父类 `Animal` 和子类 `Dog` 的所有属性和方法

2. **implements 实现接口**

   ```typescript
   interface Singable {
       sing(): void
   }
   
   class Person implements Singable {
       sing() {
           console.log('八嘎')
       }
   }
   ```

   **解释**：

   - 通过 `implements` 关键字让 class 实现接口
   - 类继承接口意味着必须实现接口中的属性或者方法

### class 成员权限

成员权限分为：

1. **public**

   `public` 表示公有的、公开的，公有成员可以被任何地方访问，默认权限

   ```typescript
   class Animal {
       public move() {
           console.log('Moving along!')
       }
   }
   ```

   **解释**：

   - 在类属性或方法前面添加 `public` 关键字，来修饰该属性或方法是共有的
   - `public` 是默认可见性，所以可以直接省略

2. **protected**

   `protected` 表示受保护的，仅对其声明所在类和子类中可见，实例对象不可见

   ```typescript
   class Animal {
       protected move() { console.log('Moving along!') }
   }
   class Dog extends Animal {
       bark() {
           console.log('汪汪!')
           this.move()
       }
   }
   ```

   **解释**：

   - 在类属性或方法前面添加 `protected` 关键字，来修饰该属性或方法是受保护的
   - 在子类的方法内部可以通过 `this` 来访问父类中受保护的成员，但是实例对象无法访问 `protected` 修饰的属性或方法

3. **private**

   private 表示私有的，只有在**当前类**中可见，对实例对象以及子类都不可见

   ```typescript
   class Animal {
       private move() { console.log('Moving along!') }
       walk() {
           this.move()
       }
   }
   ```

   **解释**：

   - 在类属性或方法前面添加 `private` 关键字，表示该属性或方法是私有的
   - 私有属性或方法只在当前类中可见，对子类和实例对象均不可见

4. **readonly**

   readonly 表示只读，用来防止在构造函数之外对属性进行赋值

   ```typescript
   class Person {
       readonly age: number = 18 // 初始化，不是赋值
       constructor(age: number) {
           this.age = age
       }
   }
   ```

   **解释**：

   1. 使用 `readonly` 关键字修饰该属性是只读的，注意**只能修饰属性不能修饰方法**
   2. 注意：属性` age` 后面的类型注解(比如上述 `number`)。如果不加，则 `age` 的类型为 18(字面量类型)，这时构造函数内不能为 `age` 赋值了
   3. 接口或者 {} 标识的对象类型，也可以使用 `readonly`

## 类型兼容性

两种**类型系统**：

1. Structural Type System (结构化类型系统)
2. Nominal Type System (标明类型系统)

`TS` 采用的是结构化类型系统，也叫做 **duck typing (鸭子类型)**，类型检查关注的是值所具有的形状，也就是说，在结构类型系统中，如果两个对象具有相同的形状，则认为它们属于同一类型。

```typescript
class Point { x: number; y: number }
class Point2D { x: number; y: number }
const p: Point = new Point2D()
```

**解释**：

1. `Point` 和 `Point2D` 是两个名称不同的类，上述代码中 p 的类型被显示标注为 `Point` 类型，但是，它的值确实 `Point2D` 的实例，并且没有类型错误
2. `TS` 是结构化类型系统，只检查 `Point` 和 `Point2D` 的结构是否相同
3. 但是在 Norminal Type System 中(C#，Java等)，它们是不同的类，类型无法兼容

### 对象之间的兼容性

上述演示的对象兼容性并不严谨，准确一点：对于对象来说，**成员少的兼容成员多的**(**成员多的可以赋值给成员少的**)

```typescript
class Point { x: number; y: number }
class Point3D { x: number; y: number; z: number }
const p: Point = new Point3D()
```

**解释**：`Point3D` 的成员数量大于 `Point`，所以 `Point` 兼容 `Point3D`

### 接口之间的兼容性

接口之间的兼容性，类似于 `class`，并且 `class` 和 `interface` 之间也可以兼容。

```typescript
interface Point { x: number; y: number }
interface Point2D { x: number; y: number }
let p1: Point
let p2: Point2D = p1

interface Point3D { x: number; y: number; z: number }
let p3: Point3D
p2 = p3
```

```typescript
class Point3D { x: number; y: number; z: number }
let p3: Point2D = new Point3D()
```

### 函数兼容性

函数之间的兼容性比较复杂，需要考虑几点：**参数个数、参数类型、返回值类型**

1. **参数个数**

   参数少的可以赋值给多的

   ```typescript
   type F1 = (a: number) => void
   type F2 = (a: number, b: number) => void
   // 记住要完整实现 f1 函数，否则会报错，这里为了简写(不是偷懒)就不写了
   let f1: F1
   let f2: F2 = f1
   ```

   ```typescript
   const arr = ['a', 'b', 'c']
   arr.forEach(() => {})
   arr.forEach((item) => {})
   ```

   **解释**：

   1. **参数少的可以赋值给参数多的**，所以 f1 可以赋值给 f2
   2. 数组 `forEach` 在该示例中类型为 `(value: string, index: number, array: string[]) => void`
   3. 在 `JS` 中省略用不到的函数参数非常常见，这样的使用促成了 `TS` 中函数类型之间的兼容性。并且因为回调函数是有类型的，所以，`TS` 会自动推导出参数 item、index、array 的类型

2. **参数类型**

   相同位置的参数类型要相同(原始类型)或兼容(对象类型)

   ```typescript
   type F1 = (a: number) => string
   type F2 = (a: number) => string
   let f1: F1
   let f2: F2 = f1
   ```

   解释：函数类型 `F2` 兼容函数类型 `F1`，因为 `F1` 和 `F2` 的第一个参数类型相同

   ```typescript
   interface Point2D { x: number; y: number }
   interface Point3D { x: number; y: number; z: number }
   type F2 = (p: Point2D) => void
   type F3 = (p: Point3D) => void
   let f2: F2
   let f3: F3 = f2
   // f2 = f3 // 错误
   ```

   **解释**：

   1. 注意，此处与前面讲到的接口兼容性冲突
   2. 技巧：讲对象拆开，每个属性都可以当成参数，从这个角度，参数少的可以赋值给参数多的

3. **返回值类型**

   只需关注返回值类型即可

   ```typescript
   type F5 = () => string
   type F6 = () => string
   let f5: F5
   let f6: F6 = f5
   ```

   ```
   type F7 = () => { name: string }
   type F8 = () => { name: string; age: number }
   let f7: F7
   let f8: F8
   f7 = f8
   ```

   解释：

   1. 如果返回值类型是原始类型，此时两个类型要相同，比如左侧 `F5` 和 `F6`
   2. 如果返回值类型是对象类型，此时成员多的可以赋值给成员少的，比如右侧类型 `F7` 和 `F8`

**一句话：对象成员少的可以赋值给成员多的，函数参数少的可以赋值给函数参数多的，返回参数多的可以赋值给返回参数少的**

## 交叉类型

**交叉类型(&)**：功能类似于接口继承(extends)，用于**组合多个类型为一个类型**(常用于对象类型)

```typescript
interface Person { name: string }
interface Contact { phone: string }
type PersonDetail = Person & Contact
let obj: PersonDetail = {
    name: 'xj',
    phone: '186...'
}
```

**解释：**使用交叉类型后，新的类型 `PersonDetail` 就同时具备了 `Person` 和 `Contact` 的所有属性类型，相当于：

```typescript
type PersonDetail = { name: string; phone: string  }
```

### 交叉类型(&)和接口继承(extends)的对比

- 相同点：都可以实现对象类型的组合

- 不同点：两种方式实现类型组合时，对于同名属性之间，处理冲突的方式不同

  ```typescript
  interface A {
      fn: (value: number) => string
  }
  interface B extends A {
      // fn: (value: string) => string // 报错
  }
  ```

  ```typescript
  interface A {
      fn: (value: number) => string
  }
  interface B {
      fn: (value: string) => string
  }
  type C = A & B
  ```

  以上代码，接口继承会报错(类型不兼容)；而交叉类型没有错误，可以理解为

  ```
  fn: (value: string | number) => string
  ```

## 泛型

**泛型**是可以在**保证类型安全**前提下，让函数等与多种类型一起工作，从而实现复用，常用于：**函数**、**接口**、**class** 中

TODO：创建一个 id 函数，传输什么数据就返回该数据本身(类型和值都相等)

```typescript
function id(value: number): number { return value }
```

**泛型**在**保证类型安全**(不丢失类型信息)的同时，可以让函数等与多种不同的类型一起工作，灵活可复用

### 创建泛型函数

```typescript
function id<Type>(value: Type): Type { return value }
```

**解释**：

1. 语法：在函数后面名称添加 `<>`，尖括号中添加类型变量，例如上述的 Type
2. `Type` 是一种特殊类型的变量，处理类型而不是值

### 调用泛型函数

```typescript
function id<Type>(value: Type): Type { return value }
const num = id<number>(10)
const str = id<string>('a')
```

**解释**：

1. 在函数名称后添加 `<>`，尖括号中指定具体的类型
2. 通过这种泛型方式做到了让 id 函数与多种不同类型一起工作，实现了复用的同时保证了类型安全

其实也可以**简化调用泛型函数**：

```typescript
let num = id(10) // 鼠标移动到 num，显示 let num: number，但是当鼠标放到 id 函数上，显示 function id<10>(value: 10): 10
let str = id('abc') // 鼠标移动到 str，显示 let str: string，但是当鼠标放到 id 函数上，显示 function id<"abc">(value: :"abc"): "abc"
```

TS 内部会采用**类型参数推断**的机制，来根据传入的实参自动推断出类型变量 `Type` 的类型

### 泛型约束

默认情况下，泛型函数的类型变量 `Type` 可以代表多个类型，这导致无法访问任何属性

比如，`id(‘a’)` 调用函数时获取参数长度：

```typescript
function id<Type>(value: Type): Type {
    // console.log(value.length) // 报错
    return value
}
```

**解释**：Type 可以代表任意类型，无法保证一定存在 length 属性，比如 number 类型就没有 length。

此时就需要为泛型**添加约束**来收缩类型(缩窄类型取值范围)

添加泛型约束有两种方式：

1. **指定更加具体的类型**

   ```typescript
   function id<Type>(value: Type[]): Type[] {
       console.log(value.length)
       return value
   }
   ```

   比如，将类型修改为 `Type[]` (Type 类型的数组)，这样 `value` 就存在 `length` 属性了

2. **添加约束**

   ```typescript
   interface ILength { length: number }
   function id<Type extends ILength>(value: Type): Type {
       console.log(value.length)
       return value
   }
   
   id(['a', 'b'])
   id('abc')
   id({ length: 10, name: 'xj' })
   ```

   创建接口 `ILength`，该接口提供 `length` 属性，并通过 `extends` 关键字使用该接口，为泛型(类型变量)添加约束

   **注意**：传输的实参(比如数组)只要有 `length` 属性即可，符合前面提到的接口类型兼容性

### 多个泛型约束

泛型的类型变量可以有多个，并且类型变量之间还可以约束(比如第二个类型变量受第一个类型变量约束)

```typescript
function getProp<Type, Key extends keyof Type>(obj: Type, key: Key) {
    return obj[key]
}
interface IPerson {
    name: string
    age: number
}
let person: IPerson = { name: 'jack', age: 18 }
getProp<IPerson, keyof IPerson>(person, 'name')
```

**解释**：

1. 添加了第二个变量 `Key`，两个变量之间使用 `,` 分隔
2. `keyof` 关键字接受一个对象类型，生成其键名称(可能是字符串或数字)的联合类型
3. 本示例中的 `keyof Type` 实际上获取的是` person` 对象所有键的联合类型，也就是 `‘name’ | ‘age’`
4. 类型变量 `Key` 受 `Type` 约束，可以理解为： `Key` 只能是 `Type` 所有键中的任意一个，或者说只能访问对象中存在的属性

### 泛型接口

**泛型接口**：接口也可以配合泛型来使用，以增加其灵活性，增强复用性

```typescript
interface IdFunc<Type> {
    id: (value: Type) => Type
    ids: () => Type[]
}
```

```typescript
let obj: IdFunc<number> = {
    id(value) { return value },
    ids() { return [1, 3, 5] }
}
```

**解释**：

1. 在接口名称的后面添加 `<类型变量>`，那么这个接口就变成了泛型接口
2. 使用泛型接口时，需要显式指定具体的类型(比如本示例中的 `IdFunc<number>`)
3. 此时，`id` 方法参数和返回值类型都为 `number`，`ids` 方法的返回值类型为 `number[]`

### 泛型类

**泛型类：**`class` 也可以配合泛型来使用

例如 `React` 的 `class` 组件的基类 `Component` 就是泛型类，不同的组件之间有不同的 `props` 和 `state`

```tsx
interface IState { count: number }
interface IProps { maxLength: number }
class InputCount extends React.Component<IProps, IState> {
    state: IState = {
        count: 0
    }
    render() {
        return <div>{this.props.maxLength}</div>
    }
}
```

**解释**：`React.Component` 泛型类两个类型变量，分别指定 `props` 和 `state` 类型

```typescript
class GenericNumber<NumType> {
    defaultValue: NumType
    add: (x: NumType, y: NumType) => NumType
}
```

解释：

1. 类似于泛型接口，在 `class` 后面添加**<类型变量>**，这个类就变成了泛型类
2. 此处的 `add` 方法，采用箭头函数形式书写

```typescript
const myNum = new GenericNumber<number>()
myNum.defaultValue = 10
```

类似于泛型接口，在创建 `class` 实例时，在类名后面通过 `<类型>` 来指定明确的类型

## 泛型工具类型

**泛型工具类型**：TS 内置了一些常用的工具类型，来简化 TS 中的一些常见操作。

说明：它们都是基于泛型来实现的，并且是内置的，主要介绍以下几个：

1. `Partial<Type>`
2. `Readonly<Type>`
3. `Pick<Type, Key>`
4. `Record<Keys, Type>`

### Partial

`Partial<Type>` 用来构造(创建)一个类型，将 Type 的所有属性设置为可选

```typescript
interface Props {
    id: string
    children: number[]
}
type PartialProps = Partial<Props>
```

**解释**：构造出来的类新类型 `PartialProps` 结构和 `Props` 相同，但所有属性都变为可选

### Readonly

`Readonly<Type>` 用来构造一个类型，将 Type 的所有属性都设置为 readonly(只读)

```typescript
interface Props {
    id: string
    children: number[]
}
type ReadonlyProps = Readonly<Props>
```

**解释**：构造出来的类新类型 `ReadonlyProps` 结构和 `Props` 相同，但所有属性都变为只读

```typescript
let props: ReadonlyProps = { id: '1', children: [1, 2, 3] }
// props.id = '2' // 报错
```

当我们想重新给 id 属性赋值后就会出错

### Pick

`Pick<Type, Keys>` 从 Type 中选择一组属性来构造新类型

```typescript
interface Props {
    id: string
    title: string
    children: number[]
}
type PickProps = Pick<Props, 'id' | 'title'>
```

**解释**：

1. `Pick` 工具传入的两个参数分别为 **哪个接口、接口的哪些键**
2. 上述示例 `PickProps` 只有 `id` 和 `title` 两个成员，且类型与 `Props` 相同

### Record

`Record<Keys, Type>` 构造一个**对象类型**，属性键为 `Keys`，属性类型为 `Type`

```typescript
type RecordObj = Record<'a' | 'b' | 'c', string[]>
let obj: RecordObj = {
    a: ['1'],
    b: ['2'],
    c: ['3']
}
```

解释：

1. `Record` 工具类型有两个类型变量，分别为对象有哪些属性、对象属性的类型
2. 构造的对象类型 `RecordObj` 表示：这个对象有三个属性分别为 a、b、c，属性值都为 `string[]`

## 索引签名类型

绝大情况下，我们都可以在使用对象前就确定对象的结构，并为对象添加准确的类型

**使用场景**：无法确定对象中有哪些属性

```typescript
interface AnyObject {
    [key: string]: number
}
let obj: AnyObject = {
    a: 1,
    b: 2
}
```

**解释**：

1. 使用 `[key:string]` 来约束该接口中允许出现的属性名称。表示只要是 `string` 类型的属性名称，都可以出现在对象中
2. `key` 只是一个占位符，可以换成任意合法的变量名称
3. `JS` 中对象 `({ })` 的键是 `string` 类型的

在 JS 中数组是一类特殊的对象，特殊在数组的键(索引)是数值类型

```typescript
interface MyArray<T> {
    [n: number]: T
}
let arr: MyArray<number> = [1, 2, 3, 4, 5]
```

**解释**：

1. `MyArray` 接口模拟原生的数组接口，并使用 `[n: number]` 来作为索引签名类型
2. 该索引签名类型表示：只要是 `number` 类型的键(索引)都可以出现在数组中，或者说数组中可以有任意多个元素
3. 同时也符合数组索引是 `number` 类型这一前提

## 映射类型

**映射类型**：基于旧类型创建新类型(**对象类型**)，减少重复，提升开发效率

例如，类型 `PropsKeys` 有 x、y、z，另一类型 Type1 中也有 x、y、z，并且 `Type1` 中的 x、y、z 类型相同

```typescript
type PropKeys = 'x' | 'y' | 'z'
type Type1 = { x: number; y: number; z: number }
```

这样书写没错，但 x、y、z 重复书写了两次。像这种情况，就可以使用映射类型来进行简化

```typescript
type PropsKeys = 'x' | 'y' | 'z'
type Type2 = { [Key in PropKeys]: number }
```

**解释**：

1. 映射类型是基于索引签名类型的，所以语法类似
2. `Key in PropsKeys` 表示 `Key` 可以是 `PropKeys `联合类型中的任意一个，类似于 `for in(let k in obj)`
3. `Type1` 和 `Type2` 结构完全相同
4. **注意**：映射类型只能在类型别名中使用，不能在接口中使用

**映射类型**除了根据联合类型创建新类型外，还可以根据对象类型创建

```typescript
type Props = { a: number; b: string; c: boolean }
type Type3 = { [key in keyof Props]: number }
```

**解释**：

1. 先执行 `keyof Props` 获取对象类型 `Props` 中所有键的联合类型，即 `‘a’ | ‘b’ | ‘c’`
2. 然后，`Key in` ... 就表示 `Key` 可以是 `Props` 中所有件名称中的任意一个

### 实现泛型工具性

`Partical<Type>` 实现

```typescript
type Partial<T> = {
    [P in keyof T]?: T[P]
}
```

```
type Props = { a: number; b: string; c: boolean }
type PartialProps = Partial<Props>
```

## 查询类型

以上实例用到了 `T[P]` 语法，在 `TS` 中叫做索引**查询(访问)类型**

作用：用来查询属性的类型

```typescript
type Props = { a: number; b: string; c: boolean }
```

```typescript
type TypeA = Props['a'] // 鼠标放到 'a' 出，可见 type TypeA = number
```

**解释**：`Props[‘a’]` 表示查询类型 `Props` 种属性 `a` 对应的类型 `number`，所以 `TypeA` 的类型为 `number`

注意：`[]` 中的属性必须存在于被查询类型中，否则会报错

### 同时查询多个

```typescript
type Props = { a: number; b: string; c: boolean }
```

```typescript
type TypeA = Props['a' | 'b'] // string | number
```

**解释**：使用字符串字面量的联合类型，获取属性 a 和 b 对应的类型，结果为：`string | number`

```typescript
type TypeA = Props[keyof Props] // string | number | boolean
```

**解释**：使用 `keyof` 操作符获取 `Props` 中所有键的类型，结果如上述代码注释

# 类型声明文件

`TS` 代码最终会编译为 `JS` 代码发布给开发者使用。这样就失去了代码提示和类型保护机制，我们可以通过**类型声明文件**，用来为已存在的 `JS` 库提供类型信息

## TS 中的两种文件类型

TS 中有两种文件类型：

1. `.ts` 文件
   - 既包含类型信息又可以执行代码
   - 可以被编译为 `.js `文件，然后执行代码
   - **用途**：编写程序代码
2. `.d.ts`
   - 只包含类型信息的类型声明文件
   - 不会生成 `.js` 文件，仅用于提供类型信息
   - **用途**：为 `JS` 提供类型信息

**总结**： `.ts` 是 `implementation`(代码实现文件)；`.d.ts` 是 `declaration`(类型声明文件)

如果要为 `JS` 库提供类型信息，要使用 `.d.ts` 文件

## 类型声明文件的使用

使用已有的类型声明文件：

1. **内置类型声明文件**

   `TS` 为 J`S` 运行时所有的标准化内置 API 都提供了声明文件

   比如，在使用数组时，数组的所有方法都有相应的代码提示以及类型信息

   ```typescript
   (method) Array<number>.forEach(callbackfn: (value: number, index: number, array: number[]) => void, thisArg?: any): void
   ```

2. **第三方库的类型声明文件**

   (不知道为啥这些我都没找到，反正记上再说)

   第三方库的类型声明文件有两种存在形式：库自带类型声明文件、`DefinitelyTyped` 提供

   - 库自带类型声明文件、例如 `axios` 根目录下的 `index.ts`

     这种情况下，正常导入该库，`TS` 会自动加载自己的类型声明文件，以提供该库的类型声明

   - 由 `DefinitelyTyped` 提供

     `DefinitelyTyped` 是一个 `github` 仓库，用来提供高质量 `TypeScript` 类型声明

     可以通过 `npm/yarn` 来下载该仓库提供的 TS 类型声明包，这些包的名称格式为: **@types/***，例如：@types/react、@types/lodash 等

     **说明**：在实际开发中，如果使用的第三方库没有自带的声明文件，VSCode 也会给出提示，当安装 **@types/*** 类型声明包后，TS 也会自动加载该类型声明包，以提供该库的类型声明

## 创建自己的类型声明文件

**操作步骤：**

      1. 创建 `index.d.ts` 文件
      2. 创建需要共享的类型，并使用 `export` 导出(TS 中的类型(`interface` 等) 也可以使用 `import/export` 实现模块化)
      3. 在需要使用共享类型的  `.ts` 文件中，只需要 `import` 导入所需内容即可

   ```typescript
// index.d.ts
type Props = { x: number; y: number }
export { Props }
   ```

   ```typescript
// test.ts
// 注意此文件不要使用 index.ts 名，不然会产生错误
import { Props } from './index' // 不能写 index.d.ts，不然会报错
let p2: Props = {
    x: 10,
    y: 22
}
   ```

## 项目中使用

为已有 `JS` 提供类型声明：

说明：`TS` 项目中也可以使用 `JS` 文件；再导入 `JS` 文件时，`TS` 会自动加载于 `.js` 同名的 `.d.ts` 文件，以提供类型声明

`declare` 关键字：用于类型声明，为其他地方(比如, `.js` 文件)已存在的变量声明类型，而不是创建一个新的变量

1. 对于 `type`、`interface` 等这些明确就是 `TS` 类型的(只能在 `TS` 中使用)，可以省略 `declare` 关键字
2. 对于 `let`、`function` 等具有双重含义(在 `JS`、`TS` 中都能用)，应当使用 `declare` 关键字，明确指定此处用于类型声明

在 `test.js` 文件所在目录中，声明与之同名的 `test.d.ts`，如下图代码所示：

![](https://plumbiu.github.io/blogImg/QQ截图20230115124439.png)

这样，在 `index.ts` 中便可以使用 `test.js` 导出的变量和方法，并且带有类型声明

![](https://plumbiu.github.io/blogImg/QQ截图20230115124838.png)

---
title: 类型化数组
date: 2024-10-31
desc: 1
---

类型化数组是一种类似数组的对象，但是跟我们常说的“伪数组”不同，它的主要作用是提供了一种在内存缓存中访问二进制数据的机制。JavaScript 引入它主要是为了操作一些音视频以及 webgl 的原始数据。

类型化数组与普通数组类似，但是类型化数组并不包括在数组里，体现在类型化数组调用 `Array.isArray` 会返回 `false`，另外，类型化数组不支持 `push` 和 `pop` 等方法

JavaScript 将类型化数组拆分为**缓冲**和**视图**两部分：

- 缓冲：表示数据块的对象，没有格式可言，也不提供访问其内容的机制
- 视图：缓冲不提供访问机制，所以需要用到视图，视图提供了上下文，即**数据类型、起始偏移量和元素数量**

# 缓冲

缓冲有两种类型：[`ArrayBuffer`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 和 [`SharedArrayBuffer`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)，它们都是内存块的低级表示

缓冲支持的操作：

- 分配：创建缓冲会分配一个新的内存块，并初始化为 0
- 复制：使用 [`slice`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/slice) 方法，可以高效地复制缓冲区的一部分数据
- 转移(**Baseline 2024**)：使用 [`transfer`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/transfer) 和 [`transferToFixedLength`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/transferToFixedLength) 方法，可以将内存块的所有权转移到一个新的缓冲对象，可以在不同执行上下文间转换数据。但是 `SharedArrayBuffer` 不能被转移，因为已被所有执行上下文共享
- 调整大小(**Baseline 2024**)：：使用 [`resize`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/resize) 方法，可以调整内存块的大小（不能超过 [`maxByteLength`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/maxByteLength)限制），大小只能增长，不能缩小

**另：`ArrayBuffer` 与 `SharedArrayBuffer` 之间的区别：**

`ArrayBuffer` 同一时刻只能属于单个执行上下文，如果将 `ArrayBuffer` 传递给另一个执行上下文，那么它将会被**转移**，原本的 `ArrayBuffer` 将不可用。而 `SharedArrayBuffer` 传递给另一个上下文不会被转移，因此可以被多个执行上下文同时访问，多线程访问避免竞争，可以使用 [`Atomics`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Atomics) 方法

# 视图

目前有两种视图：**类型化数组视图**和 [`DataView`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DataView)。类型化数组提供了[实用方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray#%E5%AE%9E%E4%BE%8B%E6%96%B9%E6%B3%95)，而 DataView 提供的操作更底层，

两种视图都会使 [`ArrayBuffer.isView`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView) 方法返回 `true`，都具备以下属性：

- `buffer`：视图所引用的低层缓冲
- `byteOffset`：视图相对于换成冲起始位置偏移量（以字节为单位）
- `byteLength`：视图长度（以字节为单位）

两者的构造函数还接受 `length` 作为**数量**，而不是字节长度，两种试图都会使 [`ArrayBuffer.isView`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView)，都具备以下属性：

- `buffer`：视图所引用的底层缓冲
- `byteOffset`：视图相对于缓冲起始位置的偏移量（单位字节）
- `byteLength`：使徒的长度（单位字节）

## 类型化数组视图

除了常见的 `Int8`、`Uint32` 等，还有一种特殊的类型化试图，如 [`Uint8ClampedArray`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray)，它会将值钳制（clamp）到 0 到 255 之间，这在 [Canvas 数据处理](https://developer.mozilla.org/zh-CN/docs/Web/API/ImageData)等场景中很有用。

| 值范围                                                                                                                  | 字节大小                                           | 描述 | Web IDL 类型                                                | 等价的 C 类型         |                                 |
| ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---- | ----------------------------------------------------------- | --------------------- | ------------------------------- |
| [Int8Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Int8Array)                 | -128 到 127                                        | 1    | 8 位有符号整型（补码）                                      | `byte`                | `int8_t`                        |
| [Uint8Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)               | 0 到 255                                           | 1    | 8 位无符号整型                                              | `octet`               | `uint8_t`                       |
| [Uint8ClampedArray](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray) | 0 到 255                                           | 1    | 8 位无符号整型（一定在 0 到 255 之间）                      | `octet`               | `uint8_t`                       |
| [Int16Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Int16Array)               | -32768 到 32767                                    | 2    | 16 位有符号整型（补码）                                     | `short`               | `int16_t`                       |
| [Uint16Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array)             | 0 到 65535                                         | 2    | 16 位无符号整型                                             | `unsigned short`      | `uint16_t`                      |
| [Int32Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Int32Array)               | -2147483648 到 2147483647                          | 4    | 32 位有符号整型（补码）                                     | `long`                | `int32_t`                       |
| [Uint32Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array)             | 0 到 4294967295                                    | 4    | 32 位无符号整型                                             | `unsigned long`       | `uint32_t`                      |
| [Float32Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Float32Array)           | `-3.4E38` 到 `3.4E38` 并且 `1.2E-38` 是最小的正数  | 4    | 32 位 IEEE 浮点数（7 位有效数字，例如 `1.234567`）          | `unrestricted float`  | `float`                         |
| [Float64Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Float64Array)           | `-1.8E308` 到 `1.8E308` 并且 `5E-324` 是最小的正数 | 8    | 64 位 IEEE 浮点数（16 位有效数字，例如 `1.23456789012345`） | `unrestricted double` | `double`                        |
| [BigInt64Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt64Array)         | -2^63 到 2^63 - 1                                  | 8    | 64 位有符号整型（补码）                                     | `bigint`              | `int64_t (signed long long)`    |
| [BigUint64Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigUint64Array)       | 0 到 2^64 - 1                                      | 8    | 64 位无符号整型                                             | `bigint`              | `uint64_t (unsigned long long)` |

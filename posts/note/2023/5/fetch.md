---
title: fetch API
date: 2023-05-10
---

# fetch 基础知识

在以前的开发中，向服务端请求数据是非常繁琐的事情

我们可以通过 `Ajax` 向服务器请求数据，而 `Ajax` 本质是使用 `XMLHttpRequest` 对象实现的

```javascript
// 1.创建一个 xhr 对象
let xhr = new XMLHttpRequest()
// 2.设置请求方式和请求地址
xhr.open('get', 'http://xxx')
// 3.发送请求
xhr.send()
// 4.监听 load 事件获取响应结果
xhr.addEventListener('load', () => {
  console.log(JSON.parse(xhr.response))
})
```

也可以使用 `axios` 来实现，但是底层仍然是基于 `XMLHttpRequest` 对象实现的，本质不变，只是进行了 `promise` 封装

## 什么是 fetch

`fetch` 称之为下一代 `Ajax` 技术，采用 `promise` 方式处理数据

-   API 语法更加简洁
-   采用模块化设计，API 分散于多个对象中(如：Resposne 对象、Request 对象、Header 对象)
-   通过数据流(Stream 对象)处理数据，可以分块读取，有利于提高网站心梗

## Response 对象

fetch 请求成功以后，得到的是一个 [Response](https://developer.mozilla.org/zh-CN/docs/Web/API/Response) 对象，它是对 HTTP 响应

```javascript
const res = await fetch(url)
console.log(res)
```

**常见的属性：**

| 属性           | 含义                                                 |
| -------------- | ---------------------------------------------------- |
| res.ok         | 返回一个布尔值，表示请求是否成功                     |
| res.status     | 返回一个数字，表示 HTTP 回应的状态码                 |
| res.statusText | 返回状态的文本信息(例如：请求成功之后，服务器返回ok) |
| res.url        | 返回请求的 url                                       |

**示例：**

```javascript
fetch('https://dummyjson.com/products').then(res => {
  console.log(res.ok)
  console.log(res.status)
  console.log(res.statusText)
  console.log(res.url)
})
```

**常见方法：**

| 方法              | 含义                                     |
| ----------------- | ---------------------------------------- |
| **res.json()**    | 得到 JSON 对象                           |
| res.text()        | 得到文本字符串(服务端发送过来的是字符串) |
| res.blob()        | 得到二进制 Blob 对象                     |
| res.formData()    | 得到 FormData 表单对象                   |
| res.arrayBuffer() | 得到二进制 ArrayBuffer 对象              |

# 发送 get 请求

如果 `fetch()` 只接收了一个 url字符串参数，表示默认的 get 请求

```javascript
fetch('https://dummyjson.com/products').then(res => {
  console.log('res', res)
}).catch(err => {
  console.log('err', err)
})
```

控制台显示：`res` 是一个 `Response` 对象

![](https://plumbiu.github.io/blogImg/QQ截图20230510135919.png)

但是 `Response` 对象并不是我们需要的数据，此时需要使用 `res.json` 方法

>   `res.json()` 是一个异步操作，表示取出所有的内容，将其转换成 JSON 对象

```javascript
fetch('https://dummyjson.com/products').then(res => res.json()).then(data => {
	console.log(data)
}).catch(err => {
  console.log('err', err)
})
```

控制台显示：

![](https://plumbiu.github.io/blogImg/QQ截图20230510140312.png)

>   `.catch` 会捕获错误

## 携带参数

1.   可以通过地址栏拼接查询参数

```
http://xxx?name=value&age=value
```

示例：

```javascript
fetch('https://dummyjson.com/products?limit=10').then(res => res.json()).then(data => {
  console.log(data)
}).catch(err => {
  console.log('err', err)
})
```

# 发送 post 请求

post、put、patch 用法类似，这里只讲解 post 用法

## fetch 配置参数

fetch 第一个参数为 `url`，也可以接收第二个参数作为配置对象，语法如下：

```javascript
fetch(url, {
  method: '请求方式',
  headers: {
    'Content-Type': '数据格式'
  },
  body: '请求体数据'
})
```

## json 格式

json 格式的请求有以下几点注意

1.   数据格式 `Content-Type` 为 `application/json`
2.   `body` 数据需要使用 `JSON.stringify` 转换成 `json` 对象

```javascript
fetch('https://dummyjson.com/products/add', {
  method: 'post',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'hello'
  })
}).then(res => res.json()).then(data => {
  console.log(data)
})
```

## x-www-form-urlencoded 格式

x-www-form-urlencoded 格式的请求有以下几点注意：

1.   数据格式 `Content-Type` 为 `application/x-www-form-urlencoded;charset=UTF-8`，其中包含了语言集为 `utf-8`
2.   `body` 为路由查询参数格式

```javascript
fetch(url, {
  method: 'post',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  },
  body: 'foo=bar&baz=42'
})
```

## formData 格式

### 什么是 formData

formData 提供了一种表示表单数据的键值对 `key-value` 的方式，我们可以使用 `FormData()` 构造函数创建

```javascript
const formData = new FormData(form)
```

>   form 表示 `<form>` 表单元素，**直接打印 `formData` 不会展示任何数据**，但是我们可以使用 `entries` 方法获取 `key/value` 值

```html
<form id="myForm" name="myForm">
  <div>
    <label for="username">Enter name:</label>
    <input value="xj" type="text" id="username" name="username">
  </div>
  <div>
    <label for="useracc">Enter account number:</label>
    <input value="3434909403" type="text" id="useracc" name="useracc">
  </div>
  <div>
    <label for="userfile">Upload file:</label>
    <input value="写真集.rar" type="file" id="userfile" name="userfile">
  </div>
  <input type="submit" value="Submit!">
</form>
<script>
  const form = document.getElementById('myForm')
  const formData = new FormData(form)
  for(let [key, value] of formData.entries()) {
    console.log(`${key} - ${value}`)
  }
</script>
```

1.   获取数据

获取数据有多种方式

-   `get()`：获取指定 key 值的第一个数据

```javascript
formData.get(key) // key 为获取值的键名
```

-   `getAll()`：获取指定 key 的所有值

此方法返回一个数组，包括 key 中的所有值

```javascript
formData.getAll(key) // key 为获取值的键名
```

-   `keys()`：获取所有的键名

该方法返回一个迭代器，可以使用 `for of` 循环遍历

```
formData.keys()
```

-   `values()`：获取所有的键值

返回一个迭代器，可以使用 `for of` 循环遍历

```
formData.values()
```

-   `entries()`：获取所有的键名+键值

返回的是一个迭代器对象，我们可以使用 `for [key, value] of formData.entries()` 循环遍历数据

```javascript
formData.entries()
```

2.   增删数据

我们可以使用 `append`、`delete` 方法增加、删除数据：

```
formData.append(key, value)
formData.append(key, value, filename)
formData.delete(key)
```

-   `filename` 为可选参数，表示传给服务器的文件名称 (一个 [`USVString`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)), 当一个 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 或 [`File`](https://developer.mozilla.org/zh-CN/docs/Web/API/File) 被作为第二个参数的时候， [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 对象的默认文件名是 "blob"。 [`File`](https://developer.mozilla.org/zh-CN/docs/Web/API/File) 对象的默认文件名是该文件的名称
-   `delete` 方法会删除所有 `key` 值对应的数据

3.   `set()`

`set(key, value, filename?)` 方法与 `append(key, value, filename?)` 的异同：

-   当 `key` 值不存在时，两者都是创建一个键值对(key/value)
-   当 `key` 值存在时，`set()` 更新 `key` 值对应的数据，而 `append` 则是添加新的 `key/value` 数据

### fetch 发送 formData 格式

form-data 格式的请求有以下几点注意：

1.   数据格式 `Content-Type` 为 `multipart/form-data`
2.   `body` 为 `formData` 格式

首先介绍一下 `formData` 形式：

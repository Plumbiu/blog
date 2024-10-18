---
title: axios(未完待续~~)
date: 2023-03-23
---

# Axios 起步

Axios 是一个基于 `promise` 的网络请求库，可作用于 `nodejs` 和浏览器中

## 安装

选择你喜欢的包管理器

npm:

```bash
npm install axios
```

yarn:

```bash
yarn add axios
```

## 简单请求

>   注：`get` 和 `post` 请求均可以直接使用 `axios({ method: ‘get’ })` 方式执行，但是为了方便起见，最好使用 `axios.get` 和 `axios.post` 等方法

### GET 请求

```typescript
import axios from 'axios'
axios.get('/user?ID=12345')
    .then(res => {
    	// 处理成功情况
    	console.log(res)
	})
	.catch(err => {
    	// 处理错误情况
    	console.log(err)
	})
	.finally(() => {
    	// 最终总会执行的代码
	})
```

上述请求的参数，即 `?ID=12345` 也可以使用以下方式完成

```typescript
axios.get('/user', {
    params: { ID: 12345 }
}).then(res => {
    console.log(res)
}).catch(err => {
    console.log(err)
}).finally(() => {
    // 总会执行
})
```

当然也可以使用 `async/await` 方式请求

```typescript
async function getUser() {
    try {
        const res = await axios.get('/user?ID=12345')
        console.log(res)
    } catch(err) {
        console.log(err)
    }
}
```

### POST 请求

```typescript
axios.post('/user', {
    firstName: 'guo',
    lastName: 'xj'
}).then(res => {
    cosnole.log(res)
}).catch(err => {
    
})
```

## 并发请求

使用 `Promise.all()` 方法进行并发请求

```typescript
function getUserAccount() {
    return axios.get('/user/12345')
}
function getUserPermissions() {
    return axios.get('/user/12345/permissions')
}
Promise.all([getUserAccount(), getUserPermissions()])
	.then((results) => {
    	const [acct, perm] = result
	})
```

# Axios API

## Axios 实例

使用 `axios.create()` 自定义配置创建一个实例

`axios.create([config])`

```typescript
const instance = axios.create({
    baseURL: 'http://www.plumbiu.club:8001',
    timeout: 10 * 1000,
    headers: {
        "Content-Type": "application/json"
    }
})
```

## Axios 请求配置

这些配置选项中，只有 `url` 是必需的。如果没有指定 `method`，请求将默认使用 `GET` 方法

```typescript
{
  url: '/user',
  method: 'get', // 默认值
  baseURL: 'https://some-domain.com/api/',
  transformRequest: [function (data, headers) {
    return data;
  }],
  transformResponse: [function (data) {
    return data;
  }],
  headers: {'X-Requested-With': 'XMLHttpRequest'},
  params: {
    ID: 12345
  },
  paramsSerializer: function (params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },
  data: {
    firstName: 'Fred'
  },
  data: 'Country=Brasil&City=Belo Horizonte',
  timeout: 1000, // 默认值是 `0` (永不超时)
  withCredentials: false, // default
  adapter: function (config) {
    /* ... */
  },
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },
  responseType: 'json', // 默认值
  responseEncoding: 'utf8', // 默认值
  xsrfCookieName: 'XSRF-TOKEN', // 默认值
  xsrfHeaderName: 'X-XSRF-TOKEN', // 默认值
  onUploadProgress: function (progressEvent) {
  },
  onDownloadProgress: function (progressEvent) {
  },
  maxContentLength: 2000,
  maxBodyLength: 2000,
  validateStatus: function (status) {
    return status >= 200 && status < 300; // 默认值
  },
  maxRedirects: 5, // 默认值
  socketPath: null, // default
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  proxy: {
    protocol: 'https',
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },
  cancelToken: new CancelToken(function (cancel) {
  }),
  decompress: true // 默认值
}
```

完整示例：[请求配置 | Axios Docs (axios-http.com)](https://axios-http.com/zh/docs/req_config)

主要配置项：

| 配置项名称        | 类型                                                         | 解释                                                         |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| url               | string                                                       | 用于请求服务器 URL，通常是 `baseURL` 的后缀                  |
| method            | string                                                       | 请求的方法                                                   |
| baseURL           | string                                                       | 完整请求路径的前缀，将会自动加在 `baseURL` 前，除非 `baseURL` 是一个绝对 URL |
| transformRequest  | function(data, header) { return data }                       | 对发送的 data 进行任意的转换处理                             |
| transformResponse | function(data) { return data }                               | 对接收的 data 进行任意转换处理                               |
| headers           | { ‘X-Requested-With’: ‘XMLHttpRequest’ }                     | 自定义请求头                                                 |
| params            | 对象，例如： { ID: 12345 }                                   | 与请求一起发送的 URL 参数                                    |
| data              | string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams；浏览器专属: FormData, File, Blob ；Node 专属: Stream, Buffer | 作为请求体被发送的数据，仅适用 `PUT、POST、DELETE、PATCH` 请求方法 |
| data              | 'Country=Brasil&City=Belo Horizonte'                         | 发送请求体数据的可选语法，只适用于 `POST`，只有 value 会被发送，key 不会(相当于一个 string) |
| timeout           | number                                                       | 请求超时的毫秒数，如果请求事件大于规定值，则请求终端         |
| responseType      | string，默认值为 `json`                                      | 浏览器相应的数据类型                                         |
| validateStatus    | function(status) { return status >= 200 && status < 300 }    | 定义了给定的 HTTP状态码是 resolve 还是 reject。如果 `validateStatus` 返回为 true 则 promise 将会 resolved，否则 rejected |
| proxy             |                                                              | 定义了代理服务器的主机名，端口，协议                         |

## 响应结构

```typescript
{
  data: {},
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
  request: {}
}
```

主要配置项：

| 配置项名称 | 类型   | 解释                                                         |
| ---------- | ------ | ------------------------------------------------------------ |
| data       | {}     | 服务器提供的响应数据                                         |
| status     | number | 服务器相应的 HTTP 状态码                                     |
| status     | string | 服务器相应的 HTTP 状态信息                                   |
| headers    | {}     | 服务器的响应头，所有的 header 名称都是小写，而且可以使用方括号语法访问，例如: `response.headers[‘content-type’]` |
| config     | {}     | `axios` 请求的配置信息                                       |

## 拦截器

在请求发送、响应接收之前拦截它们，并处理一些数据

```typescript
// 添加请求拦截器
axios.interceptors.request.use(
    (config) => {
    	// 在请求之前做些什么
    	return config
	},
	(err) => {
        // 对请求错误做些什么
        return Promise.reject(err)
    }
)
// 添加响应拦截器
axios.interceptors.response.use(
    (response) => {
    	// 2xx 范围内的状态码都会触发该函数
        // 对相应数据做点什么
        return response
	},
    (err) => {
        // 超出 2xx 范围的状态码都会触发该函数
        // 对响应错误做点什么
        return Promise.reject(error)
    }
)
```

如果要移除拦截器，可以这样

```typescript
const myInterceptor = axios.interceptors.request.use(() => { /* ... */ })
axios.interceptors.request.eject(myInterceptor)
```

可以给自定义的 axios 实例添加拦截器

```typescript
const instance = axios.create()
instance.interceptors.request.use(() => { /*  */ })
```

## 错误处理

```typescript
axios.get('/user')
	.then((error) => {
    	if(error.response) {
            // 请求成功发出且服务器也相应了状态码，但是状态码超出了 2xx 的范围
            const { data, status, headers } = error.response
        } else if(err.request) {
            // 请求已经成功发起，但没有收到响应
            // error.request 在浏览器中是 XMLHttpRequest 的实例
            // 在 node.js 中是 http.ClientRequest 的实例
            console.log(error.request)
        } else {
            // 发送请求时出了点问题
            console.log('Error', error.message)
        }
    console.log(error.config)
	}
)
```

当然我们也可以使用 `validateStatus` 配置选项，自定义抛出错误的 HTTP status

```typescript
axios.get('/user', {
    validateStatus: (status) => {
        reutrn status < 500 // 处理状态码小于 500 的情况
    }
})
```

通过 `toJSON` 可以获取更多 HTTP 错误的信息

```typescript
axios.get('/user')
	.catch((err) => {
    	console.log(err.toJSON())
	})
```

## 取消请求

CanelToken 方法已经飞起，这里只介绍 `AbourtController`

>   version >= 0.22.0，Axios 支持以 fetch API —— [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) 取消请求

```typescript
const controller = new AbortController()
axios.get('/foo/bar', {
    signal: controller.signal
}).then((response) => {
    // ...
})
// 取消请求
controller.abort()
```

# Axios 的二次封装

敬请期待
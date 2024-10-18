---
title: React 全家桶(持续更新~~)
date: 2022-12-30
---

# 1. RTK 基本使用

> text

## 1.1 Slice 切片

**步骤:**

1. 引入 `createSlice`

   ```javascript
   import { createSlice } from '@reduxjs/toolkit'
   ```

2. 创建 `slice 对象`

   ```javascript
   const xxxSlice = createSlice({
     /**/
   })
   ```

3. 配置对象参数

   ```javascript
   const xxxSlice = createSlice({
     name: '',
     initialState: {},
     reducers: {
       setName(state, action) {},
       setAddress(state, action) {},
     },
   })
   ```

   | 属性名       | 值类型   | 作用             |
   | ------------ | -------- | ---------------- |
   | name         | String   | 指定唯一标识     |
   | initialState | any      | 设置切片的初始值 |
   | reducers     | Function | 设置切片的方法   |

4. 导出切片和对应的方法

   ```javascript
   export const { setName, setAddress } = xxxSlice.actions
   export const { reducer: xxxReducer } = xxxSlice
   ```

5. 例子:

   ```javascript
   // src/store/schoolSlice.js
   import { createSlice } from '@reduxjs/toolkit'

   const schoolSlice = createSlice({
     name: 'school',
     initialState: {
       name: 'hdu',
       address: '白杨街道',
     },
     reducers: {
       setName(state, action) {
         state.name = action.payload
       },
     },
   })
   export const { setName, setAddress } = schoolSlice.actions
   export const { reducer: schoolReducer } = schoolSlice
   ```

## 1.2 配置以及使用切片

**步骤:**

1. 引入 `configureStore`

   ```javascript
   import { configureStore } from '@reduxjs/toolkit'
   ```

2. 引入切片

   ```javascript
   import { xxxReducer } from './xxxSlice'
   ```

3. 配置对象参数

   ```javascript
   const store = configureStore({
     reducer: {
       xxx: xxxReducer,
     },
   })
   ```

   | 属性名  | 类型     | 作用             |
   | ------- | -------- | ---------------- |
   | reducer | 对象     | 指定存储的切片   |
   | xxx     | 切片对象 | 为切片对象起名字 |

4. 导出 store

   ```javascript
   export default store
   ```

5. 最终效果

   ```javascript
   import { configureStore } from '@reduxjs/toolkit'
   import { schoolReducer } from './schoolSlice'

   const store = configureStore({
     reducer: {
       school: schoolReducer,
     },
   })
   export default store
   ```

6. `main.jsx` 使用切片

   **6.1** 引入 `store` 和 `Provider` 标签

   ```javascript
   import { Provider } from 'react-redux'
   import store from './store/index'
   ```

   **6.2** 将 `Provider` 标签作为 `APP` 的父标签，并指定 store

   ```jsx
   root.render(
     <Provider store={store}>
       <App />
     </Provider>,
   )
   ```

   **6.3** 实例

   ```jsx
   // src/main.jsx
   import ReactDOM from 'react-dom/client'
   import App from './App'
   import { Provider } from 'react-redux'
   import store from './store/index'
   const root = ReactDOM.createRoot(document.getElementById('root'))
   root.render(
     <Provider store={store}>
       <App />
     </Provider>,
   )
   ```

7. 组件中使用切片

   **7.1** 导入 `useDipatch、useSelector` 方法

   ```jsx
   import { useDispatch, useSelector } from 'react-redux'
   ```

   **7.2** 导入切片中的方法

   ```javascript
   import { setName as setSchoolName, setAddress } from './store/school'
   ```

   **7.3** 使用 `useSelector` 访问切片中的数据

   其中 `state.school` 中的 school 是 **步骤 3** 中指定的 xxx

   ```javascript
   const student = useSelector((state) => state.school)
   ```

   **7.4** 使用 `useDispatch` 访问切片中的方法

   ```javascript
   const dispatch = useDispatch()
   const setNameHandler = () => {
     dispatch(setSchoolName('杭腚'))
     // 上下两个方法等效，其中 school 是在切片中指定的 name 属性
     dispatch({ type: 'school/setName', payload: '杭腚' })
   }
   ```

   `console.log(setSchoolName('杭腚'))` 返回的数据

   ![](C:\Users\LX\Desktop\QQ截图\QQ截图20221230152848.png)

   **7.5** 实例

   ```jsx
   import React from 'react'
   import { useDispatch, useSelector } from 'react-redux'
   import { setName as setSchoolName, setAddress } from './store/school'
   const App = () => {
     const school = useSelector((state) => state.school)
     const dispatch = useDispatch()
     return (
       <div>
         <p>
           {school.name} ---
           {school.address}
         </p>
         <button onClick={() => dispatch(setSchoolName('杭腚'))}>
           修改名字
         </button>
         <button onClick={() => dispatch(setAddress('地球'))}>修改地址</button>
       </div>
     )
   }
   export default App
   ```

## 1.3 代码总结

1. 创建 slice

   ```javascript
   // src/store/schoolSlice.js
   import { createSlice } from '@reduxjs/toolkit'

   const schoolSlice = createSlice({
     name: 'school',
     initialState: {
       name: 'hdu',
       address: '白杨街道',
     },
     reducers: {
       setName(state, action) {
         state.name = action.payload
       },
       setAddress(state, action) {
         state.name = action.payload
       },
     },
   })
   export const { setName, setAddress } = schoolSlice.actions
   export const { reducer: schoolReducer } = schoolSlice
   ```

2. store 入口文件

   ```javascript
   // src/store/index.js
   import { configureStore } from '@reduxjs/toolkit'
   import { stuReducer } from './stuSlice'
   import { schoolReducer } from './school'

   const store = configureStore({
     reducer: {
       school: schoolReducer,
     },
   })
   export default store
   ```

3. main.jsx 入口文件

   ```jsx
   // src/main.jsx
   import ReactDOM from 'react-dom/client'
   import App from './App'
   import { Provider } from 'react-redux'
   import store from './store/index'
   const root = ReactDOM.createRoot(document.getElementById('root'))
   root.render(
     <Provider store={store}>
       <App />
     </Provider>,
   )
   ```

4. 组件使用

   ```jsx
   // src/App.jsx
   import React from 'react'
   import { useDispatch, useSelector } from 'react-redux'
   import { setName as setSchoolName, setAddress } from './store/school'
   const App = () => {
     const school = useSelector((state) => state.school)
     const dispatch = useDispatch()
     return (
       <div>
         <p>
           {school.name} ---
           {school.address}
         </p>
         <button onClick={() => dispatch(setSchoolName('杭腚'))}>
           修改名字
         </button>
         <button onClick={() => dispatch(setAddress('地球'))}>修改地址</button>
       </div>
     )
   }
   export default App
   ```

# 2. RTKQ 基本使用

## 2.1 API 切片

**步骤:**

1. 导入 `createApi、fetchBaseQuery` 方法

   ```javascript
   import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
   ```

2. 创建 `API切片` 实例

   ```javascript
   const studentApi = createApi({
     reducerPath: 'studentApi',
     baseQuery: fetchBaseQuery({
       baseUrl: 'http://127.0.0.1:3033/api/',
     }),
     tagTypes: ['student', 'teacher'],
     endpoints(build) {
       return {
         getStudents: build.query({
           query() {
             return 'students'
           },
           transformResponse(baseQueryReturnValue) {
             return baseQueryReturnValue.data
           },
           providesTags: [{ type: 'student', id: 'LIST' }],
         }),
         addStudent: build.mutation({
           query(stu) {
             return {
               url: 'students',
               method: 'post',
               body: {
                 data: stu,
               },
             }
           },
           invalidatesTags: [{ type: 'student', id: 'LIST' }],
         }),
       }
     },
   })
   ```

3. **`createApi` 参数解析**

   | 参数名      | 类型     | 作用                                         |
   | ----------- | -------- | -------------------------------------------- |
   | reducerPath | string   | 指定唯一标识                                 |
   | baseQuery   | Function | 一般指定 fetchBaseQuery 方法，指定请求根路径 |
   | tagTypes    | String[] | 标签类型，标签用于方法之间的关联             |
   | endPoints   | Function | 指定请求的一些方法                           |

4. `endpoints` 解析

   - 发起 `get` 请求

     ```javascript
     getXxx: build.query({
       query() {
         return '子路径'
       },
     })
     ```

   - 发起 `post` 请求

     ```javascript
     addXxx: build.mutation({
       query() {
         return {
           url: '子路径',
           method: 'post',
           body: {
             data: 'xxx',
           },
         }
       },
     })
     ```

   - 发起 `put` 请求

     ```javascript
     updateXxx: build.mutation({
       query(id) {
         return {
           method: 'put',
           url: `子路径/${id}`,
         }
       },
     })
     ```

   - 参数

     | 参数名                                  | 作用                                                                                                                                                          |
     | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
     | transformResponse(baseQueryReturnValue) | 指定返回的结果，例如完整的相应结果是 `{status: ‘200’, data: [‘xj’, ‘sx’]}`，指定 `return baseQueryReturnValue.data` 后，返回的结果就是 `{data: [‘xj’, ‘sx’]}` |
     | keepUnusedDataFor                       | 指定缓存的时间，单位 s                                                                                                                                        |
     | providesTags                            | 指定某个方法具有的标签，当另一个方法使这个标签无效后，具有这个标签的方法就会触发                                                                              |
     | invalidatesTags                         | 使某个或多个标签无效                                                                                                                                          |

     如果想要更具体的指定某个数据，可以将 `providesTags` 、`invalidateTags ` 变为对象或者函数形式

     ```javascript
     getStudentsById: build.query({
       query(id) {
         return `students/${id}`
       },
       providesTags: (result, error, id) => [{ type: 'student', id: id }],
     })
     updateStudent: build.mutation({
       query(stu) {
         return {
           url: `students\${stu.id}`,
           method: 'put',
           body: {
             data: stu.attributes,
           },
         }
       },
       invalidatesTags: (result, error, stu) => [
         { type: 'student', id: stu.id },
         { type: 'student', id: 'LIST' },
       ],
     })
     ```

5. **导出方法**

   注意命名规范

   - get 请求: `useXxxQuery`
   - post、delete、put...请求: `useXxxMutation`

   ```javascript
   export const {
     useGetStudentsQuery,
     useGetStudentByIdQuery,
     useDelStudentMutation,
     useAddStudentMutation,
     useUpdateStudentMutation,
   } = studentApi
   export default studentApi
   ```

6. **总结代码**

   ```javascript
   import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'

   const studentApi = createApi({
     reducerPath: 'studentApi',
     baseQuery: fetchBaseQuery({
       baseUrl: 'http://127.0.0.1:3033/api/',
     }),
     tagTypes: ['student', 'teacher'],
     endpoints(build) {
       return {
         getStudents: build.query({
           query() {
             return 'students'
           },
           transformResponse(baseQueryReturnValue) {
             return baseQueryReturnValue.data
           },
           providesTags: [{ type: 'student', id: 'LIST' }],
         }),
         getStudentById: build.query({
           query(id) {
             console.log('id', id)
             return 'students/' + id
           },
           transformResponse(baseQueryReturnValue) {
             console.log('baseQueryReturnValue', baseQueryReturnValue)
             return baseQueryReturnValue.data
           },
           keepUnusedDataFor: 5,
           providesTags: (result, error, id) => [{ type: 'student', id: id }],
         }),
         delStudent: build.mutation({
           query(id) {
             return {
               // 如果发送的不是get请求，需要返回一个对象设置请求的信息
               url: `students/${id}`,
               method: 'delete',
             }
           },
         }),
         addStudent: build.mutation({
           query(stu) {
             return {
               url: 'students',
               method: 'post',
               body: {
                 data: stu,
               },
             }
           },
           invalidatesTags: [{ type: 'student', id: 'LIST' }],
         }),
         updateStudent: build.mutation({
           query(stu) {
             return {
               url: `students\${stu.id}`,
               method: 'put',
               body: {
                 data: stu.attributes,
               },
             }
           },
           invalidatesTags: (result, error, stu) => [
             { type: 'student', id: stu.id },
             { type: 'student', id: 'LIST' },
           ],
         }),
       }
     },
   })

   export const {
     useGetStudentsQuery,
     useGetStudentByIdQuery,
     useDelStudentMutation,
     useAddStudentMutation,
     useUpdateStudentMutation,
   } = studentApi
   export default studentApi
   ```

## 2.2 组件中使用

```javascript
const result = useGetStudentsQuery(null, {
  // useQuery 可以接受一个对象作为第二个参数，通过该对象可以对请求进行配置
  selectFromResult: (result) => {
    // 用来指定 useQuery 返回的结果
    if (result.data) {
      result.data = result.data.filter((item) => item.attributes.age < 18)
    }
    return result
  },
  pollingInterval: 0, // 设置轮询的间隔，单位毫秒，0为不轮询
  skip: false, // 设置是否跳过当前请求，默认false
  refetchOnMountOrArgChange: false, // 设置是否每次都重新加载数据，false正常使用缓存，true每次都重新新加载数据，数字设置缓存的时间
  refetchOnFocus: true, // 是否在重新获得焦点时加载数据，例如页面切换
  refetchOnReconnect: false, // 是否在重新连接后重新加载数据(网又有了)
})
```

# 3. RTK 和 RTKQ 进阶使用

关键词:

## 3.1 项目结构

可以参考一下目录结构构建

![](C:\Users\LX\Desktop\QQ截图\QQ截图20230103115407.png)

## 3.2 代码使用

### 3.2.1 api 使用

有时候，当网页涉及到权限问题的时候，会将 token 存储到头部信息的 `Authorizaiton` 交付给服务器验证，这时候需要使用 `prepareHeaders` 为 `endpoints` 的每个方法都指定响应头。

```javascript
prepareHeaders: (headers, { getState }) => {
  const token = getState().auth.token
  headers.set('Authorization', `Bearer ${token}`)
  return headers
}
```

其中 `getState` 可以获取 `name` 为 `auth` 的切片值，使用 `headers.set()` 方法即可指定头部信息。

**完整代码：**

其中可以直接写 `export const authApi = createApi({/* CODE HERE */})`

```javascript
// auth.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:3033/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  endpoints(build) {
    return {
      register: build.mutation({
        query(user) {
          return {
            url: 'auth/local/register',
            method: 'post',
            body: user, // username, password, email
          }
        },
      }),
      login: build.mutation({
        query(user) {
          console.log('user', user)
          return {
            url: 'auth/local',
            method: 'post',
            body: user, // identifier
          }
        },
      }),
    }
  },
})

export const { useRegisterMutation, useLoginMutation } = authApi
```

### 3.2.2 reducer 使用

`initialState` 也可以是是一个函数，更灵活地操作和指定返回值。

```javascript
initialState: () => {
  const token = localStorage.getItem('token')
  if (!token) {
    return /* CODE HERE */
  }
  return /* CODE HERE */
}
```

完整代码

```javascript
import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: () => {
    const token = localStorage.getItem('token')
    if (!token) {
      return {
        isLogged: false,
        token: '',
        user: null,
        expirationTime: 0,
      }
    }
    return {
      isLogged: true,
      token,
      user: JSON.parse(localStorage.getItem('user')),
      expirationTime: +localStorage.getItem('expirationTime'),
    }
  },
  reducers: {
    login(state, action) {
      state.isLogged = true
      state.token = action.payload.token
      state.user = action.payload.user
      // 获取当前时间戳
      const currentTime = Date.now()
      // 设置登录的有效时间
      const timeout = 1000 * 60 * 60 * 24 * 7 // 一周
      setTimeout.expirationTime = currentTime + timeout // 设置失效日期
      localStorage.setItem('token', state.token)
      localStorage.setItem('user', JSON.stringify(state.user))
      localStorage.setItem('expirationTime', state.expirationTime + '')
    },
    logout(state, action) {
      state.isLogged = false
      state.token = ''
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('expirationTime')
    },
  },
})

export const { login, logout } = authSlice.actions
```

### 3.2.3 store 入口文件使用

其实配置的项很少，主要有一些坑，之前一直没注意到：

例如

1. `[authApi.reducerPath]` 是一个表达式，在 `authApi` 文件中我们已经指定了 `reducerPath`，所以应该是唯一的。
2. `configureStore` 中的 `reducer` 属性，配置的属性后面都有 `.reducer` 后缀，这样不管是 `Api` 还是 `Slice` 都好记一些
3. `middleware` 中间件配置，`concat()` 函数可以用 `, `分隔多个中间件

```javascript
const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [studentApi.reducerPath]: studentApi.reducer,
    auth: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, studentApi.middleware),
})
```

**完整代码：**

```javascript
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { authApi } from './api/authApi'
import studentApi from './api/studentApi'
import { authSlice } from './reducer/authSlice'

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [studentApi.reducerPath]: studentApi.reducer,
    auth: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, studentApi.middleware),
})
setupListeners(store.dispatch)

export default store
```

### 3.2.4 组件中的使用

主要是忘记了，这里再写一点

1. 如果是 `Query Api`

   `Query Api` 钩子函数返回的是一个对象，其中 `data` 是服务器返回的值，`isSuccess` 是返回是否成功。

   ```jsx
   const { data, isSuccess } = useGetStudentsQuery()
   ```

2. 如果是 `Mutation Api`

   `Mutation Api` 钩子函数返回的是一个数组，其中数组第一项是请求 `Api` 函数，即发起请求的函数，第二项是一个数组，有很多属性，依照名字看很好理解，不多介绍。

   ```javascript
   const [regFn, { error: regError, isSuccess: regIsSuccess }] =
     useRegisterMutation()
   ```

   以 `regFn` 为例，其返回值是一个 `Promise` 对象，可以对服务器返回的数据进行操作。

   ```javascript
   loginFn({
     identifier: username,
     password: password,
   }).then((res) => {
     if (!res.error) {
       // 登录成功后，需要向系统中添加一个标识，标记用户的登录状态
       // 登录状态(布尔值，token(jwt))
       // 跳转页面到根目录
       dispatch(
         login({
           token: res.data.jwt,
           user: res.data.user,
         }),
       )
       navigate('/form')
     }
   })
   ```

# 4. React Router

## 4.1 V5

react router 可以将 url 地址和组件进行映射。当用户访问某个地址时，与其对应的组件会自动的挂载

安装: `npm i react-router-dom@5 -S`

### 4.1.1 HashRouter 和 BrowserRouter adsfadsfadsfasdfadfsafd

> HashRouter 会通过 url 地址中的 hash 值来对地址进行匹配
>
> 例如: http://127.0.0.1/#/about/me

HashRouter 对于 seo 不是很友好

> BrowserRouter 直接通过 url 地址进行组件的跳转
>
> 使用过程中和普通的 url 地址没有区别

BrowserRouter 问题在于当我们通过 \<Link> 标签跳转时，刷新页面会重新向服务器请求数据，这时候页面会返回 404，因为这次请求没有经过 react router。

解决方法：

1. 使用 HashRouter，服务器不会判断 hash 值
2. 修改服务器的配置(nginx)，将所有请求都转发到 index.html

### 4.1.2 具体使用

#### # **在 `main.jsx` 中使用**

1. 引入 react-router-dom 包

   ```javascript
   // 这里重命名是为了以后更换路由模式更加方便
   import { BrowerRouter as Router } from 'react-router-dom'
   ```

2. 将 \<App /> 组件包裹

   ```jsx
   <Router>
     <App />
   </Router>
   ```

3. 最终代码

   ```jsx
   // main.jsx
   import React from 'react'
   import ReactDOM from 'react-dom/client'
   import App from './App'
   import { BrowserRouter as Router } from 'react-router-dom'

   ReactDOM.createRoot(document.getElementById('root')).render(
     <React.StrictMode>
       <Router>
         <App />
       </Router>
     </React.StrictMode>,
   )
   ```

#### # **在 `App.jsx` 和 `其他组件` 中使用**

1. 引入 Route 标签和组件

   ```jsx
   import { Route } from 'react-router-dom'
   import About from './components/About'
   import Home from './components/home'
   import Menu from './components/Menu'
   import Student from './components/Student'
   ```

2. 配置路由

   配置路由有很多方式，依次介绍

   **2.1 component 方式:**

   ```jsx
   <Route exact path="/" component={Home} />
   <Route path="/about" component={About} />
   <Route path="/student/:id" component={Student} />
   ```

   | 属性      | 作用                                                                                                                      |
   | --------- | ------------------------------------------------------------------------------------------------------------------------- |
   | path      | 路由映射的 url 地址，其中上述例子中的 `:id` 为 uri 参数                                                                   |
   | component | 路由要挂载的组件                                                                                                          |
   | exact     | 路径是否完全匹配，React Router5 默认不是完全匹配，例如指定 `path=“/about”`，访问 `.../about/hello` 也可以看到被挂载的组件 |

   这时在 `Student组件` 中就可以访问到路由参数了

   ```jsx
   import React from 'react'
   const STU_DATA = [
     { id: 1, name: 'xj' },
     { id: 2, name: 'sx' },
     { id: 3, name: 'yq' },
     { id: 4, name: 'xm' },
   ]

   const Student = (props) => {
     console.log(props) // 路由参数
     const stu = STU_DATA.find((item) => item.id === +props.match.params.id)
     return (
       <div>
         {stu.id} --- {stu.name}
       </div>
     )
   }

   export default Student
   ```

   **2.2 render 方式**

   render 也可以用来指定要挂载的组件，不过需要一个回调函数作为参数，回调函数的返回值最终会被挂载

   **注意: 如果希望被挂载的组件访问到路由参数，一定要指定组件的路由属性**

   ```jsx
   <Route path="/student/:id" render={(routeProps) => {
           console.log(routeProps)
           return <Student {...routeProps} /> {/* 一定要这样传递参数，不然 Student 组件无法访问路由参数 */}
         }}
   />
   ```

   **2.3 children 方式**

   children 也可以用来指定被挂载的组件，用法有两种：

   1. 和 render 类似，传递回调函数，**注意：当 children 设置一个回调函数时组件无论路径是否匹配都会挂载，`所以不建议`**
   2. 可以传递组件

   ```jsx
   <Route path="/student/:id" children={(routeProps) => <Student {...routeProps} />} />
   <Route path="/student/:id" children={<Student />} />
   ```

   **2.4 直接写组件**

   ```jsx
   <Route path="student/:id">
     <Student />
   </Route>
   ```

   这种方式更加清晰，但需要注意的是，`Student组件`是无法直接打印 props 来获取路由参数的，但是我们可以通过钩子函数，这也是更加常用的情况

   ```jsx
   import React from 'react'
   import {
     useHistory,
     useLocation,
     useParams,
     useRouteMatch,
   } from 'react-router-dom'
   const STU_DATA = [
     { id: 1, name: 'xj' },
     { id: 2, name: 'sx' },
     { id: 3, name: 'yq' },
     { id: 4, name: 'xm' },
   ]
   const Student = (props) => {
     // 通过钩子函数获取路由参数
     const match = useRouteMatch()
     const location = useLocation()
     const history = useHistory()
     const params = useParams()
     const stu = STU_DATA.find((item) => item.id === +params.id)

     return (
       <div>
         {stu.id} --- {stu.name}
       </div>
     )
   }

   export default Student
   ```

3. **路由参数**

   | 参数名   | 作用           |
   | -------- | -------------- |
   | match    | 匹配的信息     |
   | location | 路由地址信息   |
   | history  | 控制页面的跳转 |

   **3.1 match 参数**

   | 参数名  | 类型    | 含义                                                                                          |
   | ------- | ------- | --------------------------------------------------------------------------------------------- |
   | isExact | Boolean | 是否与指定路径完全匹配                                                                        |
   | params  | 对象    | 路由传递的参数，例如 `student/:id` 中的 `id` 便是 `params` 的一个属性                         |
   | path    | String  | 指定路由的地址，例如 `<Route path=“/student/:id” />`，那么 path 就是 `“/student/:id”`         |
   | url     | String  | 浏览器实际访问的路由地址，例如访问 `http://127.0.0.1/student/3`，那么 url 就是 `“/student/3”` |

   **3.2 location 参数**

   | 参数名   | 类型         | 含义                                                                                                    |
   | -------- | ------------ | ------------------------------------------------------------------------------------------------------- |
   | hash     | 字符串       | hash 地址                                                                                               |
   | pathname | 字符串       | 与 match 的 path 参数一致                                                                               |
   | search   | 字符串       | 查询字符串，即?之后的参数                                                                               |
   | state    | 用户指定类型 | 使用 `history.push({path: ‘/student/2’, state: {msg: ‘沈昕姐姐，嘿嘿’}})`，手动跳转地址时，state 会显示 |

   **3.3 history 参数**

   | 参数名  | 类型     | 作用                               |
   | ------- | -------- | ---------------------------------- |
   | push    | Function | 跳转页面，带后退前进功能           |
   | replace | Function | 也是跳转页面，不过没有后退前进功能 |
   |         |          |                                    |

#### # Switch 标签

可以将 Route 统一放到 Switch 中，一个 Switch 中只会有一个路由显示

**注意：根标签要加上 exact，不然只显示 Home 组件了**

```jsx
<Switch>
  <Route exact path="/" component={Home} />
  <Route path="/about">
    <About />
  </Route>
  <Route path="/login">
    <Login />
  </Route>

  <Route path="/student/:id">
    <Student />
  </Route>
</Switch>
```

#### # Redirect

Redirect 用于重定向，例如未成功登录强制跳转到登录页面，登陆成功跳转到内容页面

```jsx
<Route path="/form">{isLogin ? <MyForm /> : <Redirect to={'/login'} />}</Route>
```

当然也可以指定 **哪个路由跳转到哪个路由**，例如下面指的是当访问路由地址为 /abc 时跳转到 /login，访问其他路由地址就不会跳转

```jsx
<Redirect from={'/abc'} to={'/login'} />
```

#### # 路由嵌套

在 App.jsx 中使用

```jsx
// App.jsx
import React from 'react'
import { Route } from 'react-router-dom'
import About from './components/About'
import Hello from './components/Hello'

const App = () => {
  return (
    <div>
      <Route path="/about">
        <About />
        <Route path="/about/hello">
          <Hello />
        </Route>
      </Route>
    </div>
  )
}

export default App
```

当然也可以直接在 About 组件中嵌套

```jsx
import React from 'react'
import { Redirect, Route, useRouteMatch } from 'react-router-dom'
import Hello from './Hello'

const About = (props) => {
  // 获取父路径
  const { path } = useRouteMatch()
  return (
    <div>
      <h2>关于我们</h2>
      <ul>
        <li>xj</li> <li>sx</li> <li>yq</li> <li>xm</li>
      </ul>
      {/* 子路由嵌套 */}
      <Route path={`${path}/hello`}>
        <Hello />
      </Route>
    </div>
  )
}

export default About
```

#### # 路径不匹配

如果用户随便输入了路径地址，此时要做一定的处理

```jsx
<Route path="*">路径匹配错误</Route>
```

### 4.1.3 总结

一般使用组件嵌套 + 钩子函数组合使用

```jsx
// main.jsx
import React from 'react'
import { Route } from 'react-router-dom'
import About from './components/About'
import Home from './components/home'
import Menu from './components/Menu'
import Student from './components/Student'

const App = () => {
  return (
    <div className="APP">
      <Menu />
      <Route path="/">
        <Home />
      </Route>
      <Route path="/about">
        <About />
      </Route>
      <Route path="/student/:id">
        <Student />
      </Route>
    </div>
  )
}

export default App
```

```jsx
// student.jsx
import React from 'react'
import {
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom'
const STU_DATA = [
  { id: 1, name: 'xj' },
  { id: 2, name: 'sx' },
  { id: 3, name: 'yq' },
  { id: 4, name: 'xm' },
]
const Student = () => {
  const match = useRouteMatch()
  const location = useLocation()
  const history = useHistory()
  const params = useParams()
  const stu = STU_DATA.find((item) => item.id === +params.id)
  return (
    <div>
      {stu.id} --- {stu.name}
    </div>
  )
}

export default Student
```

## 4.2 V6

### 4.2.1 具体使用

React Router 6 更改的特性有很多，例如:

1. `<Route />` 组件必须由 `<Routes />` 组件包裹
2. 指定被挂载的组件需要使用 JSX 形式，如 `element={<Xxx />}`
3. `path` 指定路径可以不用加 /
4. 子路由也不用加上父路由根路径

```jsx
// main.jsx
<Routes>
  <Route path="student/:id" element={<Student />}></Route>
  <Route path="about" element={<About />}>
    {/* Hello组件路由地址为: /about/hello */}
    <Route path="hello" element={<Hello />}></Route>
    {/* Abc组件路由地址为: /about/abc */}
    <Route path="abc" element={<Abc />}></Route>
  </Route>
</Routes>
```

组件中的使用，以 `About` 组件为例，只需要加入 `<Outlet />` 组件，即可在此区域显示子路由内容

Outlet 用来标识路由中的组件:

- 当嵌套路由中的路径匹配成功了，Outlet 则表示嵌套路由中的组件
- 当嵌套路由中的路径没有匹配成功，Outlet 就什么都不会显示

```jsx
import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
const About = () => {
  return (
    <div>
      <h2>这是About组件</h2>
      <Outlet />
    </div>
  )
}

export default About
```

当然也可以使用另一种方法

```jsx
// main.jsx
<Routes>
  <Route path="about" element={<About />}></Route>
</Routes>
```

About 组件：

```jsx
// component/About.jsx
import React from 'react'
import Hello from './Hello'
import { Routes, Route } from 'react-router-dom'
const About = () => {
  return (
    <div>
      {/* 通过子路由来对 Hello 进行映射， /about/hello  */}
      <Routes>
        <Route path="hello" element={<Hello />} />
      </Routes>
    </div>
  )
}

export default About
```

#### # Navigate 组件

`Navigate` 组件与 V5 版本的 `Redirect` 组件类似，用来指定重定向

`Navigate` 默认使用 `push` 跳转，但是可指定 `replace` 属性更换为 `replace` 跳转

```jsx
<Navigate to="student/1" replace />
```

#### # Link 与 NavLink 组件

Link 组件与 V5 版本一致，NavLink 在指定链接样式的时候，需要一个回调函数

回调函数中有一个 isActive 布尔值形参，代表链接是否激活

```jsx
<NavLink
  style={({ isActive }) => {
    return isActive ? { backgroundColor: 'red' } : null
  }}
  to="/home"
>
  主页
</NavLink>
```

# 5. NextJS

NextJS 是一个轻量级的 React 服务端渲染应用框架

## 5.1 NextJS 中的路由

### 5.1.1 NextJS 如何实现路由

> 相比于 React 中传统的路由，NextJS 实现路由的方式是通过文件夹目录结构实现

NextJS 会将**文件夹名**或者**文件名**当做路由的地址，其中 `index.jsx` 便是路由地址的入口文件名，如果想要创建子路由，那么可以在对应的路由新建文件，**文件名**代表子路由地址，也可以新建文件夹，在对应文件夹中新建 `index.jsx`，此时**文件夹名**代表子路由地址。![](F:\资料\博客图片\QQ截图20230103210626.png)

路由分为**静态路由**和**动态路由**，静态路由的实现很简单只需要新建文件就可以，动态路由则需要在文件夹名加入 `[]`。对于很多参数的路由，还可以使用 `[...xxx]` 的方式获取参数。

以上图为例解释对应的路由地址:

> about/index.jsx --> http://127.0.0.1:3000/about
>
> blog/[...slug].jsx --> http://127.0.0.1:3000/2022/02/02/...
>
> clients/index.jsx --> http://127.0.0.1:3000/clients
>
> clients/[id]/index.jsx --> http://127.0.0.1:3000/clients/2
>
> clients/[id]/[clientprojectid].jsx --> http://127.0.0.1:3000/clients/2/projectA
>
> portfolio/index.jsx --> http://127.0.0.1:3000/portfolio
>
> portfolio/list.jsx --> http://127.0.0.1:3000/portfolio/list
>
> portfolio/[projectid].jsx --> http://127.0.0.1:3000/portfolio/projectA

聪明的你可能已经发现，动态路由和静态路由可能会有冲突的地方，例如 `portfolio` 中的 `list.jsx` 和 `[projectid].jsx` 两个文件，当我访问 http://127.0.0.1:3000/portfolio/list，NextJS 会将 `list` 当做静态路由还是动态路由的参数？答案是静态路由，这一点 NextJS 处理的还是很好的

### 5.1.2 NextJS 获取动态路由参数

获取路由参数主要是动态路由，和 React 设计初衷一样，NextJS 也提供了获取路由的钩子函数：

1. 引入 `useRouter`

   ```javascript
   import { useRouter } from 'next/router'
   ```

2. 获取路由参数

   ```javascript
   const router = useRouter()
   console.log(router.query)
   ```

3. 完整实例

   ```jsx
   // pages/clients/[id]/[clientprojectid].jsx
   import { useRouter } from 'next/router'

   const SelectedClientProjectPage = () => {
     const router = useRouter()
     console.log(router.query)
     return (
       <div>
         <h1>The Project Page fro a Specific Project for a Selected Client</h1>
       </div>
     )
   }

   export default SelectedClientProjectPage
   ```

   如果访问 http://127.0.0.1:3000/clients/max/projectA，那么 `router.query` 便是 `{ id: 'max', clientprojectid: 'projectA' }`

4. 多个路由参数

   ```jsx
   // pages/blog/[...slug].jsx
   import { useRouter } from 'next/router'

   const BlogPostsPage = () => {
     const router = useRouter()
     console.log(router.query)
     return (
       <div>
         <h1>The Blog Posts</h1>
       </div>
     )
   }

   export default BlogPostsPage
   ```

   此时访问 http://127.0.0.1:3000/blog/2022/03/03，打印的便是 `{ slug: ['2022', '03', '03'] }`

### 5.1.3 路由跳转

可以通过 `Link 标签`以及 `router 对象` 中的 `push` 和 `replace` 方法进行路由地址的跳转，但是与 React 中的有所不同。

假设我们跳转的路由文件结构为 **/clients/[id]/[clientprojectid]**

**第一种: Link 标签形式**

与 React 相同方式，只是跳转地址的属性为 `href`

```jsx
<link href="/clients/max/projectA">跳转</link>
```

传入对象方式：

```jsx
<Link
  href={{
    pathname: 'clients/[id]/[clientprojectid]',
    query: { id: 'max', clientprojectid: 'projectA' },
  }}
>
  跳转
</Link>
```

**第二种: useRouter 钩子函数形式**

先导入 `useRouter` 方法以及创建实例对象

```jsx
import { userRouter } from 'next/router'
```

与 React 相同方式，直接写路由地址:

```javascript
router.push('/clients/max/projectA')
```

转入对象方式:

```javascript
router.push({
  pathname: 'clients/[id]/[clientprojectid]',
  query: { id: 'max', clientprojectid: 'projectA' },
})
```

## 5.2 页面数据预加载

浏览器访问网站典型的流程是，浏览器首先获取一个 HTML 页面，此页面并没有数据，然后 `useEffect` 函数调用 `fetch` 从服务器获取数据，然后使用这些数据设置组件 state，state 因为发生改变，react 使组件函数重新执行一遍，页面因此重新渲染，因此页面实际上有两个渲染周期。

而 `SEO` (search engine optimization 搜索引擎优化)依据的是第一个渲染周期的页面，此页面数据为空，为了避免这个问题，可以使得预渲染的页面，在第一个 render cycle 就已包含从数据库中获取的数据。

要使得预渲染的页面包含数据，NextJS 提供了两种形式的预渲染：

1. static site generation 静态生成 SSG
2. server-side rendering 服务端渲染 SSR

|              | CSR        | SSR              | SSG                      |
| ------------ | ---------- | ---------------- | ------------------------ |
| 运行端       | 浏览器     | 服务器           | 服务器                   |
| 静态文件     | 单页面     | 由服务器即时生成 | 多个页面                 |
| SEO          | 不适合     | 适合             | 适合                     |
| 静态文件 CDN | 适合       | 不适合           | 适合                     |
| 适用场景     | 中后台产品 | 信息展示型网站   | 内容较为固定的资讯类网站 |

### 5.2.1 getStaticProps

NextJS 提供了 `getStaticProps` 函数来实现在 Build 期间就能显示数据的方法。

使用步骤：

#### 静态路由

1. 书写逻辑

   可以在 `getStaticProps` 函数中写请求 API 的逻辑

   ```jsx
   export async function getStaticProps() {
     /* CODE HERE */
     const data = fetch('xxxx')
     if (!data) {
       return {
         redirect: {
           destination: '/no-data',
         },
       }
     }
     if (data.length === 0) {
       return {
         notFound: true,
       }
     }
     return {
       props: {
         products: data,
       },
       revaliate: 10,
     }
   }
   ```

2. **`getStaticProps` 返回值参数**

   | 参数名    | 类型   | 作用                                                                                                                                                                                                                                                                                                                                     |
   | --------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | redirect  | 对象   | 重定向，可以指定其中的 `destination` 属性，指定路由地址                                                                                                                                                                                                                                                                                  |
   | notFound  | 布尔值 | 设置为 true 时，会显示 404 页面，默认为 false                                                                                                                                                                                                                                                                                            |
   | props     | 对象   | 组件的 props 参数，用户可以指定从 API 中获取的数据                                                                                                                                                                                                                                                                                       |
   | revaliate | 数字   | `getStaticProps` 内部逻辑和静态页面重新执行、生成的时间，例如设置为 10，在 10s 内无论怎么刷新页面去请求某一个数据，也不会出发请求逻辑，10s 过后，如果有新数据，那么会重新生成静态页面。**当用户新添加数据时，如果不指定 `revaliate`，虽然页面会显示数据，但这个数据并不会预先生成，检查源代码就能看到，如果指定 revaliate 就可以显示了** |

3. **组件使用 `props`**

   ```jsx
   const HomePage = (props) => {
     console.log(props.data)
     return <div>{props.data}</div>
   }
   ```

   当然这样设置对于某些动态路由组件会报错，甚至会报错，此时需要设置另一个函数：`getStaticPaths`，这个以后再讲

4. **效果查看**

   如果执行的命令是 `npm run dev`，那么 `revaliate` 属性不会起作用，我们需要先执行 `npm run build` 再执行 `npm start`，查看效果

   npm run build 效果图，我们可以很清楚看到 Route 与 `SSG` 或者 `Static` 之间的对应关系![](F:\资料\博客图片\QQ截图20230105153341.png)

#### 动态路由

1. **动态路由获取参数**

   在 `getStaticProps` 中的 context 上下文获取动态路由参数

   ```jsx
   // [pid].jsx
   export async function getStaticProps(context) {
     const { params } = context
     const pid = params.pid
     return {
       props: {
         id: pid,
       },
     }
   }
   ```

   当然设置上述是不够的，还要写另一个函数 `getStaticPaths`

2. **书写 `getStaticPaths` 函数`**

   getStaticPaths 有很多种写法，要配合 `getStaticProps` 和 组件函数

   > fallback 配置项的作用：当用户传入的路径参数不在规定的范围内之后，NextJS 要给用户展示什么：
   >
   > 1. 如果 fallback 为 false，则会展示 404 页面
   > 2. 如果 fallback 为 true，那么服务器将会根据用户传递的路由参数(即使与 path 配置项的路由不匹配)，获取对应的数据，然后将这些数据传递给组件进行静态页面的生成(可以查看有个新建的页面)，最后将这个生成好的静态页面传递给客户端用户
   > 3. blocking 会一次性加载所有页面(路由)

   **2.1 第一种写法**

   在 `getStaticPaths` 函数的返回值中，指定**所有的**路由参数，**一般这样选择**。

   建议加上 fallback

   ```jsx
   // [pid].jsx
   export async function getStaticPaths() {
     return {
       paths: [
         { params: { pid: 'p1' } },
         { params: { pid: 'p2' } },
         { params: { pid: 'p3' } },
       ],
     }
   }
   ```

   **2.2 第二种写法**

   这样就访问 p1、p2、p3 也可以访问了

   ```jsx
   export async function getStaticPaths() {
     return {
       fallback: true,
     }
   }
   ```

   不过如果这样写，那么当用户访问不存在的地址，会直接报错，如果我们不希望这样，可以在 `getStaticProps` 中设置 `notFound: true`

   ```jsx
   export async function getStaticProps(context) {
     const { params } = context
     const productId = params.pid
     // 假设有个获取数据的方法
     const data = await getData()
     // 根据路由参数过滤数据
     const product = data.products.find((product) => product.id === productId)
     // 关键代码，如果路由参数不对，那么直接返回 404
     if (!product) {
       return {
         notFound: true,
       }
     }
     return {
       props: {
         loadedProduct: product,
       },
     }
   }
   ```

   同时指定组件函数，因为不太确定各个函数执行时机

   ```jsx
   const xxx = (props) => {
     const { loadedProduct } = props
     if (!loadedProduct) {
       return <p>loading....</p>
     }
     return <p>{loadedProduct}</p>
   }
   ```

   > **注意：第二种方法的数据处理方式也适合第一种方法**

   > **tips：fallback 为 false 的时候，不需要 notFound 属性，因为只有从 getStaticPaths 返回的路径才会被预渲染，当用户访问的路由参数没有在当前函数中返回时，是否显示 404，false 是显示，true 是不显示 。**

   > 1. `fallback: false`
   >    如果 `fallback` 是 `false`，那么任何路径都不会生成并且变成一个 404 页面。你可以在你仅有少量的路径去预渲染的时候这样做，这样的话在构建时都是静态页面。当并不经常添加新的页面的时候这样做很有用。但是当你需要然后新的时候的时候，你就需要重新构建。
   >
   > 2. 如果`fallback` 是`true`，那么`getStaticProps`的行为会有如下变化：
   >
   > - 由 `getStaticPaths` 获取的路径会在构建时调用 `getStaticProps` 方法渲染成 HTML 文件；
   > - 在构建时未生成的路径不会以 404 页面返回。相反，当请求不存在的页面路径时，Next.js 会渲染一个当前页面的 `回退`( `fallback`) 版本。注意，`回退`(`fallback`) 版本不会提供给像谷歌这样的爬虫程序，而是以阻塞模式呈现路径。
   > - 在后台，Next.js 会根据请求路经执行 `getStaticProps` 方法静态生成页面的 HTML 和 JSON。
   > - 当这些都完成之后，浏览器接收 JSON 数据根据对应的生成路径。这些数据会自动在页面渲染的时候被使用。从用户的角度来看，页面将从备用页面切换到完整页面。
   > - 在同时，Next.js 将路经添加到预渲染页面列表中。对同一路径的后续请求将渲染已经生成的页面，就像构建时预渲染的其他页面一样。
   >
   > 3. `fallback: true` 何时最有用？
   >    当你的应用有大量的依赖于数据（`depend on data`）的静态页面 `fallback: true` ，你想要预渲染所有的商品页面，但这样你的构建将花费很长时间。取而代之的是，你可以静态生成一个很小的页面集合，其余部分通过使用 `fallback: true` 生成。当有用户请求一个还没有生成的页面时，用户会看到页面中有一个加载指示器。很快的，`getStaticProps` 执行完成，页面会根据请求到的数据渲染。之后同样请求此页面的任何用户将会得到静态预渲染的页面。
   >    这确保了用户在保持快速构建和静态生成的好处的同时始终拥有最快的体验。
   >    `fallback: true` 并不会更新已经生成的页面，具体可查看增量静态再生（Incremental Static Regeneration）。
   >
   > 4. `fallback: 'blocking'`
   >    如果 `fallback` 是 `blocking`，`getStaticPaths`未返回的新路径将等待 HTML 完全生成，与 SSR 是完全相同的，然后被缓存下来以供将来的请求使用，因此每个路径只发生一次。

3. **代码示例**

   ```jsx
   import fs from 'fs/promises'
   import Link from 'next/link'
   import path from 'path'

   const index = (props) => {
     const { products } = props
     return (
       <ul>
         {products.map((product) => (
           <li>
             <Link href={`/${product.id}`} key={product.id}>
               {product.title}
             </Link>
           </li>
         ))}
       </ul>
     )
   }

   export async function getStaticProps() {
     console.log('(Re-)Generating...')
     const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json')
     const jsonData = await fs.readFile(filePath)
     const data = JSON.parse(jsonData)
     if (!data) {
       return {
         redirect: {
           destination: '/no-data',
         },
       }
     }
     if (data.products.length === 0) {
       return {
         notFound: true,
       }
     }
     return {
       props: {
         products: data.products,
       },
       revalidate: 10,
     }
   }

   export default index
   ```

### 5.2.2 getServerSideProps

`getServerSideProps` 只会在服务器并且只在服务器上运行

和 NodeJS 一样，可以从上下文中获取 `req` 和 `res` 对象，也可以像 `NextJS` 一样获取动态路由参数

```jsx
// [uid.jsx]
const UserIdPage = (props) => {
  return <h1>{props.id}</h1>
}

export const getServerSideProps = async (context) => {
  const { params, req, res } = context
  const userId = params.uid
  return {
    props: {
      id: 'userid-' + userId,
    },
  }
}

export default UserIdPage
```

当然，`getServerSideProps` 也可以和 `getStaticProps` 一样返回重定向或者 404 数据

```javascript
return {
  redirect: {
    destination: '/xx',
    permanent: false, // 只有这一次重定向，并不是永久重定向
  },
}
```

```javascript
return {
  notFound: true,
}
```

## 5.3 Head 标签与 Image 标签

### 5.3.1 Head

有时我们的网页有很多路由，如果要更换不同路由的网页标题，该如何做？

NextJS 为我们提供了 `Head 标签`，在 `Head 标签`内可以书写 `meta、title 等标签`。

**步骤：**

1. 导入 `Head 标签`

   ```javascript
   import Head from 'next/head'
   ```

2. 使用 `Head 标签`

   在组件函数中添加

   ```jsx
   const xxx = () => {
       return (
       	<Head>
           	<title>本页面标题为xxx</title>
           	<meta name="description" content='NextJS Events' />
         	</Head>
           <div>
           	<h1>xxx</h1>
           </div>
       )
   }
   ```

   如果想要加上整个网页通用的 `meta 标签`，可以在 `_app.jsx` 入口文件中添加，以下是完整代码：

   **注意：`_app.jsx` 中 `Head 标签`中的 `title 标签`优先级弱于路由级别的 `title 标签`，会被覆盖**

   ```jsx
   import '../styles/globals.css'
   import '../components/layout/layout'
   import Layout from '../components/layout/layout'
   import Head from 'next/head'
   const MyApp = ({ Component, pageProps }) => {
     return (
       <Layout>
         <Head>
           <title>Next Events</title>
           <meta name="description" content="NextJS Events" />
           <meta
             name="viewport"
             content="initial-scale=1.0, width=device-width"
           />
         </Head>
         <Component {...pageProps} />
       </Layout>
     )
   }

   export default MyApp
   ```

   如果希望设计页面结构，可以在` _document.jsx` 入口文件修改，以下是完整代码

   ```jsx
   import Document, { Html, Head, Main, NextScript } from 'next/document'

   class MyDocument extends Document {
     static async getInitialProps(ctx) {
       const initalProps = await Document.getInitialProps(ctx)

       return initalProps
     }

     render() {
       return (
         <Html lang="en">
           <Head>{/* Head 标签 */}</Head>
           <body>
             <div id="overlays" />
             <Main />
             <NextScript />
           </body>
         </Html>
       )
     }
   }

   export default MyDocument
   ```

   分析以上代码步骤

   1. 导入所需组件

      ```javascript
      import Document, { Html, Head, Main, NextScript } from 'next/document'
      ```

   2. 书写类标签架构

      ```jsx
      class MyDocument extends Document {
        static async getInitialProps(ctx) {
          const initalProps = await Document.getInitialProps(ctx)
          return initalProps
        }
        render() {
          return (
            <Html>
              <Head>{/* Head 标签 */}</Head>
              <body>
                <Main />
                <NextScript />
              </body>
            </Html>
          )
        }
      }

      export default MyDocument
      ```

   3. 添加属性

      ```jsx
      return (
        <Html lang="en">
          <Head></Head>
          <body>
            <div id="backdrop"></div>
            <Main />
            <NextScript />
          </body>
        </Html>
      )
      ```

### 5.3.2 Image

默认的 img 标签并不会对图片进行压缩、懒加载等优化，NextJS 提供的 Image 标签可以很好地解决这个问题。

**Image 标签的使用：**

```jsx
<Image src="/picURL" alt="鼠标悬浮显示文本" width={500} height={500} />
```

其中 `src、alt 属性`与普通的 `img 标签`一致，`width` 和 `height` 需要根据实际情况，例如**图片的大小上限、父元素的大小**等设置。。

**使用前后的变化:**

前

![QQ截图20230106201246](F:\资料\博客图片\QQ截图20230106201246.png)

后

![](F:\资料\博客图片\QQ截图20230106201332.png)

可以看到首先是图片的 `Type 属`性由 `jpeg` 改为 `webp`，`Size` 和 `Time` 都有所减少，尤其是 `Time 响应时间`。

## 5.4 api router

项目结构：![](F:\资料\博客图片\QQ截图20230107202731.png)

`page` 页面中的 `api` 是一个特殊的文件夹，它代表着 `api router(api 路由)`

### 5.4.1 如何使用 api router

1. **简单示例**

   ```javascript
   // pages/api/feedback.js
   const feedbackHandler = (req, res) {
       res.status(200).json({
           message: 'it is working!'
       })
   }

   export default feedbackHandler
   ```

   如果我们访问 http://127.0.0.1:3000/api/feedbackHandler 就会有 `{ “message”: “it is working” }` JSON 格式数据返回。

   **发送请求:**

   **GET 请求**

   ```jsx
   // pages/feedback.jsx
   const feedbackPage = () => {
     fetch('/api/feedback')
       .then((res) => res.json())
       .then((data) => {
         console.log(data)
       })
   }
   export default feedbackPage
   ```

   **POST 请求**

   ```jsx
   const feedbackPage = () => {
     fetch('/api/feedback', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: {
         text: '123456',
       },
     })
       .then((res) => res.json())
       .then((data) => {
         console.log(data)
       })
   }
   export default feedbackPage
   ```

2. **req 参数**

   除了 GET 请求，还会有 POST、PUT 请求，以 POST 为例，看 NextJS 如何处理这些请求

   ```javascript
   // pages/api/feedback
   const feedbackHandler = (req, res) {
       if(req.method === 'POST') {
           const feedbackText = req.body.text
       }
       res.status(200).json({
           message: 'it is working!'
       })
   }

   export default feedbackHandler
   ```

   req 参数

   | 参数名 | 参数作用                                    |
   | ------ | ------------------------------------------- |
   | body   | 客户端 POST、PUT 请求的 body 数据内容       |
   | method | 请求方法(具体有 POST、GET、PUT、DELETE ...) |
   | query  | 路由参数，具体见下一个页面                  |

### 5.4.2 api 动态路由

和普通的 `page 页面`一样，api 动态路由也可以使用 `[]` 形式来指定路由参数，同时用 **`req.query.xxx`** 来获取动态路由参数

```javascript
// pages/api/[feedbackId].js

const handler = (req, res) => {
  const feedbackId = req.query.feedbackId
  res.status(200).json({
    feedback: selectedFeedback,
  })
}

export default handler
```

## 5.5 NextJS 部署

### 5.5.1 标准构建 Standard Build

**命令**:

> next build

```
npm run build
```

使用此命令构建的 NextJs 应用程序是优化的生产版本，它会生成一个服务端的应用程序，因此需要一个 NodeJS 服务器来运行它，所以不能放在某个静态主机上。NextJS 具有内置的服务端功能，可以在服务器上及时渲染页面、重新验证页面、API 路由，这些服务端的特性，需要一个 NodeJS 服务器运行这些代码。

### 5.5.2 完全静态构建 Full Static Build

**命令**:

> next export

```
npm run export
```

会产生 100% 的静态应用程序(只有 `HTML、CSS、JavaScript`)，所以不需要 NodeJS 服务。

如果你的应用依赖于 `API Routes` 或者 `server-side pages `或者 `revalidations` 或者将 `fallback` 设置为 `true` 或者 `blocking` 的页面。所以 next export 只适用于不需要任何服务端代码的页面。

这还意味着当你需要重新更改页面时，需要重新书写代码。对于一些非常简单的博客，比如你每周添加一篇新的文章，可能非常好。

### 5.5.3 部署步骤

1. **一些必要的前置操作**

   添加页面的 meta 数据、标题、描述；去掉一些不必要的依赖和控制台输出语句；优化代码。不错的是 `NextJS` 内置了延迟加载。

2. **检查配置**

   正确配置环境变量、api 密钥，比如说你的测试数据库地址对于其他用户来说肯定没用，需要换成服务器的数据库地址

3. **测试构建**

   在本地的机器上测试应用程序是否就绪，如果对构建的大小不满意，可以回到第一个步骤优化项目体积

4. **最终部署**

### 5.5.4 next.config.js

在项目根目录中创建 `next.config.js`

在其中书写以下代码：

```javascript
module.exports = {
  env: {
    customKey: 'my-value',
    mongodb_username: 'xj',
    mongodb_password: 'dfa2sf2ad',
    mongodb_clustername: 'cluster0',
    mongodb_database: 'my-site',
  },
}
```

这样就可以在**组件**或者**其他 js 文件**中使用这个 `key` 值了

```jsx
// src/page.js
function Page() {
    return <h1>The value of customKey is: {process.env.customKey}</h1>
}

export defualt Page
```

```javascript
// src/utils/db.js
const connectionString = `mongodb+src://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.ntrwp.mongodb.next:${mongodb_database}`
```

当然 `next.config.js` 的内容不止这些，我们还可以默认导出一个函数

```javascript
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase) => {
  // 如果我们处于开发阶段，则返回这些数据
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
        customKey: 'my-value',
        mongodb_username: 'xj',
        mongodb_password: 'dfa2sf2ad',
        mongodb_clustername: 'cluster0',
        mongodb_database: 'my-site-dev',
      },
    }
  }
  return {
    env: {
      customKey: 'my-value',
      mongodb_username: 'xj',
      mongodb_password: 'dfa2sf2ad',
      mongodb_clustername: 'cluster0',
      mongodb_database: 'my-site',
    },
  }
}
```

这样就不会影响真正的数据库数据

---
title: vue-router
date: 2023-5-16 14:07:00
updated: 2023-5-16 14:07:00
tags:
  - Vue
  - vue-router
categories:
  - FE
---

# 配置路由

基本的框架：

```typescript
import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
```

`vue-router` 采用了 `path -> component` 的方式，我们只需要修改上述代码的 `routes`，添加类似下面数据即可：

```typescript
// () => import('xxx') 表示路由拉加载，即访问这个路由才会加载这个资源
const routes: RouteRecordRaw[] = [
  { path: '/', component: Home },
  { path: '/about', component: () => import('../components/About.vue') }
]
```

最后在 `main.ts` 中使用：

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

## createRouter

顾名思义，`createRouter` 即创造路由，语法如下：

```typescript
createRouter(options: RouterOptions)
```

其中 `options` 中必须传递两个参数：

1.   `history`：路由模式，有两种模式可选，一个是 `createWebHistory()`，另一个是 `createWebHashHistory`
2.   `routes`：路由参数，即配置的 `path -> component` 对象数组

## createWebHashHistory、createWebHistory

两者均是路由模式

1.   `createWebHashHistory`：在路由后使用了哈希字符 `#` (例如学校的远程实验平台 `http://www.ycsypt.com/#/`)，这样 URL 处理不需要在服务器层面上进行，虽然简单，但是**对 SEO 有不好的影响**
2.   `createWebHistory`：正常的路由地址，也是 vue 官网推荐的模式，不过 vue 作为一个单页的客户端渲染框架，在 dev 环境下测试是正常的，但是**在部署环境时会发生错误**，因为这种正常的路由一般交给服务器处理，我们需要**手动配置 `nginx`** 才可以

>   `createWebHistory` 配置：[不同的历史模式 | Vue Router (vuejs.org)](https://router.vuejs.org/zh/guide/essentials/history-mode.html)

# 路由标签

`vue-router` 提供了两个标签：

1.   `router-link`
2.   `router-view`

`vue-router` 没有使用常规的 `a` 标签，而是使用自定义组件 `router-link`。这是由于 `a` 标签跳转会重新加载页面，向服务端请求数据，这样就失去了 `vue` 对页面的控制。`router-link` 允许在**不重新加载页面的前提下更改 URL**

`router-view` 切换路由时需要展示的位置，可以放在任何地方

-   配置路由

```typescript
const routes: RouteRecordRaw[] = [
  { path: 'a', component: A },
  { path: 'b', component: B }
]
```

-   `App.vue`

我们不一定要配置 `path: ‘/’` 对应的组件，因为这个路径默认对应的组件就是 `App.vue`

```vue
<template>
	<div>
    <h1>App 组件</h1>
    <RouterLink to='a'>a</RouterLink>
    <RouterLink to='b'>b</RouterLink>
    <RouterView />
  </div>
</template>
```

>   `router-link` 组件中的 `to` 属性表示要跳转的链接

-   `a.vue`

```vue
<template>
	<h2>A 组件</h2>
</template>
```

`b.vue` 同理

# 动态路由

有时候我们会访问类似 `/user/${id}` 来查看不同 id 的用户，我们不可能把用户所有 id 遍历后写到路由配置中，为此 `vue-router` 提供了**动态路由**，使用 `:id` 来区分不同路由

```typescript
const routes: RouteRecordRaw[] = {
  { path: '/user/:id', component: User}
}
```

当我们访问 `user/1` 时，组件该如何获取到 id 呢？

`vue-router` 提供了`$route` 参数，我们可以直接在 `<template>` 模板上调用：

```vue
<template>
	<h2>id: {{ $route.params.id }}</h2>
</template>
```

当然也可以在 `<script>` 标签中使用

```vue
<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
console.log(route.params.id)
</script>
```

`vue-router` 官网给出的示例：

| 匹配模式                       | 匹配路径                 | $route.params                            |
| :----------------------------- | :----------------------- | :--------------------------------------- |
| /users/:username               | /users/eduardo           | `{ username: 'eduardo' }`                |
| /users/:username/posts/:postId | /users/eduardo/posts/123 | `{ username: 'eduardo', postId: '123' }` |

`$route/route` 除了 `params` 属性，其实还有 `query`(路由查询参数) 和 `hash`(hash参数) 属性等

>   动态路由在切换时，例如从 `/user/1` 到 `/user/2`，**相同的组件实例将被重复使用**，因为两个路由都渲染同一个组件，比起销毁再创建，复用则更高效，这也意味着：**组件的某些生命周期钩子不会被调用(update会调用)**

## 动态路由匹配语法

在上述的讲解中，我们已经知道了 `:` 匹配运算符，事实上，`vue-router` 内部基于正则表达式处理，还有这更多的匹配运算符：

```typescript
const routes = [
  // 表示 /:orderId 只匹配数字
  { path: '/:orderId(\\d+)' },
  // /:productName 匹配任何内容
  { path: '/:productName' }
]
```

当我们访问 `/25` 时，对应的路由地址时 `/:orderId`，其他情况则对应的是 `/:productName`

### 可重复参数

如果需要匹配多个部分的路由，例如 `/2003/03/03`，可以使用以下两个运算符：

1.   `*`：匹配 0 个或多个
2.   `+`：匹配 1 个或多个

```typescript
const route = [
  { path: '/params/:paramsId*', component: Prams }
]
```

当我们访问 `/params/2003/03/03` 时，打印的 `$route.params` 为数组：

```typescript
import { useRoute } from 'vue-router'
const route = useRoute()
cosnole.log(route.params)
// paramsId: ['2003', '03', '03']
```

### 可选参数

可以通过使用 `?` 修饰符将一个参数标记为可选

```typescript
const routes = [
  { path: '/users/:userId?' }
]
```

## 路由严格模式

默认情况下，`vue-router` 配置的路由地址是**不敏感且不区分大小写**的，例如 `path: ‘/user’` 会匹配 `/users`、`/users/`、`/User`，我们可以通过修改 `createRouter` 的参数来修改，可以全局设置，也可以设置在某个单独路由：

```typescript
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 单独配置 sensitive
    { path: '/user/:id', sensitive: true }
  ],
  // 全局配置 strict
  strict: true
})
```

# 嵌套路由

前面讲到过 `<RouteView>` 可以使用多次，而使用多次的场景便是嵌套路由，即子路由

-   访问 `/` 展示的组件

```vue
// App.vue
<template>
	<div>
    <h1>App 组件</h1>
    <RouterView />
  </div>
</template>
```

-   访问 `/sons` 展示的组件

```vue
// Sons.vue
<template>
	<div>
    <h2>Sons 组件</h2>
    <RouterView />
  </div>
</template>
```

-   访问 `/sons/:id(\\d+)`  展示的组件

```vue
// Son.vue
<template>
	<div>
    <h3>我是 {{$route.params.id}} 儿子</h3>
  </div>
</template>
```

配置 `router` 配置

```typescript
const routes = [
  {
    path: '/sons',
    component: Sons,
    // 使用 children 配置子路由
    children: [
      { path: '/sons/id(\\d+)', component: Son }
    ]
  }
]
```

当我们访问 `/sons/4` 显示的网页效果：

![](https://plumbiu.github.io/blogImg/QQ截图20230514222120.png)

# 命名路由

命名路由很容易理解，即给每一个路由添加 `name` 属性：

```typescript
const routes = [
  {
    path: '/user',
    name: 'user',
    component: User
  }
]
```

这有一个好处，即当我们使用 `<router-link>` 跳转时，不需要写 `url` 地址，可以写一个配置对象：

```html
<RouterLink :to="{name: 'user'}">去 user 组件</RouterLink>
```

也可以使用编程式导航(下节内容)：

```typescript
import { useRouter } from 'vue-router'
const router = useRouter()
router.push({
  name: 'user'
})
```

# 编程式导航

以下示例均基于以下路由配置：

```typescript
const routes = [
  { path: '/user/:username', component: User }
]
```

上述代码中，我们只通过 `<router-link>` 标签进行路由切换，`vue-router` 提供了 js 中的路由切换功能：

```typescript
import { useRouter } from 'vue-router'
const router = useRouter()
router.push('/user')
```

`router.push` 可以接受一个字符串路径，也可以接受一个描述地址的对象，例如：

```typescript
// 字符串路径
router.push('/user/2')
// 带有路径的对象
router.push({ path: '/user/2' })
// 命名路由，并加上 params 参数
router.push({ name: 'user', params: {
  username: 'xjj'
} })
// 携带查询参数
router.push({ path: '/user', query: {
  password: 'xxx'
} })
// 携带 hash(通常是目录定位)
// 结果是 /user#age
router.push({ path: '/user', hash: '#age' })
```

>   注意 `path` 不能与 `params` 一起使用，最后解析的仍然是 `path`

`<router-link>` 中的 `to` 属性与 `router.push` 完全相同，因此不再讲解

# 命名视图

有时候我们希望两个视图在同一层，例如 2 个侧导航栏 + 1 个主内容，我们可以采用以下写法：

```html
<RouterView name="LeftSideBar" />
<RouterView />
<RouterView name="RightSidebar"
```

配置路由：

>   注意，是配置 `components` 属性，而不是 `component` 属性

```typescript
const routes = [
  {
    path: '/',
    components: {
      default: Home,
      // 下面两个都是组件，简写形式
      LeftSidebar,
      RightSidebar
    }
  }
]
```

这样，当我们访问 `/` 是，展示的组件有 `Home`、`LeftSidebar`、`RightSidebar`

# 重定向

重定向可以通过 `routes` 完成：

```typescript
const routes = [
  // 从 `/` 重定向到 `/home`
  { path: '/', redirect: '/home' }
]
```

重定向的目标也可以是命名路由：

```typescript
{ path: '/', redirect: { name: 'home' } }
```

也可以是一个方法：

```typescript
{
  path: '/',
  redirect: to => {
    return { path: '/home', query: { q: to.params.pathText } }
  }
}
```

>   在写 `redirect` 属性时，可以省略 `component` 配置，因为跳转后本身访问不到这个路由
>
>   例外：**如果一个路由有 `children` 和 `redirect` 属性，那么也应该有 `component` 属性****

## 相对重定向

相对重定向是以当前目录为准，例如下面代码：

>   相比于上面代码，这里的写法省去了 `/`

-   当我们访问 `/users/2/posts` 时，会被重定向到 `/user/2/profile`

**没成功，不知道具体什么原因**

```typescript
const routes = [
  {
    path: '/users/:id/posts',
    redirect: to => {
      return 'profile' // 或者 { path: 'profile' }
    }
  }
]
```

这种效果在 `<router-link>` 也适用：

-   当我们访问 `/users/2/posts` 时，点击以下标签，页会跳转到 `users/2/profile`

```html
<router-link to="profile">去个人首页</router-link>
```

# 路由传参

我们可以通过使用 `$route` 将组件与页面结合，但是这样就限制了组件的灵活性，因为这只能应用于特定的 URL，这不是坏事，但是 `vue-router` 额外提供了 `props` 传参：

```typescript
// 将 props 属性设置为 true
const routes = [
  { path: '/user/:id', component: User, props: true }
]
```

组件中使用 `defineProps` 定义动态路由的参数：

```vue
// User.vue
<script setup>
defineProps<{
  id: string
}>()
</script>
<template>
	<div>
    {{id}}
  </div>
</template>
```

# 路由导航守卫

路由导航守卫可以让我们控制路由之间的跳转，并实现一些功能

## 全局前置守卫

例如有些路由需要登录才可以访问，而有些不可以，此时我们可以使用 `router.beforeEach` 注册一个**全局前置守卫**：

```typescript
const router = createRouter({ /**/ })
router.beforeEach((to, form) => {
  // 返回 false 即取消路由跳转
  return false
})
```

当路由切换时，全局前置守卫先被调用，此方法是个异步方法，这意味着当守卫 `resolve` 完成之前，一直是 `pending`(**等待中**) 状态

`beforeEach` 方法接收三个参数：

1.   `to`：表示要导向的路由
2.   `from`：表示由哪个路由导向
3.   `next`：这是一个可选参数，我们也可以使用它来表示路由是否可以跳转或跳转到哪里

可以返回的值：

1.   `false`：取消这次路由切换
2.   `path(一个路由地址)`：表示跳转的路由地址，例如我们未登陆成功，返回到登录页：

```typescript
router.beforeEach((to, from) => {
  if(!isAuthenticated && to.name !== 'Login') {
    return { name: 'Login' }
  }
})
```

3.   `undefined | true`：表示这次导航是有效的，调用下一个导航守卫

>   可选的 `next` 参数是一个函数，接收的参数与 `beforeEach` 守卫的返回值一样，例如：
>
>   ```typescript
>   return '/login' 
>   // 上下两者效果相等
>   next('/login')
>   ```

## 全局解析钩子

`router.beforeResolve` 和 `router.beforeEach` 比较类似，也是在**每次路由切换时触发**，不过解析守卫会在导航确认之前、**所有组件内守卫和异步路由组件被解析之后**调用

我们可以使用 `beforeResolve` 全局解析钩子访问自定义的 `meta` 属性，例如官方给的例子：

```typescript
router.beforeResolve(async (to) => {
  if(to.meta.requireCamera) {
    try {
      await askForCameraPermission()
    } catch(error) {
      if(error instanceof NotAllowedError) {
        // ...处理错误
        return false // 取消导航
      } else {
        // 意料之外的错误，取消当行并传递给全局处理器
        throw error
      }
    }
  }
})
```

>   同时 `router.beforeResolve` 是获取数据或执行任何其他操作的理想位置

## 全局后置钩子

钩子和守卫不同，钩子并不会影响路由的切换

全局后置可用于分析、更改页面标题、声明页面

```typescript
router.afterEach((to, from) => {
  sendToAnalytics(to.fullPath)
})
```

也可以接收  [navigation failures](https://router.vuejs.org/zh/guide/advanced/navigation-failures.html) 作为第三个参数：

```typescript
router.afterEach((to, from, failure) => {
  if (!failure) sendToAnalytics(to.fullPath)
})
```

## 路由独享的守卫

可以直接在路由配置上定义 `beforeEnter` 守卫

```typescript
const routes = [
  {
    path: '/users/:id',
    component: User,
    beforeEnter: (to, from) => {
      // reject he navigation
      return false
    }
  }
]
```

`beforeEnter` 只在路由切换后触发，例如从 `/users/2` 到 `/users/3`，`/users/2#one` 到 `/users/2#two`

同时，`beforeEnter` 还支持接收一个数组，数组项为函数：

```typescript
function removeQueryPrams(to) {
  if(Object.keys(to.query).length)
  	return { path: to.path, query: {}, hash: to.hash }
}
function removeHash(to) {
  if(to.hash) return {
    path: to.path,
    query: to.query,
    hash: ''
  }
}
const routes = [
  {
    path: '/users/:id',
    component: User,
    beforeEnter: [removeQueryParams, removeHash]
  }
]
```

## 组件内的守卫

我们可以在 `.vue` 组件内定义路由导航守卫，可用的路由组件有一下 3 个：

-   `onBeforeRouteUpdate`
-   `onBeforeRouteLeave`

```vue
<script>
onBeforeRouteUpdate((to, from) => {
  // 在当前路由改变，但是该组件被复用时调用
  // 举例来说，对于一个带有动态参数的路径 `/users/:id`，在 `/users/1` 和 `/users/2` 之间跳转的时候，
  // 由于会渲染同样的 `UserDetails` 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
  // 因为在这种情况发生的时候，组件已经挂载好了，导航守卫可以访问组件实例 `this`
})
onBeforeRouteLeave((to, from) => {
  // 在导航离开渲染该组件的对应路由时调用
  // 与 `beforeRouteUpdate` 一样，它可以访问组件实例 `this`
})
</script>
```

# 路由动画

如果我们希望在路由切换的时候，能给用户动画提示，可以使用 `vue` 提供了 `transition` API 和 `vue-router` 提供的 `router-view` API：

```vue
<RouterView v-slot="{ Component }">
	<transition name="fade">
  	<component :is="Componet" />
  </transition>
</RouterView>
```

>   不过目前 `vue` 的更新想法是未来去掉 `is` 用法，另外吐槽一点 `vue-router` 的文档真的好老

## 单个路由过渡

如果我们希望单个路由有过渡效果或者路由之间有不同的过渡效果，可以将路由元信息和 `transition` 的 `name` 结合在一起：

```typescript
const routes = [
  {
    path: '/left',
    component: Left,
    meta: { transition: 'slide-left' }
  },
  {
    path: '/right',
    component: Right,
    meta: { transition: 'slide-right' }
  }
]
```

此时使用 `<router-view>` 标签的 `v-slot` 属性解构出  `route` 即可：

```vue
<route-view v-slot="{ Component, route }">
	<transition :name="route.meta.transition || 'fade'">
  	<component :is="Component" />
  </transition>
</route-view>
```

## 结合钩子使用

手动指定往左滑动还是往右滑动太过复杂了，此时我们可以指定路由的深度，通过 `afterEach` 全局后置钩子比较路由的深度来判断是路由的层级：

>   判断路由的层级

```typescript
router.afterEach((to, from) => {
  // 获取前往路由的数组长度(以 '/' 分隔)
  const toDepth = to.path.split('/').length
  // 同上
  const fromDepth = from.path.split('/').length
  to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left'
})
```

## 复用视图之间的过渡

`vue` 会自动复用一些组件，从而忽略过渡，我们可以添加，`key` 属性强制进行过度：

```vue
<router-view v-slot="{ Component, route }">
	<transition name="fade">
  	<component :is="Component" :key="route.path" />
  </transition>
</router-view>
```

# 滚动行为

当我们切换路由时，想要滚动到页面顶部，或者是保留原先的滚动位置时，我们可以配置 `createRouter` 的 `scrollBehavior` 属性

>   **注意：这个功能只支持在 history.pushState 的浏览器中可用**

```typescript
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: (to, from, savedPosition) {
  	return /* 位置 */
	}
})
```

## 基本滚动

1.   滚动到顶部

```typescript
scrollBehavior(to, from, savedPosition) {
  return { top: 0 }
}
```

2.   滚动到 DOM 元素相对位置

```typescript
scrollBehavior(to, from, savedPosition) {
  return {
    el: '#main',
    top: -10
  }
}
```

3.   保持位置不变

```typescript
scrollBehavior(to, from, savedPosition) {
  if(savedPosition) {
    return savedPosition
  }
  return {
    top: 0
  }
}
```

4.   滚动到锚点

```typescript
scrollBehavior(to, from, savedPosition) {
  if(to.hash) {
    return {
      el: to.hash
    }
  }
}
```

## 平滑滚动

>   如果浏览器支持滚动行为，那么滚动可以更加流畅

```typescript
scrollBehavior(to, from, savedPosition) {
  if(to.hash) {
    return {
      el: to.hash,
      behavior: 'smooth'
    }
  }
}
```

## 延迟滚动

为了做到延迟滚动，我们需要返回一个 `Promise` 对象

```typescript
scrollBehavior(to, from, savedPosition) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ left: 0, top: 0 })
    }, 500)
  })
}
```

# 导航故障

想象一个场景，当安卓手机左滑出菜单栏后，点击菜单跳转，当我们进入对应路由时，希望菜单栏可以自动隐藏，你可能想这么做：

```typescript
router.push('/my-profile')
closeMenu()
```

但这样做会在到达对应路由之前立马关闭菜单，因为**导航**是异步的，我们需要 `await` 处理：

```typescript
await router.push('/my-profile')
closeMenu()
```

但是路由可能会跳转失败，这时候我们就不希望关闭菜单栏，因此我们需要一种方法来检测我们是否真的跳转到别的路由

## 检测导航故障

如果路由切换被阻止，导致用户停留在一个页面上，由 `router.push` 返回的 `Promise` 的值将解析为 *Navigation Failure*，否则它将是一个 `falsy(假值，通常是 undefined)`，这样我们就能判断路由是否切换成功了：

```typescript
const navigationResult = await router.push('/my-profile')
if(navigationResult) {
  // 导航被阻止
} else {
  // 导航成功，关闭菜单栏
  closeMenu()
}
```

## 导航故障的属性

上述章节中我们讲述了：路由切换失败后，`router.push` 返回的 `Promise` 值将被解析成 *Navigation Failure* 值，这个值是带有一些额外属性的 `Error` 实例，可以提供更多的信息，例如哪些导航被阻止了以及为什么被阻止，要检查导航结果的性质，需要使用 `isNavigationFailure` 函数：

```typescript
import { NavigationFailureType, isNavigationFailure } from 'vue-router'

// 试图离开未保存的编辑文本界面
const failure = await router.push('/articles/2')

if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
  // 给用户显示一个小通知
  showToast('You have unsaved changes, discard and leave anyway?')
}
```

>   TIP
>
>   如果忽略第二个参数： `isNavigationFailure(failure)`，那么就只会检查这个 `failure` 是不是一个 *Navigation Failure*。

`NavigationFailureType` 有三种不同类型：

-   `aborted`：在导航守卫中返回 `false` 中断了本次导航。
-   `cancelled`： 在当前导航还没有完成之前又有了一个新的导航。比如，在等待导航守卫的过程中又调用了 `router.push`。
-   `duplicated`：导航被阻止，因为我们已经在目标位置了。

## 检测重定向

例如当导航守卫返回一个新的位置时，我们会触发一个新的导航，覆盖之前的导航，**重定向不会阻止导航，而是创建一个新的导航**，可以通过读取路由中的 `redirectedFrom` 属性，对其进行不同的检查：

```typescript
await router.push('/my-profile')
if(router.currentRoute.value.redirectedFrom) {
  // redirectedFrom 是解析出的路由地址，就像导航守卫中的 to 和 from
}
```

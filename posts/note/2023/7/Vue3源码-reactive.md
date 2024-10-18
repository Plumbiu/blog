---
title: Vue3源码 —— 响应式原理
date: 2023-07-08
---

Vue 中的响应式原理是基于 [JavaScript Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

如果我们想使用响应式数据，可以这样写：

```html
<script src="@vue/reactiveity/dist/reactivity.global.js"></script>
<script>
	const { effect, reactive } = VueReactivity
  // 定义响应式数据
  const state = reactive({ name: 'xj', age: 13, address: { loc: 'HDU' } })
  // effect 函数用于收集依赖
  effect(() => {
    document.body.innerHTML = `${state.name}今年${state.age}岁了，居住在${state.address.loc}`
  })
  // 加个定时器便于查看数据变化
  setTimeout(() => {
    state.age = 18
  }, 1000)
</script>
```

# reactive

reactive 函数是将数据定义为响应式的基础函数

1. 首先准备 `isObject` 函数，用于判断是否为对象

> Vue 中的 `reactive` 只能将对象作为参数

```typescript
export function isObject(value: any) {
  return typeof value === 'object' && value !== null
}
```

2. `reactive` 函数

`reactive` 函数是将数据变为响应式，只写下面的代码可能体现不出响应式在哪里，

其实做到响应式的前提是包含在 `effect` 函数中，这个函数稍后再讲

> `effect` 函数通过 `proxy` 的 `get` 进行依赖收集

```typescript
export function reactive(target: any) {
  // 不是对象就返回
  if(!isObject(target)) {
    return
  }
  // 代理对象
  const proxy = new Proxy(target, {
    get(target: any, key: any, receiver: any) {
      return Reflect.get(target, key, receiver)
    },
    set(target: any, key: any, value: any, receiver: any) {
      return Reflect.set(target, key, value, receiver)
    },
  })
  return proxy
}
```

之所以使用 `Reflect` 映射 API，是因为有一些情况，代理对象会失效，例如：

```typescript
const obj = {
  name: 'xj',
  get getName() {
    return this.name()
  }
}
// 如果我们不使用 Reflect 函数，那么上述 this.name 指向的是 obj，而不是代理对象 proxy
obj.getName()
```

做到这些，当我们修改数据时，便会执行 `proxy` 中的 `set` 方法，

## 注意事项

1. 用户传入了一个响应式数据

例如以下情况：

```typescript
const state1 = reactive({ name: 'xj' })
const state2 = reactive(state1)
```

`state1` 本身就是一个 `Poxy` 对象，我们又将此对象传递到 `reactive` 函数上再次代理，这样会报错，所以源代码需要修改

```typescript
enum ReactiveFlags {
  IS_REACTIVE = '_v_isReactive',
}
export function reactive(target: any) {
  // 不是对象就返回
  if(!isObject(target)) {
    return
  }
+ if(target[ReactiveFlags.IS_REACTIVE]) {
+   return target
+ }
  // 代理对象
  const proxy = new Proxy(target, {
    get(target: any, key: any, receiver: any) {
+     if(key === ReactiveFlags.IS_REACTIVE) {
+       return true
+     }
      return Reflect.get(target, key, receiver)
    },
    set(target: any, key: any, value: any, receiver: any) {
      return Reflect.set(target, key, value, receiver)
    },
  })
  return proxy
}
```

依次来解释为什么要这么做

> 我们要做的是传入的参数不能是一个已经代理过的对象，也就是说传入给 `reactive` 的对象必须是一个普通对象

1. 准备一个 `enum`

用于枚举一些字段，方便以后使用

```typescript
enum ReactiveFlags {
  IS_REACTIVE = '_v_isReactive',
}
```

此时我们便可以用 `ReactiveFlags.IS_REACTIVE` 代替 `'_v_isReactive'` 字符串了

2. 判断传入的参数 `target` 是否为代理对象

如果传的 `target` 是普通对象，只要对象没有 `_v_isReactive` 属性

```typescript
if(target[ReactiveFlags.IS_REACTIVE]) {
  return target
}
```

如果传递的是代理对象，那么当我们在 `if` 判断语句中访问时，就会触发 `get` 方法，此时判断 `key` 值即可：

```typescript
get(target, key, receiver) {
  if(key === ReactiveFlags.IS_REACTIVE) {
    return true
  }
}
```

# effect

`effect` 函数用来产生副作用

`effect` 内部执行的机制：

1. 首先用户是这样使用 `effect` 的：

```typescript
effect(() => {
  document.body.innerHTML = state.name + '今年' + state.age + '岁了'
})
```

2. vue 源码内部

- 首先定义 `ReactiveEffect` 类

```typescript
class ReactiveEffect {
  // ts 中的类，如果我们在 constructor 构造函数中写上 public 前缀，那么参数会自动挂载到 this 上
  // 例如以下，this.fn = fn
  constructor(public fn: any) {}
  run() {
    return this.fn() // 执行函数
  }
}
```

- 导出 `effect` 函数

```typescript
export function effect(fn: any) {
  const _effect = new ReactiveEffect(fn)
  _effect.run() // run 就是执行 fn，即用户使用 effect 的函数参数
}
```

## 注意事项

刁钻的用户可能这样使用 `effect`：

```typescript
effect(() => {
	state.name = 'xjj'
  effect(() => {
    state.age = 18
  })
  state.address = 'liyi'
})
```

现在看这似乎没有什么问题，因为我们还没做"清理"，最重要获得的效果是：

- 一个 effect 对应多个响应式数据
- 一个响应式数据对应的多个 effect

为了解决这个问题，我们需要确定 `effect` 的作用域：

```typescript
effect(() => {
	state.name = 'xjj' // parent = null; activeEffect = e1
  effect(() => {
    state.age = 18 // parent = e1; activeEffect = e2
  })
  state.address = 'liyi' // parent = null; activeEffect = e1
})
```

可以很清楚看到各个 `effect` 之间的联系传递关系：

- `parent` 为上一个 `effectEffect`，如果是第一个 `effect`，那么 `parent` 为 `null`
- `activeEffect` 为当前 `effect` 的作用域

**修改**：

1. 首先定义一个全局变量，用于确认当前 `effect` 函数的作用域

```typescript
let activeEffect = undefined
```

2. 修改 `ReactiveEffect` 类

> 函数内即使 `return` 了，`finally` 内部的代码块也会执行

```typescript
class ReactiveEffect {
  public parent = null
  constructor(public fn: any) {}
  run() {
    try {
      this.parent = activeEffect
      activeEffect = this
      return this.fn()
    } finally {
      activeEffect = this.parent
      this.parent = null // (可省略)
    }
  }
}
```

`run` 函数即执行 `effect` 传入的函数，每一个 `effect` 中函数执行完毕，就将 `activeEffect` 变为 `this.parent`，这样，各层 `effect` 函数就可以分的清了

## track 依赖收集函数

上面已经讲过，**一个 effect 对应多个数据，一个数据对应多个 effect**，`track` 函数就是为了实现这一目的

1. 首先 `ReactiveEffect` 类增加公共属性 `deps`

> 每一个 `effect` 都要对应多个数据，deps 就是为了收集这些数据

```typescript
class ReactiveEffect {
  public deps = []
  // ...
}
```

2. 书写 `track` 函数

逻辑分析：

- 如果 `activeEffect` 为 `false` 表明用户在 `effect` 外取值了，这时候不需要依赖收集，直接 `return`
- `targetMap` 用于存储依赖，用于判断依赖是否重复收集
- `dep` 存储响应式的数据，为 `Set` 数据结构
- `depsMap` 存储 `effect`，为 `Map` 数据结构

```typescript
// 使用 WeakMap 收集 effect
const targetMap = new WeakMap()
export function track(target, type, key) {
  // 如果当前 activeEffect 不是激活状态，直接 return
  // 这样做的目的是，当用户在 effect 函数外取值时不需要收集依赖
  if(!activeEffect) return
  // depsMap 最终会是 Map 对象
  let depsMap = targetMap.get(target)
  if(!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  // dep 最终是一个 Set 数据结构
  let dep = depsMap.get(key)
  if(!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  let shouldTrack = !dep.has(activeEffect)
  if(shouldTrack) {
    // 添加 activeEffect，即 属性对应多个 effect
    dep.add(activeEffect)
    // Core: 此时 activeEffect 指向 this，即当前 ReactiveEffect 实例对象
    // 即 effect 对应多个属性
    activeEffect.deps.push(dep)
  }
}
```

## trigger 执行函数

上述 `effect` 代码写好后，数据还未变成真正的"响应式"，因为没有 `trigger` 函数，数据变化并不会反映到视图上：

```typescript
export funtion trigger(target: object, type: any, key: any, value: any, oldValue: any) {
  const depsMap = targetMap.get(target)
  if(!depsMap) return
  const effects = depsMap.get(key) // 找到了数据对应的 effect
  effects && effects.forEach(effect => {
    // 为什么还要加这个判断呢，是因为用户可能在 effect 修改响应式数据，这样触发 trigger，trigger 又触发 effect，effect 再次触发 trigger 导致无限循环，所以 effect 不能等于当前激活的 effect
    if(effect !== activeEffect) effect.run()
  })
}
```

修改 `Proxy` 配置

```typescript
const proxy = new Proxy({
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
    // get 方法内收集依赖
    track(target, 'get', 'key')
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    let oldValue = target[key]
    let result = Reflect.set(target, key, value, receiver)
    if(oldValue !== value) {
      // set 方法中更新依赖
      trigger(target, 'set', key, value, oldValue)
    }
    return result
  }
})
```

## 总结

只看代码可能会搞混，这里用图解帮助理解：

![](https://plumbiu.github.io/blogImg/reactivity.png)

## 补充

1. `cleanupEffect` 清理函数

例如以下代码：

```typescript
const state = reactive({ flag: true, name: 'xj', age: 20 })
effect(() => {
  document.body.innerHTML = state.flag ? state.name : state.age
})
setTimeout(() => {
  state.flag = false
  setTimeout(() => {
    // 原则上不应该更新视图，应为 flag 为 false 时，只需要收集 flag 和 age 即可，所以我们希望每次执行都重新收集依赖
    state.name = 'xjj'
  }, 1000)
}, 1000)
```

增加 `cleanupEffect` 函数：

```typescript
function cleanupEffect(effect) {
  const { deps } = effect
  for(let i = 0; i < deps.length; i++) {
    deps[i].delete(effect)
  }
  effect.deps.length = 0
}
```

> 为什么不直接将 `effect.deps` 赋值空数组呢？
>
> 一个 `dep` 对应多个 `effect`，一个 `effect` 对应多个 `dep`，如果我们只将 `deps` 赋值为空数组，那么 `effect` 还是引用着 `dep`，不能完全清除干净

在 `run` 函数执行 `return this.fn()` 前添加该函数：

```typescript
+ cleanupEffect(this)
  return this.fn()
```

> 还是会有个问题，上述代码我们执行了 `cleanupEffect` 函数，又执行了 `fn` 函数，一个清理依赖，另一个收集依赖，这样无疑会造成死循环

为了解决死循环问题，我们需要修改 `trigger` 函数，对属性进行**深拷贝**：

```typescript
export function trigger(target: object, type: any, key: any, value: any, oldValue: any) {
  const depsMap = targetMap.get(target)
  if(!depsMap) return // 触发的值不在模板中使用
  let effects = depsMap.get(key) // 找到了属性对应的 effect
  // 永远在执行之前，先拷贝一份来执行，不要关联引用
  if(effects) {
    // 深拷贝可以用展开运算符
    effects = [...effects]
    effects.forEach((effect: ReactiveEffect) => {
      // 执行 effect 的时候，又要执行自己，需要屏蔽到这种情况，因为会导致无限循环
      if(effect !== activeEffect) {
          effect.run() // 否则默认刷新视图
      }
    })
  }
}
```

2. `effect` 的返回值

用于用户自行决定数据是否是响应式

```typescript
let runner = effect(() => {
	document.body.innerHTML = state.age
})
// 将数据变为非响应式
runner.effect.stop()
setTimeout(() => { state.age = 18 }, 1000) // 不会修改视图
// 启动响应式
runner()
setTimeout(() => { state.age = 20 }, 1000) // 会修改视图
```

为了达到以上目的，我们可以修改 `effect` 函数：

```typescript
export function effect(fn: any, options: any = {}) {
  // 这里 fn 可以根据状态变化，重新执行，effect 可以嵌套着写
  const _effect = new ReactiveEffect(fn, options.scheduler) // 创建响应式的 effect
  _effect.run()
  // runner 的 this 应该指向 effect，而非 windows，需要用 bind 方法修改 this
+  const runner = _effect.run.bind(_effect) as any
+  runner.effect = _effect
+  return runner
}
```

同时为 `ReactiveEffect` 类实例增加 `stop` 方法：

```typescript
class ReactiveEffect {
  // ...
  stop() {
    if(this.active) {
      this.active = false // 将此 effect 变为非激活状态
      cleanupEffect(this) // 清空 effect 收集的依赖
    }
  }
}
```

2. `scheduler` 函数

`scheduler` 配置项，可以让用户自己选择渲染的方式，例如批处理渲染：

```typescript
let waiting = false
const state = reactive({ name: 'xj', age: 30 })

let runner = effect(() => {
  document.body.innerHTML = state.age
}, {
  scheduler() {
    console.log('run')
    if(!waiting) {
      waiting = true
      setTimeout(() => {
        runner()
        waiting = false
      }, 1000)
    }
  }
})
// 多次赋值，最终只会渲染一次视图
state.age = 1000
state.age = 2000
state.age = 3000
state.age = 4000
state.age = 5000
```

达到以上目的，我们可以修改 `ReactiveEffect` 类的构造函数

```typescript
class ReactiveEffect {
  constructor(
  	public fn: any,
+    public scheduler: any
  ) {}
}
```

再修改 `trigger` 函数：

```typescript
export function trigger(target: object, type: any, key: any, value: any, oldValue: any) {
  const depsMap = targetMap.get(target)
  if(!depsMap) return
  let effects = depsMap.get(key)
  if(effects) {
    effects = [...effects]
    effects.forEach((effect: ReactiveEffect) => {
+      if(effect !== activeEffect) {
+        if(effect.scheduler) {
+          effect.scheduler() // 如果用户传入了调度函数，则用用户的
+        } else {
+          effect.run() // 否则默认刷新视图
+        }
      }
    })
  }
}
```

> 调度函数 `scheduler` 一般结合 `effect` 函数的返回值来使用，达到定制型更强的效果

# computed

`computed` 是 `vue` 中的计算属性，它有以下特点：

1. 缓存：计算属性中肯定要有一个缓存的标识，如果这个依赖有变化，要重新执行 get，没有变化就不执行 get
2. 有一个 `dirty` 属性：`computed` 是一个 `effect`，以后属性变化了，会更新 `dirty`

让我们来看一下 `vue` 中如何使用 `computed`：

```typescript
const state = reactive({ firstname: 'g', lastname: 'xj' })
const fullname = computed(() => {
  return state.firstname + state.lastname
})
// 或者可以写成对象：
// const fullName = computed({
//   get() {
//     // defineProperty 中的 getter
//     return state.firname + state.lastname
//   },
//   set(newValue) {
//     // defineProperty 中的 setter
//   },
// })
setTimeout(() => {
  state.lastname = 'xjj' // fullname 计算属性值也会跟着修改
}, 1000)
```

## 回顾如何将数据变为响应式

将数据变为响应式主要有以下步骤：

1. 将数据使用 `proxy` 对象代理
2. `effect` 中的函数收集使用到的数据依赖，即写在 `effect` 中的数据会经过 `proxy` 中的 `get` 方法，`get` 方法中使用 `track` 函数收集依赖
3. 用户修改时，会经过 `proxy` 中的 `set` 方法，`set` 方法中使用 `trigger` 触发更新

函数之间的调用关系：

> 注：这里只讨论核心的思路，代码并不是最终代码，真实需要额外考虑很多情况

1. `proxy` 对象代理：

使用：

```typescript
const state = reactive({ name: 'xj', age: 20 })
```

源码的核心逻辑就是：

- 取值我就用 `track` 收集依赖

- 设置值就用 `trigger` 更新依赖

```typescript
export function reactive(val) {
  if(!isObject(val)) {
    // 只接受对象数据
    return
  }
  const proxy = new Proxy(val, {
    get(target, key, receiver) {
      track(target, 'get', key) // 将 target[key] 变为 proxy 代理对象
      return Reflect.get(target, key, receiver)
    },
    set(target, key, newValue, receiver) {
      let oldValue = target[key] // 获取旧的值
      let result = Reflect.set(target, key, value, receiver)
      if(oldValue !== newValue) {
        // 旧值和新值不同，要更新
        trigger(target, 'set', key, value, oldValue)
      }
      return result // target[key] = value
    }
  })
}
```

2. 如何收集更新依赖？

收集和更新依赖的核心分别是 `track` 和 `trigger` 函数，当然用户入口函数是 `effect`

- 准备一个 `ReactiveEffect` 类

`run` 方法就是收集依赖的入口方法

```typescript
let activeEffect = null // 用于表示当前正在激活的 effect
export class ReactiveEffect {
  public parent = null
  public deps = []
  // 用于判断此 effect 是否为激活状态，用于用户自主控制响应式
  public active = true
  constructor(public fn: any, public scheduler: any) {}
  // run 就是执行 effect
  run() {
    // 如果 effect 未激活，那么直接执行 fn 函数
    if (!this.active) {
      return this.fn()
    }
		// 这里 try finally 代码块主要为了标识 effect 的作用域，并最终执行用户传递过来的函数
    try {
      this.parent = activeEffect
      activeEffect = this
      return this.fn()
    } finally {
      activeEffect = this.parent
    }
  }
  // 用于停止数据响应式
  stop() {
    if (this.active) {
      this.active = false
      cleanupEffect(this) // 清除收集的依赖
    }
  }
}
```

> 我们已经讲过收集依赖是在 `proxy` 的 `get` 方法中，而如果要触发 `get` 函数，必须要执行用户传递给 `effect` 的参数函数，而执行这个参数函数就是在 `ReactievEffect` 实例的 `run` 方法上

- `effect` 函数

注释的代码是用户手动规定响应式渲染方式，即 `effect` 函数的第二个参数

```typescript
export function effect(fn: any, options: any = {}) {
  // const _effect = new ReactiveEffect(fn, options.scheduler)
  // _effect.run()
  // runner.effect = _effect
  // return runner
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}
```

- `track` 和 `trigger` 函数

之前一直在讲依赖收集，那么依赖收集最终要求的格式是什么，也就是说收集了个什么东西？

事实上，最终收集的数据格式大概是这样：

1. 每一个 `effect`(`ReactiveEffect` 实例) 对应多个数据(`dep`)
2. 每一个 `dep`(数据) 都对应多个 `effect`

`track` 函数：

> `activeEffect` 表示当前激活的 `effect`，

```typescript
let targetMap = new WeakMap()
export function track(target, type, key) {
  // 只在 activeEffect 中收集依赖
  if(!activeEffect) return
  // depsMap 中存储了要收集的依赖
  let depsMap  = targetMap.get(target)
  if(!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if(!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  trackEffect(dep)
}

// 最终收集依赖的函数
export function trackEffect(dep) {
  if(activeEffect) {
    let shouldTrack = !dep.has(activeEffect)
    if(shouldTrack) {
      // 循环引用似乎有点问题，暂时不清楚 vue 为啥这样做
      dep.add(activeEffect)
      activeEffect.deps.push(dep)
    }
  }
}
```

原理图

![](https://plumbiu.github.io/blogImg/track原理.png)

`trigger` 函数：

```typescript
export funciton trigger(target, type, key, value, oldValue) {
  const depsMap = targetMap.get(target)
  if(!depsMap) return
  const effects = depsMap.get(key)
  if(effects) {
    triggerEffect(effects)
  }
}

export function triggerEffect(effects: any) {
  // 永远在执行之前，先拷贝一份来执行，不要关联引用
  effects = [...effects]
  effects.forEach((effect: ReactiveEffect) => {
    // 执行 cleanupEffect 的时候，又要执行自己，需要屏蔽到这种情况，因为会导致无限循环
    if (effect !== activeEffect) {
      effect.run() // 否则默认刷新视图
    }
  })
}
```

## 实现原理

`computed` 函数

```typescript
export function computed(getterOrOptions) {
  // 判断用户传入的是函数还是对象
  let onlyGetter = isFunction(getterOrOptions)
  let getter
  let setter
  if(onlyGetter) {
    getter = getterOrOptions
    setter = () => console.log('no set')
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }
  return new ComputedRefImpl(getter, setter)
}
```

`ComputedRefImpl` 类：

```typescript
class ComputedRefImpl {
  public effect: any
  public _dirty = true
	public _v_isReadonly = true
  public _v_isRef = true
  public _value: any
  public dep = new Set()
  constructor(getter, public setter: any) {
    this.effect = new ReactiveEffect(getter, () => {
      if(!this._dirty) {
        this._dirty = true
        triggerEffect(this.dep)
      }
    })
  }
  get value() {
    trackEffect(this.dep)
    // 使用 _dirty 可以避免用户每次取值的时候，都要执行 this.effect.run，即缓存效果
    // _dirty 设置值时会变为 true，此时才会执行 this.effect.run 重新计算结果
    if(this._dirty) {
      this._dirty = false
      this._value = this.effect.run()
    }
    return this._value
  }
  set value(newValue) {
    this.setter(newValue)
  }
}
```

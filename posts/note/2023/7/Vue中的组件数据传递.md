---
title: Vue 组件之间的数据传递
date: 2023-07-09
---

# 父向子传值

只需要父向子传值有三种方法：

1. `prop` 传参：直接将数据作为子组件标签元素即可
2. `provide`、`inject` 依赖注入

## prop 传参

父组件 `Father.vue`：

```vue
<script setup>
import Son from './Son.vue'
</script>
<template>
	<Son msg="hello" />
</template>
```

子组件 `Son.vue`：

> 只需要 `defineProps` 中说明有哪些 `prop` 即可

```vue
<script setup>
defineProps<{
  msg: string
}>()
</script>
<template>
	<div>
    <h1>Son - {{ msg }}</h1>
  </div>
</template>
```

## `provide`、`inject` 依赖注入

`provide` 和 `inject` 不仅支持父向子传递数据，只要组件是父组件的后代，都能通过 `inject` 获得父组件 `provide` 传递的数据

父组件 `Father.vue`：

```vue
<script setup>
import Son from './Son.vue'
import { provide } from 'vue'
provide('dataFromFather', {
  msg: 'hello'
})
</script>
<template>
	<Son />
</template>
```

子组件 `Son.vue`：

```vue
<script setup>
import { inject } from 'vue'
const { msg } = inject('dataFromFather')
</script>
<template>
	<div>
    <h1>Son - {{ msg }}</h1>
  </div>
</template>
```



# 子向父传值

只需要子向父传值可以有一种方法：

- `defineExpose` 将数据暴露出去

## defineExpose

子向父传值，Vue 提供了 `defineExpose` 方法，可以将组件的数据向外暴露出去，如果要拿到，就要获取组件实例

子组件 `Son.vue`：

```vue
<script setup lang="ts">
import { ref } from 'vue'
const a = ref(12)
// 将 a 数据暴露出去
defineExpose({
  a,
})
</script>

<template>
  <div>
    <h1>Son</h1>
    <div>Son a: {{ a }}</div>
  </div>
</template>
```

父组件 `Father.vue`：

> 子组件向外暴露的值，只有在 `onMounted` 生命周期钩子里才能获得

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const a = ref(0) // 先定义一个 a
// 获取组件实例
const sonRef = ref(null)
// onMounted 生命周期中可以获取到 Son 组件向外暴露的数据
onMounted(() => {
  a.value = sonRef.value.a
})
</script>

<template>
	<div>
    <h1>Fahter</h1>
    <div>Father: {{ a }}</div>
    <Son ref="sonRef" />
  </div>
</template>
```

# 双向传递

双向传递即子可以向父组件传递数据，父组件也可以向子组件传递数据吗，同时该数据在任何一个组件修改，都会影响到其他组件

双向传递可以有两种：

- 组件间的 `v-model`
- 传递函数

## 组件间的 v-model

父组件 `Father.vue`：

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Son from './Son.vue'
const c = ref(1)
</script>

<template>
  <div>
    <h1>Father</h1>
    <Son v-model="c" />
  </div>
</template>
```

子组件 `Son.vue `：

> 这里只能用 `modelValue` 作为 `prop` 名

```vue
<script setup lang="ts">
import { ref } from 'vue'
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>

<template>
  <div>
    <h1>Son</h1>
    <input :value="modelValue" @input="$emit('update:modelValue', ($event.target as any).value)" />
    <button @click="$emit('update:modelValue', modelValue + 1)">Son 组件 => C加一</button>
  </div>
</template>
```

`defineProps` 也可以支持 ts 泛型导入

## 传递函数

父组件 `Father.vue`：

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Son from './Son.vue'

const c = ref(1)
function changeC(val?) {
  if(val) {
    c.value = val
  }
  return c // 传递的 c 是响应式的
}
</script>

<template>
  <div>
    <h1>Father - {{ c }}</h1>
    <button @click="c++">父组件C加一</button>
    <Son :changeC="changeC" />
  </div>
</template>
```

子组件 `Son.vue`：

```vue
<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps(['changeC'])
const c = props.changeC() // 得到父组件传过来的数据
</script>

<template>
  <div>
    <h1>Son - {{ c }}</h1>
    <button @click="changeC(1111)">改变父组件的C</button>
  </div>
</template>
```

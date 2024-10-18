---
title: VueI18n
date: 2023-02-08
---

# 基本使用

贴个官网：[Vue I18n | Vue I18n (intlify.dev)](https://vue-i18n.intlify.dev/)

## Getting Started

首先引入 CDN

```html
<script src="https://unpkg.com/vue@3"></script>
<script src="https://unpkg.com/vue-i18n@9"></script>
```

创建 HTML 基本结构

```html
<div id="app">
    <p>{{ $t('message.hello') }}</p>
</div>
```

书写JS内容

1. 创建**语言**之间的**翻译**
   
   这里的对象与 HTML 中的 `{{ $t('message.hello') }}` 对应
   
   ```javascript
   const messages = {
       en: {
           message: {
               hello: 'hello world'
           }
       },
       zhcn: {
           message: {
               hello: '你好 世界'
           }
       }
   }
   ```

2. 创建 i18n 对象实例
   
   ```javascript
   const i18n = VueI18n.createI18n({
       locale: 'zhen', // 设置本地场景语言
       fallbackLocale: 'en', // 设置本来的语言
       messages: messages, // 配置项，与上文的 messages 对象对应
   })
   ```

3. 使用 Vue 控制标签
   
   ```javascript
   const app = Vue.createApp()
   app.use(i18n)
   app.mount('#app')
   ```

此时页面将展示 **你好世界** 中文

## 基本使用

### 具名差值

在上面的章节中，我们使用了 `{{ $t(‘’) }}` 语法，我们可以把 `$t` 看为一个**函数**，也就是说，他可以传递参数。

对上面的例子进行改造

```html
<p>{{ $t('message', { msg: 'hello' }) }}</p>
<script>
    const messages = {
        en: {
            message: {
                hello: '{msg} world'
            }
        }
    }
</script>
```

上述例子中，我们传递了一个对象，其中含有 `msg` 属性，在 messages 对象中，我们可以用 `{msg}` 形式来接收值。

当然，我们也可以传递数组

```html
<p>{{ $t('message', ['hello']) }}</p>
<script>
    const messages = {
        en: {
            message: {
                hello: '{0} world'
            }
        }
    }
</script>
```

此时需要用到 `{0}` 形式

同时也可以设置多个属性来接收值

```html
<p>email: {{ $t('address', { account: 'foo', domain: 'domain.com' }) }}</p>
<script>
    const messages = {
        address: "{account}{'@'}{domain}"
    }
</script>
```

其中 `{‘@’}` 代表直接返回一个字符串

输出：

```html
<p>email: foo@domain.com</p>
```

### messages 对象

如果有一些 messages key 经常被使用，可以使用 `@:key` 语法来使用它：

```html
<p>{{ $t('message.linked') }}</p>
<script>
    const messages = {
        en: {
            message: {
                the_world: 'the world',
                dio: 'DIO',
                linked: '@:message.dio @"message.the_world !!!"'
            }
        }
    }
</script>
```

### @:key 语法

Built-in Modifiers：内置修改器(不知道翻译的对不对)

`@key` 可以带有修饰符，就像 Vue 中的 `@click.stop` 一样，Vue-i18n 的用法是 `@.modifier:key`，其中内置的 `modifier` 有三种

- `upper` 将所有字母大写
- `lower` 将所有字母小写
- `capitalize` 只将首字母大写

```html
<p>{{ $t('message.word') }}</p>
<script>
const messages = {
    en: {
        message: {
            prefix: 'hello',
               suffix: 'world',
               word: '@.capitalize:message.prefix @.upper:message.suffix !!!!'
          }
    }
}
</script>
```

显示：

```html
<p>Hello WORLD !!!!</p>
```

### 自定义修改(Custom Modifiers)

如果不想使用内置修改器(built-in modifers)的话，可以使用自定义修改。

想要使用自定义修改，应该在 `createI18n` 方法中定义 `modifiers` 属性，内容是定义如何修改的函数。

```javascript
const i18n = VueI18n.createI18n({
    locale: 'en',
    messages: messages,
    modifiers: {
        noa: (str) => str.replace(/a/g, '')
    }
})
```

`messages` 对象配置：

```javascript
const messages = {
    en: {
        message: {
            words: 'aaa帅哥鉴赏',
              uname: "@.noa:{'message.words'}"
           }
       }
}
```

`@.noa:{‘message.words’}` 表示 绑定 message 属性中的 words 项，等同于 `@.noa:message.words`

### 官方提供的另一种渲染方式

**不建议**

```html
<p v-html="$t{'message.hello'}"></p>
```

## 多元化

### 基本使用

首先我们需要使用管道符 `|` 分隔内容，像是下面这样：

```javascript
const messages = {
    en: {
        car: 'benchi | baoma',
        food: 'niu | yang | {named}'
    }
}
```

`Vue.createI18n` 方法不变，这些多值的属性，VueI18n 为我们提供了 `$tc` API 去灵活使用。

```html
<p>{{ $tc('message.car', 0) }}</p>
<p>{{ $tc('message.car', 1) }}</p>
<p>{{ $tc('message.food', 0) }}</p>
<p>{{ $tc('message.food', 1) }}</p>
<p>{{ $tc('message.food', 100, { named: 'zhu' }) }}</p>
```

和 `$t` 不同的是，`$tc` 可以在第二个参数中传入索引值，并且当索引值超出 `messages` 中类似数组的长度，就会显示最后一个，第三个参数是传入对象，与 `$t` 一致

### 自定义

有一些多元化方式并不适合所有语言，所以 VueI18n 还提供了可选的 `pluralizationRules` 去满足用户需求(虽然做的很棒，但我确实看不懂这里的语言，各位可以去官网看)：[Pluralization | Vue I18n (intlify.dev)](https://vue-i18n.intlify.dev/guide/essentials/pluralization.html)

## Datetime Formatting

顾名思义，本章将讲解 `Datetime Formatting` 的知识

```javascript
const datetimeFormats = {
  'en': {
    short: {
      year: 'numeric', month: 'short', day: 'numeric'
    },
    long: {
      year: 'numeric', month: 'short', day: 'numeric',
      weekday: 'short', hour: 'numeric', minute: 'numeric'
    }
  }
}
```

另外需要额外配置 `VueI18n.createI18n` 方法

```javascript
const i18n = VueI18n.createI18n({
      datetimeFormats
})
```

VueI18n 提供了 `$d` API，第一个参数可以传入一个 `Date` 类，第二个参数填 `datetimeFormats` 配置对象的属性，当然此方法存在第三个参数，如果不填，默认显示的是 `VueI18n.createI18n` 配置的 `locale` 的属性值。这里篇幅有限，详细可以看项目文件。

```html
<p>{{ $d(new Date(), 'short') }}</p>
```

## Number Formatting

```javascript
const numberFormats = {
      'en-US': {
        currency: {
              style: 'currency', currency: 'USD', notation: 'standard'
        },
        decimal: {
              style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2
        },
        percent: {
              style: 'percent', useGrouping: false
        }
      },
}
```

另外需要额外配置 `VueI18n.createI18n` 方法

```javascript
const i18n = VueI18n.createI18n({
      numberFormats
})
```

VueI18n 提供了 `$n` API，第一个参数可以传入数字，第二个传入 `numberFormats` 对应的属性，第三个同 `Datetime Formatting` 一样，这里不多赘述，另外还可以传入第四个参数，代表显示的格式

```html
<p>{{ $n(10000, 'currency') }}</p>
<p>{{ $n(10000, 'currency', 'ja-JP') }}</p>
<p>{{ $n(10000, 'currency', 'ja-JP', { useGrouping: false }) }}</p>
<p>{{ $n(987654321, 'currency', { notation: 'compact' }) }}</p>
<p>{{ $n(0.99123, 'percent') }}</p>
<p>{{ $n(0.99123, 'percent', { minimumFractionDigits: 2 }) }}</p>
<p>{{ $n(12.11612345, 'decimal') }}</p>
<p>{{ $n(12145281111, 'decimal', 'ja-JP') }}</p>
```

| 参数  | 可选值                                                        | 作用                                      |
| --- | ---------------------------------------------------------- | --------------------------------------- |
| 第一个 | 任何数字                                                       | 显示的数字                                   |
| 第二个 | currency、percent、decimal                                   | 货币、百分号、十进制                              |
| 第三个 | 配置语言，此项在 `numberFormats` 中配置                               | 切换显示语言                                  |
| 第四个 | 是一个对象，对象中有 `useGrouping、notation、minimumFractionDigits` 属性 | 具体配置如何显示，如不用逗号隔开`{useGrouping: false}`等 |

# Vue中使用

## Scope

Vue 应用程序由树状的组件构成。为了让每个组件都可以使用 Vue I18n 的特性，我们需要理解 scope 的组成

Vue I18n 拥有两种 scope(作用域)

- global scope(全局作用域)

- local scope(本地作用域)

![scope](https://vue-i18n.intlify.dev/scope.png)

### Global Scope(全局作用域)

如果我们想要改变整个应用的 locale，我们可以使用全局 `$i18n.locale`

**main.js**

```javascript
const i18n = createI18n({
  locale: 'zh', // 设置当前 locale
  messages: {
    en: {
      hello: 'hello world'
    },
    zh: {
      hello: '你好世界'
    }
  },
  // ohter options
})
createApp({
  // some vue options
}).use(i18n).mount('#app')
```

**Component**

```html
<template>
  <div>
    <select v-model="$i18n.locale">
      <option
        v-for="locale in $i18n.availableLocales"
        :key="`locale-${locale}`"
        :value="locale"
      >
        {{ locale }}
      </option>
    </select>
  </div>
</template>
```

### Local Scope

本地作用域的 `locale` 默认继承自全局作用域。因此，当改变了全局的 `locale` 时，本地作用域的 `locale` 也会发生变化 

如果想要通过修改本地作用域来影响整个组件，我们需要通过 `global` 属性

> NOTE
> 
> 如果我们不想让本地作用于继承全局的`locale`, 我们需要设置 `i8n` 组件的`sync` 属性为 false.

```javascript
const i18n = createI18n({
  locale: 'zh',
  // vue-i18n something options here ...
  // ...
})
createApp({
  // something vue options here ...
}).use(i18n).mount('#app')
// change locale via `global` property

// when vue-i18n is being used with legacy: false, note that i18n.global.locale is a ref, so we must set it via .value:
i18n.global.locale.value = 'en'
// otherwise - when using legacy: true, we set it like this:
i18n.global.locale = 'en'


```

### Fallbacking

`fallbackLocale: '<lnag>'` 选择你想要看到的语言。

例如，某个网站默认为英文，但是网站的中文客户也很多，于是网站开发者可以将 `fallbackLocale` 属性设置为 `zh`

```javascript
const i18n = createI18n({
  locale: 'ja',
  fallbackLocale: 'en',
  messages
})
```

**Template**

```html
<p>{{ $t('hello') }}</p>
```

## Composition API

```html
<script setup>
const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      msg: 'hello',
      named: '{msg} world!',
      list: '{0} world!',
      literal: '{"hello"} world!',
      the_world: 'the world',
      dio: 'DIO:',
      linked: '@:dio @:the_world !!!!'
    },
    ja: {
      msg: '你好',
      named: '{msg} 世界！',
      list: '{0} 世界！',
      literal: "{'你好'} 世界！",
      the_world: '世界！',
      dio: '你好:',
      linked: '@:dio @:the_world ！！！！'
    }
  }
})
const msg = computed(() => {
  return t('msg')
})
</script>
```

注意，使用 Composition API 需要将 `leagcy` 设置为 `false`

```javascript
const i18n = createI18n({
  legacy: false
})
```

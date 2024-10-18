---
title: rollup/pluginutils 的使用
date: 2023-08-22
---

接触到这个依赖是最近在做 [truth-cli](https://github.com/truthRestorer/truth-cli) 时，发现 `vite` 把 public 文件夹下的 `.gitkeep` 也当做了打包文件。

可能有的人会感觉到奇怪，为什么我要在 public 下加入 `.gitkeep`，这是因为某些特殊原因，`public` 会在 `dev` 和部署 `vercel` 时用到，如果我不添加 `.gitkkep`，那么用户开发我的仓库，便会报错。 

接着我便从源码入手，尝试解决，从 [vite-plugin-vue](https://github.com/vitejs/vite-plugin-vue) 中，我发现了 `createFilter` 函数，但是并不是这个插件造成的，于是我便翻看 `vite` 的文档和源码，找到了大概位置：

```typescript
function prepareOutDir(
outDirs: string[],
 emptyOutDir: boolean | null,
 config: ResolvedConfig,
) {
  // ...
  if (
    config.build.copyPublicDir &&
    config.publicDir &&
    fs.existsSync(config.publicDir)
  ) {
    // ...
    copyDir(config.publicDir, outDir)
  }
}
```

`copyDir`:

```typescript
export function copyDir(srcDir: string, destDir: string): void {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    if (srcFile === destDir) {
      continue
    }
    const destFile = path.resolve(destDir, file)
    const stat = fs.statSync(srcFile)
    if (stat.isDirectory()) {
      copyDir(srcFile, destFile)
    } else {
      fs.copyFileSync(srcFile, destFile)
    }
  }
}
```

能大概看出来，`vite` 只对 `public` 只做了复制和不复制的操作，这确实能满足很大需求，当时我想着能不能增加一下选项，例如加一个 `exclude` 选项，所以我先提了一个 [issue](https://github.com/vitejs/vite/issues/14148)，但是从 `vite` 成员的回答上看，他们并不想要这个 new feature(我觉得也挺合理的，毕竟应用场景十分有限，而且从文档上看这个选项目前还是实验性的)

![image-20230820212141731](https://plumbiu.github.io/blogImg/image-20230820212141731.png)

但我还是提了 `pr`，也无非增加了几句话：

```typescript
function prepareOutDir(
outDirs: string[],
 emptyOutDir: boolean | null,
 config: ResolvedConfig,
) {
  // ...
  if (
    config.build.copyPublicDir &&
    config.publicDir &&
    fs.existsSync(config.publicDir)
  ) {
    // ...
    copyDir(
      config.publicDir,
      outDir,
      config.build.copyPublicDir === true
      ? undefined
      : config.build.copyPublicDir.exclude,
    )
  }
}
```

`copyDir`:

```typescript
export function copyDir(
  srcDir: string,
  destDir: string,
  exclude?: FilterPattern,
): void {
  fs.mkdirSync(destDir, { recursive: true })
  const filter = createFilter(undefined, exclude)
  const _exclude = Array.isArray(exclude) ? exclude : [exclude]
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    if (srcFile === destDir || !filter(file) || _exclude.includes(file)) {
      continue
    }
    const destFile = path.resolve(destDir, file)
    const stat = fs.statSync(srcFile)
    if (stat.isDirectory()) {
      copyDir(srcFile, destFile)
    } else {
      fs.copyFileSync(srcFile, destFile)
    }
  }
}
```

由于不是很会用 `createFilter` 函数，我在尝试使用字符串时均不能匹配成功，所以这个 pr 比较"潦草"

后来我才掌握了正确的使用技巧，`createFilter` 还接受第三个参数，我们稍加修改，便可以更合理的处理代码：

```typescript
export function copyDir(
  srcDir: string,
  destDir: string,
  exclude?: FilterPattern,
): void {
  fs.mkdirSync(destDir, { recursive: true })
  const filter = createFilter(undefined, exclude, { resolve: false })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    if (srcFile === destDir || !filter(file)) {
      continue
    }
    const destFile = path.resolve(destDir, file)
    const stat = fs.statSync(srcFile)
    if (stat.isDirectory()) {
      copyDir(srcFile, destFile)
    } else {
      fs.copyFileSync(srcFile, destFile)
    }
  }
}
```

好，接下来讲怎么使用：

# addExtension

在开发时，我们经常在 `import` 文件的时候忽略后缀，`addExtension` 便是处理这种问题：如果用户省略了后缀导致文件不存在，那么在处理时便加上这个后缀：

```typescript
import { addExtension } from '@rollup/pluginutils'

console.log(addExtension('a')) // a.js
console.log(addExtension('a.js')) // a.js
console.log(addExtension('a', '.txt')) // a.txt
console.log(addExtension('a', 'txt')) // atxt
console.log(addExtension('a.js', '.txt')) // a.js
```

# createFilter

顾名思义，`createFilter` 用于创建过滤器

根据官网介绍：这个是用于解析 `process.cwd()` 以外的目录解析模式，也可以用于简单的过滤

1. 我们先看简单的过滤函数：

```typescript
// 如果只先要判断某个字符串是否包含可以加入 { resolve: false } 选项
// 1. 如果 includes 和 excludes 都为 undefined 那么无论是什么都会返回 true
const filter1 = createFilter(undefined, undefined, {
  resolve: false
})
filter1('any thing' as any) // true

// 2. 加入 includes，意味着只有字符为 a 时才为 true
const filter2 = createFilter('a', undefined, {
  resolve: false
})
filter2('a') // true
filter2('a') // true
```

除了以上简单的实例，我们还可以传入正则和特殊的判断字符，例如以下过滤器：

```typescript
const filter3 = createFilter(/a/, undefined, {
  resolve: false
})
const filter4 = createFilter('a*', undefined, {
  resolve: false
})
```

2. 过滤路径

`@rollup/pluginutils` 本身就是为了开发插件用的，当我们开发插件时，肯定会遇到各种路径问题，我们可以使用 `resolve` 很好的解决

例如我们创建一个只过滤 `D:/Code/src` 目录下(不包括子目录)包含 `.vue` 文件的过滤器

```typescript
const filter = createFilter('*.vue', undefined, {
  resolve: 'D:/Code/src'
})

const filterPlugin = {
  name: 'vite-filter-plugin',
  transform(code, id) {
    console.log({ id, filter: filter(id)});
    if (filter(id)) {
      return
    }
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), filterPlugin],
  
})
```

查看打印结果，只存在一种为 true 的情况

```typescript
{
  id: 'D:/Code/src/App.vue',
  filter: true
}
```

# dataToEsm

将对象转换为 `ES module`:

```typescript
const source = dataToEsm({
  foo: 'bar',
  hello: 'world'
})

console.log(source)
// export var foo = "bar";
// export var hello = "world";
// export default {
//         foo: foo,
//         hello: hello
// };
```

我们也可以通过设置选项更改输出内容格式：

```typescript
const source2 = dataToEsm({
  foo: 'bar',
  hello: 'world'
}, {
  compact: false,
  indent: '\t',
  preferConst: true,
  objectShorthand: true,
  namedExports: true
})

console.log(source2)
// export const foo = "bar";
// export const hello = "world";
// export default {
//         foo,
//         hello
// };
```

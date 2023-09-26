---
title: 构建工具(Webpack、Vite)
date: 2023-3-13 15:39:00
updated: 2023-3-13 15:39:00
tags:
  - Webpack
  - Vite
  - 构建工具
categories:
  - FE
---

# 构建工具简介

前端编写 html、css 和 js 时，会因为模块化不能正常使用(有些浏览器不支持，例如以下代码)，即使抛开兼容性，也会面临模块加载过多的问题，所以就希望有一款工具可以对代码进行打包，将多个模块打包成一个文件，这样既解决了兼容性问题，又解决了模块过多的问题

```html
<script type="module"></script>
```

同时构建工具还起着一个非常重要的作用：通过构建工具可以将使用 ESM 规范编写的代码转换为旧的 JS 语法，这样可以使得所有浏览器都支持

# Webpack

## 初始化

1.   初始化项目

     ```bash
     yarn init -y
     ```

2.   安装依赖 `webpack`、`webpack-cli`

     ```bash
     yarn add -D webpack webpack-cli # 开发阶段使用
     ```

3.   在项目中创建 `src` 目录，在 `src` 中编写代码(`index.js`)

4.   打包命令(基于 `webpack-cli`)，项目根目录会出现 `dist` 打包目录

     ```bash
     npx webpack
     ```

     或者

     ```bash
     yarn webpack
     ```

5.   配置 `package.json`

     ```json
     {
         "script": {
             "build": "webpack",
             "watch": "webpack --watch",
             "dev": "webpack server --open"
         }
     }
     ```

     这样运行 `yarn build` 就会打包了，如果希望在修改代码的时候自动打包，可以使用 `yarn watch` 或者 `yarn dev`

## webpack 打包的特性

1.   当 `export` 导出的对象没有使用的时候，webpack 不会打包

     ```javascript
     // src/m1.js
     export default {
         a: 10, // 未使用的变量不会打包，下面的属性 b 同理
         b: 20,
         sayHi() { console.log('Hello') }
     }
     ```

     ```typescript
     // src/index.js
     import m1 from './m1'
     m1.sayHi()
     ```

2.   但是 `export` 导出模块外的代码，即使未使用也会被打包

     ```javascript
     // src/m2.js
     import $ from 'jquery' // 未使用 jquery，但也会被打包
     export default {
         setHi() {
         	document.body.insertAdjacentHTML('beforeend', '<h1>你好, webpack</h1>')
         }
     }
     ```

## webpack 配置

我们通过在根目录创建 `webpack.config.js` 文件来配置 webpack，`webpack.config.js` 是 webpack 配置的入口文件。

`webpack.config.js` 需要使用 CommonJS 规范(因为在 NodeJS 环境中)导出一个对象

```javascript
module.exports = { /* OPTIONS */ }
```

### mode

`mode` 表示代码运行的环境，可以选择 `production`、`development`，分别表示**生产模式**和**开发模式**

```javascript
module.exports = {
    mode: 'production'
}
```

### entry

`entry` 表示打包的入口文件，`entry` 可以是一个字符串，也可以是对象或者数组。

**字符串**：

```javascript
module.exports = {
	entry: '/src/index.js' // 默认配置
}
```

**数组**：

```javascript
module.exports = {
    entry: [
        './src/a.js',
        './src/b.js'
    ]
}
```

**对象**：

```javascript
module.exports = {
    entry: {
        a: './src/a.js',
        b: './src/b.js'
    }
}
```

>   **注**：**字符串**和**数组**形式会打包在 `main.js` 一个文件中，即使数组中有多个值。但是对象格式可以打包为多个文件，如上述代码中分别会打包为 `a.js` 和 `b.js`

### output

`output` 表示打包后的目录地址，也可以配置打包后的文件夹名字

>   注意，`path` 配置选项必须是绝对路径，所以使用 `path.join()` 方法

-   `filename`：配置打包后 `js` 文件名称，可以通过 `[]` 方式填入不同值，如下面代码可选值
-   `clean`：执行打包命令后是否清空打包目录文件，默认为 `false`


```javascript
const path = require('path')
module.exports = {
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        // filename: '[name]-[id]-[hash].js',
        // clean: true
    }
}
```

### module

`webpack` 默认情况下只会处理 js 文件，如果要增添对其他文件(例如 css、png)的打包支持，需要配置 `module` 选项，具体见下一章节 **loader 的配置**

### Plugins

`Plugins` 插件用来为 webpack 来扩展功能，例如：html-webpack-plugin：打包后，自动在打包目录生成 html 页面

**安装：**

```
yarn add html-webpack-plugin -D
```

**使用：**Plugin 的使用很简单，以 `html-webpack-plugin` 为例

```javascript
const HTMLPlugin = require('html-webpack-plugin')
module.exports = {
    plugins: [new HTMLPlugin()]
}
```



## loader 的配置

我们需要在 `module.rules` 数组中配置具体文件的规则。

### 增添 css-loader

**安装：**

```bash
yarn add css-loader style-loader -D
```

配置 `module.rules`：

```javascript
module.exports = {
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] } // use 数组的顺序不能反
        ]
    }
}
```

### 增添图片支持

图片不需要安装额外的依赖，只需增添 `type: 'asset/resource'` 即可

```javascript
module.exports = {
    module: {
        rules: [
            { test: /\.(jpg|png|gif|svg)/, type: 'asset/resource' }
        ]
    }
}
```

### Babel

在编写 js 代码时，经常需要使用一些新特性，而这些特性在旧的浏览器中兼容性并不是很好。为了解决这些问题，babel 可以将这些新的语法特性转换为旧代码，以保持各种版本浏览器的兼容问题

如果希望在 `webpack` 支持 `babel`，则需要向 `webpack` 中引入 `babel` 的 `loader`

1.   安装

```bash
yarn add babel-loader @babel/core @babel/preset-env -D
```

2.   配置 `webpack.config.js`

-   `exclude`：表示排除符合条件的文件或文件夹
-   `use.loader`：表示使用什么 loader
-   `use.options`：表示 loader 的配置选项

```javascript
module: {
  	rules: [
		{
      		test: /\.m?js$/,
      		exclude: /node_modules/,
      		use: {
        		loader: 'babel-loader',
        		options: {
          			presets: ['@babel/preset-env']
        		}
      		}
    	}
  	]
}
```

配置成功之后，就可以运行打包命令 `yarn build`，查看打包后的文件

3.   设置浏览器兼容列表

我们可以修改 `package.json` 中的 `browserslist` 来增添对不同浏览器的兼容性，具体配置可看 [browserslist🦔](https://github.com/browserslist/browserslist)

**默认配置：**

```json
{
    "browerslist": [
        "defaults"
    ]
}
```

**增添配置**：项目里别这么写(会被打)

```javascript
{
    "browerslist": [
        "defaults",
        "ie 6-8"
    ]
}
```

## 添加 webpack 服务器

安装 `webpck-dev-server`

```bash
yarn add webpack-dev-server -D
```

之后运行以下命令，即可启动服务器

```bash
yarn webpack server
```

## sourceMap

`webpack` 默认打包的代码都在一行，这对我们开发者找到错误很不友好，为了解决这一问题，需要在 `webpack.config.js` 设置 `devtool: ‘inline-source-map’`。

>   注意：`mode` 需要设置为 `development` 开发模式

```javascript
module.exports = {
  mode: 'development', // 设置打包的模式，production 表示生产模式，development 开发模式
  devtool: 'inline-source-map'
}
```

# Vite

Vite 也是前端的构建工具，但相较于 `webpack`，vite 采用了不同的运行方式:

-   开发时，并不对代码打包，而是直接采用 ESM 的方式来运行项目
-   在项目部署时，再对项目进行打包

除了速度外，vite 使用起来也更加方便

## 初始化

**安装**

```bash
yarn add vite -D
```

新建文件 `index.html` 和 `index.js`

```html
<!-- index.html -->
<script type="moudle" src="./index.js" ></script>
```

```javascript
// index.js
document.body.insertAdjacentHTML('beforeend', '<h1>Hello, Vite</h1>')
```

之后使用 `yarn vite` 即可启动服务，如果想要打包，可以执行 `yarn vite build`，当然最好先配置一下 `package.json` 的 `“script”`

```json
"script": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
}
```

>   注：
>
>   -   `index.html` 标签需要加入 `type=“module”` 属性
>   -   当我们运行 `yarn build` 时，想要查看项目打包后的代码，需要使用 `yarn preview` 命令，打开 `dist/index.html` 是无法查看的

## 安装模板

自己手动配置 `Vite` 还是很麻烦，这时候我们可以使用社区里的模板，使用下面的命令，会让你手动选择框架(Vue、React....)、语言(JavaScript、TypeScript....)等

```
yarn create vite
```

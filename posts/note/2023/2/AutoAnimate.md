---
title: AutoAnimate简单动画库的使用
date: 2023-02-08
---

贴一下官网地址：[AutoAnimate](https://link.juejin.cn/?target=https%3A%2F%2Fauto-animate.formkit.com%2F "https://auto-animate.formkit.com/") ，项目代码地址：[Plumbiu/autoanimate](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FPlumbiu%2Fautoanimate "https://github.com/Plumbiu/autoanimate")

你是否还在纠结如何用css写出漂亮的动画效果？当写完css后，然后又要使用js去操作DOM？AutoAnimate将帮你省去这些麻烦，只需一个函数，完成所有的动画效果！同时AutoAnimate具有天然的跨框架优势，支持多种框架。

# 库的基本使用

AutoAnimate动画库不需要我们配置任何信息，我们只需简单引用钩子函数并进行一些简单操作即可达到目的，具体操作如下：

```jsx
import { useAutoAnimate } from '@formkit/auto-animate/react'

function myAnimation() {
    const [animationParent] = useAutoAnimate()
    return (
        <ul ref={animationParent}>
            {/* 增添、显示隐藏等操作将会添加动画 */}        </ul>
    )
}
```

我们首先引入 `useAutoAnimate` 钩子函数，这个函数返回一个数组，我们用 `[animationParent]` 接收，找到需要增添(显示隐藏)数据操作元素的父元素，将其指定为父元素的ref属性即可。

这样当我们增添数据时就有动画效果了，具体代码请看仓库项目文件。

# autoAnimate

components/Dropdown.jsx

```jsx
import { useState, useRef, useEffect } from 'react'
import autoAnimate from '@formkit/auto-animate'

const Dropdown = () => {
  const [show, setShow] = useState(false)
  const parent = useRef(null)

  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])

  return <div ref={parent}>
    <strong onClick={() => setShow(!show)}>Click me to open!</strong>
    { show && <p>Lorum ipsum...</p> }  </div>
}

export default Dropdown
```

autoAnimate 钩子只需要将父元素的 ref 对象(具体是xxx.current)传入进去即可，非常的简单智能。

## 详细配置

以下配置均为默认值

```javascript
autoAnimate(el, {
  // 动画的持续事件
  duration: 250,
  // 动画模式
  easing: 'ease-in-out'
  // 当设置为true时，动画会在用户没有指示的情况下也会进行，对于不喜欢大量动画的人群，最好关掉
  disrespectUserMotionPreference: false
})
```

同时，autoAnimate函数返回值其实有两个 `const [parent, enableAnimation] = autoAnimate()`，第一个是一个ref对象，第二个是一个函数，可以通过传入值的方式关闭或打开动画

```jsx
// App.jsx
const [animationParent, enableAnimation] = useAutoAnimate()

return (
    <>
        <button onClick={() => enableAnimation(false)}>关闭动画</button>
        <button onClick={() => enableAnimation(true)}>启动动画</button>
    </>
)
```

# 简单实战一下

首先准备 1~50 的数组

```javascript
const numsData = [1, 2, ... , 50]
```

准备打乱数组的方法和state数据，这样只需调用 `numsData.sort(randomSort)既可以打乱舒足乐`

```jsx
const [nums, setNums] = useState(numsData)
function randomSort(a, b) {
    return Math.random() > 0.5 ? -1 : 1
}
```

接下来就与之前一样了，导入 `autoAnimate` 方法，传递父元素ref属性

```javascript
const parent = useRef(null)
useEffect(() => {
    parent.current && autoAnimate(parent.current)
}, [parent])

function randomArr() {
    setNums([...numsData.sort(randomSort)])
}

return (
    <button onClick={randomArr}>点我打乱</button>
    <div ref={parent}></div>
)
```

具体代码可参考项目文件中的 `components/Practice.jsx` 文件，说一下自己遇到的坑，直接 `setNums(numsData.sort(randomSort))`页面不更新，还要用数组展开形式`setNums([...numsData.sort(randomSort)])`，真的神奇，其他的都挺简单，这里不多赘述。

---
title: Threejs examples
date: 2024-11-07
tags: ['threejs']
desc: 1
---

浏览器对 `WebGL Contexts` 数量有要求，数量过多会将旧的删除，因此单独分一个 example 文章：

为了方便创建渲染器，这里写了一个 `buildRenderer`、`buildCamera` 函数：

> 第一个例子没有使用这个函数，因为我觉得注释对理解很有必要

```js
import { type RefObject } from 'react'
import * as THREE from 'three'

export function buildRenderer(ref: RefObject<HTMLDivElement>) {
  const container = ref.current!
  const size = container.clientWidth
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(size, size)
  renderer.pixelRatio = window.devicePixelRatio
  container.appendChild(renderer.domElement)

  return renderer
}

export function buildCamera(x: number, y: number, z: number) {
  const fov = 45
  const aspect = 1
  const near = 0.1
  const far = 1000
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(x, y, z)
  camera.lookAt(0, 0, 0)
  return camera
}
```

# Rotating cube

```tsx Playground='three/ThreePureFirstScene'

```

**如何确保自转时间**？上面的例子中，使用的是 `requestAnimationFrame` api，调用频率与用户的浏览器刷新率有关，不同硬件、浏览器环境下，自转的速度也不一样，为了使得旋转速度一致，我们可以使用 `Clock` 解决：

```js
const clock = new Three.Clock()
function animate() {
  requestAnimationFrame(animate)
  const elapsedTime = clock.getElapsedTime()
  cube.rotation.y = elapsedTime * Math.PI

  renderer.render(scene, camera)
}
```

# Controls

`OrbitControls` 允许我们对场景内容进行旋转、放大缩小等操作

> 注意，如果使用之前的 `animate` 函数不断调用渲染器的 `render` 方法渲染的，是不需要为 `OrbitControls` 添加 `change` 事件的

```tsx Playground='three/ThreeControlPureFirstScene' {23-25}

```

# Light

`MeshBasicMaterial` 不受光源影响，需要设置为 `MeshStandardMaterial`

```tsx Playground='three/ThreeLightPureFirstScene' {14,26-43}

```

# Drawing lines

```tsx Playground='three/ThreePureLine'

```

# Box with edge

```tsx Playground='three/ThreeLearnPrimitivesBox'

```

# Render Text

```tsx Playground='three/ThreePureText'

```

# Loading 3D modales

Three.js 支持很多[导入工具](https://github.com/mrdoob/three.js/tree/dev/examples/jsm/loaders)，官网推荐 [glTF](https://zh.wikipedia.org/wiki/GlTF)（gl 传输格式），这种格式传输效率和加载速度都非常优秀，而且也包括了网格、材质、纹理、皮肤、骨骼、变形目标、动画、灯光和摄像机等，很多工具都包含了 glTF 导出功能：

- [Blender](https://www.blender.org/)
- [Substance](https://www.allegorithmic.com/products/substance-painter)
- [还有更多](http://github.khronos.org/glTF-Project-Explorer/)

three.js 内置了 [`GLTFLoader`](https://threejs.org/docs/index.html#examples/zh/loaders/GLTFLoader)，可以载入 `glTF` 模型。

另外一些环境贴图加载器也是必须的，例如 [`RGBELoader`](https://threejs.org/docs/index.html#api/zh/loaders/DataTextureLoader) 可以加载高动态范围（HDR）环境贴图，通常用于创建更逼真的光照和反射效果，详见 [wiki](https://en.wikipedia.org/wiki/RGBE_image_format)。

```tsx Playground='three/ThreePureModel'

```

# Sun Earth and moon

这个 demo 的关键是了解 three,js 的**场景图**。场景图在 3D 引擎是一个图中节点的层次结构，每个节点代表了一个局部空间（local space）：

例如下面系统的场景图：

![scenegraph-sun-earth-moon](scenegraph-sun-earth-moon.svg)

可能很多人有疑问：为什么需要单独设置 `solarSystem`、`earthOrbit` 和 `moonOrbit`？至少第一次我认为下面的场景图更加简洁：

![scenegraph-solarsystem](scenegraph-solarsystem.svg)

这里的重点在于**局部空间**，参考下面第 22、25 行代码，如果我们将 `sun` 放大五倍，作为子节点的 `earth` 也会放大五倍，同理 `moon` 也会放大五倍，为了避免缩放之间互相影响，我们使用了 [`Object3D`](https://threejs.org/docs/index.html?q=Object3D#api/zh/core/Object3D)将对象进行了**组合**，这样每个图元就不会互相影响了

```tsx Playground='three/ThreeSunEarthMoon' line {22,25}

```

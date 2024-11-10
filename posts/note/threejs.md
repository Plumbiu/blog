---
title: Threejs
date: 2024-11-07
desc: 1
---

Three.js 是基于 [`canvas`](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API) 的一个开源应用级依赖，，它屏蔽了 [`WebGL`](https://developer.mozilla.org/zh-CN/docs/Glossary/WebGL) 底层的调用细节，可以使我们快速在网页创建 3D 效果。此文章是在学习 [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) 是 [three.js](https://github.com/mrdoob/three.js) 之前，我需要了解 [three.js](https://github.com/mrdoob/three.js) 的一些基本概念，这些概念可以帮助我更好的理解 threejs 的设计理念和编程艺术。

# 概念

## 核心元素名词

开发一个 `Three.js` 应用，一般会涉及以下元素：

- `scene` 场景：类似于一个容器（container），可以将物体，包括物体的模型、例子、光源等加入其中
- `object` 物体：物体即我们看到的实际元素，可以是原始的集合体，也可以是导入的模型、粒子、光源等
- `camera` 相机：相机类似于我们的视角，相机也可以做 `scene` 的一部分，但是在页面是不可见的
- `renderer` 渲染器：从 `camera` 的角度渲染，结果绘制到 canvas 中

**通用的模板**

```tsx
import * as THREE from 'three'
// 1. 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true }) // 抗锯齿
renderer.setSize(window.innerWidth, window.innerHeight) // 设置大小
rebderer.pixelRatio = window.devicePixelRatio // 设置像素密度
document.body.appendChild(renerer.domElement) // 将渲染器 dom 加入 body 节点下

// 2. 创建场景
const scene = new THREE.Scene()

// 3. 创建物体
const geomerty = new THREE.BoxGeometry(4, 4, 4) // 物体的几何形状
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 }) // 物体的材质
const object = new THREE.Mesh(geometry, material) // 物体

scene.add(object) // 将物体加入场景
// 4. 创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
)
camera.position.set(15, 15, 15) // 设置相机的位置
camera.lookAt(0, 0, 0) // 相机看向远点

// 5. 调用渲染器 rendr 方法渲染
renderer.render(scene, camera)
```

**Threejs 的结构：**

![threejs-structure](/threejs-structure.svg)

## 透视相机 Perspective Camera

透视相机模拟的是人的视角，人观察物体时，物体近大远小：

```js
const camera = new PerspectiveCamera(fovy, aspect, zNear, zFar)
```

参数含义可以看图：

![view-frustum](view-frustum.png)

## 坐标系统

Three.js 使用的是右手坐标系（伸出右手，大拇指指向 Z 轴，另外四指指向 X 轴，弯曲 90 度就是 Y 轴），Z 轴方向就是屏幕朝向我们的方向。

> **所有物体都会摆在坐标原点位置，也就是 (0, 0, 0) 这个位置**
>
> 这也是为什么相机需要设置位置 `camera.position.set(x, y, z)`，并“看向原点”：`camera.lookAt(0, 0, 0)`

![three-coordinate](three-coordinate.png)

## 光源

Three.js 中三种光源：

- **环境光（Ambient Light）**：均匀光照，会均匀照亮场景中所有物体，不考虑光照源的位置和方向
- **方向光（Directional Light）**：方向光是一种平行光源，具有确定的方向和强度，类似太阳光
- **点光源（Point Light**）：点光源是一种位于特定位置的光源，向所有方向发射光线，类似于灯泡

## 材质 material

材质定义了对象在场景中的外形：

```js
const material = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  flatShading: true, // 定义材质是否使用平面着色进行渲染
})
```

几种材质：

- `MeshBasicMaterial`：不受光照影响
- `MeshLamertMaterial`：只在顶点计算光照
- `MeshPhongMaterial`：每个像素计算光照，还支持镜面高光

:ThreeMaterialKinds

另外 `MeshPhongMaterial` 的 `shininess` 属性决定了镜面高光的光泽度，默认 30

:ThreeMaterialKindsShininess

另外一种材质 `MeshToonMaterial`，它与 `MeshPhongMaterial`，但是它不是平滑地着色，而是使用一种渐变图（一个 X 乘 1 的纹理）来决定如何着色

:ThreeMaterialToonKind

上面的材质是使用简单的数学来制作，看起来是 3D 的，但并不是现实世界存在的，下面 2 中是基于物理引擎（_Physically Based Rendering_，简称 PBR）的材质：

- `MeshStandardMaterial`：有两个参数设置材质，分别是 `roughness` 和 `metalness` 属性，代表粗糙度和金属度
- `MeshPhysicalMaterial`：与 `MeshStandardMaterial` 相同，但是增加了一个 `clearcoat` 参数，表示清漆光亮层的成都，和另一个 `clearCoatRoughness` 参数，指定光泽层的粗糙程度

[例子](https://threejs.org/manual/#zh/materials)，搜索关键字**MeshPhysicalMaterial**，这个例子写的不太好，就不展示了

# Before

虽然目前大多数设备以及浏览器都支持 [WebGL2](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL2RenderingContext)，但是依旧少部分不支持，我们需要给用户提示信息

```js
import WebGL from 'three/addons/capabilities/WebGL.js'

if (WebGL.isWebGL2Available()) {
  // Initiate function or other initializations here
  animate()
} else {
  const warning = WebGL.getWebGL2ErrorMessage()
  document.getElementById('container').appendChild(warning)
}
```

# Examples

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

## Rotating cube

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

## Controls

`OrbitControls` 允许我们对场景内容进行旋转、放大缩小等操作

> 注意，如果使用之前的 `animate` 函数不断调用渲染器的 `render` 方法渲染的，是不需要为 `OrbitControls` 添加 `change` 事件的

```tsx Playground='three/ThreeControlPureFirstScene' {23-25}

```

## Light

`MeshBasicMaterial` 不受光源影响，需要设置为 `MeshStandardMaterial`

```tsx Playground='three/ThreeLightPureFirstScene' {14,26-43}

```

## Drawing lines

```tsx Playground='three/ThreePureLine'

```

## Box with edge

```tsx Playground='three/ThreeLearnPrimitivesBox'

```

## Render Text

```tsx Playground='three/ThreePureText'

```

## Loading 3D modales

Three.js 支持很多[导入工具](https://github.com/mrdoob/three.js/tree/dev/examples/jsm/loaders)，官网推荐 [glTF](https://zh.wikipedia.org/wiki/GlTF)（gl 传输格式），这种格式传输效率和加载速度都非常优秀，而且也包括了网格、材质、纹理、皮肤、骨骼、变形目标、动画、灯光和摄像机等，很多工具都包含了 glTF 导出功能：

- [Blender](https://www.blender.org/)
- [Substance](https://www.allegorithmic.com/products/substance-painter)
- [还有更多](http://github.khronos.org/glTF-Project-Explorer/)

three.js 内置了 [`GLTFLoader`](https://threejs.org/docs/index.html#examples/zh/loaders/GLTFLoader)，可以载入 `glTF` 模型。

另外一些环境贴图加载器也是必须的，例如 [`RGBELoader`](https://threejs.org/docs/index.html#api/zh/loaders/DataTextureLoader) 可以加载高动态范围（HDR）环境贴图，通常用于创建更逼真的光照和反射效果，详见 [wiki](https://en.wikipedia.org/wiki/RGBE_image_format)。

```tsx Playground='three/ThreePureModel'

```

## Sun Earth and moon

这个 demo 的关键是了解 three,js 的**场景图**。场景图在 3D 引擎是一个图中节点的层次结构，每个节点代表了一个局部空间（local space）：

例如下面系统的场景图：

![scenegraph-sun-earth-moon](scenegraph-sun-earth-moon.svg)

可能很多人有疑问：为什么需要单独设置 `solarSystem`、`earthOrbit` 和 `moonOrbit`？至少第一次我认为下面的场景图更加简洁：

![scenegraph-solarsystem](scenegraph-solarsystem.svg)

这里的重点在于**局部空间**，参考下面第 22、25、28 行代码，如果我们将 `sun` 放大五倍，作为子节点的 `earth` 也会放大五倍，同理 `moon` 也会放大五倍，为了避免缩放之间互相影响，我们使用了 [`Object3D`](https://threejs.org/docs/index.html?q=Object3D#api/zh/core/Object3D)将对象进行了**组合**，这样每个图元就不会互相影响了

```tsx Playground='three/ThreeSunEarthMoon' line {22,25,28}

```

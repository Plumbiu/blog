---
title: Threejs
date: 2024-11-07
desc: 1
---

Three.js 是基于 [`canvas`](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API) 的一个开源应用级依赖，，它屏蔽了 [`WebGL`](https://developer.mozilla.org/zh-CN/docs/Glossary/WebGL) 底层的调用细节，可以使我们快速在网页创建 3D 效果。此文章是在学习 [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) 是 [three.js](https://github.com/mrdoob/three.js) 之前，我需要了解 [three.js](https://github.com/mrdoob/three.js) 的一些基本概念，这些概念可以帮助我更好的理解 threejs 的设计理念和编程艺术。

# 概念

## 一些元素名词

开发一个 `Three.js` 应用，一般会涉及以下元素：

- `scene` 场景：类似于一个容器（container），可以将物体，包括物体的模型、例子、光源等加入其中
- `object` 物体：物体即我们看到的实际元素，可以是原始的集合体，也可以是导入的模型、粒子、光源等
- `camera` 相机：相机类似于我们的视角，相机也可以做 `scene` 的一部分，但是在页面是不可见的
- `renderer` 渲染器：从 `camera` 的角度渲染，结果绘制到 canvas 中

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

# Examples

## Rotating cube

```jsx Playground='three/ThreePureFirstScene'

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

### 添加交互

`OrbitControls` 允许我们对场景内容进行旋转、放大缩小等操作

> 注意，这里也是需要 `animate` 函数不断调用渲染器的 `render` 方法渲染的，不然只会渲染一次，导致交互失效

```jsx Playground='three/ThreeControlPureFirstScene' {30,31}

```

### 添加光源

`MeshBasicMaterial` 不受光源影响，需要设置为 `MeshStandardMaterial`

```jsx Playground='three/ThreeLightPureFirstScene' {14-15,26-43}

```

## Drawing lines

```jsx Playground='three/ThreePureLine'

```

## Render Text

```jsx Playground='three/ThreePureText'

```
---
title: Threejs
date: 2024-11-07
tags: ['threejs']
desc: 1
---

Three.js 是基于 [`canvas`](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API) 的一个开源应用级依赖，它屏蔽了 [`WebGL`](https://developer.mozilla.org/zh-CN/docs/Glossary/WebGL) 底层的调用细节，可以使我们快速在网页创建 3D 效果。此文章是在学习 [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) 是 [three.js](https://github.com/mrdoob/three.js) 之前，我需要了解 [three.js](https://github.com/mrdoob/three.js) 的一些基本概念，这些概念可以帮助我更好的理解 threejs 的设计理念和编程艺术。

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

Three.js 中三种基本光源：

- **环境光（Ambient Light）**：均匀光照，会均匀照亮场景中所有物体，不考虑光照源的位置和方向
- **方向光（Directional Light）**：方向光是一种平行光源，具有确定的方向和强度，类似太阳光
- **点光源（Point Light**）：点光源是一种位于特定位置的光源，向所有方向发射光线，类似于灯泡

## 材质 [material](https://threejs.org/docs/#api/zh/materials/Material)

材质定义了对象在场景中的外形。

> 越精细的材质，构建速度往往更加慢，但是场景会更加逼真。因为在移动设备这种低功率设备上，要选择合适的材质。

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

<ThreeMaterialKinds />

另外 `MeshPhongMaterial` 的 `shininess` 属性决定了镜面高光的光泽度，默认 30。

<ThreeMaterialKindsShininess />

另外一种材质 `MeshToonMaterial`，它与 `MeshPhongMaterial`，但是它不是平滑地着色，而是使用一种渐变图（一个 X 乘 1 的纹理）来决定如何着色。

<ThreeMaterialToonKind />

上面的材质是使用简单的数学来制作，看起来是 3D 的，但并不是现实世界存在的，下面 2 中是基于物理引擎（_Physically Based Rendering_，简称 PBR）的材质：

- `MeshStandardMaterial`：有两个参数设置材质，分别是 `roughness` 和 `metalness` 属性，代表粗糙度和金属度
- `MeshPhysicalMaterial`：与 `MeshStandardMaterial` 相同，但是增加了一个 `clearcoat` 参数，表示清漆光亮层的成都，和另一个 `clearCoatRoughness` 参数，指定光泽层的粗糙程度

[例子](https://threejs.org/manual/#zh/materials)，搜索关键字**MeshPhysicalMaterial**，这个例子自己写的不太好，就不展示了。

另外几种特殊用处的材质：

- [`ShadowMaterial`](https://threejs.org/docs/#api/zh/materials/ShadowMaterial)：获取阴影创建的数据
- [`MeshdepthMeterial`](https://threejs.org/docs/#api/zh/materials/MeshDepthMaterial)：渲染每个像素的深度
- [`MeshNormalMaterial`](https://threejs.org/docs/#api/zh/materials/MeshNormalMaterial)：显示几何体的法线
- [`ShaderMaterial`](https://threejs.org/docs/#api/zh/materials/ShaderMaterial)：通过 three.js 制作的自定义材质
- `RawShaderMaterial`：用来制作完全自定义的着色器，不需要 three.js 的帮助（这个涉及的东西太多了，这里不细讲）

最后，大多数材质都是共享一堆由 [`Material`](https://threejs.org/docs/#api/zh/materials/Material) 定义的设置，所有设置可参考[文档](https://threejs.org/docs/#api/zh/materials/Material)

## 纹理 [texture](https://threejs.org/manual/#zh/textures)

纹理可以理解为图片“贴”在我们的物体上，只需要在 `material` 上设置 `map` 属性即可：

```diff-js
const loader = new THREE.TextureLoader()
loader.load('/threejs/images/wall.jpg', (texture) => {
  texture.colorSpace = THREE.SRGBColorSpace
  const material = new THREE.MeshBasicMaterial({
-    color: 0xff0000,
+    map: texture,
  })
})
```

例如：

<ThreeTexture />

另外，我们可以指定多种纹理，例如每个立方体面都有不同纹理：

<ThreeTextureMulti />

**只需要定义 `materials` 数组即可**

```js {10-21}
import * as THREE from 'three'

const loader = new THREE.TextureLoader()
function loadTexture(path) {
  return new Promise((resolve) => {
    loader.load(path, rsolve)
  })
}

async function loaMaterials(paths: string[]) {
  const textures = await Promise.all(
    paths.map(async (path) => {
      const texture = await loadTexture(path)
      texture.colorSpace = THREE.SRGBColorSpace
      return texture
    }),
  )
}
const materials = await loadMaterials([
  // ...paths
])

const geometry = new THREE.BoxGeometry(4, 4, 4)
const mesh = new Mesh(geometry, materials)
```

> [`BoxGeometry`](https://threejs.org/docs/#api/zh/geometries/BoxGeometry) 每个面都可以有一种材质，但是像 [`GoneGeometry`](https://threejs.org/docs/#api/zh/geometries/ConeGeometry) 能用两种材料（底部和侧面），[`CylinderGeometry`](https://threejs.org/docs/#api/zh/geometries/CylinderGeometry) 可以使用三种（底部、顶部和侧面）。

### 内存管理

纹理在 threejs 中占的内存往往非常多，一般计算公式，纹理会占 `宽度 * 高度 * 4 * 1.33` 字节的内存。

有个有意思的现象，虽然有些图片大小可能很小，但是它的分辨率会很高，例如 `threejs` 官网中的这个例子：

![texture-memory](threejs/texture-memory.webp)

为了让 three.js 使用成本，必须把纹理交给 GPU 处理，但 GPU 一般要求纹理数据不被压缩，因此要合理处理纹理的文件：

**文件大小小，网络下载快；分辨率小，占用的内存少。**

## 光照 [Light](https://threejs.org/manual/#zh/lights)

### [lil-gui](https://github.com/georgealways/lil-gui)

学习光照之前，我们可以尝试一下 `lil-gui`，它是一个悬浮的可以控制 threejs 参数的面板，方便我们观察不同参数的 3D 效果，例如：

<ThreeLilGuiFirst />

核心代码：

```js
export export function buildGUI(ref: RefObject<HTMLDivElement>, width = 250) {
  const gui = new GUI({
    autoPlace: false,
    container: ref.current!,
    width,
  })
  return gui
}

const gui = buildGUI(ref)
function render() {
  renderer.render(scene, camera)
}
const controls = new OrbitControls(camera, renderer.domElement)
controls.addEventListener('change', render)
controls.update()

gui.add(mesh.scale, 'x', 0, 4, 0.1).name('x').onChange(render)
gui.add(mesh.scale, 'y', 0, 4, 0.1).name('y').onChange(render)
gui.add(mesh.scale, 'z', 0, 4, 0.1).name('z').onChange(render)
```

## 环境光 AmbientLight

环境光没有反向，也无法产生阴影，场景内任何一点受到的光照强度都是相通的。环境光看起来并不是真正意义上的光照，通常用于**提高亮度**。

```tsx Playground path='three/ThreePureAmbientLight' component='ThreePureAmbientLight'

```

## 半球光 HemisphereLight

# Before

虽然目前大多数设备以及浏览器都支持 [WebGL2](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL2RenderingContext)，但是依旧少部分不支持，我们需要给用户提示信息。

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

move to [three-js](/posts/note/threejs-examples)

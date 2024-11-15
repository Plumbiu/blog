---
title: Threejs in React
date: 2024-11-07
desc: 1
hidden: true
---

[@react-three/fiber](https://github.com/pmndrs/react-three-fiber) 是 [three.js](https://github.com/mrdoob/three.js) 的 React 渲染器，可以方便在 React 上运行 three.js，并且提供了更多的可重用的状态组件，所有的 Threejs 方法都可以运行，同时基于 React 的调度能力，它在大规模应用上的性能要优于原生开发。官网上说 threejs 的任何更新都会立即可用，不需要更新，因为 @react-three/fiber 只是 JSX 表达的 Three.js

# First Example

在 `<Canvas>` 标签内，我们可以自定义 `Object`，任何 `Object` 都应该被 `<Canvas>` 标签包裹，否则会被报错

```jsx Playground='three/ThreeFirstScene'

```

export function raf(fn: Function) {
  const wrap = () => {
    fn()
    requestAnimationFrame(wrap)
  }
  requestAnimationFrame(wrap)
}

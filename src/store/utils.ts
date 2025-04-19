function preventDefault(e: Event) {
  e.stopImmediatePropagation()
  e.preventDefault()
}

export function avoidBodyScroll(callback?: () => void) {
  document.body.addEventListener('wheel', preventDefault, {
    passive: false,
  })
  document.body.addEventListener('touchmove', preventDefault, {
    passive: false,
  })
  callback && window.addEventListener('popstate', callback)
}

export function makeBodyScroll(callback?: () => void) {
  document.body.removeEventListener('wheel', preventDefault)
  document.body.removeEventListener('touchmove', preventDefault)
  callback && window.removeEventListener('popstate', callback)
}

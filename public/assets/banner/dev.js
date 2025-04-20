const dom = document.querySelector('.banner')

function setBannerHeight() {
  if (dom) {
    const w = window.innerWidth
    const pathname = location.pathname
    if (pathname === '/' || pathname.startsWith('/list')) {
      dom.style.height = `${w < 960 ? 320 : 580}px`
    } else {
      dom.style.height = `${w < 960 ? 220 : 320}px`
    }
  }
}

window.setBannerHeight = setBannerHeight

setBannerHeight()

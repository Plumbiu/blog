const dom = document.querySelector('.banner')

const viewW = window.innerWidth
var BannerHeight = viewW < 960 ? 220 : 320
var BannerListPageHeight = viewW < 960 ? 320 : 580

function setBannerHeight() {
  if (dom) {
    const pathname = location.pathname
    if (pathname === '/' || pathname.startsWith('/list')) {
      dom.style.height = `${BannerListPageHeight}px`
    } else {
      dom.style.height = `${BannerHeight}px`
    }
  }
}

setBannerHeight()

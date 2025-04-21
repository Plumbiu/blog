const dom = document.querySelector('.blog_banner')
const viewW = window.innerWidth
const isMobile = viewW < 960
var BannerHeight = isMobile ? 220 : 320
var BannerListPageHeight = isMobile ? 320 : 580

function setBannerHeight() {
  console.log(dom)
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

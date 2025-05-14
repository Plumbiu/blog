const dom = document.querySelector('.blog_banner')
const viewW = window.innerWidth
const isMobile = viewW < 960
var BannerHeight = isMobile ? 220 : 340
var BannerListPageHeight = isMobile ? 320 : 580

function setBannerHeight() {
  if (dom) {
    const pathname = location.pathname
    if (
      pathname.startsWith('/posts') ||
      pathname.startsWith('/links') ||
      pathname.startsWith('/about')
    ) {
      dom.style.height = `${BannerHeight}px`
    } else {
      dom.style.height = `${BannerListPageHeight}px`
    }
  }
}

setBannerHeight()

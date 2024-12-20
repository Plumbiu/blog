var ThemeKey = 'data-theme'
var Dark = 'dark'
var Light = 'light'

const media = window.matchMedia('(prefers-color-scheme: light)')
let iframe

function getTheme() {
  const localTheme = getLocalTheme()
  const theme = localTheme ? localTheme : media.matches ? Light : Dark
  return theme
}
function getLocalTheme() {
  return localStorage.getItem(ThemeKey)
}
function setHtmlTheme(theme) {
  document.documentElement.setAttribute(ThemeKey, theme)
}
function setTheme(theme) {
  setHtmlTheme(theme)
  localStorage.setItem(ThemeKey, theme)

  if (!iframe) {
    iframe = document.querySelector('iframe.giscus-frame')
  }
  if (iframe) {
    iframe.contentWindow.postMessage(
      {
        giscus: {
          setConfig: {
            theme: theme,
          },
        },
      },
      'https://giscus.app',
    )
  }
}

const theme = getTheme()
setTheme(theme)

media.addEventListener('change', (e) => {
  setTheme(e.matches ? Light : Dark)
})
window.addEventListener('storage', (e) => {
  if (e.key === ThemeKey) {
    const theme = getLocalTheme()
    setHtmlTheme(theme)
  }
})

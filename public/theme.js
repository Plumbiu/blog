const ThemeKey = 'data-theme'
const Dark = 'dark'
const Light = 'light'

const media = window.matchMedia('(prefers-color-scheme: light)')

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
}

const theme = getTheme()
setTheme(theme)

media.addEventListener('change', (e) => {
  setTheme(e.matches ? Light : Dark)
})
window.addEventListener('storage', (e) => {
  const theme = getLocalTheme()
  setHtmlTheme(theme)
})

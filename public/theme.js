const ThemeKey = 'data-theme'
const Dark = 'dark'
const Light = 'light'

const media = window.matchMedia('(prefers-color-scheme: light)')

function getLocalTheme() {
  const localTheme = localStorage.getItem(ThemeKey)
  const theme = localTheme ? localTheme : media.matches ? Light : Dark
  return theme
}
function setLocalTheme(theme) {
  localStorage.setItem(ThemeKey, theme)
}
function setDataTheme(theme) {
  document.documentElement.setAttribute(ThemeKey, theme)
}

function applyTheme(theme) {
  setDataTheme(theme)
  setLocalTheme(theme)
}

function getDataTheme() {
  return document.documentElement.getAttribute(ThemeKey)
}

function applyCurrentTheme() {
  const theme = getLocalTheme()
  applyTheme(theme)
  window.theme = theme
}

applyCurrentTheme()
media.addEventListener('change', (e) => {
  applyTheme(e.matches ? Light : Dark)
})
window.addEventListener('storage', applyCurrentTheme)

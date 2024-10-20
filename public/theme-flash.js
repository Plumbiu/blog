const ThemeKey = 'data-theme'

function getLocalTheme() {
  return localStorage.getItem(ThemeKey)
}

function setLocalTheme(theme) {
  localStorage.setItem(ThemeKey, theme)
}

function setDataTheme(theme) {
  document.documentElement.setAttribute(ThemeKey, theme)
}

function setTheme() {
  let theme = getLocalTheme()
  if (!theme) {
    setLocalTheme('dark')
    theme = 'dark'
  }
  setDataTheme(theme)
}

setTheme()

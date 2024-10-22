const ThemeKey = 'data-theme'
export const Dark = 'dark'
export const Light = 'light'

export function getLocalTheme() {
  const localTheme = localStorage.getItem(ThemeKey)
  if (localTheme) {
    return localTheme
  }
  const isLight = window.matchMedia('(prefers-color-scheme: light)')
  return isLight ? Light : Dark
}

export function setLocalTheme(theme: string) {
  localStorage.setItem(ThemeKey, theme)
}

export function setDataTheme(theme: string) {
  document.documentElement.setAttribute(ThemeKey, theme)
}

export function getDataTheme() {
  return document.documentElement.getAttribute(ThemeKey)
}

export function toggleDataTheme() {
  const theme = getDataTheme()
  const nextTheme = theme === Dark ? Light : Dark
  applyTheme(nextTheme)
  return nextTheme
}

export function applyTheme(theme: string) {
  setDataTheme(theme)
  setLocalTheme(theme)
}

export function applyCurrentTheme() {
  const theme = getLocalTheme()
  applyTheme(theme)
}

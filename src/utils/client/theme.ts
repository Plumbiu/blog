const ThemeKey = 'data-theme'
export const Dark = 'dark'
export const Light = 'light'

export function handleLightMediaChange(ev: MediaQueryListEventMap['change']) {
  applyTheme(ev.matches ? Light : Dark)
}

export function getLocalTheme() {
  const localTheme = localStorage.getItem(ThemeKey)
  const lightMedia = window.matchMedia('(prefers-color-scheme: light)')
  const theme = localTheme ? localTheme : lightMedia.matches ? Light : Dark

  return { theme, lightMedia }
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
  const { theme } = getLocalTheme()
  applyTheme(theme)
}

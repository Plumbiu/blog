const ThemeKey = 'data-theme'
export const Dark = 'dark'
export const Light = 'light'

export function applyTheme(theme: string) {
  document.documentElement.setAttribute(ThemeKey, theme)
  localStorage.setItem(ThemeKey, theme)
}

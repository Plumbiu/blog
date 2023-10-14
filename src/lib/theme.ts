export function toggleTheme(isDark: boolean) {
  document.documentElement.setAttribute('theme', isDark ? 'dark' : '')
}

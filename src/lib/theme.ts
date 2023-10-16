export function toggleTheme(mode: 'dark' | 'light') {
  document.documentElement.setAttribute('theme', mode)
}

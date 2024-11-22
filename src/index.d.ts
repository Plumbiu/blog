interface Window {
  getLocalTheme(): string
  setLocalTheme(theme: any): void
  setDataTheme(theme: any): void
  applyTheme(theme: any): void
  applyCurrentTheme(): void
  getDataTheme(): string | null
  toggleDataTheme(): 'dark' | 'light'
  theme: 'dark' | 'light'
}

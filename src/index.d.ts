interface Window {
  getTheme(): string
  getLocalTheme(): string
  setHtmlTheme(theme: string): void
  setTheme(theme: string): void
  gitCommentFrame: HTMLIFrameElement
  ThemeKey: string
  Dark: string
  Light: string
}

declare module '~/data/issues.json' {
  const value: Record<string, number>
  export default value
}

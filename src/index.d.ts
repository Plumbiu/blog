interface Window {
  // theme
  getTheme(): string
  getLocalTheme(): string
  setHtmlTheme(theme: string): void
  setTheme(theme: string): void
  gitCommentFrame: HTMLIFrameElement
  ThemeKey: string
  Dark: string
  Light: string
  // banner
  setBannerHeight(): void
  BannerHeight: number
  BannerListPageHeight: number
}

declare module '~/data/issues.json' {
  const value: Record<string, number>
  export default value
}

declare module '!!raw-loader!*' {
  const value: string
  export default value
}

declare module 'raw-loader!*' {
  const value: string
  export default value
}

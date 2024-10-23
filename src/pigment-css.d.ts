import { type ExtendTheme } from '@pigment-css/react/theme'
import { configColors } from '../theme-variable.mjs'

type tokenType = typeof configColors

declare module '@pigment-css/react/theme' {
  interface ThemeArgs {
    theme: ExtendTheme<{
      colorScheme: 'light' | 'dark'
      tokens: tokenType
    }>
  }
}

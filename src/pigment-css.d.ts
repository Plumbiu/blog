import { type ExtendTheme } from '@pigment-css/react/theme'
import { configColors } from '../theme-variable.js'

type tokenType = typeof configColors

declare module '@pigment-css/react/theme' {
  interface ThemeArgs {
    theme: ExtendTheme<{
      colorScheme: 'light' | 'dark'
      tokens: tokenType
    }>
  }
}

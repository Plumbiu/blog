import { JetBrains_Mono, Roboto } from 'next/font/google'

export const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
})

export const robot = Roboto({
  subsets: ['latin'],
  display: 'swap',
  fallback: [
    'sans-serif',
    'ui-sans-serif',
    'system-ui',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'Noto Color Emoji',
  ],
  weight: ['400', '600'],
})

import {
  PT_Mono,
  Fira_Mono,
  Roboto_Mono,
  Inter,
  Noto_Sans_Mono,
} from 'next/font/google'
import localfont from 'next/font/local'

export const noto = Inter({
  subsets: ['latin'],
  style: ['normal'],
  display: 'swap',
  weight: ['400', '600'],
})

export const mono = Fira_Mono({
  subsets: ['latin'],
  style: ['normal'],
  display: 'swap',
  weight: '400',
})

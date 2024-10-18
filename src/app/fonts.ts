import {
  PT_Mono,
  Fira_Mono,
  Roboto_Mono,
  Roboto,
  Noto_Sans_Mono,
} from 'next/font/google'
import localfont from 'next/font/local'

export const noto = Roboto({
  subsets: ['latin'],
  style: ['normal'],
  display: 'swap',
  weight: ['400', '700'],
})

export const mono = Fira_Mono({
  subsets: ['latin'],
  style: ['normal'],
  display: 'swap',
  weight: '400',
})

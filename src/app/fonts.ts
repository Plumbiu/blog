import { Fira_Mono, Inter, DM_Mono } from 'next/font/google'

export const noto = Inter({
  subsets: ['latin'],
  style: ['normal'],
  display: 'swap',
  weight: ['400', '500', '600'],
})

export const mono = DM_Mono({
  subsets: ['latin'],
  style: ['normal'],
  display: 'swap',
  weight: '400',
  fallback: ['Consolas'],
})

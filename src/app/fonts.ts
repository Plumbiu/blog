import { Fira_Mono, Inter } from 'next/font/google'

export const noto = Inter({
  subsets: ['latin'],
  style: ['normal'],
  display: 'swap',
  weight: ['400', '500', '600'],
})

export const mono = Fira_Mono({
  subsets: ['latin'],
  style: ['normal'],
  display: 'swap',
  weight: '400',
  fallback: ['Consolas'],
})

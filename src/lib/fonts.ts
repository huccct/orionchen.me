import { Geist, Geist_Mono, Newsreader, Noto_Serif_SC } from 'next/font/google'

export const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  weight: ['400', '600'],
  display: 'swap',
})

export const notoSerifSC = Noto_Serif_SC({
  variable: '--font-noto-serif-sc',
  weight: ['400', '700'],
  display: 'swap',
  preload: false,
})

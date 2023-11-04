import type { MetadataRoute } from 'next'
import { title, name, url } from '@/lib/json'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name,
    short_name: title,
    description: `${name} 的 material 风格博客`,
    start_url: '.',
    display: 'standalone',
    background_color: '#F6F8FC',
    theme_color: '#1976d2',
    prefer_related_applications: true,
    related_applications: [
      {
        platform: 'play',
        url,
        id: 'com.app.blog.plumbiu',
      },
    ],
    icons: [
      {
        src: 'icons/favico-32x32.webp',
        sizes: '32x32',
        type: 'image/webp',
        purpose: 'maskable',
      },
      {
        src: 'icons/favico-96x96.webp',
        sizes: '96x96',
        type: 'image/webp',
        purpose: 'maskable',
      },
      {
        src: 'icons/favico-128x128.webp',
        sizes: '128x128',
        type: 'image/webp',
        purpose: 'maskable',
      },
      {
        src: 'icons/favico-192x192.webp',
        sizes: '192x192',
        type: 'image/webp',
        purpose: 'any',
      },
      {
        src: 'icons/favico-256x256.webp',
        sizes: '256x256',
        type: 'image/webp',
        purpose: 'maskable',
      },
      {
        src: 'icons/favico-512x512.webp',
        sizes: '512x512',
        type: 'image/webp',
        purpose: 'any',
      },
    ],
  }
}

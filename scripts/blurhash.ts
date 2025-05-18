import { glob } from 'tinyglobby'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import getBlurDataUrl from '~/optimize/blurhash'

const BannerWritePath = 'data/banner.json'

async function run() {
  const bannerPath = await glob('public/banner/*')
  const avatarPath = 'public/avatar.jpg'
  const { base64 } = await getBlurDataUrl(avatarPath)

  const data: Record<string, string> = {}
  if (base64) {
    data.avatar = base64
  }
  await Promise.all(
    bannerPath.map(async (imagePath) => {
      const { base64 } = await getBlurDataUrl(imagePath)
      const basename = imagePath.slice(imagePath.lastIndexOf('/') + 1)
      if (base64) {
        data[basename] = base64
      }
    }),
  )

  writeFile(path.join(BannerWritePath), JSON.stringify(data))
}

run()

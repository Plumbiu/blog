import fsp from 'node:fs/promises'
import { profileInfo } from '@plumbiu/github-info'
import path from 'node:path'
const writePath = path.join(process.cwd(), 'src', 'assets', 'Plumbiu')

async function preBuild() {
  const dir = await fsp.readdir(writePath)
  console.log(dir)

  // 如果更新时间大于 7 天，重新执行
  if ((Date.now() - new Date(dir[0]).getTime()) / 1000 > 7 * 24 * 60 * 60) {
    const date = new Date()
    await fsp.rename(
      path.join(writePath, dir[0]),
      path.join(
        writePath,
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      ),
    )
    const plumbiu = await profileInfo('Plumbiu')
    await fsp.writeFile(
      path.join(writePath, 'index.json'),
      JSON.stringify(plumbiu),
    )
  }
}

void preBuild()

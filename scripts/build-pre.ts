import fsp from 'node:fs/promises'
import { initFields, profileInfo } from '@plumbiu/github-info'
import path from 'node:path'

async function preBuild() {
  const dir = await fsp.readdir(process.cwd())
  const DATEREG = /[\d]{4}-[\d]+-[\d]+/
  const updated = dir.filter((item) => DATEREG.test(item))
  // 如果更新时间大于 7 天，重新执行
  if ((Date.now() - new Date(updated[0]).getTime()) / 1000 > 7 * 24 * 60 * 60) {
    const date = new Date()
    await fsp.rename(
      path.join(process.cwd(), updated[0]),
      path.join(
        process.cwd(),
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      ),
    )
    const { eventsField } = await initFields('Plumbiu')
    await fsp.writeFile(
      path.join(path.join(process.cwd(), 'src', 'app'), 'Plumbiu.json'),
      JSON.stringify(await eventsField()),
    )
  }
}

void preBuild()

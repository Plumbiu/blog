import fsp from 'node:fs/promises'
import path from 'node:path'
import { initFields } from '@plumbiu/github-info'

async function preBuild() {
  const { eventsField } = await initFields('Plumbiu')
  await fsp.writeFile(
    path.join(process.cwd(), 'config', 'events.json'),
    JSON.stringify(await eventsField()),
  )
}

preBuild()

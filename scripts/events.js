// @ts-check
import fsp from 'node:fs/promises'
import { initFields } from '@plumbiu/github-info'
import path from 'node:path'

async function preBuild() {
  const { eventsField } = await initFields('Plumbiu')
  await fsp.writeFile(
    path.join(process.cwd(), 'config', 'events.json'),
    JSON.stringify(await eventsField()),
  )
}

preBuild()

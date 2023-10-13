import fsp from 'node:fs/promises'
import path from 'node:path'
import { initFields } from '@plumbiu/github-info'
import { github_name } from '../config.json'

async function preBuild() {
  const { eventsField } = await initFields(github_name)
  await fsp.writeFile(
    path.join(process.cwd(), 'config', 'events.json'),
    JSON.stringify(await eventsField()),
  )
}

preBuild()

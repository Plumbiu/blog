import fsp from 'node:fs/promises'
import path from 'node:path'
import { initFields } from '@plumbiu/github-info'
import { readJSON } from './utils.js'

async function preBuild() {
  const { github_name } = await readJSON(
    path.join(process.cwd(), 'config.json'),
  )
  const { eventsField } = await initFields(github_name)
  await fsp.writeFile(
    path.join(process.cwd(), 'config', 'events.json'),
    JSON.stringify(await eventsField()),
  )
}

preBuild()

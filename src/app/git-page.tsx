import fs from 'node:fs'
import path from 'node:path'

function GitPage() {
  const theme = fs.readFileSync(
    path.join(process.cwd(), 'public', 'theme.js'),
    'utf-8',
  )
  return <script>{theme}</script>
}

export default GitPage

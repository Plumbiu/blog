import { tryReadFileSync } from '@/lib/node/fs'
import { arrayify } from '@/lib/types'
import micromatch from 'micromatch'

type MatchValue = string | string[]

const cached: Record<'gitIgnore', null | ((match: MatchValue) => string[])> = {
  gitIgnore: null,
}

export function matchWithGitingore(matchString: MatchValue) {
  if (cached.gitIgnore) {
    return cached.gitIgnore(matchString)
  }

  const text = tryReadFileSync('.gitignore')
  const tokens = text.split('\n').filter((t) => t[0] === '#' || t.trim())
  cached.gitIgnore = (match: MatchValue) => {
    return micromatch.match(arrayify(match), tokens)
  }
  return cached.gitIgnore
}

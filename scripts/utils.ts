import { $ } from 'execa'

export function gitadd(path: string) {
  $`git add ${path}`
}

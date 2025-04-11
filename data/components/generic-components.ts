import { lazy } from 'react'
import CodeRunner from './generic/code-runner'
import Switcher from './generic/switcher'
import PreTitle from './generic/pre-title'
import { CodeRunnerName } from '~/markdown/plugins/remark/runner-utils'
import { GalleryName } from '~/markdown/plugins/remark/gallery-utils'
import { SwitcherName } from '~/markdown/plugins/remark/code-block/switcher-utils'
import { PreTitleName } from '~/markdown/plugins/remark/code-block/pre-title-utils'
import { IframeName } from '~/markdown/plugins/remark/iframe-utils'
import { PlaygroundName } from '~/markdown/plugins/remark/code-block/playground-utils'
import Playground from './generic/playground'

const Gallery = lazy(() => import('./generic/gallery/index'))
const Iframe = lazy(() => import('./generic/iframe/index'))

export const genericComponentsMap: Record<string, any> = {
  [PlaygroundName]: Playground,
  [CodeRunnerName]: CodeRunner,
  [GalleryName]: Gallery,
  [IframeName]: Iframe,
  [SwitcherName]: Switcher,
  [PreTitleName]: PreTitle,
}

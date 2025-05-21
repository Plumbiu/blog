'use client'

import { lazy } from 'react'
import Playground from './generic/playground'
import CodeRunner from './generic/logger'
import Switcher from './generic/switcher'
import Title from './generic/title-code'
import { PlaygroundName } from '~/markdown/plugins/remark/code/playground-utils'
import { LoggerName } from '~/markdown/plugins/remark/logger-utils'
import { GalleryName } from '~/markdown/plugins/remark/directive/gallery-utils'
import { SwitcherName } from '~/markdown/plugins/remark/code/switcher-utils'
import { TitleCodeName } from '~/markdown/plugins/remark/code/title-utils'
import { IframeName } from '~/markdown/plugins/remark/directive/iframe-utils'
import { HTMLParserName } from '~/markdown/plugins/remark/html-parser-utils'
import HtmlParser from './generic/html-parser'
import { FileTreeName } from '../plugins/remark/code/file-tree/file-tree-utils'
import FileTree from './generic/file-tree'
import Tooltip from './generic/tooltip'

const Gallery = lazy(() => import('./generic/gallery/index'))
const Iframe = lazy(() => import('./generic/iframe/index'))

export const genericComponentMap: Record<string, any> = {
  [PlaygroundName]: Playground,
  [LoggerName]: CodeRunner,
  [GalleryName]: Gallery,
  [IframeName]: Iframe,
  [SwitcherName]: Switcher,
  [TitleCodeName]: Title,
  [HTMLParserName]: HtmlParser,
  [FileTreeName]: FileTree,
  Tooltip,
}

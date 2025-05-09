'use client'

import { lazy } from 'react'
import Playground from './generic/playground'
import CodeRunner from './generic/code-runner'
import Switcher from './generic/switcher'
import PreTitle from './generic/pre-title'
import { PlaygroundName } from '~/markdown/plugins/remark/code/playground-utils'
import { CodeRunnerName } from '~/markdown/plugins/remark/runner-utils'
import { GalleryName } from '~/markdown/plugins/remark/directive/gallery-utils'
import { SwitcherName } from '~/markdown/plugins/remark/code/switcher-utils'
import { PreTitleName } from '~/markdown/plugins/remark/code/title-utils'
import { IframeName } from '~/markdown/plugins/remark/directive/iframe-utils'
import { HTMLParserName } from '~/markdown/plugins/remark/html-parser-utils'
import HtmlParser from './generic/html-parser'
import { FileTreeName } from '../plugins/remark/code/file-tree/file-tree-utils'
import FileTree from './generic/file-tree'

const Gallery = lazy(() => import('./generic/gallery/index'))
const Iframe = lazy(() => import('./generic/iframe/index'))

export const genericComponentMap: Record<string, any> = {
  [PlaygroundName]: Playground,
  [CodeRunnerName]: CodeRunner,
  [GalleryName]: Gallery,
  [IframeName]: Iframe,
  [SwitcherName]: Switcher,
  [PreTitleName]: PreTitle,
  [HTMLParserName]: HtmlParser,
  [FileTreeName]: FileTree,
}

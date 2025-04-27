'use client'

import { lazy } from 'react'
import Playground from './generic/playground'
import CodeRunner from './generic/code-runner'
import Switcher from './generic/switcher'
import PreTitle from './generic/pre-title'
import { PlaygroundName } from '~/markdown/plugins/remark/code-block/playground-utils'
import { CodeRunnerName } from '~/markdown/plugins/remark/runner-utils'
import { GalleryName } from '~/markdown/plugins/remark/gallery-utils'
import { SwitcherName } from '~/markdown/plugins/remark/code-block/switcher-utils'
import { PreTitleName } from '~/markdown/plugins/remark/code-block/pre-title-utils'
import { IframeName } from '~/markdown/plugins/remark/iframe-utils'
import { HTMLParserName } from '~/markdown/plugins/remark/html-parser-utils'
import HtmlParser from './generic/html-parser'

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
}

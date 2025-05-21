'use client'

import IntersectionObserverComponent from '@/components/function/IntersectionObserverComponent'
import { createElement } from 'react'
import { handleComponentName } from '~/markdown/plugins/constant'
import { PlaygroundName } from '~/markdown/plugins/remark/code/playground-utils'
import { PreTitleName } from '~/markdown/plugins/remark/code/title-utils'
import { SwitcherName } from '~/markdown/plugins/remark/code/switcher-utils'
import { LoggerName } from '~/markdown/plugins/remark/logger-utils'
import { customComponentMap } from './custom-components'
import { genericComponentMap } from './generic-components'

const SyncComponentNameSet = new Set<String>([
  PlaygroundName,
  LoggerName,
  SwitcherName,
  PreTitleName,
  'Tooltip',
])

function CustomComponent(props: any) {
  const componentName = handleComponentName(props)
  const value =
    customComponentMap[componentName] ?? genericComponentMap[componentName]

  if (value) {
    if (
      SyncComponentNameSet.has(componentName) ||
      process.env.NODE_ENV === 'test'
    ) {
      return createElement(value, props)
    }
    return (
      <IntersectionObserverComponent props={props}>
        {value}
      </IntersectionObserverComponent>
    )
  }
  return <div {...props} />
}

export default CustomComponent

'use client'

// It could be running at server, but doesn't support onClick or other props
import { useMemo } from 'react'
import {
  handleComponentFileKey,
  handleComponentSelectorKey,
  handleFileMap,
} from '@/plugins/constant'
import CodePreview from '../_common/CodePreview'
import styles from './index.module.css'

const Switcher = (props: any) => {
  const { defaultSelector, codeNodeMap, codeTabs } = useMemo(() => {
    const children = Array.isArray(props.children)
      ? props.children
      : [props.children]
    const defaultSelector = handleComponentSelectorKey(props)
    const codeNodeMap = Object.fromEntries(
      children.map((node: any) => [handleComponentFileKey(node.props), node]),
    )
    const files = handleFileMap(props)
    const codeTabs = Object.keys(files).map((name) => ({ name }))

    return {
      defaultSelector,
      codeNodeMap,
      codeTabs,
    }
  }, [props])

  return (
    <CodePreview
      className={styles.container}
      tabs={codeTabs}
      nodeMap={codeNodeMap}
      defaultSelector={defaultSelector}
      hide={false}
    />
  )
}

export default Switcher

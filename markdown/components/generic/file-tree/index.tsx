'use client'

import PreComponent from '@/components/ui/Pre'
import { arrayify } from '@/lib/types'
import { memo, useEffect, useMemo, useState } from 'react'
import {
  handleFileTree,
  handleFileFileTreeMapItemKey,
  type TreeNode,
} from '~/markdown/plugins/remark/code/fill-tree/file-tree-utils'
import styles from './index.module.css'
import tabStyles from '../_styles/tab.module.css'
import codeWrapStyles from '../_common/CodeWrapper.module.css'
import { CloseIcon, EmptyIcon, FolderIcon } from '@/components/Icons'
import { cn } from '@/lib/client'

type SelectorArr = Array<{
  value: string
  icon: string
}>

interface TreeTabs {
  tree: TreeNode[]
  setLabel: (value: string) => void
  label: string
  setsetSelectorArr: (value: SelectorArr) => void
  selectorArr: SelectorArr
}

function getBaseDirname(filePath: string) {
  // /markdown/test/foo.ts
  const segments = filePath.slice(1).split('/')
  const basename = segments[segments.length - 1]
  const dirname = segments[segments.length - 2]
  return { basename, dirname }
}

function formatHeaderTabName(selector: string, selectorArray: SelectorArr) {
  const { basename, dirname } = getBaseDirname(selector)
  const baseNames = selectorArray
    .filter((s) => s.value !== selector)
    .map((s) => getBaseDirname(s.value).basename)
  if (baseNames.includes(basename)) {
    return (
      <div>
        <span>{basename}</span>
        <span className={styles.dirname}>
          ...\
          {dirname}
        </span>
      </div>
    )
  }
  return <div>{basename}</div>
}

const HeaderTab = memo(
  ({
    setLabel: setSelector,
    label: selector,
    selectorArr,
    setsetSelectorArr,
  }: Omit<TreeTabs, 'tree'>) => {
    return (
      !!selectorArr.length && (
        <div className={cn(tabStyles.tab, styles.header_tab)}>
          {selectorArr.map(({ value, icon }) => (
            <div
              key={value}
              className={cn(styles.header_tab_item, {
                [tabStyles.tab_active]: value === selector,
              })}
              onClick={() => setSelector(value)}
            >
              <img
                data-no-view
                alt="icon"
                width="16"
                height="16"
                src={`/vscode-icons/${icon}.svg`}
              />
              <div>{formatHeaderTabName(value, selectorArr)}</div>
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  setsetSelectorArr(
                    selectorArr.filter((item) => item.value !== value),
                  )
                }}
              >
                <CloseIcon />
              </div>
            </div>
          ))}
          <div />
        </div>
      )
    )
  },
)

const TreeTabs = memo(
  ({
    tree,
    setLabel: setSelector,
    label: selector,
    selectorArr,
    setsetSelectorArr,
  }: TreeTabs) => {
    const [collapse, setCollapse] = useState(false)

    return (
      <div>
        {tree.map((node) => {
          const isDir = node.children.length > 0
          const pl = (node.level + 1) * 24
          return (
            <div
              data-pl={pl}
              className={styles.item}
              onClick={(e) => {
                e.stopPropagation()
                if (isDir) {
                  setCollapse(!collapse)
                } else {
                  setSelector(node.path)

                  if (
                    !node.icon ||
                    selectorArr.map((s) => s.value).includes(node.path)
                  ) {
                    return
                  }
                  setsetSelectorArr([
                    ...selectorArr,
                    { value: node.path, icon: node.icon },
                  ])
                }
              }}
              key={node.path}
            >
              <div
                className={styles.slash}
                style={{
                  left: pl + 8,
                }}
              />
              <div
                className={cn(styles.label, {
                  [styles.active_label]: selector === node.path,
                })}
                style={{
                  paddingLeft: pl,
                }}
              >
                {isDir ? (
                  <FolderIcon
                    className={cn({
                      [styles.active_dir]: !collapse,
                    })}
                  />
                ) : (
                  <img
                    data-no-view
                    alt="icon"
                    width="16"
                    height="16"
                    src={`/vscode-icons/${node.icon}.svg`}
                  />
                )}
                {node.label}
              </div>
              {!collapse && (
                <TreeTabs
                  selectorArr={selectorArr}
                  setsetSelectorArr={setsetSelectorArr}
                  label={selector}
                  tree={node.children}
                  setLabel={setSelector}
                />
              )}
            </div>
          )
        })}
      </div>
    )
  },
)

const Empty = memo(() => <EmptyIcon className={cn('fcc', styles.empty)} />)

const FileTree = memo((props: any) => {
  const [label, setLabel] = useState('')
  const [selectorArr, setsetSelectorArr] = useState<SelectorArr>([])

  const { tree, previewMap } = useMemo(() => {
    const children = arrayify(props.children)
    const previewMap = Object.fromEntries(
      children.map((child) => [
        handleFileFileTreeMapItemKey(child.props),
        child,
      ]),
    )
    const tree = handleFileTree(props)
    console.log(children)
    return { tree, previewMap }
  }, [])

  useEffect(() => {
    if (selectorArr.length === 0) {
      setLabel('')
    }
  }, [selectorArr])

  return (
    <div className={styles.wrap}>
      <div className={codeWrapStyles.bar}>FileTree</div>
      <div className={styles.container}>
        <div className={styles.tabs}>
          <TreeTabs
            selectorArr={selectorArr}
            setsetSelectorArr={setsetSelectorArr}
            label={label}
            setLabel={setLabel}
            tree={tree}
          />
        </div>
        <div
          className={cn(styles.preview, {
            fcc: !previewMap[label],
          })}
        >
          <HeaderTab
            selectorArr={selectorArr}
            setsetSelectorArr={setsetSelectorArr}
            label={label}
            setLabel={setLabel}
          />

          {previewMap[label] ? (
            <PreComponent>{previewMap[label]}</PreComponent>
          ) : (
            <Empty />
          )}
        </div>
      </div>
    </div>
  )
})

export default FileTree

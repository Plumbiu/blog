'use client'

import PreComponent from '@/components/ui/Pre'
import { arrayify } from '@/lib/types'
import { memo, useEffect, useMemo, useState } from 'react'
import {
  handleFileTree,
  handleFileFileTreeMapItemKey,
  type TreeNode,
  handleFileTreeDefaultSelector,
  handleFileTreeFileIconMapKey,
} from '~/markdown/plugins/remark/code/file-tree/file-tree-utils'
import styles from './index.module.css'
import tabStyles from '../_styles/tab.module.css'
import codeWrapStyles from '../_common/CodeWrapper.module.css'
import {
  CloseIcon,
  CoffeeIcon,
  FolderOpenIcon,
  FolderIcon,
} from '@/components/Icons'
import { cn } from '@/lib/client'

interface TreeTabsProps {
  tree: TreeNode[]
  setLabel: (value: string) => void
  label: string
  setsetSelectorArr: (value: string[]) => void
  selectorArr: string[]
  fileIconMap: Record<string, string>
}

function getBaseDirname(filePath: string) {
  // /markdown/test/foo.ts
  const segments = filePath.slice(1).split('/')
  const basename = segments[segments.length - 1]
  const dirname = segments[segments.length - 2]
  return { basename, dirname }
}

function formatHeaderTabName(selector: string, selectorArray: string[]) {
  const { basename, dirname } = getBaseDirname(selector)
  const baseNames = selectorArray
    .filter((s) => s !== selector)
    .map((s) => getBaseDirname(s).basename)
  if (baseNames.includes(basename)) {
    return (
      <div>
        <span>{basename}</span>
        <span className={styles.dirname}>
          ..\
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
    fileIconMap,
  }: Omit<TreeTabsProps, 'tree'>) => {
    return (
      !!selectorArr.length && (
        <div className={cn(tabStyles.tab, styles.header_tab)}>
          {selectorArr.map((s) => (
            <div
              key={s}
              className={cn(styles.header_tab_item, {
                [tabStyles.tab_active]: s === selector,
              })}
              onClick={() => setSelector(s)}
            >
              <img
                data-no-view
                alt="icon"
                width="16"
                height="16"
                src={`/vscode-icons/${fileIconMap[s]}.svg`}
              />
              <div>{formatHeaderTabName(s, selectorArr)}</div>
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  setsetSelectorArr(selectorArr.filter((item) => item !== s))
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

const TreeTabItem = memo(
  ({
    node,
    fileIconMap,
    setsetSelectorArr,
    setLabel,
    selectorArr,
    label,
  }: Omit<TreeTabsProps, 'tree'> & {
    node: TreeNode
  }) => {
    const [collapse, setCollapse] = useState(node.collapse)

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
            setLabel(node.path)

            if (selectorArr.includes(node.path)) {
              return
            }
            setsetSelectorArr([...selectorArr, node.path])
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
            [styles.active_label]: label === node.path,
          })}
          style={{
            paddingLeft: pl,
          }}
        >
          {isDir ? (
            collapse ? (
              <FolderIcon />
            ) : (
              <FolderOpenIcon className={styles.active_dir} />
            )
          ) : (
            <img
              data-no-view
              alt="icon"
              width="16"
              height="16"
              src={`/vscode-icons/${fileIconMap[node.path]}.svg`}
            />
          )}
          {node.label}
        </div>
        {!collapse && (
          <TreeTabs
            selectorArr={selectorArr}
            setsetSelectorArr={setsetSelectorArr}
            label={label}
            tree={node.children}
            setLabel={setLabel}
            fileIconMap={fileIconMap}
          />
        )}
      </div>
    )
  },
)

const TreeTabs = memo(({ tree, ...restProps }: TreeTabsProps) => {
  return (
    <div>
      {tree.map((node) => (
        <TreeTabItem key={node.path} node={node} {...restProps} />
      ))}
    </div>
  )
})

const Empty = memo(() => <CoffeeIcon className={cn('fcc', styles.empty)} />)

const FileTree = memo((props: any) => {
  const { tree, previewMap, defaultSelector, fileIconMap } = useMemo(() => {
    const children = arrayify(props.children)
    const previewMap = Object.fromEntries(
      children.map((child) => [
        handleFileFileTreeMapItemKey(child.props),
        child,
      ]),
    )
    const defaultSelector = (handleFileTreeDefaultSelector(props) || []).map(
      (s) => (s[0] === '/' ? s : `/${s}`),
    )
    console.log(defaultSelector)
    const fileIconMap = handleFileTreeFileIconMapKey(props) || {}
    const tree = handleFileTree(props)
    return { tree, previewMap, defaultSelector, fileIconMap }
  }, [])

  const [selectorArr, setsetSelectorArr] = useState<string[]>(defaultSelector)
  const [label, setLabel] = useState(defaultSelector[0] || '')

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
            fileIconMap={fileIconMap}
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
            fileIconMap={fileIconMap}
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

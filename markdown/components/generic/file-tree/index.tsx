'use client'

import PreComponent from '@/components/ui/Pre'
import { arrayify } from '@/lib/types'
import {
  Fragment,
  memo,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  handleFileTree,
  handleFileFileTreeMapItemKey,
  handleFileTreeDefaultSelector,
  handleFileTreeHasPreviewKey,
  handleFileTreeDirName,
  DefaultFile,
  isLabelStartswithConfigCh,
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
import {
  handleComponentCodeTitle,
  handleIconMap,
} from '~/markdown/plugins/constant'
import Loading from '../_common/Loading'
import useDivider from '@/hooks/useDivider'
import type { TreeNode } from '~/markdown/plugins/remark/code/file-tree/types'
import { getBaseName, getSuffix } from '~/markdown/plugins/utils'
import ImageIcon from '../_common/ImageIcon'

interface TreeTabsProps {
  tree: TreeNode[]
  setPath: (value: string) => void
  path: string
  setSelectorArr: (value: string[]) => void
  selectorArr: string[]
  fileIconMap: Record<string, string>
}

function getBaseDirname(filePath: string) {
  // markdown/test/foo.ts
  const segments = filePath.split('/')
  let basename = segments[segments.length - 1]
  let dirname = segments[segments.length - 2]
  if (isLabelStartswithConfigCh(basename)) {
    basename = basename.slice(1)
  }

  if (isLabelStartswithConfigCh(dirname)) {
    dirname = dirname.slice(1)
  }
  return { basename, dirname }
}

function formatAppDir(name: string) {
  if (name.startsWith('./')) {
    return name
  }
  if (name[0] === '/') {
    return '.' + name
  }
  return './' + name
}

// src/utils ->
function formatLabel(label: string) {
  const tokens = label.split('/')
  return (
    <div className={styles.label}>
      {tokens.map((token, i) => (
        <Fragment key={i}>
          {i === 0 ? null : <span className={styles.split}>\</span>}
          <span>{token}</span>
        </Fragment>
      ))}
    </div>
  )
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

function getIconKey(s: string, fileIconMap: Record<string, string>) {
  s = s.trim()
  const basename = getBaseName(s)
  if (fileIconMap[basename]) {
    return fileIconMap[basename]
  }
  const suffix = getSuffix(s)
  const icon = fileIconMap[suffix]
  return icon || DefaultFile
}

const HeaderTab = memo(
  ({
    setPath,
    path,
    selectorArr,
    setSelectorArr,
    fileIconMap,
  }: Omit<TreeTabsProps, 'tree'>) => {
    return (
      !!selectorArr.length && (
        <div className={cn(tabStyles.tab, styles.header_tab)}>
          {selectorArr.map((s) => (
            <div
              key={s}
              className={cn(styles.header_tab_item, {
                [tabStyles.tab_active]: s === path,
              })}
              onClick={() => setPath(s)}
            >
              <ImageIcon icon={getIconKey(s, fileIconMap)} />
              <div>{formatHeaderTabName(s, selectorArr)}</div>
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectorArr(selectorArr.filter((item) => item !== s))
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
    setSelectorArr,
    setPath,
    selectorArr,
    path,
  }: Omit<TreeTabsProps, 'tree'> & {
    node: TreeNode
  }) => {
    const [collapse, setCollapse] = useState(node.collapse)
    const isDir = node.children.length > 0
    const pl = (node.level + 1) * 16
    return (
      <div
        className={styles.item}
        onClick={(e) => {
          e.stopPropagation()
          if (isDir) {
            setCollapse(!collapse)
          } else {
            setPath(node.path)
            if (selectorArr.includes(node.path)) {
              return
            }
            setSelectorArr([...selectorArr, node.path])
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
          className={cn(styles.label_wrap, {
            [styles.active_label]: path === node.path,
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
            <ImageIcon icon={getIconKey(node.path, fileIconMap)} />
          )}
          {formatLabel(node.label)}
        </div>
        {!collapse && (
          <TreeTabs
            selectorArr={selectorArr}
            setSelectorArr={setSelectorArr}
            path={path}
            tree={node.children}
            setPath={setPath}
            fileIconMap={fileIconMap}
          />
        )}
      </div>
    )
  },
)

const TreeTabs = memo(({ tree, ...restProps }: TreeTabsProps) => {
  return tree.map((node) => (
    <TreeTabItem key={node.path} node={node} {...restProps} />
  ))
})

const Empty = memo(() => <CoffeeIcon className={cn('fcc', styles.empty)} />)

const FileTree = memo((props: any) => {
  const {
    tree,
    previewMap,
    defaultSelector,
    fileIconMap,
    hasPreview,
    title,
    dirname,
  } = useMemo(() => {
    const children = arrayify(props.children || [])
    const previewMap = Object.fromEntries(
      children.map((child) => [
        handleFileFileTreeMapItemKey(child?.props || {}),
        child,
      ]),
    )
    const defaultSelector = handleFileTreeDefaultSelector(props) || []
    const fileIconMap = handleIconMap(props) || {}
    const hasPreview = handleFileTreeHasPreviewKey(props)
    const tree = handleFileTree(props)
    const title = handleComponentCodeTitle(props)
    const dirname = handleFileTreeDirName(props)
    return {
      tree,
      previewMap,
      defaultSelector,
      fileIconMap,
      hasPreview,
      title,
      dirname,
    }
  }, [])

  const [selectorArr, setSelectorArr] = useState<string[]>(defaultSelector)
  const [path, setPath] = useState(defaultSelector[0] || '')
  const preViewRef = useRef<HTMLDivElement>(null)
  const { node: dividerNode, init } = useDivider()

  useLayoutEffect(() => {
    if (selectorArr.length === 0) {
      setPath('')
    } else {
      if (selectorArr.includes(path)) {
        return
      }
      setPath(selectorArr[0])
    }
  }, [selectorArr])

  useEffect(() => {
    return init(preViewRef.current)
  }, [])

  return (
    <div className={styles.wrap}>
      <div className={codeWrapStyles.bar}>{title ?? 'FileTree'}</div>
      <div
        className={cn(styles.container, {
          [styles.no_preview]: !hasPreview,
        })}
      >
        <div className={styles.tabs} ref={preViewRef}>
          {!!dirname && (
            <div className={styles.appdir}>{formatAppDir(dirname)}</div>
          )}
          <TreeTabs
            selectorArr={selectorArr}
            setSelectorArr={setSelectorArr}
            path={path}
            setPath={setPath}
            tree={tree}
            fileIconMap={fileIconMap}
          />
        </div>
        {hasPreview && (
          <Suspense fallback={<Loading />}>
            {dividerNode}
            <div
              className={cn(styles.preview, {
                fcc: !previewMap[path],
                [styles.preview_empty]: !selectorArr.length,
              })}
            >
              <HeaderTab
                selectorArr={selectorArr}
                setSelectorArr={setSelectorArr}
                path={path}
                setPath={setPath}
                fileIconMap={fileIconMap}
              />
              {previewMap[path] ? (
                <PreComponent>{previewMap[path]}</PreComponent>
              ) : (
                <Empty />
              )}
            </div>
          </Suspense>
        )}
      </div>
    </div>
  )
})

export default FileTree

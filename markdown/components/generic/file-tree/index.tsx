'use client'

import PreComponent from '@/components/ui/Pre'
import { arrayify } from '@/lib/types'
import {
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
  handleFileTreeFileIconMapKey,
  handleFileTreeHasPreviewKey,
  handleFileTreeDirName,
  DefaultFile,
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
import { handleComponentCodeTitle } from '~/markdown/plugins/constant'
import Loading from '../_common/Loading'
import useDivider from '@/hooks/useDivider'
import type { TreeNode } from '~/markdown/plugins/remark/code/file-tree/types'
import { getSuffix } from '~/markdown/plugins/utils'

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
  const basename = segments[segments.length - 1]
  const dirname = segments[segments.length - 2]
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

function formatHeaderTabName(selector: string, selectorArray: string[]) {
  let { basename, dirname } = getBaseDirname(selector)
  const baseNames = selectorArray
    .filter((s) => s !== selector)
    .map((s) => getBaseDirname(s).basename)
  if (basename[0] === '+' || basename[0] === '-') {
    basename = basename.slice(1)
  }
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

const FileExtensionIcon = memo(({ icon }: { icon: string }) => {
  return (
    <img
      data-no-view
      alt="icon"
      width="16"
      height="16"
      src={`/vscode-icons/${icon}.svg`}
    />
  )
})

function getIconKey(s: string) {
  const iconKey = getSuffix(s.trim())
  if (iconKey === 'txt') {
    return DefaultFile
  }
  return iconKey
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
              <FileExtensionIcon icon={fileIconMap[getIconKey(s)]} />
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
            <FileExtensionIcon icon={fileIconMap[getIconKey(node.path)]} />
          )}
          <div className={styles.label}>{node.label}</div>
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
    const fileIconMap = handleFileTreeFileIconMapKey(props) || {}
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

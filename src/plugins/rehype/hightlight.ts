// Modified by https://github.com/timlrx/rehype-prism-plus/blob/main/LICENSE
import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import { filter } from 'unist-util-filter'
import rangeParser from 'parse-numeric-range'
import type { Element, Root } from 'hast'
import { HighlighterCore, HighlighterGeneric } from 'shiki/core'
import { getCodeFromProps, getLangFromProps } from '../remark/playground'

const getLanguage = (className: string[]) => {
  for (const classListItem of className) {
    if (classListItem.slice(0, 9) === 'language-') {
      return classListItem.slice(9).toLowerCase()
    }
  }
  return 'txt'
}

/**
 * Create a closure that determines if we have to highlight the given index
 */
const NumRangeRegx = /{([\d,-]+)}/
const calculateLinesToHighlight = (meta: string) => {
  // Remove space between {} e.g. {1, 3}
  const parsedMeta = meta
    .split(',')
    .map((str) => str.trim())
    .join()
  const parsed = NumRangeRegx.exec(parsedMeta)
  if (parsed === null) {
    return () => false
  }
  const strlineNumbers = parsed[1]
  const lineNumbers = rangeParser(strlineNumbers)
  return (index: number) => lineNumbers.includes(index + 1)
}

/**
 * Check if we want to start the line numbering from a given number or 1
 * showLineNumbers=5, will start the numbering from 5
 */
const LineRegx = /showLineNumbers=(?<lines>\d+)/i
const calculateStartingLine = (meta: string) => {
  // pick the line number after = using a named capturing group
  const parsed = LineRegx.exec(meta)
  if (parsed === null) {
    return 1
  }
  return Number(parsed.groups?.lines)
}

/**
 * Create container AST for node lines
 */
const createLineNodes = (number: number) => {
  const a: any[] = []
  for (let i = 0; i < number; i++) {
    a.push({
      type: 'element',
      tagName: 'span',
      properties: { className: [] },
      children: [],
    })
  }
  return a
}

/**
 * Split multiline text nodes into individual nodes with positioning
 * Add a node start and end line position information for each text node
 */
const addNodePositionClosure = () => {
  let startLineNum = 1

  const addNodePosition = (ast: Element['children']) => {
    return ast.reduce((result: Element['children'], node) => {
      if (node.type === 'text') {
        const value = /** @type {string} */ node.value
        const numLines = (value.match(/\n/g) || '').length
        if (numLines === 0) {
          node.position = {
            // column: 1 is needed to avoid error with @next/mdx
            // https://github.com/timlrx/rehype-prism-plus/issues/44
            start: { line: startLineNum, column: 1 },
            end: { line: startLineNum, column: 1 },
          }
          result.push(node)
        } else {
          const lines = value.split('\n')
          for (const [i, line] of lines.entries()) {
            result.push({
              type: 'text',
              value: i === lines.length - 1 ? line : line + '\n',
              position: {
                start: { line: startLineNum + i, column: 1 },
                end: { line: startLineNum + i, column: 1 },
              },
            })
          }
        }
        startLineNum = startLineNum + numLines

        return result
      }

      if (Object.prototype.hasOwnProperty.call(node, 'children')) {
        const initialLineNum = startLineNum
        // @ts-ignore
        node.children = addNodePosition(node.children, startLineNum)
        result.push(node)
        node.position = {
          start: { line: initialLineNum, column: 1 },
          end: { line: startLineNum, column: 1 },
        }
        return result
      }

      result.push(node)
      return result
    }, [])
  }
  return addNodePosition
}

/**
 * Rehype prism plugin generator that highlights code blocks with refractor (prismjs)
 *
 * Pass in your own refractor object with the required languages registered:
 * https://github.com/wooorm/refractor#refractorregistersyntax
 */
const themeOptions = {
  light: 'vitesse-light',
  dark: 'vitesse-dark',
}
const rehypePrismGenerator = (
  shiki: HighlighterCore | HighlighterGeneric<any, any>,
) => {
  return () => {
    return (tree: Root) => {
      visit(tree, 'element', function visitor(node, index, parent) {
        const props = node.properties
        let code = getCodeFromProps(props)

        if (
          !parent ||
          parent.type !== 'element' ||
          parent.tagName !== 'pre' ||
          node.tagName !== 'code'
        ) {
          return
        }
        if (!code) {
          code = toString(node)
        }
        // @ts-ignore meta is a custom code block property
        const meta: string = node.data?.meta ?? props?.metastring ?? ''
        // Coerce className to array
        if (props.className) {
          if (typeof props.className === 'boolean') {
            props.className = []
          } else if (!Array.isArray(props.className)) {
            props.className = [props.className]
          }
        } else {
          props.className = []
        }
        const lang = getLanguage(props.className as string[])
        props.className.push('shiki')
        // Syntax highlight
        let shikiRoot = node
        try {
          shikiRoot =
            shiki.codeToHast(code, {
              themes: themeOptions,
              lang,
              // @ts-ignore
            }).children?.[0]?.children[0] ?? node
        } catch (error) {}

        shikiRoot.children = addNodePositionClosure()(shikiRoot.children)
        // Add position info to root
        if (shikiRoot.children.length > 0) {
          shikiRoot.position = {
            start: {
              line: shikiRoot.children[0].position!.start.line,
              column: 0,
            },
            end: {
              line: shikiRoot.children[shikiRoot.children.length - 1].position!
                .end.line,
              column: 0,
            },
          }
        } else {
          shikiRoot.position = {
            start: { line: 0, column: 0 },
            end: { line: 0, column: 0 },
          }
        }

        const shouldHighlightLine = calculateLinesToHighlight(meta)
        const startingLineNumber = calculateStartingLine(meta)
        const codeLineArray = createLineNodes(shikiRoot.position.end.line)
        for (let i = 0; i < codeLineArray.length; i++) {
          const line = codeLineArray[i]
          // Default class name for each line
          line.properties.className = ['code-line']

          // Syntax highlight
          const treeExtract = filter(
            shikiRoot,
            (node) =>
              node.position &&
              node.position.start.line <= i + 1 &&
              node.position.end.line >= i + 1,
          )
          if (!treeExtract?.children) {
            continue
          }
          line.children = treeExtract.children

          // Line number
          if (meta.toLowerCase().includes('showLineNumbers'.toLowerCase())) {
            line.properties.line = [(i + startingLineNumber).toString()]
            line.properties.className.push('line-number')
          }

          // Line highlight
          if (shouldHighlightLine(i)) {
            line.properties.className.push('highlight-line')
          }

          // Diff classes
          if (lang === 'diff' || lang.includes('diff-')) {
            const ch = toString(line).substring(0, 1)
            line.properties.className.push(ch === '-' ? 'deleted' : 'inserted')
          }
        }
        node.children = codeLineArray
      })
    }
  }
}

export default rehypePrismGenerator

import { type FC, type ReactNode } from 'react'
import Image from 'next/image'
import { toHtml } from 'hast-util-to-html'
import { toString } from 'hast-util-to-string'
import ReactMarkdown from 'react-markdown'
import sizeOf from 'image-size'
import remarkParse from 'remark-parse'
import remarkToc from 'remark-toc'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import remarkTextr from 'remark-textr'
import remarkGfm from 'remark-gfm'
import rehypePrism from 'rehype-prism-plus'
import CopyComponent from './Copy'
import {
  rehypeCodeLang,
  rehypeImageWrapper,
  rehypeLazyImage,
  rehypeSlug,
} from '@/plugins/rehype'
import {
  BashIcon,
  JavaScriptIcon,
  JsonIcon,
  JsxIcon,
  ReactIcon,
  RustIcon,
  ShellIcon,
  TextIcon,
  TsxIcon,
  TypeScriptIcon,
  VueIcon,
} from '@/components/icons/lang'

interface Props {
  md: string
}

const iconMap: Record<string, ReactNode> = {
  javascript: <JavaScriptIcon />,
  typescript: <TypeScriptIcon />,
  rust: <RustIcon />,
  react: <ReactIcon />,
  jsx: <JsxIcon />,
  tsx: <TsxIcon />,
  vue: <VueIcon />,
  json: <JsonIcon />,
  shell: <ShellIcon />,
  bash: <BashIcon />,
}

const PostCmp: FC<Props> = ({ md }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[
        remarkParse,
        remarkGfm,
        [remarkToc, { maxDep: 3, heading: '目录', skip: '---------' }],
        remarkTextr,
        remarkRehype,
      ]}
      rehypePlugins={[
        rehypeStringify,
        [rehypePrism, { ignoreMissing: true, showLineNumbers: true }],
        rehypeImageWrapper,
        rehypeCodeLang,
        rehypeLazyImage,
        rehypeSlug,
      ]}
      components={{
        pre(node) {
          const lang = (node as any)?.['data-lang'] as string
          return (
            <div className="pre-wrap">
              <div className="pre-bar">
                <div className="pre-lang-wrap">
                  <div className="pre-circle" data-red />
                  <div className="pre-circle" data-yellow />
                  <div className="pre-circle" data-green />
                  <div className="pre-lang">
                    {iconMap[lang?.toLowerCase() ?? '__'] ?? lang ?? (
                      <TextIcon />
                    )}
                  </div>
                </div>
                <CopyComponent text={toString(node.node!)} />
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: toHtml(node.node!),
                }}
              />
            </div>
          )
        },
        img(node) {
          return (
            <Image
              src={node.src!}
              width={800}
              height={800}
              alt={node.alt ?? ''}
            />
          )
        },
      }}
      className="md Post"
    >
      {'# 目录\r\n' + '# ---------' + md}
    </ReactMarkdown>
  )
}

export default PostCmp

/* eslint-disable @stylistic/max-len */
import { type FC, type ReactNode } from 'react'
import { toHtml } from 'hast-util-to-html'
import { toString } from 'hast-util-to-string'
import ReactMarkdown from 'react-markdown'
import remarkParse from 'remark-parse'
import remarkToc from 'remark-toc'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import remarkTextr from 'remark-textr'
import remarkGfm from 'remark-gfm'
import rehypePrism from 'rehype-prism-plus'
import Image, { getImageProps } from 'next/image'
import Link from 'next/link'
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

const aliasMap: Record<string, string> = {
  javascript: 'Javascript',
  typescript: 'Typscript',
  rust: 'Rust',
  react: 'React',
  jsx: 'JSX',
  tsx: 'TSX',
  vue: 'Vue',
  json: 'JSON',
  shell: 'Shell',
  bash: 'Bash',
}

const REPO_IMAGE = 'https://plumbiu.github.io/blogImg/'

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
              <div className="pre-code-wrap">
                <div className="pre-code-lang">
                  {aliasMap[lang ?? '__'] ?? 'PlainText'}
                </div>
                <div
                  data-lang={lang ?? 'PlainText'}
                  className="pre-code"
                  dangerouslySetInnerHTML={{
                    __html: toHtml(node.node!),
                  }}
                />
              </div>
            </div>
          )
        },
        img(node) {
          const nodeSrc = node.src as string
          const props = {
            ...getImageProps({
              src: nodeSrc,
              height: 500,
              width: 500,
              alt: node.alt ?? '',
            }).props,
            className: 'glightbox',
            alt: node.alt ?? '',
          }
          return (
            <Link
              href={nodeSrc.startsWith(REPO_IMAGE) ? nodeSrc : props.src}
              className="chocolat-image"
            >
              <Image
                {...props}
                placeholder="blur"
                blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
              />
            </Link>
          )
        },
      }}
      className="md Post"
    >
      {'# 目录\n' + '# ---------' + md}
    </ReactMarkdown>
  )
}

export default PostCmp

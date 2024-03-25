import type { FC } from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkParse from 'remark-parse'
import remarkToc from 'remark-toc'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import remarkTextr from 'remark-textr'
import remarkGfm from 'remark-gfm'
import rehypePrism from 'rehype-prism-plus'
import {
  rehypeCodeLang,
  rehypeImageWrapper,
  rehypeLazyImage,
  rehypeSlug,
} from '@/plugins/rehype'

interface Props {
  md: string
}

const PostCmp: FC<Props> = ({ md }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[
        remarkParse,
        remarkGfm,
        [remarkToc, { maxDep: 3, heading: '目录' }],
        remarkTextr,
        remarkRehype,
      ]}
      rehypePlugins={[
        rehypeStringify,
        [rehypePrism, { ignoreMissing: true, showLineNumbers: true }],
        rehypeCodeLang,
        rehypeLazyImage,
        rehypeImageWrapper,
        rehypeSlug,
      ]}
      components={{
        img: (node) => {
          return (
            <Image
              src={node.src!}
              width={600}
              height={600}
              alt={node.alt ?? ''}
            />
          )
        },
      }}
      className="md Post"
    >
      {'# 目录\n' + md}
    </ReactMarkdown>
  )
}

export default PostCmp

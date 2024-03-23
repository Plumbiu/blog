import type { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkParse from 'remark-parse'
import remarkToc from 'remark-toc'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeRewrite from 'rehype-rewrite'
import remarkTextr from 'remark-textr'
import remarkGfm from 'remark-gfm'
import rehypePrism from 'rehype-prism-plus'
import { rewritePlugins } from '@/lib/md/plugins'
import { rewriteCodeLang } from '@/lib/md/plugins/code-lang'
import { rewriteImageWrapper } from '@/lib/md/plugins/img-wrap'
import { rewriteLazyImage } from '@/lib/md/plugins/lazy-image'
import { rewriteToc } from '@/lib/md/plugins/toc'

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
        [
          rehypeRewrite,
          rewritePlugins(
            rewriteCodeLang,
            rewriteLazyImage,
            rewriteImageWrapper,
            rewriteToc,
          ),
        ],
      ]}
      className="md Post"
    >
      {'# 目录\n' + md}
    </ReactMarkdown>
  )
}

export default PostCmp

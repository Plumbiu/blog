import Main from '@/components/Main'
import { Typography } from '@mui/material'
import { type FC } from 'react'
import '@/styles/github-markdown-light.css'
import { useRequest } from '@/lib/api'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }),
)
interface Props {
  params: {
    id: string
  }
}

const page: FC<Props> = async ({ params }) => {
  const data = await useRequest<Article>('article/' + params.id)
  const html = await marked.parse(data.content)
  return (
    <Main>
      <div>
        <Typography
          variant="h4"
          gutterBottom
          component="div"
          sx={{
            px: 2,
          }}
        >
          {data.title}
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          component="div"
          sx={{
            px: 2,
          }}
        >
          <div
            className="md"
            dangerouslySetInnerHTML={{
              __html: html,
            }}
          />
        </Typography>
      </div>
    </Main>
  )
}

export default page

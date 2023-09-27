import { Typography } from '@mui/material'
import { type FC } from 'react'
import '@/styles/github-markdown-light.css'
import 'highlight.js/styles/github.css'
import { useRequest } from '@/lib/api'
import Main from '@/components/ui/Main'
import marked from '@/lib/marked'
import Toc from '@/components/Toc'

interface Props {
  params: {
    id: string
  }
}

const page: FC<Props> = async ({ params }) => {
  const data = await useRequest<Article>('article/' + params.id)
  const html = await marked.parse(data.content)
  return (
    <>
      <Toc html={html} title={data.title} tags={data.tags} />
      <Main>
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
      </Main>
    </>
  )
}

export default page

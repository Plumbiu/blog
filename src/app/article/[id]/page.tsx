import Main from '@/components/Main'
import { Typography } from '@mui/material'
import { FC } from 'react'
import { marked } from 'marked'

import '@/styles/github-markdown-light.css'

interface Props {
  params: {
    id: string
  }
}

const page: FC<Props> = async ({ params }) => {
  const raw = await fetch('https://blog.plumbiu.top/api/article/' + params.id)
  const data: Article = await raw.json()

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
              __html: marked.parse(data.content),
            }}
          />
        </Typography>
      </div>
    </Main>
  )
}

export default page

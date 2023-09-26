import Main from '@/components/Main'
import { Typography } from '@mui/material'
import { type FC } from 'react'
import { marked } from 'marked'
import '@/styles/github-markdown-light.css'
// import { useRequest } from '@/lib/api'

interface Props {
  params: {
    id: string
  }
}

const page: FC<Props> = async ({ params }) => {
  // const data = await useRequest<Article>('article/' + params.id)
  const data: Article = {
    id: '',
    content: '',
    title: '',
    date: new Date('1970'),
    updated: new Date('1970'),
    tags: [],
    categories: [],
  }
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

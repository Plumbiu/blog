import type { FC } from 'react'
import './index.css'

interface Props {
  html: string
}

const PostCmp: FC<Props> = ({ html }) => {
  return (
    <div
      className="md Post"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  )
}

export default PostCmp

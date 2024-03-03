import type { FC } from 'react'

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

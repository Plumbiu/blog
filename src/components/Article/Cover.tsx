import type { FC, ReactNode } from 'react'

interface Props {
  width?: number
  height?: number
  children: ReactNode
  mr?: number
}

const ArticleCover: FC<Props> = ({
  width = 52,
  height = 52,
  mr = 12,
  children,
}) => {
  return (
    <div
      style={{
        minWidth: width + 'px',
        width: width + 'px',
        maxWidth: width + 'px',
        height: height + 'px',
        marginRight: mr + 'px',
        lineHeight: height + 'px',
        color: '#fff',
        fontSize: '1.25rem',
        textAlign: 'center',
        backgroundColor: '#9C27B0',
        overflow: 'hidden',
        borderRadius: '50%',
      }}
    >
      {children}
    </div>
  )
}

export default ArticleCover

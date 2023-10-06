import type { FC } from 'react'
import './index.css'

interface Props {
  q: string
  a: string
  emoji: string
}

const QA: FC<Props> = ({ q, a, emoji }) => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: '16px',
        }}
      >
        <span className="QA-Emoji">🤔</span>
        <span className="A-Block">{q}</span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          alignSelf: 'flex-end',
          marginRight: '16px',
        }}
      >
        <span className="Q-Block">{a}</span>
        <span className="QA-Emoji">{emoji}</span>
      </div>
    </>
  )
}

export default QA

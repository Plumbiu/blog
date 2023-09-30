import type { FC } from 'react'
import '@/styles/myself.css'

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
        }}
      >
        <span className="myself-emoji">🤔</span>
        <span className="myself-box myself-answer-box">{q}</span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          alignSelf: 'flex-end',
        }}
      >
        <span className="myself-box myself-question-box">{a}</span>
        <span className="myself-emoji">{emoji}</span>
      </div>
    </>
  )
}

export default QA

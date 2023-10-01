import * as React from 'react'
import { Typography } from '@mui/material'
import QA from '@/components/Myself/QA'

const qas = [
  { q: 'Who are you ?', a: 'Plumbiu(Guo Xingjun).', emoji: '😀' },
  { q: "what's your job ?", a: 'A front-end programmer.', emoji: '🥵' },
  {
    q: 'Introduce yourself ?',
    a: 'Studied at Hangzhou Dianzi University(杭州电子科技大学)(HDU), a junior.',
    emoji: '🥰',
  },
]

export default function Home() {
  return (
    <div className="myself-container">
      <Typography
        variant="h6"
        component="div"
        sx={{
          mx: 'auto',
          pb: 2,
        }}
      >
        🎉 我的个人介绍！ 🎉
      </Typography>
      {qas.map(({ q, a, emoji }) => (
        <QA key={q} q={q} a={a} emoji={emoji} />
      ))}
    </div>
  )
}

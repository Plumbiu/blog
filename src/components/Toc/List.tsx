'use client'
import type { Toc } from '@/lib/toc'
import { Typography } from '@mui/material'
import { useState, type FC } from 'react'

interface Props {
  tocs: Toc[]
}

const TocList: FC<Props> = ({ tocs }) => {
  const initalData: Record<string, boolean> = {}
  for (const toc of tocs) {
    initalData[toc.id] = false
  }
  const [show, setShow] = useState(initalData)
  function handleShow(id: string) {
    setShow({
      ...initalData,
      [id]: true,
    })
  }
  return tocs.map(({ level, id }) => (
    <Typography
      key={id}
      className="toc-list"
      component="a"
      gutterBottom
      variant="body2"
      href={'#' + id.replace(/\s/g, '')}
      onClick={() => {
        handleShow(id)
      }}
      sx={{
        pl: level * 2,
        py: 1,
        display: 'block',
        color: show[id] ? '#1976D2' : 'inherit',
        backgroundColor: show[id] ? '#F8F8F8' : 'inherit',
        '&:hover': {
          backgroundColor: '#F8F8F8',
        },
      }}
    >
      {show[id] && <div className="toc-block" />}
      {id}
    </Typography>
  ))
}

export default TocList

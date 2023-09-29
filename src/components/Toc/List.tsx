'use client'
import type { Toc } from '@/lib/toc'
import { Button, Typography } from '@mui/material'
import { useState, type FC } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Hr from '../ui/Hr'

interface Props {
  tocs: Toc[]
  id: string
}

const TocList: FC<Props> = ({ tocs, id }) => {
  const [currentIdx, setCurrentIdx] = useState(0)
  return (
    <>
      <div
        style={{
          padding: '6px 0',
        }}
      >
        <Hr />
      </div>
      <div
        style={{
          padding: '4px 0',
          maxHeight: '460px',
          overflowY: 'scroll',
        }}
      >
        {tocs.map(({ level, id: hash }, index) => (
          <Typography
            key={hash}
            className="toc-list"
            component="a"
            variant="body2"
            href={'#' + hash.replace(/\s/g, '')}
            onClick={() => {
              setCurrentIdx(index)
            }}
            sx={{
              pl: level * 2,
              py: 1,
              display: 'block',
              color: currentIdx === index ? '#1976D2' : 'inherit',
              backgroundColor: currentIdx === index ? '#F8F8F8' : 'inherit',
              '&:hover': {
                backgroundColor: '#F8F8F8',
              },
            }}
          >
            {currentIdx === index && <div className="toc-block" />}
            {hash}
          </Typography>
        ))}
      </div>
      <Hr />
      <Button
        variant="outlined"
        size="small"
        startIcon={<ArrowBackIcon />}
        component="a"
        href="/article"
        sx={{
          ml: '12px',
          mt: 1,
        }}
      >
        文章页
      </Button>
    </>
  )
}

export default TocList

'use client'
import type { Toc } from '@/lib/toc'
import { Alert, Button, ButtonGroup, Snackbar, Typography } from '@mui/material'
import { useState, type FC } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ShareIcon from '@mui/icons-material/Share'
import Hr from '../ui/Hr'

interface Props {
  tocs: Toc[]
  id: string
}

const TocList: FC<Props> = ({ tocs, id }) => {
  const initalData: Record<string, boolean> = {}
  const [url, setUrl] = useState('https://blog.plumbiu.top/article/' + id)
  const [open, setOpen] = useState(false)
  for (const toc of tocs) {
    initalData[toc.id] = false
  }
  const [show, setShow] = useState(initalData)
  function handleShow(hash: string) {
    setUrl(`https://blog.plumbiu.top/article/${id}#${hash}`)
    setShow({
      ...initalData,
      [hash]: true,
    })
  }
  async function handleShare() {
    setOpen(true)
    await navigator.clipboard.writeText(url)
  }
  return (
    <>
      <div
        style={{
          margin: '12px 0',
          maxHeight: '460px',
          overflowY: 'scroll',
        }}
      >
        <Hr />
        <div
          style={{
            padding: '12px 0',
          }}
        >
          {tocs.map(({ level, id }) => (
            <Typography
              key={id}
              className="toc-list"
              component="a"
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
          ))}
        </div>
        <Hr />
      </div>
      <ButtonGroup
        disableElevation
        variant="outlined"
        size="small"
        sx={{
          pl: 2,
        }}
        aria-label="Disabled elevation buttons"
      >
        <Button startIcon={<ArrowBackIcon />} component="a" href="/article">
          文章页
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault()
            void handleShare()
          }}
          endIcon={<ShareIcon />}
          component="a"
          href="/article"
        >
          分享
        </Button>
      </ButtonGroup>
      <Snackbar
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        autoHideDuration={3000}
        key="复制链接成功，快分享给你的小伙伴吧！"
        message="复制链接成功，快分享给你的小伙伴吧！"
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          复制链接成功，快分享给你的小伙伴吧！
        </Alert>
      </Snackbar>
    </>
  )
}

export default TocList

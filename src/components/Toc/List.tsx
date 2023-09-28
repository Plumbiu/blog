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
    setUrl(`https://blog.plumbiu.top/article/${id}#${hash.replace(/\s/g, '')}`)
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
      <ButtonGroup
        disableElevation
        variant="outlined"
        size="small"
        sx={{
          mt: 2,
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
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          复制链接成功！
        </Alert>
      </Snackbar>
    </>
  )
}

export default TocList

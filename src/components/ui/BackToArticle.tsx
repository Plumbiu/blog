'use client'
import { ButtonGroup, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

function BackToArticle() {
  return (
    <ButtonGroup
      disableElevation
      variant="contained"
      aria-label="Disabled elevation buttons"
    >
      <Button startIcon={<ArrowBackIcon />} component="a" href="/article">
        文章页
      </Button>
    </ButtonGroup>
  )
}

export default BackToArticle

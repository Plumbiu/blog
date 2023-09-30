'use client'
import { Pagination } from '@mui/material'
import { useRouter } from 'next/navigation'
import type { ChangeEvent, FC } from 'react'
import { articleNum } from '@/config/sideCard.json'

interface Props {
  page: number
}

const PaginationCmp: FC<Props> = ({ page }) => {
  const router = useRouter()
  function handleChangePage(_event: ChangeEvent<unknown>, newPage: number) {
    router.push(String(newPage))
  }
  return (
    <Pagination
      showFirstButton
      showLastButton
      page={page}
      onChange={handleChangePage}
      count={Math.floor(articleNum / 8)}
      color="secondary"
      sx={{
        mt: 1,
      }}
    />
  )
}

export default PaginationCmp

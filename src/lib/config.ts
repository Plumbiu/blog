import { articleNum } from '@/lib/json'

/*
  for router article/:pagenum
  one page article limit
*/
export const articleLimit = 12

/*
  for component Pagination, total pagenum
*/
export const paginationTotal = Math.ceil(articleNum / articleLimit)

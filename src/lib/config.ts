import { articleNum } from '~/config/sideCard.json'
/*
  for router article/:pagenum
  one page article limit
*/
export const articleLimit = 10

/*
  for component Pagination, total pagenum
*/
export const paginationTotal = Math.ceil(articleNum / articleLimit)

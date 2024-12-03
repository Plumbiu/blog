export const monthArr = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const FrontmatterWrapStr = '---'

export const PostDir = ['blog', 'life', 'summary', 'note'] as const
export type FrontmatterKey = (typeof PostDir)[number]

export const RepoName = 'blog'
export const IS_GITPAGE = !!process.env.GITPAGE
export const BasePath = IS_GITPAGE ? `/${RepoName}` : ''

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

export const PostDir = ['note', 'life', 'blog', 'summary'] as const
export type FrontmatterKey = (typeof PostDir)[number]

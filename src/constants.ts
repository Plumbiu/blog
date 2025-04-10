export const PostDir = ['blog', 'life', 'summary', 'note'] as const
export type FrontmatterKey = (typeof PostDir)[number]



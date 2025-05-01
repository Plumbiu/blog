export const Categoires = ['blog', 'life', 'summary', 'note'] as const
export type CategoiresType = (typeof Categoires)[number]

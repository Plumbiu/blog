import path from 'node:path'

export const CWD = process.cwd()
export const DataPath = path.join(CWD, 'data')
export const PostPath = path.join(CWD, 'posts')
export const MarkdownPath = path.join(CWD, 'markdown')

export const BlogUrl = 'https://blog.plumbiu.top/'

export const BlogAuthor = 'Plumbiu'

export const GithubName = BlogAuthor

export const RepoName = 'blog'

export const RepoUrl = `https://github.com/Plumbiu/${RepoName}`

export const RepoLinksUrl = `${RepoUrl}/blob/main/data/links.json`

export const BilibiliId = '227616086'

export const IS_GITPAGE = !!process.env.GITPAGE
export const BasePath = IS_GITPAGE ? `/${RepoName}` : ''

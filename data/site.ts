// Blog
export const BlogUrl = 'https://blog.plumbiu.top/'
export const BlogAuthor = 'Plumbiu'
export const BlogTitle = `${BlogAuthor}の博客`
export const BlogDesc = 'Note, life, summary and blog'
export const BlogCopyRight = `CC BY-NC-SA 4.0 2024 © ${BlogAuthor}`

// Github
export const GithubName = BlogAuthor
export const GithubRepoName = 'blog'
export const GithubRepoUrl = `https://github.com/Plumbiu/${GithubRepoName}`
export const GithubLinksUrl = `${GithubRepoUrl}/blob/main/data/links.json`

// Contact
export const BilibiliId = '227616086'
export const Email = 'plumbiuzz@gmail.com'

// Page
export const IS_GITPAGE = !!process.env.GITPAGE
export const BasePath = IS_GITPAGE ? `/${GithubRepoName}` : ''

// Google Search Console
export const GSC = 'cLcOnIeQ4g4EzFOatuj_bf8zVqruuH4ZYgrnTSgVR_k'

// Github app client id
export const GithubClientId = 'Iv23liwjsrIfaRQuewBK'

export function loadArchives(posts: IFrontMatter[]) {
  const raw: Record<string, IFrontMatter[]> = {}
  for (const post of posts) {
    const date = new Date(post.date)
    const year = date.getFullYear()
    const key = String(year)
    if (raw[key]) {
      raw[key].push(post)
    } else {
      raw[key] = [post]
    }
  }
  const archives: IArcheve[] = []
  for (const [year, articles] of Object.entries(raw)) {
    archives.push({
      year,
      articles,
    })
  }

  return archives.sort((a, b) => Number(b.year) - Number(a.year))
}

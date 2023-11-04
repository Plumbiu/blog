import config from '~/config.json'
import sideCard from '~/config/sideCard.json'

const {
  name,
  github_name,
  twitter,
  title,
  location,
  email,
  url,
  yourself,
  blog_message_repo,
  blog_repo,
} = config

const { articleNum, categoryNum, tagNum } = sideCard

export {
  name,
  github_name,
  twitter,
  title,
  location,
  email,
  url,
  yourself,
  blog_message_repo,
  blog_repo,
  articleNum,
  categoryNum,
  tagNum,
}

import ButtonListIcon from '../../../../ui/Button/ListIcon'
import Hr from '../../../../ui/Hr'
import {
  ArticleIcon,
  CategoryIcon,
  FirstPageIcon,
  GithubIcon,
  PeopleIcon,
  TagIcon,
  TravelExploreIcon,
} from '@/components/icons'
import { blog_repo } from '~/config.json'

const lists = [
  { text: '首页', link: '/', icon: <FirstPageIcon /> },
  { text: '文章', link: '/article/1', icon: <ArticleIcon /> },
  { text: '开源之旅', link: '/opensource', icon: <TravelExploreIcon /> },
  { text: '朋友们', link: '/friend', icon: <PeopleIcon /> },
  { text: '标签', link: '/tag', icon: <TagIcon /> },
  { text: '分类', link: '/category', icon: <CategoryIcon /> },
  {
    text: 'GitHub',
    link: blog_repo,
    icon: <GithubIcon />,
  },
]

const MenuList = () => {
  return lists.map(({ text, link, icon }, index) => (
    <div key={text}>
      <ButtonListIcon
        blank={false}
        icon={icon}
        py={10}
        text={text}
        link={link}
      />
      {index % 3 ? undefined : <Hr />}
    </div>
  ))
}

export default MenuList

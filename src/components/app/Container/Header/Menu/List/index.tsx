import ButtonListIcon from '@/components/ui/Button/ListIcon'
import Hr from '@/components/ui/Hr'
import {
  ArticleIcon,
  CategoryIcon,
  ClockIcon,
  FirstPageIcon,
  GithubIcon,
  LabIcon,
  PeopleIcon,
  TagIcon,
  TravelExploreIcon,
} from '@/components/icons'
import { blog_repo } from '@/lib/json'

const lists = [
  { text: '首页', link: '/', icon: <FirstPageIcon /> },
  { text: '文章', link: '/article', icon: <ArticleIcon /> },
  { text: '开源之旅', link: '/opensource', icon: <TravelExploreIcon /> },
  { text: '时间线', link: '/archive', icon: <ClockIcon /> },
  { text: '朋友们', link: '/friend', icon: <PeopleIcon /> },
  { text: '标签', link: '/tag', icon: <TagIcon /> },
  { text: '分类', link: '/category', icon: <CategoryIcon /> },
  { text: '实验室', link: '/lab', icon: <LabIcon /> },
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
        py={4}
        px={4}
        text={text}
        link={link}
      />
      {index % 3 ? undefined : <Hr />}
    </div>
  ))
}

export default MenuList

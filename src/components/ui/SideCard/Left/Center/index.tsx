import Button from '@/components/ui/Button'
import './index.css'
import Badge from '@/components/ui/Badge'
import { articleNum } from '~/config/sideCard.json'

const blogInfo = [
  { primary: '归档', href: '/archives' },
  { primary: '文章', href: '/article/1', count: articleNum },
  { primary: '关于', href: '/about' },
]

const info = [
  {
    primary: '朋友们',
    href: '/friends',
  },
  {
    primary: '留言板',
    href: '/comments',
  },
  {
    primary: '开源之旅',
    href: '/opensource',
  },
]

const SideCardCenter = () => {
  return (
    <div className="List-Center">
      <div className="List-Center-Badge">
        {blogInfo.map(({ href, primary, count }) => (
          <Badge key={primary} count={count}>
            <Button link={href}>{primary}</Button>
          </Badge>
        ))}
      </div>
      <div className="List-Center-Badge">
        {info.map(({ primary, href }) => (
          <Button key={primary} link={href}>
            {primary}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default SideCardCenter

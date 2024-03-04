import Image from 'next/image'
import Link from 'next/link'
import Chips from '@/components/ui/Chips'
import { useGet } from '@/lib/api'
import './index.css'
import { EmailIcon, GithubIcon, LocationIcon } from '@/components/icons'
import {
  location,
  email,
  articleNum,
  tagNum,
  categoryNum,
  github_name,
} from '@/lib/json'

const blogInfo = [
  { primary: '标签', href: '/tag', count: tagNum },
  { primary: '文章', href: '/article/1', count: articleNum },
  {
    primary: '分类',
    href: '/category',
    count: categoryNum,
  },
]
const myInfo = [
  {
    primary: email,
    icon: <EmailIcon />,
  },
  { primary: location, icon: <LocationIcon /> },
]

const Side = async () => {
  const tags = await useGet<Tag[]>('tag')
  const categories = await useGet<Category[]>('category')
  const archeveYear = await useGet<IArcheveYear[]>('archive/year')

  return (
    <div className="Side">
      <div className="Side-Me">
        <Image src="/avatar.jpg" width={86} height={86} alt="avatar" />
        <div className="Side-Name">Plumbiu</div>
        <div className="Side-Location">
          <LocationIcon />
          {location}
        </div>
        <div className="Side-Blog">
          {blogInfo.map(({ primary, href, count }) => (
            <Link key={primary} href={href}>
              <div>{primary}</div>
              <div className="Side-Count">{count}</div>
            </Link>
          ))}
        </div>
      </div>
      <div>
        <Chips path="tag" chips={tags.slice(0, 15)} />
      </div>
      <div>
        {archeveYear.map(({ year, num }) => (
          <Link
            key={year}
            href={'/archive/' + year}
            className="Side-Archive-Link"
          >
            <div>{year}年</div>
            <div>{num}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Side

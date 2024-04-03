'use client'

import { useRef, useState } from 'react'
import { useClickAway } from 'ahooks'
import ButtonListIcon from '@/components/ui/Button'
import './index.css'
import {
  CategoryIcon,
  FirstPageIcon,
  GithubIcon,
  LabIcon,
  MenuIcon,
  PeopleIcon,
  TagIcon,
  TravelExploreIcon,
} from '@/components/icons'
import Hr from '@/components/ui/Hr'
import { blog_repo } from '@/lib/json'

const lists = [
  { text: '首页', link: '/', icon: <FirstPageIcon /> },
  { text: '开源之旅', link: '/opensource', icon: <TravelExploreIcon /> },
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
const HeaderMenu = () => {
  const [isListOpen, setIsListOpen] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const iconBtnRef = useRef<HTMLDivElement>(null)
  useClickAway(() => {
    setIsListOpen(() => false)
  }, [listRef, iconBtnRef])

  return (
    <div className="Header-Menu">
      <div
        ref={iconBtnRef}
        onClick={() => setIsListOpen(true)}
        style={{
          marginLeft: 12,
        }}
      >
        <MenuIcon />
      </div>
      <div
        className="Header-Menu-List"
        ref={listRef}
        style={{
          transform: `scale(${isListOpen ? 1 : 0})`,
        }}
      >
        {lists.map(({ text, link, icon }, index) => (
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
        ))}
      </div>
    </div>
  )
}

export default HeaderMenu

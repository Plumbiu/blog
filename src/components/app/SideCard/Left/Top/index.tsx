import Image from 'next/image'
import './index.css'
import Link from 'next/link'
import { github_name, name } from '~/config.json'
import { RssIcon } from '@/components/icons'

const SideCardTop = () => {
  return (
    <div className="List-Top">
      <Link href={`https://github.com/${github_name}`}>
        <Image width={80} height={80} alt={name} src="/avatar.jpg" />
      </Link>
      <div className="List-Top-Me">
        @{name}
        <Link href="/rss.xml" target="_blank">
          <RssIcon />
        </Link>
      </div>
    </div>
  )
}

export default SideCardTop

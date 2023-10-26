import Image from 'next/image'
import './index.css'
import Link from 'next/link'
import { github_name, name } from '~/config.json'
import { RssIcon } from '@/components/icons'

const SideCardTop = () => {
  return (
    <div className="Side-LT">
      <Link href={`https://github.com/${github_name}`}>
        <Image width={72} height={72} alt={name} src="/avatar.jpg" />
      </Link>
      <div>
        @{name}
        <Link prefetch={false} href="/rss.xml" target="_blank">
          <RssIcon />
        </Link>
      </div>
    </div>
  )
}

export default SideCardTop

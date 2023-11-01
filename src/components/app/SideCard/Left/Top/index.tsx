import Image from 'next/image'
import './index.css'
import Link from 'next/link'
import { github_name, name } from '~/config.json'

const SideCardTop = () => {
  return (
    <div className="Side-LT">
      <Link href={`https://github.com/${github_name}`}>
        <Image width={96} height={96} alt={name} src="/avatar.jpg" />
      </Link>
      <div>
        @{name}
      </div>
    </div>
  )
}

export default SideCardTop

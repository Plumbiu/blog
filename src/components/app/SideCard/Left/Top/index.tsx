import Image from 'next/image'
import './index.css'
import Link from 'next/link'
import { github_name, name } from '~/config.json'

const SideCardTop = () => {
  return (
    <div className="List-Top">
      <Link href={`https://github.com/${github_name}`}>
        <Image width={80} height={80} alt={name} src="/avatar.jpg" />
      </Link>
      <div>@{name}</div>
    </div>
  )
}

export default SideCardTop

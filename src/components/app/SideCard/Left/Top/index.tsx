import Image from 'next/image'
import './index.css'
import Link from 'next/link'

const SideCardTop = () => {
  return (
    <div className="List-Top">
      <Link href="https://github.com/Plumbiu">
        <Image width={80} height={80} alt={'Plumbiu'} src="/avatar.jpg" />
      </Link>
      <div>@Plumbiu</div>
    </div>
  )
}

export default SideCardTop

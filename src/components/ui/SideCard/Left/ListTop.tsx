import Link from 'next/link'
import Image from 'next/image'
import './ListTop.css'

const ListTop = () => {
  return (
    <div className="List-Top-Wrap">
      <Link href="https://github.com/Plumbiu">
        <Image width={56} height={56} alt={'Plumbiu'} src="/avatar.jpg" />
      </Link>
      <div className="List-Top-Itd">
        <div className="List-Top-Name">Plumbiu 👋</div>
        <div className="List-Top-Bio">
          Studprogrammeried at Hangzhou Dianzi University (杭州电子科技大学) (HDU)，a front-end coder
        </div>
      </div>
    </div>
  )
}

export default ListTop

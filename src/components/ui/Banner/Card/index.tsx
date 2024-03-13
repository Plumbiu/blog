import type { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import './index.css'

interface Props {
  link: string
  bannerSrc: string
  avatar?: string
  title: string
  desc: string
  width?: number
  height?: number
}

const BannerCard: FC<Props> = ({
  link,
  bannerSrc,
  avatar,
  title,
  desc,
  width = 320,
  height = 180,
}) => {
  return (
    <Link href={link} target="_blank" className="Banner-Card-List">
      <Image
        src={bannerSrc}
        width={width}
        height={height}
        alt={link}
      />
      <div className="Banner-Card-Info">
        {avatar && <Image src={avatar} width={40} height={40} alt={title} />}
        <div>
          <span className="Banner-Card-Title">{title}</span>
          <div className="Banner-Card-Desc">{desc}</div>
        </div>
      </div>
    </Link>
  )
}

export default BannerCard

import Image from 'next/image'
import './index.css'

const SideCardTop = () => {
  return (
    <div className="List-Top">
      <Image width={80} height={80} alt={'Plumbiu'} src="/avatar.jpg" />
    </div>
  )
}

export default SideCardTop

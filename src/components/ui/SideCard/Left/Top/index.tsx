import Image from 'next/image'
import './index.css'
import Title from '@/components/ui/Title'

const SideCardTop = () => {
  return (
    <div className="List-Top">
      <Title>
        <Image width={80} height={80} alt={'Plumbiu'} src="/avatar.jpg" />
      </Title>
    </div>
  )
}

export default SideCardTop

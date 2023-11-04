import friends from '~/config/friends.json'
import './index.css'
import BannerCard from '@/components/ui/Banner/Card'

const FriendsCmp = () => {
  return (
    <div className="Friend">
      {friends.map(({ name, link, desc, avatar }) => (
        <BannerCard
          key={name}
          width={240}
          height={135}
          link={link}
          bannerSrc={`/friends/screenshots/${name}.png`}
          avatar={'/friends/' + avatar}
          title={name}
          desc={desc}
        />
      ))}
    </div>
  )
}

export default FriendsCmp

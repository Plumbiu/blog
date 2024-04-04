import friends from '~/config/friends.json'
import Card from '@/components/ui/Card'

const FriendsCmp = () => {
  return (
    <div className="Friend">
      {friends.map(({ name, link, desc, avatar }) => (
        <Card
          key={name}
          width={360}
          height={240}
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

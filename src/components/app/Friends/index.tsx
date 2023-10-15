import Image from 'next/image'
import Link from 'next/link'

import friends from '~/config/friends.json'
import './index.css'

const FriendsCmp = () => {
  return (
    <div className="Friend">
      {friends.map(({ name, link, desc, avatar }) => (
        <Link
          key={name}
          href={link}
          target="_blank"
          className="Friend-List"
        >
          <Image
            src={`/friends/screenshots/${name}.png`}
            width={320}
            height={180}
            alt={name}
            style={{
              objectFit: 'cover',
              borderRadius: '12px',
            }}
          />
          <div className="Friend-Info">
            <Image
              src={'/friends/' + avatar}
              width={40}
              height={40}
              alt={name}
            />
            <div>
              <span className="Friend-Name">{name}</span>
              <div className="Friend-Desc">
                {desc.slice(0, 16)}
                {desc.length > 15 && '.....'}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default FriendsCmp

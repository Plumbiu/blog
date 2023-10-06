import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import friends from '~/config/friends.json'
import './index.css'

const FriendsCmp = () => {
  return (
    <div className="Friend">
      {friends.map(({ name, link, desc, avatar, cover }) => (
        <Link key={name} href={link} target="_blank" className="Friend-List">
          <Image
            src={'/friends/' + cover}
            width={250}
            height={150}
            alt={name}
            style={{
              objectFit: 'cover',
              borderRadius: '12px',
            }}
          />
          <div className="Friend-Info">
            <Image src={'/friends/' + avatar} width={40} height={40} alt={name} />
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

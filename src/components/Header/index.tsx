import HeaderMenu from './HeaderMenu'
import Search from './Search'
import Link from 'next/link'

export default function Header() {
  return (
    <div
      style={{
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        top: 0,
        width: '100%',
        backgroundColor: '#fff',
        boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2)',
        zIndex: 1,
        height: '64px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: '24px',
        }}
      >
        <HeaderMenu />
        <Link
          style={{
            fontSize: '1.25rem',
          }}
          href="/"
        >
          Plumbiu の 小屋
        </Link>
      </div>
      <div
        style={{
          marginRight: '24px',
        }}
      >
        <Search
          id={process.env.APPLICATION_ID ?? ''}
          apiKey={process.env.API_KEY ?? ''}
          name="plumbiu"
        />
      </div>
    </div>
  )
}

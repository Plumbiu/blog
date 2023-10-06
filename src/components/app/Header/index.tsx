import HeaderMenu from './HeaderMenu'
import Search from './Search'
import Link from 'next/link'
import './index.css'

export default function Header() {
  return (
    <div className="Header">
      <div className="Header-Menu-Wrap">
        <HeaderMenu />
        <Link className="Header-Logo" href="/">
          Plumbiu の 小屋
        </Link>
      </div>
      <div className="Header-Search-Wrap">
        <Search id={process.env.APPLICATION_ID ?? ''} apiKey={process.env.API_KEY ?? ''} name="plumbiu" />
      </div>
    </div>
  )
}

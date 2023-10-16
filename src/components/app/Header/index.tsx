import Link from 'next/link'
import HeaderMenu from './Menu'
import Search from './Search'
import './index.css'
import HeaderToggle from './Toggle'
import { title } from '~/config.json'

export default function Header() {
  return (
    <div className="Header">
      <div className="Header-Menu-Wrap">
        <HeaderMenu />
        <Link href="/">{title}</Link>
      </div>
      <div className="Header-Right-Wrap">
        <HeaderToggle />
        <div className="Header-Search-Wrap">
          <Search
            id={process.env.APPLICATION_ID ?? ''}
            apiKey={process.env.API_KEY ?? ''}
            name={process.env.APPLICATION_NAME ?? ''}
          />
        </div>
      </div>
    </div>
  )
}

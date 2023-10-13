import Link from 'next/link'
import HeaderMenu from './Menu'
import Search from './Search'
import './index.css'
import { title } from '~/config.json'

export default function Header() {
  return (
    <div className="Header">
      <div className="Header-Menu-Wrap">
        <HeaderMenu />
        <Link className="Header-Logo" href="/">
          {title}
        </Link>
      </div>
      {process.env.APPLICATION_ID &&
        process.env.API_KEY &&
        process.env.APPLICATION_NAME && (
        <div className="Header-Search-Wrap">
          <Search
            id={process.env.APPLICATION_ID ?? ''}
            apiKey={process.env.API_KEY ?? ''}
            name={process.env.APPLICATION_NAME}
          />
        </div>
      )}
    </div>
  )
}

import HeaderMenu from './Menu'
import Search from './Search'
import './index.css'
import HeaderToggle from './Toggle'

export default function Header() {
  return (
    <div className="Header">
      <div className="Header-Menu-Wrap">
        <HeaderMenu />
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

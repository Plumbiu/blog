import Search from './Search'
import './index.css'
import HeaderToggle from './Toggle'
import HeaderBanner from './Banner'

export default function Header() {
  return (
    <>
      <div className="Header">
        <div className="Header-Search">
          <HeaderToggle />
          <Search
            id={process.env.APPLICATION_ID ?? ''}
            apiKey={process.env.API_KEY ?? ''}
            name={process.env.APPLICATION_NAME ?? ''}
          />
        </div>
      </div>
      <HeaderBanner />
    </>
  )
}

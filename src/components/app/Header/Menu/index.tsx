import MenuList from './List'
import './index.css'
import { MenuIcon } from '@/components/icons'

const HeaderMenu = () => {
  return (
    <div className="Header-Menu">
      <MenuIcon className="Hover" />
      <div className="Header-Menu-List">
        <MenuList />
      </div>
    </div>
  )
}

export default HeaderMenu

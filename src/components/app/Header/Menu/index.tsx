'use client'

import React, { useEffect, useState } from 'react'
import MenuList from './List'
import './index.css'
import { MenuIcon } from '@/components/icons'

const HeaderMenu = () => {
  const [open, setOpen] = useState(false)
  function listener(e: any) {
    if (!e.target?.id?.startsWith('Header-Anchor-')) {
      if (e.target?.parentNode?.id?.startsWith('Header-Anchor-')) {
        setOpen(true)
      } else {
        setOpen(false)
      }
    } else {
      setOpen(true)
    }
  }
  useEffect(() => {
    window.addEventListener('click', listener)

    return () => {
      window.removeEventListener('click', listener)
    }
  }, [])

  return (
    <div id="Header-Anchor-Menu">
      <MenuIcon className="Hover-Darker" id="Header-Anchor-Icon" />
      <div>
        {open && (
          <div className="Hader-Menu-List">
            <MenuList />
          </div>
        )}
      </div>
    </div>
  )
}

export default HeaderMenu

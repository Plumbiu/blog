import MenuList from '@/components/Header/MenuList'
import React from 'react'
import './Right.css'

const RightCard = () => {
  return (
    <div className="blog-right-card blog-side-right-w ">
      <div className="blog-right-fixed blog-side-right-w ">
        <MenuList />
      </div>
    </div>
  )
}

export default RightCard
